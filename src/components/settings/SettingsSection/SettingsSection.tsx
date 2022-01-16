import React, {FC} from "react";
import {Box, CircularProgress, Paper, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import {useAuth} from "@util/auth/hooks";

export interface SettingsSectionProps {
    title: string;
    loading?: boolean;
    adminOnly?: boolean;
    actionButton?: {
        label: string;
        onClick: () => void;
    }
}

const SettingsSection: FC<SettingsSectionProps> = ({title, loading, adminOnly, actionButton, children}) => {
    const {currentUser} = useAuth();

    return (adminOnly && currentUser?.isAdmin) || !adminOnly ? <Paper variant="outlined">
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="h6" fontWeight={600}>
                    {title}
                </Typography>
                {actionButton && <Button size="small" variant="contained" onClick={actionButton.onClick}>
                    {actionButton.label}
                </Button>}
            </Stack>
            {loading ? <Box textAlign="center" py={2}>
                <CircularProgress/>
            </Box> : children}
        </Box>
    </Paper> : <></>;
};

export default SettingsSection;


