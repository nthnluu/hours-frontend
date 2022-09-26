import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";
import CreateTicketDialog from "@components/queue/CreateTicketDialog";
import QueueListItem from "@components/queue/QueueListItem";
import Button from "@components/shared/Button";
import {
  Box,
  Chip,
  CircularProgress,
  Divider,
  Grid,
  Stack,
  Tooltip,
  Typography
} from "@mui/material";
import { useAuth } from "@util/auth/hooks";
import { Queue, Ticket, TicketStatus } from "@util/queue/api";
import { useTickets } from "@util/queue/hooks";
import { TICKET_COOLDOWN_MINUTES } from "@util/shared/constants";
import React, { FC, useEffect, useState } from "react";

export interface QueueListProps {
  queue: Queue;
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

    const [isJoinDisabled, setIsJoinDisabled] = useState(false);

    useEffect(() => {
        const updateButton = () => {
            let disabled = true;
            if (tickets && currentUser) {
                const lastTicket = tickets.find(t => t.user.UserID === currentUser.id);
                if (lastTicket) {
                    const minutesSinceLastTicket = new Date().getMinutes() - lastTicket.createdAt.toDate().getMinutes();
                    disabled = minutesSinceLastTicket < TICKET_COOLDOWN_MINUTES;
                } else {
                    disabled = false;
                }
            }
                
            if (disabled !== isJoinDisabled) {
                setIsJoinDisabled(disabled);
            }
        };
        updateButton();
        const id = setInterval(updateButton, 5000); // check to see if the button should be disabled every 5 seconds
        return () => clearInterval(id);
    }, [tickets, currentUser, isJoinDisabled]);

    const inQueue = shownTickets && shownTickets.filter(ticket => ticket.user.Email == currentUser?.email).length > 0;
    const queueEnded = queue.endTime < new Date();

    const sortedTickets: (Ticket | undefined)[] = queue.tickets && shownTickets ? queue.tickets.map(ticketID => shownTickets.find(ticket => ticket.id === ticketID)).filter(ticket => ticket !== undefined) : [];

  const [prevTicketsLength, setPrevTicketsLength] = useState(
    queue.tickets.length
  );
  useEffect(() => {
    if (queue.tickets.length > prevTicketsLength && isTA(queue.course.id)) {
      if ("Notification" in window) {
        new Notification("A student has joined your queue.");
      }
    }

    setPrevTicketsLength(queue.tickets.length);
  }, [queue, prevTicketsLength, isTA]);

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
  let pastCutoff = !queue.cutoffTicketID && queue.isCutOff;
  for (const ticket of sortedTickets) {
    if (!ticket) continue;
    if (pastCutoff) {
      ticketsAfterCutoff.push(ticket);
    } else {
      ticketsBeforeCutoff.push(ticket);
    }
    if (ticket.id === queue.cutoffTicketID && queue.isCutOff) {
      pastCutoff = true;
    }
  }
  return (<>
    <CreateTicketDialog open={createTicketDialog} onClose={() => setCreateTicketDialog(false)}
                        queueID={queue.id}/>
    <Grid item xs={12} md={9}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={600}>
          Queue
        </Typography>
        {!queueEnded && !inQueue && !isTA(queue.course.id) &&
            <Tooltip title={isJoinDisabled ? `You must wait ${TICKET_COOLDOWN_MINUTES} minutes between tickets` : ""}>
              <div>
                <Button variant="contained" onClick={() => setCreateTicketDialog(true)} disabled={isJoinDisabled}>
                  Join Queue
                </Button>
              </div>
            </Tooltip>
        }
      </Stack>
      <Box mt={1}>
          {ticketsLoading && <Stack height={200} width={"100%"} justifyContent="center" alignItems="center">
              <CircularProgress/>
          </Stack>}
          {ticketsBeforeCutoff &&
              ticketsBeforeCutoff.map((ticket, index) => (
              <QueueListItem
                  key={ticket.id}
                  queue={queue}
                  ticket={ticket}
                  position={index + 1}
                  beforeCutoff={true}
              />
              ))}

          {queue.isCutOff &&  
              <>
              <Divider style={{marginTop: "0.5rem"}}>
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
                  key={ticket.id}
                  queue={queue}
                  ticket={ticket}
                  position={index + 1 + ticketsBeforeCutoff.length}
                  beforeCutoff={false}
              />
              ))}

          {sortedTickets && sortedTickets.length == 0 && <EmptyQueue />}
      </Box>
    </Grid>
  </>);
};

export default QueueList;
