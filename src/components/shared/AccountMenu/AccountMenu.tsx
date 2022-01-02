import {FC, useRef, useState} from "react";
import {
    Avatar,
    ButtonBase,
    Divider,
    Paper,
    Popper,
    Stack,
    Typography
} from "@mui/material";
import {User} from "../../../util/auth/auth_helpers";
import Button from "../Button";
import FocusTrap from "focus-trap-react";

export interface AccountMenuProps {
    /** The current user. */
    user: User;
}

/**
 * Displays a button with the current user's picture and presents an account menu when clicked
 */
const AccountMenu: FC<AccountMenuProps> = ({user}) => {
    const [open, setOpen] = useState(false);

    const id = open ? 'simple-popper' : undefined;
    const buttonRef = useRef(null);

    function getInitials(name: string) {
        const names = name.split(' ');
        let initials = names[0].substring(0, 1).toUpperCase();

        if (names.length > 1) {
            initials += names[names.length - 1].substring(0, 1).toUpperCase();
        }

        return initials;
    }

    return (<>
        {/*Avatar button*/}
        <ButtonBase aria-label="account menu" sx={{borderRadius: '100%'}} ref={buttonRef}
                    onClick={() => setOpen(!open)} focusRipple>
            <Avatar src={user.image}>{getInitials(user.name)}</Avatar>
        </ButtonBase>

        {/*Account menu popover*/}
        <Popper id={id} open={open} anchorEl={buttonRef.current}>
            <FocusTrap active={open} focusTrapOptions={{
                clickOutsideDeactivates: true,
                onDeactivate: () => setTimeout(() => setOpen(false), 100),
            }}>
                <Paper elevation={4} sx={{width: 320, m: 1, textAlign: "center"}}>
                    <Stack sx={{p: 4}} alignItems="center">
                        <Avatar
                            src={user.image}
                            sx={{
                                width: 84,
                                height: 84,
                                fontSize: 36,
                                marginBottom: 2
                            }}>{getInitials(user.name)}</Avatar>
                        <Typography variant="h6">
                            {user.name}
                        </Typography>
                        <Typography variant="subtitle1">
                            {user.email}
                        </Typography>
                        <Divider sx={{my: 3, width: "100%"}}/>
                        <Stack spacing={1} sx={{width: "100%"}}>
                            <Button variant="contained" size="large" fullWidth>
                                Sign out
                            </Button>
                            <Button variant="outlined" size="large" fullWidth>
                                Manage account
                            </Button>
                        </Stack>
                    </Stack>
                </Paper>
            </FocusTrap>
        </Popper>
    </>);
};

export default AccountMenu;


