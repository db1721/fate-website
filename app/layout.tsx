import {Geist, Geist_Mono} from "next/font/google";
import {CssBaseline} from "@mui/material";
import "./globals.css";
import {Analytics} from "@vercel/analytics/react";
import {ColorModeProvider} from "@/app/config/color-mode-context";
import ThemeWrapper from "@/app/config/theme-wrapper";
import localFont from "next/font/local";

export const metadata = {
    title: "Fight Against the Enemy (F.A.T.E.)",
    description: "F.A.T.E (Fight Against the Enemy) is a modern rock band known for blending powerful melodies, " +
        "emotional storytelling, and anthemic hooks. Our music explores the battles we all face—each one different, " +
        "each one real—and aims to inspire strength, resilience, and connection through sound. With driving guitars, " +
        "heartfelt vocals, and lyrics that cut deep, F.A.T.E delivers a bold reminder that no matter what fight you’re " +
        "in, you’re never fighting alone",
};

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

const altarGothic = localFont({
    src: "./config/fonts/altar-gothic.otf",
    variable: "--font-altar-gothic",
    display: "swap",
});

const callingAngels = localFont({
    src: "./config/fonts/calling-angels.ttf",
    variable: "--font-calling-angels",
    display: "swap",
});

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" suppressHydrationWarning>
        <body
            className={`${geistSans.variable} ${geistMono.variable} ${callingAngels.variable} ${altarGothic.variable} antialiased`}
            suppressHydrationWarning
        >
        <ColorModeProvider>
            <CssBaseline/>
            <ThemeWrapper>
                <Analytics/>
                {children}
            </ThemeWrapper>
        </ColorModeProvider>
        </body>
        </html>
    );
}
