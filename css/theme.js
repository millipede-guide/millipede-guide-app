import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

// Create a theme instance.
const theme = responsiveFontSizes(
    createMuiTheme({
        // spacing: 8,
        typography: {
            h1: {
                fontSize: '2.5rem',
                fontWeight: 500,
            },
            h2: {
                fontSize: '1.4rem',
                fontWeight: 500,
            },
            body1: {
                fontSize: '1.0rem',
            },
            body2: {
                fontSize: '0.8rem',
            },
        },
        palette: {
            primary: {
                main: '#558b2f',
            },
            secondary: {
                main: '#8bc34a',
            },
            background: {
                default: '#fff',
            },
        },
    }),
);

export default theme;
