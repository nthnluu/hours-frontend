import React, {FC} from "react";
import {
    Box,
    Divider,
    Grid,
    List,
    ListItem,
    ListItemButton, ListItemIcon, ListItemText,
    Stack,
    Typography
} from "@mui/material";
import CampaignIcon from '@mui/icons-material/Campaign';
import CancelIcon from '@mui/icons-material/Cancel';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import QueueAPI, { Queue } from "@util/queue/api";
import {useRouter} from "next/router";
import {toast} from "react-hot-toast";

export interface QueueOptionsProps {
    queue: Queue;
    queueID: string;
}

/**
 * QueueOption contains the config necessary to modify a queue.
 */
const QueueOptions: FC<QueueOptionsProps> = ({ queue, queueID }) => {
    const router = useRouter();

    return (
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
                        Manage Queue
                    </Typography>

                    <List>
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
                                    <CampaignIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Make announcement"/>
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
                            <ListItemButton onClick={() => QueueAPI.editQueue(queueID, queue.title, queue.description || "", !queue.isActive).catch(_ => toast.error("Error closing queue."))}>
                                <ListItemIcon>
                                    {queue.isActive ? <DoNotDisturbOnIcon/> : <AddCircleIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={queue.isActive ? "Cutoff signups" : "Reopen signups"}/>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                QueueAPI.deleteQueue(queueID)
                                    .then(_ => toast.success("Queue deleted."))
                                    .catch(_ => toast.error("Error closing queue."));
                                router.push("/");
                            }}>
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
    );
};

export default QueueOptions;


