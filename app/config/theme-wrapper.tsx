'use client';

import React from 'react';
import { Box, useTheme } from '@mui/material';

interface ThemeWrapperProps {
    children: React.ReactNode;
    sx?: object;
}

const ThemeWrapper: React.FC<ThemeWrapperProps> = ({ children, sx = {} }) => {
    const theme = useTheme();

    return (
        <Box
            sx={{
                // background: getBackgroundGradientFilled(theme),
                // color: theme.palette.text.primary,
                // boxShadow: '2px 0 8px rgba(0, 0, 0, 0.1)',
                // borderRadius: '20px',
                // padding: 3,
                ...sx, // Merge additional styles if passed
            }}
        >
            {children}
        </Box>
    );
};

export default ThemeWrapper;
