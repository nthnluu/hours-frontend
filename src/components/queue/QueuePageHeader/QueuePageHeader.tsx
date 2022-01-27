import React, {FC} from "react";
import {Box, Paper, Stack, Typography} from "@mui/material";
import {Queue} from "@util/queue/api";
import getQueueColor from "@util/shared/getQueueColor";
import QueueStatusChip from "@components/queue/QueueStatusChip";

export interface QueuePageHeaderProps {
    queue: Queue;
}

const QueuePageHeader: FC<QueuePageHeaderProps> = ({queue}) => {
    return <Paper sx={{overflow: "hidden"}}>
        <Box width="100%" p={[2, null, 3]} color="#fff" position="relative" sx={{bgcolor: getQueueColor(queue)}}>
            <Box height={120}>
            </Box>
            <Box>
                <Typography variant="body1" noWrap>
                    {queue.course.code}: {queue.course.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" fontWeight={600}>
                        {queue.title}
                    </Typography>
                    <QueueStatusChip queue={queue} size="medium"/>
                </Stack>
            </Box>
        </Box>
    </Paper>;
};

export default QueuePageHeader;


