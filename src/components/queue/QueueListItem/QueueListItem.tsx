import React, {FC} from "react";
import {Box, Paper, Stack, Typography} from "@mui/material";
import {Ticket} from "@util/queue/api";

export interface QueueListItemProps {
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({ticket}) => {
    return <Paper variant="outlined">
        <Box p={2.5}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Box>
                    <Typography fontSize={16} fontWeight={600}>{ticket.createdBy.DisplayName}</Typography>
                    <Typography fontSize={14}>{ticket.description}</Typography>
                </Box>
            </Stack>
        </Box>
    </Paper>;
};

export default QueueListItem;


