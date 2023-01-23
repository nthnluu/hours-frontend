import React, {FC} from "react";
import {Box, ButtonBase, Paper, Stack, Typography} from "@mui/material";
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocationOnIcon from "@mui/icons-material/LocationOn";
import {useRouter} from "next/router";
import {Queue} from "@util/queue/api";
import formatEndTime from "@util/shared/formatEndTime";
import getQueueColor from "@util/shared/getQueueColor";
import QueueStatusChip from "@components/queue/QueueStatusChip";

export interface QueueCardProps {
    queue: Queue;
}

/**
 * QueueCard is a clickable card that is apart of the home page queue grid. Contains the course title, queue title,
 * number of tickets, location, and the ending time.
 */
const QueueCard: FC<QueueCardProps> = ({queue}) => {
    const router = useRouter();

    return <Paper variant="outlined" sx={{overflow: 'hidden'}}>
        <ButtonBase onClick={() => router.push('/queue/' + queue.id)} sx={{width: "100%", textAlign: "left"}}
                    focusRipple>
            <Box width="100%" height={125} p={2} color="#fff" sx={{bgcolor: getQueueColor(queue)}}>
                <Typography variant="body1" noWrap>
                    {queue.course.code}: {queue.course.title}
                </Typography>
                <Typography variant="h5" fontWeight={600}>
                    {queue.title}
                </Typography>
            </Box>
        </ButtonBase>
        <Box width="100%" p={2} color={"#777777"}>
            <Stack direction="row" alignItems="center" justifyContent="space-between">
                <Stack direction="row" alignItems="center" spacing={1}>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <LocationOnIcon fontSize="small"/>
                        <Typography fontSize="smaller" noWrap
                                    style={{overflow: "hidden", textOverflow: "ellipsis", maxWidth: '8rem'}}>
                            {queue.location}
                        </Typography>
                    </Stack>
                    <Stack direction="row" spacing={0.5} alignItems="center">
                        <AccessTimeIcon fontSize="small"/>
                        <Typography fontSize="smaller" noWrap>
                            {formatEndTime(queue.endTime)}
                        </Typography>
                    </Stack>
                </Stack>
                <QueueStatusChip queue={queue} size="small"/>
            </Stack>
        </Box>
    </Paper>;
};

export default QueueCard;


