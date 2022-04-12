import React, {FC, useEffect, useState} from "react";
import {Avatar, Box, Chip, Divider, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import CheckIcon from '@mui/icons-material/Check';
import PersonIcon from '@mui/icons-material/Person';
import VideocamIcon from '@mui/icons-material/Videocam';
import QueueAPI, {Queue, Ticket, TicketStatus} from "@util/queue/api";
import {useAuth, useUser} from "@util/auth/hooks";
import EditTicketDialog from "@components/queue/EditTicketDialog";
import getInitials from "@util/shared/getInitials";
import QueueListItemMenu from "@components/queue/QueueListItemMenu";
import {toast} from "react-hot-toast";
import QueueListItemTimer from "@components/queue/QueueListItemTimer";
import errors from "@util/errors";
import Button from "@components/shared/Button";
import {formatDistance} from "date-fns";

export interface QueueListItemProps {
    queue: Queue;
    ticket: Ticket;
    position: number;
    beforeCutoff: boolean;
}

function formatElapsedTime(ticket: Ticket): string {
    return formatDistance(ticket.createdAt.toDate(), new Date(), {addSuffix: true});
}

const QueueListItem: FC<QueueListItemProps> = ({queue, ticket, position, beforeCutoff}) => {
    const {currentUser} = useAuth();
    const [claimedUser] = useUser(ticket.claimedBy);
    const [editTicketDialog, setEditTicketDialog] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(formatElapsedTime(ticket));

    const isClaimed = ticket.status === TicketStatus.StatusClaimed;
    const isMissing = ticket.status === TicketStatus.StatusMissing;
    const isCompleted = ticket.status === TicketStatus.StatusComplete;
    const isReturned = ticket.status === TicketStatus.StatusReturned;

    const isTA = (currentUser != undefined) && (currentUser.coursePermissions[queue.course.id] != undefined);
    const isTicketOwner = (currentUser != undefined) && (ticket.user.Email === currentUser.email);

    function handleClaimTicket() {
        QueueAPI.editTicket(ticket.id, ticket.user.UserID, queue.id, TicketStatus.StatusClaimed, ticket.description)
            .catch(() => toast.error(errors.UNKNOWN));
    }

    function handleMarkReturned() {
        QueueAPI.editTicket(ticket.id, ticket.user.UserID, queue.id, TicketStatus.StatusReturned, ticket.description)
            .catch(() => toast.error(errors.UNKNOWN));
    }

    // send desktop notification to user when their ticket is claimed
    useEffect(() => {
        if (isTicketOwner && isClaimed) {
            if ("Notification" in window) {
                new Notification('Your ticket has been claimed!');
            }
        }
    }, [isClaimed, isTicketOwner]);

    useEffect(() => {
        setInterval(() => setElapsedTime(formatElapsedTime(ticket)), 5000);
    });

    return (<>
        <EditTicketDialog open={editTicketDialog} onClose={() => setEditTicketDialog(false)} ticket={ticket}
                          queueID={queue.id}/>
        <Paper variant={isClaimed ? "elevation" : "outlined"} elevation={4}>
            <Box px={2.5} py={2}>
                <Stack direction="row" justifyContent="space-between" overflow={"hidden"}>
                    <Stack direction="row" spacing={[0, null, 2]} alignItems="center" overflow={"hidden"}>
                        <Avatar src={ticket.anonymize ? "" : ticket.user.PhotoURL}
                                imgProps={{referrerPolicy: "no-referrer"}}
                                sx={{display: ["none", null, "flex"]}}>
                            {ticket.anonymize ? <PersonIcon/> : getInitials(ticket.user.DisplayName)}
                        </Avatar>
                        <Box overflow={"hidden"}>
                            <Stack direction="row" spacing={1}>
                                <Typography fontSize={16} fontWeight={600}>
                                    {ticket.anonymize && !isTicketOwner && !isTA && !currentUser?.isAdmin ? `${position}. Anonymous` : `${position}. ${ticket.user.DisplayName}`}
                                </Typography>
                                <Typography fontSize={16} sx={{opacity: 0.65}}>
                                    {!ticket.anonymize && ticket.user.Pronouns && `(${ticket.user.Pronouns})`}
                                </Typography>
                            </Stack>
                            {(isTA || isTicketOwner) &&
                                <Typography fontSize={14}>
                                    {(isTicketOwner || isTA || currentUser?.isAdmin) && ticket.description}
                                </Typography>}
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center" flexShrink={0}>
                        {isTA && !isClaimed && !isCompleted && <IconButton label="Claim ticket"
                                                                           onClick={handleClaimTicket}>
                            <CheckIcon/>
                        </IconButton>}
                        {isMissing && isTicketOwner && <Button color="inherit"
                                                               onClick={handleMarkReturned}>
                            I&apos;m back
                        </Button>}
                        {(isTA || isTicketOwner) && !isCompleted &&
                            <QueueListItemMenu isClaimed={isClaimed} isTA={isTA} isTicketOwner={isTicketOwner}
                                               queueID={queue.id} ticket={ticket}
                                               allowTicketEditing={queue.allowTicketEditing}
                                               setEditTicketDialog={setEditTicketDialog}/>}
                    </Stack>
                </Stack>
            </Box>
            <Divider/>
            <Box px={2.5} py={1}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" overflow={"hidden"}>
                    <Box>
                        {(ticket.status == TicketStatus.StatusClaimed) ? (claimedUser &&
                            <Stack direction="row" spacing={2} alignItems="center" overflow={"hidden"}>
                                <Box overflow={"hidden"}>
                                    <Stack direction={["column", null, "row"]}
                                           alignItems={["start", null, "center"]}>
                                        <Typography fontSize={14} mr={[null, null, 2]}>
                                            Claimed by {claimedUser?.displayName}
                                        </Typography>
                                        {queue.showMeetingLinks && claimedUser.meetingLink && (isTicketOwner || isTA || currentUser?.isAdmin) && (
                                            <Button sx={{display: "inline-flex", alignItems: "center"}}
                                                    href={claimedUser?.meetingLink} variant="text" color="inherit"
                                                    size="small"
                                                    startIcon={<VideocamIcon/>}>
                                                Join Meeting
                                            </Button>)}
                                    </Stack>
                                </Box>
                            </Stack>) : <Typography fontSize={14} mr={[null, null, 2]}>
                            Joined {elapsedTime}
                        </Typography>}
                    </Box>
                    <Box>
                        {isClaimed && ticket.claimedAt &&
                            <QueueListItemTimer claimedAt={ticket.claimedAt}/>}
                        {isMissing &&
                            <Chip label="Missing" size="small" color="error" sx={{fontWeight: 500}}/>}
                        {isReturned &&
                            <Chip label="Returned" size="small" color="warning" sx={{fontWeight: 500}}/>}
                        {isCompleted &&
                            <Chip label="Completed" size="small" color="info" sx={{fontWeight: 500}}/>}
                        {!beforeCutoff &&
                            <Chip label="After Cutoff" size="small" color="warning" sx={{fontWeight: 500}}/>}
                    </Box>
                </Stack>
            </Box>
        </Paper>
    </>);
};

export default QueueListItem;


