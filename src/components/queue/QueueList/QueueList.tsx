import React, {FC, useEffect, useState} from "react";
import {
    Box,
    CircularProgress,
    Grid,
    Stack,
    Tooltip,
    Button,
    Typography,
} from "@mui/material";
import CreateTicketDialog from "@components/queue/CreateTicketDialog";
import QueueListItem from "@components/queue/QueueListItem";
import {useTickets} from "@util/queue/hooks";
import {Queue, Ticket, TicketStatus} from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";
import { ModelTrainingSharp } from "@mui/icons-material";
import { TICKET_COOLDOWN_MINUTES } from "@util/shared/constants";

export interface QueueListProps {
    queue: Queue
    showCompletedTickets: boolean;
}

/**
 * QueueList lists out the tickets in a queue.
 */
const QueueList: FC<QueueListProps> = ({queue, showCompletedTickets}) => {
    const {currentUser, isTA} = useAuth();
    const [tickets, ticketsLoading] = useTickets(queue.id, false);
    const shownTickets = tickets?.filter(t => !showCompletedTickets || t.status !== TicketStatus.StatusComplete);
    const [createTicketDialog, setCreateTicketDialog] = useState(false);

    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const id = setInterval(() => {
            setCurrentTime(new Date());
        }, 5000);
        return () => clearInterval(id);
    });

    const disabled = !tickets || tickets.some(t =>
        (t.status === TicketStatus.StatusComplete) 
        && (t.user.Email === currentUser!.email) 
        && (currentTime.getTime() - t.completedAt!.toDate().getTime())/1000/60 <= (TICKET_COOLDOWN_MINUTES));

    const inQueue = shownTickets && shownTickets.filter(ticket => ticket.user.Email == currentUser?.email).length > 0;
    const queueEnded = queue.endTime < new Date();

    const sortedTickets: (Ticket | undefined)[] = queue.tickets && shownTickets ? queue.tickets.map(ticketID => shownTickets.find(ticket => ticket.id === ticketID)).filter(ticket => ticket !== undefined) : [];

    const [prevTicketsLength, setPrevTicketsLength] = useState(queue.tickets.length);
    useEffect(() => {
        if ((queue.tickets.length > prevTicketsLength) && isTA(queue.course.id)) {
            // const audio = new Audio("/doorbell.mp3");
            // audio.play();

            if ("Notification" in window) {
                new Notification("A student has joined your queue.");
            }
        }

        setPrevTicketsLength(queue.tickets.length);
    }, [queue, prevTicketsLength, isTA]);

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
                    <div>
                        {disabled &&
                        <Tooltip title="Hi! There is 15 minute cooldown after TA meetings">
                            <div>
                                <Button variant="contained" onClick={() => setCreateTicketDialog(true)} disabled={disabled}>
                                    Join Queue
                                </Button>
                            </div>
                        </Tooltip>}
                        {!disabled &&
                        <Button variant="contained" onClick={() => setCreateTicketDialog(true)} disabled={disabled}>
                            Join Queue
                        </Button>
                        }
                    </div>}
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
                    {sortedTickets && sortedTickets.length == 0 && <EmptyQueue/>}
                </Stack>
            </Box>
        </Grid>
    </>);
};

export default QueueList;


