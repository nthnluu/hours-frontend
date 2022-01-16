import React from "react";
import {Stack, TextField} from "@mui/material";
import AppLayout from "@components/shared/AppLayout";
import {useAuth} from "@util/auth/hooks";
import AdminList from "@components/settings/AdminList";
import YourCoursesSection from "@components/settings/YourCoursesSection";
import AllCoursesSection from "@components/settings/AllCoursesSection";
import SettingsSection from "@components/settings/SettingsSection";
import Button from "@components/shared/Button";

export default function Settings() {
    const {currentUser} = useAuth();
    const isTA = currentUser && Object.keys(currentUser.coursePermissions).length > 0;

    return (
        <AppLayout maxWidth="md">
            <Stack spacing={4} mt={4}>
                <SettingsSection title="Your profile">
                    <Stack spacing={3} mt={4}>
                        <TextField size="small" label="Name" value={currentUser?.displayName}/>
                        <TextField size="small" label="Email" disabled value={currentUser?.email}/>
                        {isTA && <TextField size="small" label="Zoom link"/>}
                        <Stack direction="row" justifyContent="end">
                            <Button variant="contained">
                                Save
                            </Button>
                        </Stack>
                    </Stack>
                </SettingsSection>
                <AdminList/>
                <YourCoursesSection/>
                <AllCoursesSection/>
            </Stack>
        </AppLayout>
    );
}
