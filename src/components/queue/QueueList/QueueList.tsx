import React, {FC, useState} from "react";
import {
    Box,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import Button from "@components/shared/Button";
import CreateTicketDialog from "@components/queue/CreateTicketDialog";
import QueueListItem from "@components/queue/QueueListItem";
import {useTickets} from "@util/queue/hooks";
import {Queue} from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";

export interface QueueListProps {
    queueID: string
    queue: Queue
    showCompletedTickets: boolean;
}

/**
 * QueueList lists out the tickets in a queue.
 */
const QueueList: FC<QueueListProps> = ({queueID, queue, showCompletedTickets}) => {
    const {currentUser, isTA} = useAuth();
    const [tickets, ticketsLoading] = useTickets(queueID, showCompletedTickets);
    const [createTicketDialog, setCreateTicketDialog] = useState(false);

    if (ticketsLoading) return <></>;

    const inQueue = tickets && tickets.filter(ticket => ticket.createdBy.Email == currentUser?.email).length > 0;

    const EmptyQueue = () => (
        <Stack mt={4} spacing={2} justifyContent="center" alignItems="center">
            <BouncingCubesAnimation/>
            <Typography variant="body1">
                Nobody is here... yet 😉.
            </Typography>
        </Stack>
    );

    return (<>
        <CreateTicketDialog open={createTicketDialog} onClose={() => setCreateTicketDialog(false)}
                            queueID={queueID as string}/>
        <Grid item xs={12} md={9}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                    Queue
                </Typography>
                {!queue.isCutOff && !inQueue && !isTA(queue.course.id) &&
                <Button variant="contained" onClick={() => setCreateTicketDialog(true)}>
                    Join Queue
                </Button>}
            </Stack>
            <Box mt={1}>
                <Stack spacing={2}>
                    {tickets && tickets.map(ticket => <QueueListItem key={ticket.id} courseID={queue.course.id}
                                                                     queueID={queue.id}
                                                                     ticket={ticket}/>)}
                    {tickets && tickets.length == 0 && <EmptyQueue/>}
                </Stack>
            </Box>
        </Grid>
    </>);
};

export default QueueList;


