import React from "react";
import {
    Box,
    Paper,
    Stack,
    Typography
} from "@mui/material";
import AppLayout from "@components/shared/AppLayout";
import {useAuth} from "@util/auth/hooks";
import AdminList from "@components/settings/AdminList";
import YourCoursesSection from "@components/settings/YourCoursesSection";
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
                        <Typography variant="body1">
                            Display Name: {currentUser?.displayName}
                        </Typography>
                        <Typography variant="body1">
                            Email: {currentUser?.email}
                        </Typography>
                    </Box>
                </Paper>
                {currentUser!.isAdmin && <AdminList/>}
                <YourCoursesSection/>
                {currentUser!.isAdmin && <AllCoursesSection/>}
            </Stack>
        </AppLayout>
    );
}
