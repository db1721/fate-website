import { Theme } from '@mui/material/styles';

export const getBackgroundGradientOpaque = (theme: Theme): string => {
    return `linear-gradient(to bottom, ${
        theme.palette.mode === 'dark'
            ? 'rgba(39,76,119, 0.4), rgba(0,0,0, 0.9)'
            : 'rgba(169,214,229, 0.9), rgba(255,255,255,0.4)'
    })`;
};

export const getBackgroundGradientFilled = (theme: Theme): string => {
    return (
        theme.palette.mode === 'dark'
            ? 'radial-gradient(circle, rgba(0,0,0,1) 0%, rgba(1,42,74,1) 100%)'
            : 'radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(169,214,229,1) 100%)'
    )
};
