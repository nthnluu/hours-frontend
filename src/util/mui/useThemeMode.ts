import {createContext, useContext} from "react";

export type ThemeMode = "light" | "dark" | "system";
type ThemeContext = [currentThemeMode: ThemeMode, setThemeMode: (arg: ThemeMode) => void, prefersDarkTheme: boolean];

const themeModeContext = createContext<ThemeContext>(["system", () => {
}, false]);
export const ThemeModeProvider = themeModeContext.Provider;

export default function useThemeMode() {
    return useContext(themeModeContext);
}