import React, {FC} from "react";
import {Box, CircularProgress, Paper, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";

export interface SettingsSectionProps {
    title: string;
    loading?: boolean;
    actionButton?: {
        label: string;
        onClick: () => void;
    }
}

const SettingsSection: FC<SettingsSectionProps> = ({title, loading, actionButton, children}) => {
    return <Paper variant="outlined">
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
    </Paper>;
};

export default SettingsSection;


