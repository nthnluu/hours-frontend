import {FC} from "react";
import {
    Box,
    ListItem,
    ListItemText,
    Paper,
} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ClearIcon from '@mui/icons-material/Clear';
import {toast} from "react-hot-toast";
import AuthAPI, {Notification} from "@util/auth/api";

export interface NotificationItemProps {
    notification: Notification
}

const NotificationItem: FC<NotificationItemProps> = ({ notification }) => {
    return <Paper>
        <Box>
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" label="Clear notification" onClick={() => {
                        AuthAPI.clearNotification(notification)
                            .catch(() => toast.error("Error clearing notification."));
                    }}>
                      <ClearIcon />
                    </IconButton>
                  }
                >
                <ListItemText primary={notification.Title} secondary={notification.Body}/>
                </ListItem>
        </Box>
    </Paper>;
};

export default NotificationItem;