import React, {FC, useState, useEffect} from "react";
import {intervalToDuration} from "date-fns";
import {Timestamp} from "@firebase/firestore";
import {Avatar, Box, Chip, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ConfirmButton from "@components/shared/ConfirmButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from '@mui/icons-material/Check';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import QuestionMarkIcon from '@mui/icons-material/QuestionMark';
import UndoIcon from '@mui/icons-material/Undo';
import QueueAPI, {Ticket, TicketStatus} from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";
import EditTicketDialog from "@components/queue/EditTicketDialog";
import getInitials from "@util/shared/getInitials";

export interface QueueListItemProps {
    courseID: string;
    queueID: string;
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({courseID, queueID, ticket}) => {
    const {currentUser} = useAuth();
    const [editTicketDialog, setEditTicketDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);
    const [time, setTime] = useState("00:00");

    const claimed = ticket.status === TicketStatus.StatusClaimed;
    const missing = ticket.status === TicketStatus.StatusMissing;
    const completed = ticket.status === TicketStatus.StatusComplete;
    const isTA = currentUser && (currentUser.coursePermissions[courseID] != undefined);
    const ownsTicket = currentUser && ticket.createdBy.Email === currentUser.email;

    const staffPerm = isTA;
    const ownedPerm = staffPerm || ownsTicket;

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

    return (<>
        <EditTicketDialog open={editTicketDialog} onClose={() => setEditTicketDialog(false)} ticket={ticket}
                          queueID={queueID as string}/>
        <Paper variant="outlined">
            <Box p={2.5}>
                <Stack direction="row" justifyContent="space-between">
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={ticket.createdBy.PhotoURL} sx={{display: ["none", null, "flex"]}}>
                            {getInitials(ticket.createdBy.DisplayName)}
                        </Avatar>
                        <Box>
                            <Stack direction="row" spacing={1}>
                                <Box>
                                    <Typography fontSize={16} fontWeight={600}>
                                        {ticket.createdBy.DisplayName}
                                    </Typography>
                                </Box>
                                {claimed && <Chip label={`CLAIMED - ${time}`} size="small" variant="outlined"
                                                  style={{width: "15ch", overflow: "hidden"}}/>}
                                {missing && <Chip label="MISSING" size="small" color="error"/>}
                                {completed && <Chip label="COMPLETED" size="small" color="info"/>}
                            </Stack>
                            <Typography fontSize={14}>{ticket.description}</Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={0}>
                        {staffPerm && !claimed && <IconButton label="Claim ticket"
                                                              onClick={() => {
                                                                  setTime("00:00");
                                                                  QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusClaimed, ticket.description);
                                                              }}>
                            <ConfirmationNumberOutlinedIcon/>
                        </IconButton>}
                        {staffPerm && claimed && <IconButton label="Mark as completed"
                                                             onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusComplete, ticket.description)}>
                            <CheckIcon/>
                        </IconButton>}
                        {staffPerm && claimed &&
                        <IconButton label="Mark as missing"
                                    onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusMissing, ticket.description)}>
                            <QuestionMarkIcon/>
                        </IconButton>}
                        {staffPerm && claimed && <IconButton label="Return to queue"
                                                             onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusWaiting, ticket.description)}>
                            <UndoIcon/>
                        </IconButton>}
                        {ownedPerm && <IconButton label="Edit ticket"
                                                  onClick={() => setEditTicketDialog(true)}>
                            <EditIcon/>
                        </IconButton>}
                        {ownedPerm &&
                        <ConfirmButton
                            message={"Delete ticket?"}
                            open={openConfirm}
                            onClose={() => setOpenConfirm(false)}
                            onConfirm={() => QueueAPI.deleteTicket(ticket.id, queueID)}>
                            <IconButton label="Delete ticket"
                                        color="error"
                                        onClick={() => setOpenConfirm(true)}>
                                <CloseIcon/>
                            </IconButton>
                        </ConfirmButton>}
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    </>);
};

export default QueueListItem;


