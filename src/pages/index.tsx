import React, {useState} from "react";
import {Grid, Stack, Typography} from "@mui/material";
import {useQueues} from "@util/queue/hooks";
import AppLayout from "@components/shared/AppLayout";
import QueueCard from "@components/home/QueueCard";
import CreateQueueDialog from "@components/home/CreateQueueDialog";
import {useAuth} from "@util/auth/hooks";
import BouncingCubesAnimation from "@components/animations/BouncingCubesAnimation";
import AddIcon from '@mui/icons-material/Add';

export default function Home() {
    const {currentUser, isAuthenticated} = useAuth();
    const [queues, loading] = useQueues(true);
    const [createQueueDialog, setCreateQueueDialog] = useState(false);

    const isTA = isAuthenticated && currentUser && currentUser.coursePermissions && (Object.keys(currentUser.coursePermissions).length > 0);

    return <AppLayout maxWidth={false} loading={loading}
                      actionButton={isTA ? {
                          label: "New Queue",
                          icon: <AddIcon/>,
                          onClick: () => setCreateQueueDialog(true)
                      } : undefined}>
        <CreateQueueDialog open={createQueueDialog} onClose={() => setCreateQueueDialog(false)}/>

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
                    No courses are currently holding hours.
                </Typography>
            </Stack>
        )}
    </AppLayout>;
}
