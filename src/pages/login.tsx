import React from "react";
import {Box, Container, Paper, Typography} from "@mui/material";
import Button from "@components/shared/Button";
import GoogleIcon from '@mui/icons-material/Google';
import AuthAPI from "@util/auth/api";
import {toast} from "react-hot-toast";

export default function Home() {
    function handleSignIn() {
        AuthAPI.signInWithGoogle()
            .then(() => (window.location.href = "/"))
            .catch(() => toast.error("Something went wrong, please try again in a bit."));
    }

    return (<Container maxWidth="sm" sx={{marginTop: [8, null, 12]}}>
        <Paper variant="outlined">
            <Box p={4} textAlign="center">
                <Typography variant="h4" fontWeight={500}>
                    Welcome to SignMeUp!
                </Typography>
                <Typography variant="h6">
                    Use your Brown email to continue.
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
