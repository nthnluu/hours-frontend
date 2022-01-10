import React, {FC} from "react";
import {Box, Paper, Typography} from "@mui/material";
import {Queue} from "@util/queue/queue_helpers";

export interface QueuePageHeaderProps {
    queue: Queue;
}

/**
 * Write a short description of this component here...
 */
const QueuePageHeader: FC<QueuePageHeaderProps> = ({queue}) => {
    return <Paper sx={{overflow: "hidden"}}>
        <Box width="100%" height={225} color="#fff" position="relative" sx={{bgcolor: queue.color}}>
            <Box position="absolute" bottom={18} left={20}>
                <Typography variant="h6" noWrap>
                    {queue.courseTitle}
                </Typography>

                <Typography variant="h4" fontWeight={600}>
                    {queue.queueTitle}
                </Typography>
            </Box>
        </Box>
    </Paper>;
};

export default QueuePageHeader;


