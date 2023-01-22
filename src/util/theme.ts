import {red} from '@mui/material/colors';
import {ThemeOptions} from "@mui/material";

const theme = (mode: "light" | "dark"): ThemeOptions => {
    return {
        components: {
            MuiButton: {
                defaultProps: {
                    disableElevation: true
                },
            },
        },
        palette: {
            mode: mode,
            primary: {
                main: mode === "light" ? '#057FFE' : '#80bfff',
            },
            secondary: {
                main: '#6d6d6d',
            },
            error: {
                main: red.A400,
            }
        },
        shape: {
            borderRadius: 7,
        },
        typography: {
            button: {
                textTransform: "none" as const,
                fontWeight: 500
            },
            body1: {
                fontFamily: [
                    'Roboto',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                ].join(','),
            },
            body2: {
                fontFamily: [
                    'Roboto',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                    '"Apple Color Emoji"',
                    '"Segoe UI Emoji"',
                    '"Segoe UI Symbol"',
                ].join(','),
            },
            fontFamily: [
                'Google Sans',
                '-apple-system',
                'BlinkMacSystemFont',
                '"Segoe UI"',
                'Roboto',
                '"Helvetica Neue"',
                'Arial',
                'sans-serif',
                '"Apple Color Emoji"',
                '"Segoe UI Emoji"',
                '"Segoe UI Symbol"',
            ].join(','),
        },
    };
};

export default theme;