import type {AppProps} from 'next/app';
import {CssBaseline, responsiveFontSizes, ThemeProvider, useMediaQuery} from "@mui/material";
import Head from "next/head";
import theme from "@util/theme";
import createEmotionCache from "@util/mui/createEmotionCache";
import {CacheProvider, EmotionCache} from "@emotion/react";
import {createTheme} from "@mui/material/styles";
import React, {useMemo, useState} from "react";
import {firebaseInit} from "@util/firebase/firebase_app";
import {Toaster} from "react-hot-toast";
import {useSession, AuthProvider} from "@util/auth/hooks";
import {ThemeMode, ThemeModeProvider} from "@util/mui/useThemeMode";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
    emotionCache?: EmotionCache;
}

function MyApp(props: MyAppProps) {
    const {Component, emotionCache = clientSideEmotionCache, pageProps} = props;
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
    const [themeMode, setThemeMode] = useState<ThemeMode | undefined>(undefined);

    function currentThemeMode() {
        if ((themeMode === "system") || !themeMode) {
            return prefersDarkMode ? "dark" : "light";
        } else {
            return themeMode;
        }
    }

    const muiTheme = useMemo(() => {
        // save the new theme mode to local storage
        if (typeof window !== "undefined") {
            if (!themeMode) {
                // Check if a user theme mode preference is saved in local storage
                const savedThemePreference = localStorage.getItem("theme-mode");
                if (savedThemePreference === "light" || savedThemePreference === "dark") {
                    setThemeMode(savedThemePreference);
                } else {
                    setThemeMode("system");
                }
            }

            localStorage.setItem('theme-mode', themeMode!);
            return responsiveFontSizes(createTheme(theme(currentThemeMode())));
        } else {
            return responsiveFontSizes(createTheme(theme("light")));
        }
    }, [themeMode, prefersDarkMode]);

    firebaseInit();
    const session = useSession();

    if (session.loading) return null;

    return (
        <AuthProvider value={session}>
            <CacheProvider value={emotionCache}>
                <ThemeModeProvider value={[themeMode!, setThemeMode, prefersDarkMode]}>
                    <Head>
                        <title>Hours</title>
                        <meta name='viewport' content='minimum-scale=1, initial-scale=1, width=device-width'/>
                    </Head>
                    <ThemeProvider theme={muiTheme}>
                        <CssBaseline/>
                        <Toaster toastOptions={{
                            style: {
                                padding: '10px',
                                backgroundColor: currentThemeMode() === "dark" ? "#353535" : "#fff",
                                color: currentThemeMode() === "dark" ? "#fff" : "#212121",
                                fontWeight: 500
                            },
                        }} containerStyle={{
                            top: 9
                        }}/>
                        <Component {...pageProps} />
                    </ThemeProvider>
                </ThemeModeProvider>
            </CacheProvider>
        </AuthProvider>
    );
}

export default MyApp;
