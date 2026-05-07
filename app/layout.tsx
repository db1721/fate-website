import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import localFont from "next/font/local";
import "./globals.css";
import { ARTIST_FULL_NAME, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/app/config/site";

export const metadata: Metadata = {
    metadataBase: new URL(SITE_URL),
    applicationName: SITE_NAME,
    title: {
        default: `${SITE_NAME} | ${ARTIST_FULL_NAME}`,
        template: `%s | ${SITE_NAME}`,
    },
    description: SITE_DESCRIPTION,
    keywords: [
        "F.A.T.E.",
        "Fight Against the Enemy",
        "modern rock band",
        "melodic hard rock",
        "alternative rock",
        "new rock music",
        "Ugly F.A.T.E.",
        "New Beginnings album",
    ],
    alternates: {
        canonical: "/",
    },
    openGraph: {
        title: `${SITE_NAME} | ${ARTIST_FULL_NAME}`,
        description: SITE_DESCRIPTION,
        url: SITE_URL,
        siteName: SITE_NAME,
        images: [
            {
                url: "/icons/fate-white-short.png",
                width: 1200,
                height: 630,
                alt: `${SITE_NAME} logo`,
            },
        ],
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: `${SITE_NAME} | ${ARTIST_FULL_NAME}`,
        description: SITE_DESCRIPTION,
        images: ["/icons/fate-white-short.png"],
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-image-preview": "large",
            "max-snippet": -1,
            "max-video-preview": -1,
        },
    },
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
        <Analytics />
        {children}
        </body>
        </html>
    );
}
