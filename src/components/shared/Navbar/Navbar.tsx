import {FC} from "react";
import {AppBar, Box, LinearProgress, Stack, Toolbar, Typography} from "@mui/material";
import IconButton from "../IconButton";
import MenuIcon from "@mui/icons-material/Menu";

export interface NavbarProps {
    /** Displays a menu button on the leading edge of the navbar. */
    showMenuButton?: boolean;
    /** A function that's called when the menu button is clicked. */
    onOpenMenu?: () => any;
    /** Displays a thinner navbar. */
    compact?: boolean;
    /** Items to display on the leading side of the header. */
    startItems?: JSX.Element[];
    /** Items to display on the trailing side of the header. */
    endItems?: JSX.Element[];
    /** Displays a loading indicator above the navbar. */
    loading?: boolean;
}

/**
 * A header that displays information and actions relating to the current page.
 */
const Navbar: FC<NavbarProps> = ({compact, endItems, loading = false, onOpenMenu, showMenuButton, startItems}) => {
    return <Box sx={{flexGrow: 1, position: "relative"}}>
        {loading && <LinearProgress sx={{position: "absolute", top: 0, width: "100%"}}/>}
        <AppBar position="static" color="transparent" elevation={0} variant="outlined">
            <Toolbar variant={compact ? "dense" : "regular"}>
                {showMenuButton && <IconButton
                    onClick={onOpenMenu}
                    label="Main menu"
                    size="large"
                    edge="start"
                    color="inherit"
                    aria-label="menu"
                    sx={{mr: 2}}>
                    <MenuIcon/>
                </IconButton>}
                <Stack sx={{flexGrow: 1}} direction="row" alignItems="center" spacing={3}>
                    <Typography variant="h6" component="div">
                        No-BS React
                    </Typography>
                    {startItems}
                </Stack>
                <Stack direction="row" alignItems="center" spacing={0.5}>
                    {endItems}
                </Stack>
            </Toolbar>
        </AppBar>
    </Box>;
};

export default Navbar;


