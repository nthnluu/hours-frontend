import React, {FC} from "react";
import {Box, CircularProgress, Paper, Stack, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import {useAuth} from "@util/auth/hooks";
import {CoursePermission} from "@util/auth/api";
import IconButton from "@components/shared/IconButton";
import GppGoodIcon from '@mui/icons-material/GppGood';

export interface SettingsSectionProps {
    title: string;
    subtitle?: string;
    loading?: boolean;
    adminOnly?: boolean;
    taOnly?: boolean;
    primaryActionButton?: {
        label: string;
        onClick: () => void;
    };
    secondaryActionButton?: {
        label: string;
        onClick: () => void;
    };
}

const SettingsSection: FC<SettingsSectionProps> = ({
                                                       title,
                                                       subtitle,
                                                       loading,
                                                       adminOnly,
                                                       taOnly,
                                                       primaryActionButton,
                                                       secondaryActionButton,
                                                       children
                                                   }) => {
    const {currentUser} = useAuth();
    const isTA = currentUser && Object.values(currentUser.coursePermissions).filter(perm => perm === CoursePermission.CourseAdmin).length > 0;
    const display = ((adminOnly && currentUser?.isAdmin) || !adminOnly) && (!taOnly || (taOnly && isTA));

    return display ? <Paper variant="outlined">
        <Box p={3}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack mb={subtitle ? 2 : 0}>
                    <Stack direction="row" justifyContent="start" alignItems="center" spacing={0.5}>
                        <Typography variant="h6" fontWeight={600}>
                            {title}
                        </Typography>
                        {adminOnly && <IconButton label="Only visible to admins" size="small">
                            <GppGoodIcon sx={{opacity: 0.36}}/>
                        </IconButton>}
                    </Stack>
                    <Typography variant="body2" sx={{opacity: 0.75}}>
                        {subtitle}
                    </Typography>
                </Stack>
                <Stack direction="row" spacing={2}>
                {secondaryActionButton && <Button size="small" variant="contained" onClick={secondaryActionButton.onClick}>
                    {secondaryActionButton.label}
                </Button>}
                {primaryActionButton && <Button size="small" variant="contained" onClick={primaryActionButton.onClick}>
                    {primaryActionButton.label}
                </Button>}
                </Stack>
            </Stack>
            {loading ? <Box textAlign="center" py={2}>
                <CircularProgress/>
            </Box> : children}
        </Box>
    </Paper> : <></>;
};

export default SettingsSection;


