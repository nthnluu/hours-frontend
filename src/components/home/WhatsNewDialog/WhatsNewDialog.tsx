import {FC} from "react";
import {
    Dialog,
    DialogContent,
    Stack,
    Typography, List, ListItem, ListItemIcon, ListItemText
} from "@mui/material";
import Button from "@components/shared/Button";
import MasksIcon from '@mui/icons-material/Masks';
import InsightsIcon from '@mui/icons-material/Insights';
import TimerIcon from '@mui/icons-material/Timer';
import MarkChatUnreadIcon from '@mui/icons-material/MarkChatUnread';

export interface WhatsNewDialogProps {
    open: boolean;
    onClose: () => void;
}

const WhatsNewDialog: FC<WhatsNewDialogProps> = ({open, onClose}) => {
    return <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm" keepMounted={false}>
        <DialogContent>
            <Stack spacing={2.5} my={1}>
                <Typography variant="h5" fontWeight={600} textAlign="center">
                    What&apos;s New in Hours
                </Typography>
                <List>
                    <ListItem>
                        <ListItemIcon>
                            <MarkChatUnreadIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Text Message Notifications"
                                      secondary="Get notified when your ticket is claimed, or when a student joins your queue, via SMS."/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <MasksIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Face Mask Policies"
                                      secondary="TAs can now specify a face mask policy to indicate whether masks are optional or required for in-person sections."/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <InsightsIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Insights Dashboard"
                                      secondary="Access insights for your courses to help better understand how students are using Hours (professors and HTAs only)."/>
                    </ListItem>
                    <ListItem>
                        <ListItemIcon>
                            <TimerIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Queue Rejoin Cooldown"
                                      secondary="Set the amount of time a student must wait before rejoining a queue after their previous ticket was marked complete."/>
                    </ListItem>
                </List>
                <Stack alignItems="center">
                    <Button size="large" variant="contained" onClick={onClose}>
                        Continue
                    </Button>
                </Stack>
            </Stack>
        </DialogContent>
    </Dialog>;
};

export default WhatsNewDialog;


