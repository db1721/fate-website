'use client';

import React, { createContext, useContext, useMemo, useState, useEffect } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import {darkTheme, lightTheme} from "@/app/src/theme";

interface ColorModeContextType {
    toggleColorMode: () => void;
    mode: 'light' | 'dark';
}

const ColorModeContext = createContext<ColorModeContextType>({
    toggleColorMode: () => {},
    mode: 'light',
});

export const useColorMode = () => useContext(ColorModeContext);

export const ColorModeProvider = ({ children }: { children: React.ReactNode }) => {
    const getInitialMode = () => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    };

    const [mode, setMode] = useState<'light' | 'dark' | undefined>(undefined);

    useEffect(() => {
        setMode(getInitialMode());
    }, []);

    useEffect(() => {
        if (mode) {
            // Update the `data-theme` attribute on the root `html` element
            const root = document.documentElement;
            root.setAttribute('data-theme', mode);
        }
    }, [mode]);

    useEffect(() => {
        if (typeof window !== 'undefined' && window.matchMedia) {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

            const handleChange = (e: MediaQueryListEvent) => {
                setMode(e.matches ? 'dark' : 'light');
            };

            // Add event listener for changes in the system color scheme
            if (mediaQuery.addEventListener) {
                mediaQuery.addEventListener('change', handleChange);
            } else {
                // For older browsers
                mediaQuery.addListener(handleChange);
            }

            // Cleanup listener on unmount
            return () => {
                if (mediaQuery.removeEventListener) {
                    mediaQuery.removeEventListener('change', handleChange);
                } else {
                    mediaQuery.removeListener(handleChange);
                }
            };
        }
    }, []);

    const colorMode = useMemo(
        () => ({
            toggleColorMode: () => {
                setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
            },
            mode: mode || 'light', // Fallback to 'light' if mode is undefined
        }),
        [mode]
    );

    const currentTheme = mode === 'light' ? lightTheme : darkTheme;

    if (!mode) {
        return null; // Prevent rendering until mode is set
    }

    return (
        <ColorModeContext.Provider value={colorMode}>
            <ThemeProvider theme={currentTheme}>{children}</ThemeProvider>
        </ColorModeContext.Provider>
    );
};
