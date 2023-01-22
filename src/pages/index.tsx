import React, {useEffect, useState} from "react";
import {Box, Grid, Stack, Typography} from "@mui/material";
import {useQueues} from "@util/queue/hooks";
import AppLayout from "@components/shared/AppLayout";
import QueueCard from "@components/home/QueueCard";
import CreateQueueDialog from "@components/home/CreateQueueDialog";
import {useAuth} from "@util/auth/hooks";
import Button from "@components/shared/Button";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import WhatsNewDialog from "@components/home/WhatsNewDialog";

const WHATS_NEW_KEY = 'whats-new-dismissed';
const WHATS_NEW_VER = '1';

export default function Home() {
    const {currentUser, isAuthenticated} = useAuth();
    const [queues, loading] = useQueues();
    const [createQueueDialog, setCreateQueueDialog] = useState(false);
    const [whatsNewDialog, setWhatsNewDialog] = useState(localStorage.getItem(WHATS_NEW_KEY) != WHATS_NEW_VER);

    const isTA = isAuthenticated && currentUser && currentUser.coursePermissions && (Object.keys(currentUser.coursePermissions).length > 0);

    // Marks the current What's New dialog as read by storing a flag in local storage
    function markAsRead() {
        localStorage.setItem(WHATS_NEW_KEY, WHATS_NEW_VER);
        setWhatsNewDialog(false);
    }

    return <AppLayout maxWidth={false} loading={loading}>
        <WhatsNewDialog open={whatsNewDialog} onClose={markAsRead}/>
        <CreateQueueDialog open={createQueueDialog} onClose={() => setCreateQueueDialog(false)}/>
        {queues && queues.length > 0 && isTA && <Box mb={2}>
            <Button startIcon={<AddCircleIcon/>} onClick={() => setCreateQueueDialog(true)}>
                Create Queue
            </Button>
        </Box>}
        {queues && queues.length > 0 &&
            <Grid spacing={3} container direction="row" alignItems="stretch">
                {queues.map(queue => <Grid key={queue.id} item xs={12} md={6} lg={4} xl={3}>
                    <QueueCard queue={queue}/>
                </Grid>)}
            </Grid>}
        {queues && queues.length === 0 && (
            <Stack mt={18} spacing={2} justifyContent="center" alignItems="center">
                <Typography variant="h6">
                    No courses are currently holding hours.
                </Typography>
                {isTA && <Button startIcon={<AddCircleIcon/>} onClick={() => setCreateQueueDialog(true)}>
                    Create Queue
                </Button>}
            </Stack>
        )}
    </AppLayout>;
}
