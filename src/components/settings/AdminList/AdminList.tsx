import React, {useState} from "react";
import {
    Avatar,
    Box,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import IconButton from "@components/shared/IconButton";
import ConfirmButton from "@components/shared/ConfirmButton";
import CloseIcon from '@mui/icons-material/Close';
import AuthAPI, {User} from "@util/auth/api";
import useAdmins from "@util/auth/hooks";
import {useForm} from "react-hook-form";
import {toast} from "react-hot-toast";
import SettingsSection from "@components/settings/SettingsSection";
import getInitials from "@util/shared/getInitials";
import Button from "@components/shared/Button";
import {Add} from "@mui/icons-material";

type FormData = {
    email: string;
};

/**
 * AdminList renders a list of all of the admins.
 */
export default function AdminList() {
    const [currentConfirmDialog, setCurrentConfirmDialog] = useState("");
    const [admins, loading] = useAdmins();
    const {register, handleSubmit, reset, formState: {errors}} = useForm<FormData>();
    const onSubmit = handleSubmit(data => {
        toast.promise(AuthAPI.updateUserByEmail(data.email, true), {
            loading: "Adding admin...",
            success: `${data.email} is now an admin.`,
            error: "Something went wrong, please try again later."
        })
            .then(() => reset());
    });

    function handleDeleteAdmin(user: User) {
        toast.promise(AuthAPI.updateUser(user.id, user.displayName, false), {
            loading: "Removing admin...",
            success: `${user.displayName} is no longer an admin.`,
            error: "Something went wrong, please try again later."
        });
    }

    return <SettingsSection title="Manage admin access" loading={loading}>
        <List dense>
            {admins?.map(admin => (
                <ListItem
                    disableGutters
                    key={admin.id}
                    secondaryAction={
                        <ConfirmButton
                            message={`Delete admin ${admin.displayName}?`}
                            open={currentConfirmDialog === admin.id}
                            onClose={() => setCurrentConfirmDialog("")}
                            onConfirm={() => handleDeleteAdmin(admin)}>
                            <IconButton label="Revoke admin access" edge="end" aria-label="delete"
                                        onClick={() => setCurrentConfirmDialog(admin.id)}>
                                <CloseIcon/>
                            </IconButton>
                        </ConfirmButton>
                    }>
                    <ListItemAvatar>
                        <Avatar src={admin.photoUrl}>
                            {getInitials(admin.displayName)}
                        </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                        primary={admin.displayName}
                        secondary={admin.email}
                    />
                </ListItem>))}
        </List>
        <Box my={2}>
            <Divider/>
        </Box>
        <Stack spacing={2}>
            <Typography fontWeight={500}>
                Add admin
            </Typography>
            <form onSubmit={onSubmit}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <TextField
                        {...register("email")}
                        required
                        label="Email"
                        type="email"
                        fullWidth
                        size="small"
                        variant="outlined"
                    />
                    <Button type="submit" startIcon={<Add/>}>
                        Add
                    </Button>
                </Stack>
            </form>
        </Stack>
    </SettingsSection>;
};