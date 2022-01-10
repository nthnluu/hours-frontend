import React, {FC} from "react";
import {Avatar, Box, Paper, Stack, Typography} from "@mui/material";

export interface QueueListItemProps {
}

/**
 * Write a short description of this component here...
 */
const QueueListItem: FC<QueueListItemProps> = ({}) => {
    return <Paper variant="outlined">
        <Box p={2.5}>
            <Stack direction="row" alignItems="center" spacing={2}>
                <Avatar>NB</Avatar>
                <Box>
                    <Typography fontSize={16} fontWeight={600}>Nathan Benavides-Luu</Typography>
                    <Typography fontSize={14}>Joined 12 mins ago</Typography>
                </Box>
            </Stack>
        </Box>
    </Paper>;
};

export default QueueListItem;


