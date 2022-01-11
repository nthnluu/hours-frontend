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
import { Queue } from "@util/queue/api";
import {useAuth} from "@util/auth/hooks";

export interface QueueListProps {
    queueID: string
    queue: Queue
}

/**
 * QueueList lists out the tickets in a queue.
 */
const QueueList: FC<QueueListProps> = ({ queueID }) => {
    const {currentUser, isAuthenticated} = useAuth();
    const [tickets, ticketsLoading] = useTickets(queueID);
    const [createTicketDialog, setCreateTicketDialog] = useState(false);

    if (ticketsLoading) return <></>;

    const inQueue = tickets && tickets.filter(ticket => ticket.createdBy.Email == currentUser?.email).length > 0;

    const EmptyQueue = () => (
        <Stack spacing={2} justifyContent="center" alignItems="center">
            <Typography variant="body1">
                Nobody is here!
            </Typography>
        </Stack>
    );

    return (<>
        <CreateTicketDialog open={createTicketDialog} onClose={() => setCreateTicketDialog(false)} queueID={queueID as string}/>
        <Grid item xs={12} md={9}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h3" fontWeight={600}>
                    Queue
                </Typography>
                {!inQueue && <Button size="large" variant="contained" onClick={() => setCreateTicketDialog(true)}>
                    Join Queue
                </Button>}
            </Stack>
            <Box p={2.5}>
                <Stack spacing={2}>
                    {tickets && tickets.map(ticket => <QueueListItem key={ticket.id} queueID={queueID as string} ticket={ticket}/>)}
                    {tickets && tickets.length == 0 && <EmptyQueue />}
                </Stack>
            </Box>
        </Grid>
    </>);
};

export default QueueList;


