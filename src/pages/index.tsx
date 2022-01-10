import React from "react";
import {Grid} from "@mui/material";
import QueueCard from "@components/home/QueueCard";
import useQueues from "@hooks/useQueues";
import AppLayout from "@components/shared/AppLayout";

export default function Home() {
    const [queues, loading] = useQueues(true);

    return <AppLayout maxWidth={false} loading={loading}>
        {queues && <Grid spacing={3} container>
            {queues.map(queue => <Grid key={queue.id} item xs={12} sm={6} lg={4} xl={3}>
                <QueueCard queue={queue}/>
            </Grid>)}
        </Grid>}
    </AppLayout>;
}
