import React from "react";
import {Box, Container, Paper, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import GoogleIcon from '@mui/icons-material/Google';
import AuthAPI from "@util/auth/api";
import {toast} from "react-hot-toast";
import errors from "@util/errors";

export default function Home() {
    function handleSignIn() {
        AuthAPI.signInWithGoogle()
            .then(() => (window.location.href = "/"))
            .catch(() => toast.error(errors.UNKNOWN));
    }

    return (<Container maxWidth="sm" sx={{marginTop: [8, null, 12]}}>
        <Paper variant="outlined">
            <Box p={4} textAlign="center">
                <Typography component="h1" variant="h4" fontWeight={500}>
                    Welcome to Hours
                </Typography>
                <Typography component="p" variant="h6">
                    Continue with your Brown email.
                </Typography>

                <Box mt={2}>
                    <Button size="large" startIcon={<GoogleIcon/>} variant="contained" onClick={handleSignIn}>
                        Sign in with Google
                    </Button>
                </Box>
            </Box>
        </Paper>
    </Container>);
}
