import React, { FC, useEffect, useMemo, useState } from "react";
import {
  Box,
  ButtonProps,
  CircularProgress,
  Grid,
  Stack,
  Typography,
} from "@mui/material";
import Button from "@components/shared/Button";
import CreateTicketDialog from "@components/queue/CreateTicketDialog";
import QueueListItem from "@components/queue/QueueListItem";
import { useTickets } from "@util/queue/hooks";
import { Queue, Ticket, TicketStatus } from "@util/queue/api";
import { useAuth } from "@util/auth/hooks";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";
import playDoorbell from "@util/shared/playDoorbell";
import getEmptyQueueString from "@util/shared/getEmptyQueueString";
import { useRouter } from "next/router";

export interface QueueListProps {
  queue: Queue;
  playSound: boolean;
}

interface JoinButtonContentProps {
  queueCooldownMinutes: number;
  lastTicket?: Ticket;
  onClick: ButtonProps["onClick"];
}

const JoinButton = (props: JoinButtonContentProps) => {
  const { queueCooldownMinutes, lastTicket, onClick } = props;
  const [disabled, setDisabled] = useState(computeState().disabled);
  const [cooldown, setCooldown] = useState<string | null>(computeState().cooldown);

  // disabled && cooldown -> "Join in 12:34"
  // disabled && (cooldown === null) -> "Join Queue" (disabled, you're in line)
  // enabled && cooldown -> Impossible
  // enabled && (cooldown === null) -> "Join Queue"
  function computeState(): { disabled: boolean; cooldown: string | null } {
    if (!lastTicket) {
      return { disabled: false, cooldown: null };
    }
    if (queueCooldownMinutes === 0) {
      return { disabled: false, cooldown: null };
    }

    const completedAt = lastTicket.completedAt;
    // In the queue
    if (!completedAt) {
      return { disabled: true, cooldown: null };
    }

    const elegibilityMillis =
      completedAt.toMillis() + queueCooldownMinutes * 1000 * 60;
    const now = Date.now();
    const millisUntilEligible = elegibilityMillis - now;

    // Need to wait for the cool-down
    if (millisUntilEligible > 0) {
      const minutes = Math.floor(millisUntilEligible / (1000 * 60));
      const seconds = Math.floor((millisUntilEligible % (1000 * 60)) / 1000);

      return { disabled: true, cooldown: `${minutes}:${seconds}` };
    } else {
      return { disabled: false, cooldown: null };
    }
  }

  function recalculateState() {
    const state = computeState();
    setDisabled(state.disabled);
    setCooldown(state.cooldown);
  }

  useEffect(() => {
    recalculateState();
  }, [queueCooldownMinutes, lastTicket]);

  useEffect(() => {
    let id: NodeJS.Timeout;

    if (cooldown !== null) {
      id = setTimeout(recalculateState, 1000);
    }

    return () => {
      clearTimeout(id);
    };
  }, [cooldown]);

  return (
    <Button variant="contained" onClick={onClick} disabled={disabled}>
      <Box component="span">Join</Box>
      <Box className="timer" sx={{ width: `8ch` }}>
        {cooldown === null ? ` Queue` : `in ${cooldown}`}
      </Box>
    </Button>
  );
};

/**
 * QueueList lists out the tickets in a queue.
 */
const QueueList: FC<QueueListProps> = ({ queue, playSound }) => {
  const { currentUser, isTA } = useAuth();
  const [tickets, ticketsLoading] = useTickets(queue.id);
  const [createTicketDialog, setCreateTicketDialog] = useState(false);

  const inQueue =
    tickets &&
    tickets.filter(
      (ticket) =>
        ticket.user.Email == currentUser?.email &&
        ticket.status != TicketStatus.StatusComplete
    ).length > 0;
  const queueEnded = queue.endTime < new Date();

  const sortedTickets: (Ticket | undefined)[] =
    queue.pendingTickets && tickets
      ? queue.pendingTickets
          .map((ticketID) => tickets.find((ticket) => ticket.id === ticketID))
          .filter(
            (ticket) =>
              ticket !== undefined &&
              ticket.status != TicketStatus.StatusComplete
          )
      : [];
  const [prevTicketsLength, setPrevTicketsLength] = useState(
    queue.pendingTickets.length
  );
  const router = useRouter();

  // ?allowTATickets=true to allow TAs to create tickets
  const { allowTATickets } = router.query;

  useEffect(() => {
    if (
      queue.pendingTickets.length > prevTicketsLength &&
      isTA(queue.course.id)
    ) {
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
      {!queueEnded && <BouncingCubesAnimation />}
      <Typography variant="h6" component="p">
        {queueEnded ? "This queue is no longer active." : emptyQueueString}
      </Typography>
    </Stack>
  );

  return (
    <>
      <CreateTicketDialog
        open={createTicketDialog}
        onClose={() => setCreateTicketDialog(false)}
        queueID={queue.id}
        faceMaskPolicy={queue.faceMaskPolicy}
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
          {!queue.isCutOff &&
            !queueEnded &&
            !inQueue &&
            (!isTA(queue.course.id) || allowTATickets) && (
              <JoinButton
                queueCooldownMinutes={queue.rejoinCooldown}
                lastTicket={undefined}
                onClick={() => setCreateTicketDialog(false)}
              />
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
            {sortedTickets &&
              sortedTickets.map((ticket, index) => (
                <QueueListItem
                  key={ticket!.id}
                  queue={queue}
                  ticket={ticket!}
                  position={index + 1}
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
