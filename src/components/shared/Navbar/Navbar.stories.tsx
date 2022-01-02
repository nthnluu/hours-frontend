import React from 'react';
import {ComponentMeta} from '@storybook/react';
import Navbar, {NavbarProps} from "./Navbar";
import IconButton from "../IconButton";
import {Domain, Help, KeyboardArrowDown, MoreVert, Notifications} from "@mui/icons-material";
import {Badge} from "@mui/material";
import {testUser} from "../../../util/auth/auth_helpers";
import AccountMenu from "../AccountMenu";
import Button from "../Button";

export default {
    title: 'Components/Navbar',
    component: Navbar
} as ComponentMeta<typeof Navbar>;

interface MenuIcon {
    compact?: boolean;
}

function HelpButton({compact}: MenuIcon) {
    return <IconButton
        label="Help"
        size={compact ? "medium" : "large"}
        edge="start"
        color="inherit"
    >
        <Help/>
    </IconButton>;
}

function AlertsButton({compact}: MenuIcon) {
    return <IconButton
        label="Alerts"
        size={compact ? "medium" : "large"}
        edge="start"
        color="inherit"
    >
        <Badge badgeContent={4} color="primary">
            <Notifications/>
        </Badge>
    </IconButton>;
}

function MoreButton({compact}: MenuIcon) {
    return <IconButton
        label="More"
        size={compact ? "medium" : "large"}
        edge="start"
        color="inherit"
    >
        <MoreVert/>
    </IconButton>;
}

function AccountButton() {
    return <AccountMenu key="account" user={testUser()}/>;
}

function WorkspaceSwitcherButton({compact}: MenuIcon) {
    return <Button size={compact ? "medium" : "large"} color="inherit" startIcon={<Domain/>}
                   endIcon={<KeyboardArrowDown/>}>
        Full Stack
    </Button>;
}

export const navbar = (args: NavbarProps) => <Navbar {...args}
                                                     startItems={[<WorkspaceSwitcherButton key="switch-workspace"/>]}
                                                     endItems={[
                                                         <HelpButton key="help"/>,
                                                         <AlertsButton key="alerts"/>,
                                                         <MoreButton key="more"/>,
                                                         <AccountButton key="account"/>
                                                     ]}/>;

export const loadingNavbar = (args: NavbarProps) => <Navbar {...args} loading/>;

export const compactNavbar = (args: NavbarProps) => <Navbar {...args}
                                                            compact
                                                            startItems={[<WorkspaceSwitcherButton
                                                                key="switch-workspace" compact/>]}
                                                            endItems={[
                                                                <HelpButton key="help" compact/>,
                                                                <AlertsButton key="alerts" compact/>,
                                                                <MoreButton key="more" compact/>,
                                                                <AccountButton key="account"/>
                                                            ]}/>;