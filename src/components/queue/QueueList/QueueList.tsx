import React, {FC, useState} from "react";
import {
    Box,
    CircularProgress,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import Button from "@components/shared/Button";
import CreateTicketDialog from "@components/queue/CreateTicketDialog";
import QueueListItem from "@components/queue/QueueListItem";
import {useTickets} from "@util/queue/hooks";
import {Queue, Ticket} from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";

export interface QueueListProps {
    queue: Queue
    showCompletedTickets: boolean;
}

/**
 * QueueList lists out the tickets in a queue.
 */
const QueueList: FC<QueueListProps> = ({queue, showCompletedTickets}) => {
    const {currentUser, isTA} = useAuth();
    const [tickets, ticketsLoading] = useTickets(queue.id, showCompletedTickets);
    const [createTicketDialog, setCreateTicketDialog] = useState(false);

    const inQueue = tickets && tickets.filter(ticket => ticket.user.Email == currentUser?.email).length > 0;
    const queueEnded = queue.endTime < new Date();

    const sortedTickets: (Ticket | undefined)[] = queue.tickets && tickets ? queue.tickets.map(ticketID => tickets.find(ticket => ticket.id === ticketID)).filter(ticket => ticket !== undefined) : [];

    const EmptyQueue = () => (
        <Stack mt={4} spacing={2} justifyContent="center" alignItems="center">
            {!queueEnded && <BouncingCubesAnimation/>}
            <Typography variant="body1">
                {queueEnded ? "This queue is no longer active." : "Nobody is here... yet 😉."}
            </Typography>
        </Stack>
    );

    return (<>
        <CreateTicketDialog open={createTicketDialog} onClose={() => setCreateTicketDialog(false)}
                            queueID={queue.id}/>
        <Grid item xs={12} md={9}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                    Queue
                </Typography>
                {!queue.isCutOff && !queueEnded && !inQueue && !isTA(queue.course.id) &&
                    <Button variant="contained" onClick={() => setCreateTicketDialog(true)}>
                        Join Queue
                    </Button>}
            </Stack>
            <Box mt={1}>
                {ticketsLoading && <Stack height={200} width={"100%"} justifyContent="center" alignItems="center">
                    <CircularProgress/>
                </Stack>}
                <Stack spacing={1}>
                    {sortedTickets && sortedTickets.map((ticket, index) => <QueueListItem key={ticket!.id}
                                                                                 queue={queue}
                                                                                 ticket={ticket!}
                                                                                 position={index + 1}/>)}
                    {tickets && tickets.length == 0 && <EmptyQueue/>}
                </Stack>
            </Box>
        </Grid>
    </>);
};

export default QueueList;


