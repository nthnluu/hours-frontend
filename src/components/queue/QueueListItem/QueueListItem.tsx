import React, {FC, useEffect, useState} from "react";
import {Avatar, Box, Chip, Paper, Link, Stack, Typography, Divider} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import CheckIcon from '@mui/icons-material/Check';
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

export interface QueueListItemProps {
    queue: Queue;
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({queue, ticket}) => {
    const {currentUser} = useAuth();
    const [claimedUser, loading] = useUser(ticket.claimedBy);
    const [editTicketDialog, setEditTicketDialog] = useState(false);

    const isClaimed = ticket.status === TicketStatus.StatusClaimed;
    const isMissing = ticket.status === TicketStatus.StatusMissing;
    const isCompleted = ticket.status === TicketStatus.StatusComplete;
    const isReturned = ticket.status === TicketStatus.StatusReturned;

    const isTA = (currentUser != undefined) && (currentUser.coursePermissions[queue.course.id] != undefined);
    const isTicketOwner = (currentUser != undefined) && (ticket.createdBy.email === currentUser.email);

    function handleClaimTicket() {
        QueueAPI.editTicket(ticket.id, ticket.createdBy.id, queue.id, TicketStatus.StatusClaimed, ticket.description)
            .catch(() => toast.error(errors.UNKNOWN));
    }

    function handleMarkReturned() {
        QueueAPI.editTicket(ticket.id, ticket.createdBy.id, queue.id, TicketStatus.StatusReturned, ticket.description)
            .catch(() => toast.error(errors.UNKNOWN));
    }

    // send desktop notification to user when their ticket is claimed
    useEffect(() => {
        if (isTicketOwner && isClaimed) {
            new Notification('Your ticket has been claimed!');
        }
    }, [isClaimed, isTicketOwner]);

    return (<>
        <EditTicketDialog open={editTicketDialog} onClose={() => setEditTicketDialog(false)} ticket={ticket}
                          queueID={queue.id}/>
        <Paper variant="outlined">
            <Box p={2.5}>
                <Stack direction="row" justifyContent="space-between" overflow={"hidden"}>
                    <Stack direction="row" spacing={2} alignItems="center" overflow={"hidden"}>
                        <Avatar src={ticket.createdBy.photoUrl} imgProps={{referrerPolicy: "no-referrer"}}
                                sx={{display: ["none", null, "flex"]}}>
                            {getInitials(ticket.createdBy.displayName)}
                        </Avatar>
                        <Box overflow={"hidden"}>
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Typography fontSize={16} fontWeight={600}>
                                    {ticket.anonymize && !isTicketOwner && !isTA && !currentUser?.isAdmin ? "Anonymous" : ticket.createdBy.displayName}
                                </Typography>
                                <Typography fontSize={16} sx={{opacity: 0.65}}>
                                    {ticket.createdBy.pronouns && `(${ticket.createdBy.pronouns})`}
                                </Typography>
                                {isClaimed && ticket.claimedAt && <QueueListItemTimer claimedAt={ticket.claimedAt}/>}
                                {isMissing && <Chip label="Missing" size="small" color="error" sx={{fontWeight: 500}}/>}
                                {isReturned &&
                                    <Chip label="Returned" size="small" color="warning" sx={{fontWeight: 500}}/>}
                                {isCompleted &&
                                    <Chip label="Completed" size="small" color="info" sx={{fontWeight: 500}}/>}
                            </Stack>
                            {(isTA || isTicketOwner) &&
                                <Typography sx={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
                                            fontSize={14}>
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
            {ticket.status === TicketStatus.StatusClaimed && claimedUser && (<>
            <Divider/>
                <Box px={2.5} py={1}>
                    <Stack direction="row" justifyContent="space-between" overflow={"hidden"}>
                        <Stack direction="row" spacing={2} alignItems="center" overflow={"hidden"}>
                            <Box overflow={"hidden"}>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Typography fontSize={14}>
                                        Claimed by {claimedUser?.displayName}
                                    </Typography>
                                    {queue.showMeetingLinks && claimedUser.meetingLink && (<Typography fontSize={14} sx={{opacity: 0.65}}>
                                        <Link color="inherit" underline="hover"
                                            sx={{display: "inline-flex", alignItems: "center"}}
                                            href={claimedUser?.meetingLink}>
                                                <Button variant="text" color="inherit" size="small" startIcon={<VideocamIcon/>}>
                                                    Join Meeting
                                                </Button>
                                        </Link>
                                    </Typography>)}
                                </Stack>
                            </Box>
                        </Stack>
                    </Stack>
                </Box>
            </>)}
        </Paper>
    </>);
};

export default QueueListItem;


