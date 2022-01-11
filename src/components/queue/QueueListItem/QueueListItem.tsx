import React, {FC} from "react";
import {Avatar, Box, Paper, Stack, Typography} from "@mui/material";
import {Ticket} from "@util/queue/api";
import {formatDistance} from 'date-fns';

export interface QueueListItemProps {
    ticket: Ticket;
}

const QueueListItem: FC<QueueListItemProps> = ({ticket}) => {
    return <Paper variant="outlined">
        <Box p={2.5}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar>:)</Avatar>
                <Box>
                    <Typography fontSize={16} fontWeight={600}>{ticket.createdBy.DisplayName}</Typography>
                    {/*<Typography*/}
                    {/*    fontSize={14}>Joined {formatDistance(ticket.createdAt, new Date(), {addSuffix: true})}</Typography>*/}
                </Box>
            </Stack>
        </Box>
    </Paper>;
};

export default QueueListItem;


