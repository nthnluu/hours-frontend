import React, {FC, useState} from "react";
import {Box, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ConfirmButton from "@components/shared/ConfirmButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import HelpCenterIcon from '@mui/icons-material/HelpCenter';
import QueueAPI, {Ticket, TicketStatus} from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";
import EditTicketDialog from "@components/queue/EditTicketDialog";

export interface QueueListItemProps {
    queueID: string;
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({queueID, ticket}) => {
    const {currentUser, isAuthenticated} = useAuth();
    const [editTicketDialog, setEditTicketDialog] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false);

    const claimed = ticket.status === TicketStatus.StatusClaimed;
    const missing = ticket.status === TicketStatus.StatusMissing;
    const isTA = currentUser && (currentUser.coursePermissions[queueID] != undefined);
    const ownsTicket = currentUser && ticket.createdBy.Email === currentUser.email;

    const staffPerm = isTA || currentUser?.isAdmin;
    const ownedPerm = staffPerm || ownsTicket;

    return (<>
        <EditTicketDialog open={editTicketDialog} onClose={() => setEditTicketDialog(false)} id={ticket.id} queueID={queueID as string} status={ticket.status} />
        <Paper variant="outlined">
            <Box p={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                        <Typography fontSize={16} fontWeight={600}>{ticket.createdBy.DisplayName}{missing && " (MISSING)"}</Typography>
                        <Typography fontSize={14}>{ticket.description}</Typography>
                    </Box>
                    <Box>
                        {staffPerm && !claimed && <IconButton label="Claim ticket" edge="end" aria-label="claim" onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusClaimed, ticket.description)}>
                            <ConfirmationNumberOutlinedIcon/>
                        </IconButton>}
                        {staffPerm && claimed && <IconButton label="Mark as missing" edge="end" aria-label="mark-missing" onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusMissing, ticket.description)}>
                            <HelpCenterIcon/>
                        </IconButton>}
                        {staffPerm && claimed && <IconButton label="Checkoff ticket" edge="end" aria-label="checkoff" onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusComplete, ticket.description)}>
                            <CheckBoxIcon/>
                        </IconButton>}
                        {staffPerm && claimed && <IconButton label="Unclaim ticket" edge="end" aria-label="unclaim" onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusWaiting, ticket.description)}>
                            <ConfirmationNumberIcon/>
                        </IconButton>}
                        {ownedPerm && <IconButton label="Edit ticket" edge="end" aria-label="edit" onClick={() => setEditTicketDialog(true)}>
                            <EditIcon/>
                        </IconButton>}
                        {ownedPerm && 
                            <ConfirmButton
                                message={"Delete ticket?"}
                                open={openConfirm}  
                                onClose={() => setOpenConfirm(false)}
                                onConfirm={() => QueueAPI.deleteTicket(ticket.id, queueID)}>
                                <IconButton label="Delete ticket" edge="end" aria-label="delete" onClick={() => setOpenConfirm(true)}>
                                    <DeleteIcon/>
                                </IconButton>
                            </ConfirmButton>
                        }
                    </Box>
                </Stack>
            </Box>
        </Paper>
    </>);
};

export default QueueListItem;


