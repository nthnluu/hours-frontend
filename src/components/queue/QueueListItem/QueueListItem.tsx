import React, {FC, useState} from "react";
import {Avatar, Box, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import QueueAPI, {Ticket, TicketStatus} from "@util/queue/api";
import {toast} from "react-hot-toast";
import {useAuth} from "@util/auth/hooks";
import EditTicketDialog from "@components/queue/EditTicketDialog";
import getInitials from "@util/shared/getInitials";

export interface QueueListItemProps {
    queueID: string;
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({queueID, ticket}) => {
    const {currentUser} = useAuth();
    const [editTicketDialog, setEditTicketDialog] = useState(false);

    const claimed = ticket.status === TicketStatus.StatusClaimed;
    const missing = ticket.status === TicketStatus.StatusMissing;
    const isTA = currentUser && (currentUser.coursePermissions[queueID] != undefined);
    const ownsTicket = currentUser && ticket.createdBy.Email === currentUser.email;

    const staffPerm = isTA || currentUser?.isAdmin;
    const ownedPerm = staffPerm || ownsTicket;

    function handleDeleteTicket() {
        const deleteConfirmed = confirm("Are you sure you want to delete your ticket?");

        if (deleteConfirmed) {
            toast.promise(QueueAPI.deleteTicket(ticket.id, queueID), {
                loading: "Deleting ticket...",
                success: "Ticket deleted!",
                error: "Something went wrong, please try again!"
            })
                .then(() => console.log("ticket deleted!"));
        }
    }

    // TODO: EditTicketDialog should be in QueueList to avoid rendering many times.

    return (<>
        <EditTicketDialog open={editTicketDialog} onClose={() => setEditTicketDialog(false)} ticket={ticket}
                          queueID={queueID as string}/>
        <Paper variant="outlined">
            <Box p={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar src={ticket.createdBy.PhotoURL}>
                            {getInitials(ticket.createdBy.DisplayName)}
                        </Avatar>
                        <Box>
                            <Typography fontSize={16}
                                        fontWeight={600}>{ticket.createdBy.DisplayName}{missing && " (MISSING)"}</Typography>
                            <Typography fontSize={14}>{ticket.description}</Typography>
                        </Box>
                    </Stack>

                    <Stack direction="row" spacing={2}>
                        {staffPerm && !claimed && <IconButton label="Claim ticket" edge="end" aria-label="claim"
                                                              onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusClaimed, ticket.description)}>
                            <ConfirmationNumberOutlinedIcon/>
                        </IconButton>}
                        {staffPerm && claimed &&
                        <IconButton label="Mark as missing" edge="end" aria-label="mark-missing"
                                    onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusMissing, ticket.description)}>
                            <HelpCenterIcon/>
                        </IconButton>}
                        {staffPerm && claimed && <IconButton label="Checkoff ticket" edge="end" aria-label="checkoff"
                                                             onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusComplete, ticket.description)}>
                            <CheckBoxIcon/>
                        </IconButton>}
                        {staffPerm && claimed && <IconButton label="Unclaim ticket" edge="end" aria-label="unclaim"
                                                             onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusWaiting, ticket.description)}>
                            <ConfirmationNumberIcon/>
                        </IconButton>}
                        {ownedPerm && <IconButton label="Edit ticket" edge="end" aria-label="edit"
                                                  onClick={() => setEditTicketDialog(true)}>
                            <EditIcon/>
                        </IconButton>}
                        {ownedPerm &&
                        <IconButton color="error" label="Delete ticket" edge="end" aria-label="delete"
                                    onClick={handleDeleteTicket}>
                            <CloseIcon/>
                        </IconButton>}
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    </>);
};

export default QueueListItem;


