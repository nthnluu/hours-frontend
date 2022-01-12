import React, {useState} from "react";
import {Grid} from "@mui/material";
import {useQueues} from "@util/queue/hooks";
import AppLayout from "@components/shared/AppLayout";
import QueueCard from "@components/home/QueueCard";
import CreateQueueDialog from "@components/home/CreateQueueDialog";
import CreateQueueCard from "@components/home/CreateQueueCard";
import {useAuth} from "@util/auth/hooks";

export default function Home() {
    const {currentUser, isAuthenticated} = useAuth();
    const [queues, loading] = useQueues(true);
    const [createQueueDialog, setCreateQueueDialog] = useState(false);

    const isTA = isAuthenticated && currentUser && currentUser.coursePermissions && (Object.keys(currentUser.coursePermissions).length > 0);

    return <AppLayout maxWidth={false} loading={loading}>
        <CreateQueueDialog open={createQueueDialog} onClose={() => setCreateQueueDialog(false)}/>
        {queues &&
        <Grid spacing={3} container>
            {queues.map(queue => <Grid key={queue.id} item xs={12} sm={6} lg={4} xl={3}>
                <QueueCard queue={queue}/>
            </Grid>)}
            {isTA && <Grid key={queues.length} item xs={12} sm={6} lg={4} xl={3}>
                <CreateQueueCard clickHandler={() => setCreateQueueDialog(true)} />
            </Grid>}
        </Grid>}
    </AppLayout>;
}
