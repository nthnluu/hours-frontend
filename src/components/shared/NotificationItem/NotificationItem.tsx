import {FC} from "react";
import {
    Box,
    ListItem,
    ListItemText,
    Paper,
} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import AuthAPI, {Notification, NotificationType} from "@util/auth/api";
import {toast} from "react-hot-toast";
import {useRouter} from "next/router";
import {formatDistance} from "date-fns";

export interface NotificationItemProps {
    notification: Notification
}

const NotificationItem: FC<NotificationItemProps> = ({notification}) => {
    const router = useRouter();

    return <Paper variant="elevation" elevation={3}>
        <Box>
            <ListItem
                button
                onClick={() => {
                    if (notification.Data && (notification.Type === NotificationType.NotificationAnnouncement || notification.Type === NotificationType.NotificationClaimed)) {
                        router.push(`/queue/${notification.Data}`);
                    }
                }}
                secondaryAction={
                    <IconButton edge="end" label="Clear notification" onClick={() => {
                        AuthAPI.clearNotification(notification)
                            .catch(() => toast.error("Error clearing notification."));
                    }}>
                        <ClearIcon/>
                    </IconButton>
                }
            >
                <ListItemText primary={notification.Title}
                              secondary={`${notification.Body} (${formatDistance(notification.Timestamp.toDate(), new Date(), {addSuffix: true})})`}/>
            </ListItem>
        </Box>
    </Paper>;
};

export default NotificationItem;