import React, {FC, ReactNode, useEffect, useState} from "react";
import Navbar from "@components/shared/Navbar";
import {
    Box,
    Container,
    Drawer,
    Stack,
    Typography
} from "@mui/material";
import {Router} from "next/router";
import AccountMenu from "@components/shared/AccountMenu";
import CloseIcon from '@mui/icons-material/Close';
import NotificationsIcon from '@mui/icons-material/Notifications';
import {useAuth} from "@util/auth/hooks";
import Button from "@components/shared/Button";
import IconButton from "@components/shared/IconButton";
import NotificationItem from "../NotificationItem";

export interface AppLayoutProps {
    maxWidth: "xl" | "md" | "sm" | "xs" | "lg" | false;
    loading?: boolean;
    actionButton?: {
        label: string;
        onClick: () => void;
        icon?: ReactNode;
    }
}

const AppLayout: FC<AppLayoutProps> = ({maxWidth, loading, actionButton, children}) => {
    const [pageLoading, setPageLoading] = useState(false);
    const {currentUser, isAuthenticated} = useAuth();
    const [notificationMenu, setNotificationMenu] = useState(false);

    // Bind page load events to pageLoading state so loading bar is displayed on navigation.
    useEffect(() => {
        Router.events.on('routeChangeStart', () => setPageLoading(true));
        Router.events.on('routeChangeComplete', () => setPageLoading(false));
        Router.events.on('routeChangeError', () => setPageLoading(false));
    }, []);

    // Redirect user to login page if unauthenticated unless isPublic prop is true.
    if (!isAuthenticated) {
        window.location.href = "/login";
        return <></>;
    }

    const endItems = [<IconButton key="notifications" label="Notifications" onClick={() => setNotificationMenu(true)}><NotificationsIcon/></IconButton>, <AccountMenu key="account" user={currentUser!}/>];
    if (actionButton) {
        endItems.push(<Button variant="contained" key="action-button"
                              startIcon={actionButton.icon}
                              onClick={actionButton.onClick}>{actionButton.label}</Button>);
                            
        endItems.reverse();
    }

    return <div>
        <Navbar fixed loading={loading || pageLoading}
                endItems={endItems}/>
        <Drawer
            anchor={"right"}
            open={notificationMenu}
            onClose={() => setNotificationMenu(false)}
        >
            <Box width={350} p={2}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h6">
                        Notifications
                    </Typography>
                    <IconButton label="Close" onClick={() => setNotificationMenu(false)}>
                        <CloseIcon/>
                    </IconButton>
                </Stack>
                <Stack spacing={1} mt={2}>
                    {currentUser?.notifications && currentUser.notifications.map((notification) => (
                        <NotificationItem key={notification.ID} notification={notification} />
                    ))}
                </Stack>
            </Box>
        </Drawer>
        <Container maxWidth={maxWidth} sx={{marginY: 10}}>
            {children}
        </Container>
    </div>;
};

export default AppLayout;


