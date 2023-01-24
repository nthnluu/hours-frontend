import React from "react";
import {Stack} from "@mui/material";
import AppLayout from "@components/shared/AppLayout";
import AdminList from "@components/settings/AdminList";
import YourCoursesSection from "@components/settings/YourCoursesSection";
import AllCoursesSection from "@components/settings/AllCoursesSection";
import ProfileInfoSection from "@components/settings/ProfileInfoSection";

export default function Settings() {
    return (
        <AppLayout maxWidth="md">
            <Stack spacing={4} mt={4}>
                <ProfileInfoSection/>
                <YourCoursesSection/>
                <AdminList/>
                <AllCoursesSection/>
            </Stack>
        </AppLayout>
    );
}
