import React, {FC, useEffect, useMemo, useState} from "react";
import {Box, CircularProgress, Grid, Stack, Typography,} from "@mui/material";
import Button from "@components/shared/Button";
import CreateTicketDialog from "@components/queue/CreateTicketDialog";
import QueueListItem from "@components/queue/QueueListItem";
import {useTickets} from "@util/queue/hooks";
import {Queue, Ticket, TicketStatus} from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";
import playDoorbell from "@util/shared/playDoorbell";
import getEmptyQueueString from "@util/shared/getEmptyQueueString";

export interface QueueListProps {
    queue: Queue;
    playSound: boolean;
}

/**
 * QueueList lists out the tickets in a queue.
 */
const QueueList: FC<QueueListProps> = ({queue, playSound}) => {
    const {currentUser, isTA} = useAuth();
    const [tickets, ticketsLoading] = useTickets(queue.id);
    const [createTicketDialog, setCreateTicketDialog] = useState(false);

    const inQueue = tickets && tickets.filter(ticket => (ticket.user.Email == currentUser?.email) && (ticket.status != TicketStatus.StatusComplete)).length > 0;
    const queueEnded = queue.endTime < new Date();

    const sortedTickets: (Ticket | undefined)[] = queue.pendingTickets && tickets ? queue.pendingTickets.map(ticketID => tickets.find(ticket => ticket.id === ticketID)).filter(ticket => (ticket !== undefined) && (ticket.status != TicketStatus.StatusComplete)) : [];
    const [prevTicketsLength, setPrevTicketsLength] = useState(queue.pendingTickets.length);

    useEffect(() => {
        if ((queue.pendingTickets.length > prevTicketsLength) && isTA(queue.course.id)) {
            if (playSound) {
                playDoorbell();
            }

            if ("Notification" in window) {
                new Notification("A student has joined your queue.");
            }
        }

        setPrevTicketsLength(queue.pendingTickets.length);
    }, [queue, prevTicketsLength, playSound]);

    const emptyQueueString = useMemo(() => getEmptyQueueString(), []);

    const EmptyQueue = () => (
        <Stack mt={4} spacing={2} justifyContent="center" alignItems="center">
            {!queueEnded && <BouncingCubesAnimation/>}
            <Typography variant="h6" component="p">
                {queueEnded ? "This queue is no longer active." : emptyQueueString}
            </Typography>
        </Stack>
    );

    // function canCreateTicket(): boolean {
    //     if (!tickets) return false;
    //
    //     // Check for cooldown violations
    //     const filtered = tickets.filter(ticket => (ticket.user.UserID == currentUser?.id) &&
    //         (ticket.status == TicketStatus.StatusComplete));
    //     if (filtered.length == 0) {
    //         return true;
    //     } else {
    //         if (queue.rejoinCooldown == -1) return false;
    //         const sorted = filtered.sort(function (a, b) {
    //             return b.completedAt!.toMillis() - a.completedAt!.toMillis();
    //         });
    //         return (Date.now() - sorted[0].completedAt!.toMillis()) > (queue.rejoinCooldown * 60000);
    //     }
    // }

    return (<>
        <CreateTicketDialog open={createTicketDialog} onClose={() => setCreateTicketDialog(false)}
                            queueID={queue.id} faceMaskPolicy={queue.faceMaskPolicy}/>
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
                    {sortedTickets && sortedTickets.length == 0 && <EmptyQueue/>}
                </Stack>
            </Box>
        </Grid>
    </>);
};

export default QueueList;


