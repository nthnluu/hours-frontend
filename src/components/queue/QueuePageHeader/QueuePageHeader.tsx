import React, {FC} from "react";
import {Box, Chip, Paper, Stack, Typography} from "@mui/material";
import {Queue} from "@util/queue/api";

export interface QueuePageHeaderProps {
    queue: Queue;
}

const QueuePageHeader: FC<QueuePageHeaderProps> = ({queue}) => {
    return <Paper sx={{overflow: "hidden"}}>
        <Box width="100%" p={3} color="#fff" position="relative" sx={{bgcolor: queue.color ?? "#172c35"}}>
            <Box height={120}/>
            <Box>
                <Typography variant="body1" noWrap>
                    {queue.course.code}: {queue.course.title}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="h4" fontWeight={600}>
                        {queue.title}
                    </Typography>
                    {queue.isActive ? <Chip label="Open" size="medium" color="success" sx={{fontWeight: 600}}/> :
                        <Chip label="Closed" size="medium" color="error" sx={{fontWeight: 600}}/>}
                </Stack>
            </Box>
        </Box>
    </Paper>;
};

export default QueuePageHeader;


