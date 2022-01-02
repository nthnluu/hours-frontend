import type {AppProps} from 'next/app';
import {CssBaseline, ThemeProvider} from "@mui/material";
import Head from "next/head";
import theme from "../util/theme";
import createEmotionCache from "../util/createEmotionCache";
import {CacheProvider, EmotionCache} from "@emotion/react";
import {createTheme} from "@mui/material/styles";
import {useMemo} from "react";
import DialogProvider from "../components/shared/providers/DialogProvider";
import {FirebaseAuthProvider, useFirebaseAuth} from "../util/firebase_auth_helpers";
import {firebaseInit} from "../util/firebase_app";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    const muiTheme = useMemo(() => createTheme(theme), []);

    firebaseInit();
    const session = useFirebaseAuth();

    if (session.isLoading) return null;

    return (
        <FirebaseAuthProvider value={session}>
            <CacheProvider value={emotionCache}>
                <Head>
                    <title>No BS React</title>
                    <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width'/>
                </Head>
                <ThemeProvider theme={muiTheme}>
                    <DialogProvider>
                        <CssBaseline/>
                        <Component {...pageProps} />
                    </DialogProvider>
                </ThemeProvider>
            </CacheProvider>
        </FirebaseAuthProvider>
    );
}

export default MyApp;
