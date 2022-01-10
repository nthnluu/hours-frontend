import React, {FC, useEffect, useState} from "react";
import Navbar from "@components/shared/Navbar";
import {Container} from "@mui/material";
import {Router} from "next/router";
import AccountMenu from "@components/shared/AccountMenu";
import {useAuth} from "@util/auth/hooks";

export interface AppLayoutProps {
    maxWidth: "xl" | "md" | "sm" | "xs" | "lg" | false;
    loading?: boolean;
}

const AppLayout: FC<AppLayoutProps> = ({maxWidth, loading, children}) => {
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

    return <div>
        <Navbar fixed loading={loading || pageLoading}
                endItems={[<AccountMenu key="account" user={currentUser!}/>]}/>
        <Container maxWidth={maxWidth} sx={{marginY: 10}}>
            {children}
        </Container>
    </div>;
};

export default AppLayout;


