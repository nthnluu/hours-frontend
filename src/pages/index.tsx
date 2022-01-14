import React, {useState} from "react";
import {Fab, Grid, Stack, Typography} from "@mui/material";
import {useQueues} from "@util/queue/hooks";
import AppLayout from "@components/shared/AppLayout";
import QueueCard from "@components/home/QueueCard";
import CreateQueueDialog from "@components/home/CreateQueueDialog";
import {useAuth} from "@util/auth/hooks";
import AddIcon from "@mui/icons-material/Add";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";

export default function Home() {
    const {currentUser, isAuthenticated} = useAuth();
    const [queues, loading] = useQueues(true);
    const [createQueueDialog, setCreateQueueDialog] = useState(false);

    const isTA = isAuthenticated && currentUser && currentUser.coursePermissions && (Object.keys(currentUser.coursePermissions).length > 0);

    return <AppLayout maxWidth={false} loading={loading}>
        <CreateQueueDialog open={createQueueDialog} onClose={() => setCreateQueueDialog(false)}/>
        {isTA && <Fab onClick={() => setCreateQueueDialog(true)} variant="extended" color="primary" size="large" sx={{
            margin: 0,
            top: 'auto',
            right: 20,
            bottom: 20,
            left: 'auto',
            position: 'fixed',
        }}>
            <AddIcon sx={{mr: 1}}/>
            New Queue
        </Fab>}
        {queues && queues.length > 0 &&
        <Grid spacing={3} container direction="row" alignItems="stretch">
            {queues.map(queue => <Grid key={queue.id} item xs={12} sm={6} lg={4} xl={3}>
                <QueueCard queue={queue}/>
            </Grid>)}
        </Grid>}
        {queues && queues.length === 0 && (
            <Stack mt={4} spacing={2} justifyContent="center" alignItems="center">
                <BouncingCubesAnimation/>
                <Typography variant="h6">
                    No courses are holding hours right now
                </Typography>
            </Stack>
        )}
    </AppLayout>;
}
