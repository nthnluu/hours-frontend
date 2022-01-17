import React from "react";
import {FormControl, InputLabel, MenuItem, Select, Stack, TextField} from "@mui/material";
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
                        <TextField size="small" label="Name" required value={currentUser?.displayName}/>
                        <TextField size="small" label="Email" disabled value={currentUser?.email}/>
                        <FormControl fullWidth size="small">
                            <InputLabel id="pronouns-label">Pronouns</InputLabel>
                            <Select
                                labelId="pronouns-label"
                                id="pronouns"
                                label="Pronouns"
                            >
                                <MenuItem value="he/him">He/him</MenuItem>
                                <MenuItem value="she/her">She/her</MenuItem>
                                <MenuItem value="they/them">They/them</MenuItem>
                                <MenuItem value="na">Prefer not to say</MenuItem>
                            </Select>
                        </FormControl>
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
