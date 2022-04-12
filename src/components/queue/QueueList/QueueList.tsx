import React, { FC, useEffect, useState } from "react";
import {
    Box,
    Chip,
    CircularProgress,
    Divider,
    Grid,
    Stack,
    Typography,
} from "@mui/material";
import Button from "@components/shared/Button";
import CreateTicketDialog from "@components/queue/CreateTicketDialog";
import QueueListItem from "@components/queue/QueueListItem";
import { useTickets } from "@util/queue/hooks";
import { Queue, Ticket } from "@util/queue/api";
import { useAuth } from "@util/auth/hooks";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";

export interface QueueListProps {
  queue: Queue;
  showCompletedTickets: boolean;
}

/**
 * QueueList lists out the tickets in a queue.
 */
const QueueList: FC<QueueListProps> = ({ queue, showCompletedTickets }) => {
  const { currentUser, isTA } = useAuth();
  const [tickets, ticketsLoading] = useTickets(queue.id, showCompletedTickets);
  const [createTicketDialog, setCreateTicketDialog] = useState(false);

  const inQueue =
    tickets &&
    tickets.filter((ticket) => ticket.user.Email == currentUser?.email).length >
      0;
  const queueEnded = queue.endTime < new Date();

  const sortedTickets: (Ticket | undefined)[] =
    queue.tickets && tickets
      ? queue.tickets
          .map((ticketID) => tickets.find((ticket) => ticket.id === ticketID))
          .filter((ticket) => ticket !== undefined)
      : [];

  const [prevTicketsLength, setPrevTicketsLength] = useState(
    queue.tickets.length
  );
  useEffect(() => {
    if (queue.tickets.length > prevTicketsLength && isTA(queue.course.id)) {
      // const audio = new Audio("/doorbell.mp3");
      // audio.play();

      if ("Notification" in window) {
        new Notification("A student has joined your queue.");
      }
    }

    setPrevTicketsLength(queue.tickets.length);
  }, [queue, prevTicketsLength]);

  const EmptyQueue = () => (
    <Stack mt={4} spacing={2} justifyContent="center" alignItems="center">
      {!queueEnded && <BouncingCubesAnimation />}
      <Typography variant="body1">
        {queueEnded
          ? "This queue is no longer active."
          : "Nobody is here... yet 😉."}
      </Typography>
    </Stack>
  );

  // Split sortedTickets into ticketsBeforeCutoff and ticketsAfterCutoff arrays
  const ticketsBeforeCutoff: Ticket[] = [];
  const ticketsAfterCutoff: Ticket[] = [];
  let pastCutoff = false;
  for (const ticket of sortedTickets) {
    if (!ticket) continue;
    if (ticket.id === queue.cutoffTicketID) {
      pastCutoff = true;
    }
    if (pastCutoff) {
      ticketsAfterCutoff.push(ticket);
    } else {
      ticketsBeforeCutoff.push(ticket);
    }
  }

  return (
    <>
      <CreateTicketDialog
        open={createTicketDialog}
        onClose={() => setCreateTicketDialog(false)}
        queueID={queue.id}
      />
      <Grid item xs={12} md={9}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6" fontWeight={600}>
            Queue
          </Typography>
          {!queueEnded && !inQueue && !isTA(queue.course.id) && (
            <Button
              variant="contained"
              onClick={() => setCreateTicketDialog(true)}
            >
              Join Queue
            </Button>
          )}
        </Stack>
        <Box mt={1}>
          {ticketsLoading && (
            <Stack
              height={200}
              width={"100%"}
              justifyContent="center"
              alignItems="center"
            >
              <CircularProgress />
            </Stack>
          )}
          <Stack spacing={1}>
            {ticketsBeforeCutoff &&
              ticketsBeforeCutoff.map((ticket, index) => (
                <QueueListItem
                  key={ticket!.id}
                  queue={queue}
                  ticket={ticket!}
                  position={index + 1}
                  beforeCutoff={true}
                />
              ))}

            {queue.isCutOff &&  
              <>
                <Divider>
                    <Chip label="Cutoff" color="warning"/>
                </Divider>
                <Typography variant="body2" color="textSecondary" align="center">
                    You can still sign up, but you might not get seen.
                </Typography>
                <Divider style={{marginTop: "0.5rem", marginBottom: "0.5rem"}}/>
              </>
            }

            {ticketsAfterCutoff &&
              ticketsAfterCutoff.map((ticket, index) => (
                <QueueListItem
                  key={ticket!.id}
                  queue={queue}
                  ticket={ticket!}
                  position={index + 1}
                  beforeCutoff={false}
                />
              ))}
                
            {sortedTickets && sortedTickets.length == 0 && <EmptyQueue />}
          </Stack>
        </Box>
      </Grid>
    </>
  );
};

export default QueueList;
