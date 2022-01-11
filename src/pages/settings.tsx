import React from "react";
import {
    Avatar,
    Box,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import AppLayout from "@components/shared/AppLayout";
import IconButton from "@components/shared/IconButton";
import DeleteIcon from '@mui/icons-material/Delete';
import {useAuth} from "@util/auth/hooks";
import AllCoursesSection from "@components/settings/AllCoursesSection";

export default function Settings() {
    const {currentUser} = useAuth();

    return (
        <AppLayout maxWidth="md">
            <Stack spacing={4}>
                <Paper variant="outlined">
                    <Box p={3}>
                        <Typography variant="h5" fontWeight={600}>
                            Your Profile
                        </Typography>
                    </Box>
                </Paper>

                {currentUser!.isAdmin && <Paper variant="outlined">
                    <Box p={3}>
                        <Typography variant="h5" fontWeight={600}>
                            Manage Admin Access
                        </Typography>

                        <List>
                            <ListItem
                                disableGutters
                                secondaryAction={
                                    <IconButton label="Revoke admin access" edge="end" aria-label="delete">
                                        <DeleteIcon/>
                                    </IconButton>
                                }>
                                <ListItemAvatar>
                                    <Avatar>
                                        NB
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Nathan Benavides-Luu"
                                    secondary="nathan_luu@brown.edu"
                                />
                            </ListItem>

                            <ListItem
                                disableGutters
                                secondaryAction={
                                    <IconButton label="Revoke admin access" edge="end" aria-label="delete">
                                        <DeleteIcon/>
                                    </IconButton>
                                }>
                                <ListItemAvatar>
                                    <Avatar>
                                        NB
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Rachel Ma"
                                    secondary="rachel_ma@brown.edu"
                                />
                            </ListItem>

                            <ListItem
                                disableGutters
                                secondaryAction={
                                    <IconButton label="Revoke admin access" edge="end" aria-label="delete">
                                        <DeleteIcon/>
                                    </IconButton>
                                }>
                                <ListItemAvatar>
                                    <Avatar>
                                        NB
                                    </Avatar>
                                </ListItemAvatar>
                                <ListItemText
                                    primary="Ashley Chon"
                                    secondary="ashley_chon@brown.edu"
                                />
                            </ListItem>


                        </List>
                    </Box>
                </Paper>}

                <Paper variant="outlined">
                    <Box p={3}>
                        <Typography variant="h5" fontWeight={600}>
                            Your Courses
                        </Typography>
                    </Box>
                </Paper>
                <AllCoursesSection/>
            </Stack>
        </AppLayout>
    );
}
