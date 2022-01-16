import React, {FC, ReactNode, useEffect, useState} from "react";
import Navbar from "@components/shared/Navbar";
import {Container} from "@mui/material";
import {Router} from "next/router";
import AccountMenu from "@components/shared/AccountMenu";
import {useAuth} from "@util/auth/hooks";
import Button from "@components/shared/Button";

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

    const endItems = [<AccountMenu key="account" user={currentUser!}/>];
    if (actionButton) {
        endItems.push(<Button variant="contained" key="action-button"
                              startIcon={actionButton.icon}
                              onClick={actionButton.onClick}>{actionButton.label}</Button>);
        endItems.reverse();
    }

    return <div>
        <Navbar fixed loading={loading || pageLoading}
                endItems={endItems}/>
        <Container maxWidth={maxWidth} sx={{marginY: 10}}>
            {children}
        </Container>
    </div>;
};

export default AppLayout;


