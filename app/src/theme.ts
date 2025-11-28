import { createTheme } from '@mui/material/styles';

// Define typography settings
const typography = {
    fontFamily: 'Roboto, Arial, sans-serif',
    h1: { fontSize: '2.5rem', fontWeight: 700, lineHeight: 1.2 },
    h2: { fontSize: '2rem', fontWeight: 600, lineHeight: 1.3 },
    h3: { fontSize: '1.75rem', fontWeight: 600, lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', fontWeight: 500, lineHeight: 1.5 },
    h5: { fontSize: '1.25rem', fontWeight: 500, lineHeight: 1.6 },
    h6: { fontSize: '1rem', fontWeight: 500, lineHeight: 1.6 },
    subtitle1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.5 },
    subtitle2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.4 },
    body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
    body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.6 },
};

// Define shape settings
const shape = {
    borderRadius: 3, // Default border radius
};

// Define light theme
export const lightTheme = createTheme({
    typography,
    shape,
    palette: {
        mode: 'light',
        background: {
            default: '#a9d6e5',
            paper: '#eefbff',
        },
        text: {
            primary: '#000000',
        },
    },
});

// Define dark theme
export const darkTheme = createTheme({
    typography,
    shape,
    palette: {
        mode: 'dark',
        background: {
            default: '#013a63',
            paper: '#012a4a',
        },
        text: {
            primary: '#FFFFFF',
        },
    },
});
