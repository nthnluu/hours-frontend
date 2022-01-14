import React, {FC} from "react";
import {Box, CircularProgress, Paper, Typography} from "@mui/material";

export interface SettingsSectionProps {
    title: string;
    loading?: boolean;
}

const SettingsSection: FC<SettingsSectionProps> = ({title, loading, children}) => {
    return <Paper variant="outlined">
        <Box p={3}>
            <Typography variant="h6" fontWeight={600}>
                {title}
            </Typography>
            {loading ? <Box textAlign="center" py={2}>
                <CircularProgress/>
            </Box> : children}
        </Box>
    </Paper>;
};

export default SettingsSection;


