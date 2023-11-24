
/* Core */
import { Provider } from 'react-redux';

/* Instruments */
import { getSystemTheme, useTheme } from '@/lib/nn-themes';
import { reduxStore } from '@/lib/redux';
import { CssBaseline } from '@mui/material';
import { red } from '@mui/material/colors';
import { ThemeProvider as MuiThemeProvider, createTheme } from '@mui/material/styles';
import React from 'react';

export const Providers = (props: React.PropsWithChildren) => {
    const { theme: mode } = useTheme();
    const theme = React.useMemo(
        () => createTheme({
            palette: {
                mode: (mode == 'dark' ? mode : mode == 'light' ? mode : getSystemTheme()),
                primary: {
                    main: '#556cd6',
                },
                secondary: {
                    main: '#19857b',
                },
                error: {
                    main: red.A400,
                },
            },

        }),
        [mode],
    );
    return <Provider store={reduxStore}>
        <CssBaseline />
        <MuiThemeProvider theme={theme}>
            {props.children}
        </MuiThemeProvider>
    </Provider >
}