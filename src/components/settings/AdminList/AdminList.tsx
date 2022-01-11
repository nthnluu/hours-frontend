import React from "react";
import {
    Avatar,
    Box,
    Button,
    DialogActions,
    DialogContent,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import AuthAPI from "@util/auth/api";
import useAdmins from "@util/auth/hooks";
import {useForm} from "react-hook-form";
import {toast} from "react-hot-toast";

type FormData = {
    email: string;
};

/**
 * AdminList renders a list of all of the admins.
 */
export default function AdminList() {
    const [admins, loading] = useAdmins();
    const {register, handleSubmit, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        AuthAPI.updateUserByEmail(data.email, true)
            .catch(_ => toast.error(`User with email "${data.email}" not found.`));
    });

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
                        key={x.id}
                        secondaryAction={
                            <IconButton label="Revoke admin access" edge="end" aria-label="delete"
                            onClick={() => {
                                AuthAPI.updateUser(x.id, x.displayName, false)
                                    .catch(e => console.log(e));
                            }}>
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

            <form onSubmit={onSubmit}>
                <DialogContent>
                    <Stack spacing={2} my={1}>
                        <TextField
                            {...register("email")}
                            required
                            autoFocus
                            label="Email"
                            type="text"
                            fullWidth
                            size="small"
                            variant="outlined"
                        />
                    </Stack>
                </DialogContent>
            </form>
        </Paper>
    );
};