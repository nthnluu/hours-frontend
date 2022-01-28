import {FC, useEffect, useState} from "react";
import NextLink from "next/link";
import {AppBar, Box, Divider, LinearProgress, Link, Stack, Toolbar} from "@mui/material";
import IconButton from "../IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Logo from "@components/shared/Logo";

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
    /** Enables fixed positioning on the navbar **/
    fixed?: boolean;
}

/**
 * A header that displays information and actions relating to the current page.
 */
const Navbar: FC<NavbarProps> = ({
                                     compact,
                                     endItems,
                                     loading = false,
                                     onOpenMenu,
                                     showMenuButton,
                                     startItems,
                                     fixed
                                 }) => {
    const [scrollPosition, setScrollPosition] = useState(0);
    const handleScroll = () => {
        const position = window.scrollY;
        setScrollPosition(position);
    };

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, {passive: true});

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return <Box sx={{flexGrow: 1, position: "relative"}}>
        <AppBar position={fixed ? "fixed" : "static"} color="transparent" elevation={scrollPosition > 20 ? 2 : 0}>
            {loading && <LinearProgress sx={{position: "absolute", bottom: 0, width: "100%", height: 2}}/>}
            <Box sx={(theme) => ({backgroundColor: theme.palette.background.default})}>
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
                    <Stack sx={{flexGrow: 1}} direction="row" alignItems="center" spacing={1}>
                        <NextLink href="/">
                            <Link variant="h6" component="button" color="inherit" underline="hover"
                                  sx={{display: "inline-flex", alignItems: "center"}}>
                                <Box mr={1} width={32} height={32}>
                                    <Logo/>
                                </Box>
                                Hours
                            </Link>
                        </NextLink>
                        {startItems}
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={1.5}>
                        {endItems}
                    </Stack>
                </Toolbar>
                <Divider/>
            </Box>
        </AppBar>
    </Box>;
};

export default Navbar;


