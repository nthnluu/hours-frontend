import React, {useEffect, useState} from "react";
import {Grid} from "@mui/material";
import QueuePageHeader from "@components/queue/QueuePageHeader";
import {useQueue} from "@util/queue/hooks";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";
import AppLayout from "@components/shared/AppLayout";
import QueueOptions from "@components/queue/QueueOptions";
import QueueList from "@components/queue/QueueList";

export default function Queue() {
    const router = useRouter();
    const {queueID} = router.query;
    const [queue, queueLoading] = useQueue(queueID as string);
    const [showCompletedTickets, setShowCompletedTickets] = useState(true);
    const [playSound, setPlaySound] = useState(localStorage.getItem("play-sound") === "true");

    // Redirect user back to home page if no queue with given ID is found
    useEffect(() => {
        if (router.isReady && !queueLoading && !queue) {
            router.push("/")
                .then(() => toast.error("We couldn't find the queue you were looking for."));
        }
    }, [router, queue, queueLoading]);

    function togglePlaySound() {
        const newValue = !playSound;
        setPlaySound(newValue);
        localStorage.setItem("play-sound", String(newValue));
    }

    return (
        <AppLayout title={queue?.title} maxWidth="lg" loading={queueLoading}>
            {queue && !queueLoading && <>
                <QueuePageHeader queue={queue}/>
                <Grid container spacing={4} marginTop={1}>
                    <QueueOptions queue={queue} queueID={queueID as string}
                                  showCompletedTickets={showCompletedTickets}
                                  togglePlaySound={togglePlaySound}
                                  playSound={playSound}
                                  setShowCompletedTickets={setShowCompletedTickets}/>
                    <QueueList queue={queue} playSound={playSound}/>
                </Grid>
            </>}
        </AppLayout>
    );
}
