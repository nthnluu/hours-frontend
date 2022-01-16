import React, {FC, useRef, useState} from "react";
import {
    Avatar,
    ButtonBase,
    Divider, Fade, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
    Paper,
    Popper,
    Stack, Tooltip,
    Typography
} from "@mui/material";
import AuthAPI, {User} from "@util/auth/api";
import FocusTrap from "focus-trap-react";
import {Feedback, Logout, Settings, WbSunny} from "@mui/icons-material";
import useThemeMode from "@util/mui/useThemeMode";
import Link from "next/link";
import getInitials from "@util/shared/getInitials";

export interface AccountMenuProps {
    /** The current user. */
    user: User;
}

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Displays a button with the current user's picture and presents an account menu when clicked
 */
const AccountMenu: FC<AccountMenuProps> = ({user}) => {
    const [open, setOpen] = useState(false);
    const [themeMode, setThemeMode, prefersDarkMode] = useThemeMode();

    const id = open ? 'simple-popper' : undefined;
    const buttonRef = useRef(null);

    function handleSwitchTheme() {
        switch (themeMode) {
            case "dark":
                setThemeMode("system");
                return;
            case "light":
                setThemeMode("dark");
                return;
            case "system":
                setThemeMode(prefersDarkMode ? "light" : "dark");
                return;
        }
    }

    function handleSignOut() {
        AuthAPI.signOut()
            .then(() => window.location.href = "/login");
    }

    return (<>
        {/*Avatar button*/}
        <Tooltip title={`Signed in as ${user.displayName}`}>
            <ButtonBase aria-label="account menu" sx={{borderRadius: '100%'}} ref={buttonRef}
                        onClick={() => setOpen(!open)} focusRipple>
                <Avatar src={user.photoUrl}
                        sx={{
                            width: 40,
                            height: 40,
                            fontSize: 16
                        }}>{getInitials(user.displayName)}</Avatar>
            </ButtonBase>
        </Tooltip>

        {/*Account menu popover*/}
        <Popper id={id} open={open} anchorEl={buttonRef.current} transition>
            {({TransitionProps}) => (
                <Fade {...TransitionProps}>
                    <Paper elevation={5} sx={{width: 320, m: 1, textAlign: "center"}}>
                        <FocusTrap active={open} focusTrapOptions={{
                            clickOutsideDeactivates: true,
                            onDeactivate: () => setTimeout(() => setOpen(false), 100),
                        }}>
                            <div>
                                <Stack sx={{p: 4}} alignItems="center">
                                    <Avatar
                                        src={user.photoUrl}
                                        sx={{
                                            width: 96,
                                            height: 96,
                                            fontSize: 36,
                                            marginBottom: 2,
                                        }}>{getInitials(user.displayName)}</Avatar>
                                    <Typography variant="h6" fontWeight={600}>
                                        {user.displayName}
                                    </Typography>
                                    <Typography variant="subtitle1">
                                        {user.email}
                                    </Typography>
                                </Stack>
                                <Divider/>
                                <List>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={handleSwitchTheme}>
                                            <ListItemIcon>
                                                <WbSunny/>
                                            </ListItemIcon>
                                            <ListItemText primary={`Theme: ${capitalizeFirstLetter(themeMode)}`}/>
                                        </ListItemButton>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <Link href="https://forms.gle/Ue9wQDXDuczLk7b56">
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <Feedback/>
                                                </ListItemIcon>
                                                <ListItemText primary="Send feedback"/>
                                            </ListItemButton>
                                        </Link>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <Link href="/settings">
                                            <ListItemButton>
                                                <ListItemIcon>
                                                    <Settings/>
                                                </ListItemIcon>
                                                <ListItemText primary="Settings"/>
                                            </ListItemButton>
                                        </Link>
                                    </ListItem>
                                    <ListItem disablePadding>
                                        <ListItemButton onClick={handleSignOut}>
                                            <ListItemIcon>
                                                <Logout/>
                                            </ListItemIcon>
                                            <ListItemText primary="Sign out"/>
                                        </ListItemButton>
                                    </ListItem>
                                </List>
                            </div>
                        </FocusTrap>
                    </Paper>
                </Fade>
            )}
        </Popper>
    </>);
};

export default AccountMenu;