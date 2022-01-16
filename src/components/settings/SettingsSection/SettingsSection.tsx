import React, {FC} from "react";
import {Box, CircularProgress, Paper, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import {useAuth} from "@util/auth/hooks";
import IconButton from "@components/shared/IconButton";
import GppGoodIcon from '@mui/icons-material/GppGood';

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
                <Stack direction="row" justifyContent="start" alignItems="center" spacing={0.5}>
                    <Typography variant="h6" fontWeight={600}>
                        {title}
                    </Typography>
                    {adminOnly && <IconButton label="Only visible to admins" size="small">
                        <GppGoodIcon sx={{opacity: 0.36}}/>
                    </IconButton>}
                </Stack>

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


