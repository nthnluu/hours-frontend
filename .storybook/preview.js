import {ThemeProvider} from "@mui/material";
import theme from "../src/util/theme";
import {createTheme} from "@mui/material/styles";

export const parameters = {
    actions: {argTypesRegex: "^on[A-Z].*"},
    controls: {
        matchers: {
            color: /(background|color)$/i,
            date: /Date$/,
        },
    }
};

const muiTheme = createTheme(theme);
export const decorators = [
    (Story) => (
        <ThemeProvider theme={muiTheme}>
            <Story />
        </ThemeProvider>
    ),
];