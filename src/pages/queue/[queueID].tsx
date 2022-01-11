import React, {useEffect} from "react";
import {
    Box,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import Lottie from "react-lottie";
import * as loadingAnimationData from "@util/lottie/89023-loading-circles.json";
import Button from "@components/shared/Button";
import CloseIcon from '@mui/icons-material/Close';
import EditIcon from '@mui/icons-material/Edit';
import QueuePageHeader from "@components/queue/QueuePageHeader";
import QueueListItem from "@components/queue/QueueListItem";
import CancelIcon from '@mui/icons-material/Cancel';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import CampaignIcon from '@mui/icons-material/Campaign';
import {useQueue} from "@util/queue/hooks";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";
import AppLayout from "@components/shared/AppLayout";
import {Ticket} from "@util/queue/api";

// TODO: much opportunity for refactoring into components

const tickets: Ticket[] = [
    {id: "0000", name: "Nathan Luu", createdAt: new Date(Date.now() - 1000 * 60)},
    {id: "1111", name: "Spike Spiegel", createdAt: new Date(Date.now() - 1000 * 120)},
    {id: "2222", name: "Toph Beifong", createdAt: new Date(Date.now() - 1000 * 180)},
    {id: "3333", name: "Tommy Chong", createdAt: new Date(Date.now() - 1000 * 250)},
    {id: "4444", name: "Jayce Brighthammer", createdAt: new Date(Date.now() - 1000 * 380)}
];

export default function Queue() {
    const router = useRouter();
    const {queueID} = router.query;
    const [queue, loading] = useQueue(queueID as string);

    // redirect user back to home page if no queue with given ID is found
    useEffect(() => {
        if (router.isReady && !loading && !queue) {
            router.push("/")
                .then(() => toast.error("We couldn't find the queue you were looking for."));
        }
    }, [router, queue, loading]);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: loadingAnimationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice"
        }
    };

    return (
        <AppLayout maxWidth="lg" loading={loading}>
            {queue && <>
                <QueuePageHeader queue={queue}/>
                <Grid container spacing={3} marginTop={1}>
                    <Grid item xs={12} md={3}>
                        <Stack spacing={3} divider={<Divider/>}>
                            {queue.description && <Box width="100%">
                                <Typography variant="h6">
                                    About
                                </Typography>
                                <Typography>
                                    {queue.description}
                                </Typography>
                            </Box>}

                            <Box width="100%">
                                <Typography variant="h6">
                                    Active TAs
                                </Typography>
                            </Box>

                            <Box width="100%">
                                <Typography variant="h6">
                                    Manage Queue
                                </Typography>

                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <CampaignIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary="Make announcement"/>
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <EditIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary="Edit queue"/>
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <ShuffleIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary="Shuffle tickets"/>
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <DoNotDisturbOnIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary="Cutoff signups"/>
                                        </ListItemButton>
                                    </ListItem>

                                    <ListItem disablePadding>
                                        <ListItemButton>
                                            <ListItemIcon>
                                                <CancelIcon/>
                                            </ListItemIcon>
                                            <ListItemText primary="Close queue"/>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </Box>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={9}>
                        <Box mb={2}>
                            <Paper variant="elevation" elevation={4}>
                                <Box width="100%" textAlign="center" p={4}>
                                    <Lottie options={defaultOptions} height={100} width={150}/>
                                    <Box mt={4}>
                                        <Typography fontSize={28} fontWeight={500}>You&apos;re up next!</Typography>
                                        {/*<Typography variant="body1">4 people ahead of you</Typography>*/}
                                        <Stack direction="row-reverse" spacing={1} justifyContent="center"
                                               marginTop={3}>
                                            <Button size="small" variant="contained" startIcon={<EditIcon/>}>
                                                Edit Ticket
                                            </Button>
                                            <Button size="small" variant="outlined" startIcon={<CloseIcon/>}
                                                    color="secondary">
                                                Exit Queue
                                            </Button>
                                        </Stack>
                                    </Box>
                                </Box>
                            </Paper>
                        </Box>
                        <Stack spacing={2}>
                            {tickets.map(ticket => <QueueListItem key={ticket.id} ticket={ticket}/>)}
                        </Stack>
                    </Grid>
                </Grid>
            </>}
        </AppLayout>
    );
}
