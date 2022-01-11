import React from "react";
import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Typography,
} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import AuthAPI from "@util/auth/api";
import useAdmins from "@util/auth/hooks";


/**
 * AdminList renders a list of all of the admins.
 */
export default function AdminList() {
    const [admins, loading] = useAdmins();

    if (loading) return <></>;

    return (
        <Paper variant="outlined">
            <Box p={3}>
                <Typography variant="h5" fontWeight={600}>
                    Manage Admin Access
                </Typography>
            </Box>
            <List>
                {admins?.map(x => (
                    <ListItem
                        key={x}
                        secondaryAction={
                            <IconButton label="Revoke admin access" edge="end" aria-label="delete"
                            onClick={() => AuthAPI.updateUser(x.id, x.displayName, false)}>
                                <DeleteIcon/>
                            </IconButton>
                        }>
                        <ListItemAvatar>
                            <Avatar>
                                NB
                            </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                            primary={x.displayName}
                            secondary={x.email}
                        />
                    </ListItem>))}
            </List>
        </Paper>
    );
};