import React, {FC, useState} from "react";
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
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CampaignIcon from '@mui/icons-material/Campaign';
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import DoNotDisturbOnIcon from '@mui/icons-material/DoNotDisturbOn';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import EditIcon from '@mui/icons-material/Edit';
import ShuffleIcon from '@mui/icons-material/Shuffle';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import QueueAPI, {Queue} from "@util/queue/api";
import EditQueueDialog from "@components/queue/EditQueueDialog";
import ReopenQueueDialog from "@components/queue/ReopenQueueDialog";
import MakeAnnouncementDialog from "@components/queue/MakeAnnouncementDialog";
import {useAuth} from "@util/auth/hooks";
import {toast} from "react-hot-toast";
import formatEndTime from "@util/shared/formatEndTime";
import {add} from "date-fns";

export interface QueueOptionsProps {
    queue: Queue;
    queueID: string;
    showCompletedTickets: boolean;
    setShowCompletedTickets: (arg: boolean) => void;
}


/**
 * QueueOption contains the config necessary to modify a queue.
 */
const QueueOptions: FC<QueueOptionsProps> = ({queue, queueID, showCompletedTickets, setShowCompletedTickets}) => {
    const {isTA} = useAuth();
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openReopenDialog, setOpenReopenDialog] = useState(false);
    const [openAnnounceDialog, setOpenAnnounceDialog] = useState(false);

    const isEnded = queue.endTime < new Date();
    const isLongEnded = add(queue.endTime, {minutes: 30}) < new Date();
    // const isLongEnded = queue.endTime < new Date();

    const lastTicketID = queue.tickets[queue.tickets.length - 1];

    return <>
        <EditQueueDialog queueID={queueID} queue={queue} open={openEditDialog}
                        onClose={() => setOpenEditDialog(false)}/>
        <ReopenQueueDialog queueID={queueID} queue={queue} open={openReopenDialog}
                        onClose={() => setOpenReopenDialog(false)}/>
        <MakeAnnouncementDialog queueID={queueID} open={openAnnounceDialog}
                                onClose={() => setOpenAnnounceDialog(false)}/>
        <Grid item xs={12} md={3}>
            <Stack spacing={3} divider={<Divider/>}>
                <Box width="100%">
                    <Typography variant="h6">
                        About
                    </Typography>
                    <Typography variant="body1" style={{wordWrap: "break-word"}}>
                        {queue.description}
                    </Typography>

                    <Stack spacing={1.5} mt={2}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <LocationOnIcon/>
                            <Typography style={{overflow: "hidden", textOverflow: "ellipsis", width: '10rem'}}>
                                {queue.location}
                            </Typography>
                        </Stack>
                        <Stack direction="row" alignItems="center" spacing={1}>
                            <AccessTimeIcon/>
                            <Typography>
                                {formatEndTime(queue.endTime)}
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>

                {isTA(queue.course.id) && !isLongEnded && <Box width="100%">
                    <Typography variant="h6">
                        Manage Queue
                    </Typography>

                    <List>
                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setOpenEditDialog(true)}>
                                <ListItemIcon>
                                    <EditIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Edit queue"/>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => setOpenAnnounceDialog(true)}>
                                <ListItemIcon>
                                    <CampaignIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Make announcement"/>
                            </ListItemButton>
                        </ListItem>

                        <ListItem disablePadding>
                            <ListItemButton onClick={() => QueueAPI.shuffleQueue(queueID)}>
                                <ListItemIcon>
                                    <ShuffleIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Shuffle tickets"/>
                            </ListItemButton>
                        </ListItem>

                        {/* <ListItem disablePadding>
                            <ListItemButton onClick={() => setShowCompletedTickets(!showCompletedTickets)}>
                                <ListItemIcon>
                                    <CheckCircleIcon/>
                                </ListItemIcon>
                                <ListItemText
                                    primary={(showCompletedTickets ? "Show" : "Hide") + " completed tickets"}/>
                            </ListItemButton>
                        </ListItem> */}

                        <ListItem disablePadding>
                            <ListItemButton
                                onClick={() => QueueAPI.cutOffQueue(queueID, !queue.isCutOff, lastTicketID).catch(
                                    () => toast.error("Error closing queue."))}>
                                <ListItemIcon>
                                    {!queue.isCutOff ? <DoNotDisturbOnIcon/> : <AddCircleIcon/>}
                                </ListItemIcon>
                                <ListItemText primary={queue.isCutOff ? "Reopen signups" : "Cutoff signups"}/>
                            </ListItemButton>
                        </ListItem>

                        {isEnded ? <ListItem disablePadding>
                            <ListItemButton onClick={() => setOpenReopenDialog(true)}>
                                <ListItemIcon>
                                    <RestartAltIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Reopen queue"/>
                            </ListItemButton>
                        </ListItem> : <ListItem disablePadding>
                            <ListItemButton onClick={() => {
                                const confirmed = confirm("Are you sure you want to end this queue?");

                                if (confirmed) {
                                    QueueAPI.endQueue(queue)
                                        .then(() => toast.success("Queue ended."))
                                        .catch(() => toast.error("Error ending queue."));
                                }
                            }}>
                                <ListItemIcon>
                                    <CancelIcon/>
                                </ListItemIcon>
                                <ListItemText primary="End queue"/>
                            </ListItemButton>
                        </ListItem>}
                    </List>
                </Box>}
            </Stack>
        </Grid>
    </>;
};

export default QueueOptions;


