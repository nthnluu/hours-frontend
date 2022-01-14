import React, {FC} from "react";
import {Box, ButtonBase, Paper, Stack, Typography} from "@mui/material";
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import {useRouter} from "next/router";
import {useTickets} from "@util/queue/hooks";
import {Queue, TicketStatus} from "@util/queue/api";

export interface QueueCardProps {
    queue: Queue;
}

/**
 * QueueCard is a clickable card that is apart of the home page queue grid. Contains the course title, queue title,
 * number of tickets, location, and the ending time.
 */
const QueueCard: FC<QueueCardProps> = ({queue}) => {
    const router = useRouter();
    // TODO: Ideally we don't pull tickets in this way to get the line length, but for now this will do.
    const [tickets, ticketsLoading] = useTickets(queue.id, false);

    return <Paper variant="outlined" sx={{overflow: 'hidden'}}>
        <ButtonBase onClick={() => router.push('/queue/' + queue.id)} sx={{width: "100%", textAlign: "left"}} focusRipple>
            <Box width="100%" height={125} p={2} color="#fff" sx={{bgcolor: queue.color ?? "#172c35"}}>
                <Typography variant="body1" noWrap>
                    {queue.course.title}
                </Typography>

                <Typography variant="h5" fontWeight={600}>
                    {queue.title}
                </Typography>
            </Box>
        </ButtonBase>

        <Box width="100%" p={2} color={"#777777"}>
            <Stack direction="row" spacing={2}>
                <Stack direction="row" spacing={0.5} alignItems="center">
                    <PeopleAltIcon/>
                    <Typography variant="body2">
                        {tickets ? tickets.filter(x => x.status != TicketStatus.StatusComplete).length : 0}
                    </Typography>
                </Stack>

                <Stack direction="row" spacing={0.5} alignItems="center">
                    <AccessTimeIcon/>
                    <Typography variant="body2">
                        Ends at 2:00pm
                    </Typography>
                </Stack>
            </Stack>
        </Box>
    </Paper>;
};

export default QueueCard;


