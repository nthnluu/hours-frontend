import React, {FC, useState, useEffect} from "react";
import {intervalToDuration} from "date-fns";
import {Timestamp} from "@firebase/firestore";
import {Avatar, Box, Chip, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import QueueAPI, {Ticket, TicketStatus} from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";
import EditTicketDialog from "@components/queue/EditTicketDialog";
import getInitials from "@util/shared/getInitials";
import QueueListItemMenu from "@components/queue/QueueListItemMenu";
import {toast} from "react-hot-toast";

export interface QueueListItemProps {
    courseID: string;
    queueID: string;
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({courseID, queueID, ticket}) => {
    const {currentUser} = useAuth();
    const [editTicketDialog, setEditTicketDialog] = useState(false);
    const [time, setTime] = useState("00:00");

    const isClaimed = ticket.status === TicketStatus.StatusClaimed;
    const isMissing = ticket.status === TicketStatus.StatusMissing;
    const isCompleted = ticket.status === TicketStatus.StatusComplete;

    const isTA = (currentUser != undefined) && (currentUser.coursePermissions[courseID] != undefined);
    const isTicketOwner = (currentUser != undefined) && (ticket.createdBy.Email === currentUser.email);

    useEffect(() => {
        const intervalID = setInterval(() => {
            if (ticket.claimedAt) {
                const timer = Timestamp.now().seconds - ticket.claimedAt.seconds;
                const duration = intervalToDuration({start: 0, end: timer * 1000});
                const formatted = `${duration.minutes! < 10 ? "0" + duration.minutes : duration.minutes}:${duration.seconds! < 10 ? "0" + duration.seconds : duration.seconds}`;
                setTime(formatted);
            }
        }, 1000);
        return () => clearInterval(intervalID);
    }, [ticket.claimedAt]);

    function handleClaimTicket() {
        setTime("00:00");
        QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusClaimed, ticket.description)
            .catch(() => toast.error("Something went wrong, please try again later."));
    }

    return (<>
        <EditTicketDialog open={editTicketDialog} onClose={() => setEditTicketDialog(false)} ticket={ticket}
                          queueID={queueID as string}/>
        <Paper variant="outlined">
            <Box p={2.5}>
                <Stack direction="row" justifyContent="space-between" overflow={"hidden"}>
                    <Stack direction="row" spacing={2} alignItems="center" overflow={"hidden"}>
                        <Avatar src={ticket.createdBy.PhotoURL} sx={{display: ["none", null, "flex"]}}>
                            {getInitials(ticket.createdBy.DisplayName)}
                        </Avatar>
                        <Box overflow={"hidden"}>
                            <Stack direction="row" spacing={1}>
                                <Box>
                                    <Typography fontSize={16} fontWeight={600}>
                                        {ticket.createdBy.DisplayName}
                                    </Typography>
                                </Box>
                                {isClaimed && <Chip label={`CLAIMED - ${time}`} size="small" variant="outlined"
                                                    style={{width: "15ch", overflow: "hidden"}}/>}
                                {isMissing && <Chip label="MISSING" size="small" color="error"/>}
                                {isCompleted && <Chip label="COMPLETED" size="small" color="info"/>}
                            </Stack>
                            <Typography sx={{overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap"}}
                                        fontSize={14}>{ticket.description}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={0} alignItems="center">
                        {isTA && !isClaimed && !isCompleted && <IconButton label="Claim ticket"
                                                                           onClick={handleClaimTicket}>
                            <ConfirmationNumberOutlinedIcon/>
                        </IconButton>}
                        {(isTA || isTicketOwner) &&
                        <QueueListItemMenu isClaimed={isClaimed} isTA={isTA} isTicketOwner={isTicketOwner}
                                           queueID={queueID} ticket={ticket}
                                           setEditTicketDialog={setEditTicketDialog}/>}
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    </>);
};

export default QueueListItem;


