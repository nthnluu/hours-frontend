import React, {FC} from "react";
import {Box, Paper, Stack, Typography} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import ConfirmationNumberOutlinedIcon from '@mui/icons-material/ConfirmationNumberOutlined';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import QueueAPI, {Ticket, Queue, TicketStatus} from "@util/queue/api";
import {toast} from "react-hot-toast";

export interface QueueListItemProps {
    queueID: string;
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({queueID, ticket}) => {

    const claimed = ticket.status === TicketStatus.StatusClaimed;
    
    return (
        <Paper variant="outlined">
            <Box p={2.5}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={2}>
                    <Box>
                        <Typography fontSize={16} fontWeight={600}>{ticket.createdBy.DisplayName}</Typography>
                        <Typography fontSize={14}>{ticket.description}</Typography>
                    </Box>
                    <Box>
                        {!claimed && <IconButton label="Claim ticket" edge="end" aria-label="delete" onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusClaimed, ticket.description)}>
                            <ConfirmationNumberOutlinedIcon/>
                        </IconButton>}
                        {claimed && <IconButton label="Checkoff ticket" edge="end" aria-label="delete" onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusComplete, ticket.description)}>
                            <CheckBoxIcon/>
                        </IconButton>}
                        {claimed && <IconButton label="Unclaim ticket" edge="end" aria-label="delete" onClick={() => QueueAPI.editTicket(ticket.id, queueID, TicketStatus.StatusWaiting, ticket.description)}>
                            <ConfirmationNumberIcon/>
                        </IconButton>}
                        <IconButton label="Edit ticket" edge="end" aria-label="delete" onClick={() => toast.error(`Feature unimplemented.`)}>
                            <EditIcon/>
                        </IconButton>
                        <IconButton label="Delete ticket" edge="end" aria-label="delete" onClick={() => QueueAPI.deleteTicket(ticket.id, queueID)}>
                            <DeleteIcon/>
                        </IconButton>
                    </Box>
                </Stack>
            </Box>
        </Paper>
    );
};

export default QueueListItem;


