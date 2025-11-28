import '@/app/src/env.mjs';
/** @type {import('next').NextConfig} */

const isDev = process.env.NODE_ENV === 'development';

const nextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'fate-band.s3.amazonaws.com',
            },
        ],
    },
    compiler: {
        // Custom SWC configuration
        styledComponents: true, // Enables better debugging for styled-components
        emotion: true, // Enables better debugging for Emotion CSS
        reactRemoveProperties: true, // Removes React properties
    },
    reactStrictMode: false, // Disable strict mode in development for faster renders
    env: {
        BACKEND_SERVER_URL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    experimental: {
        optimizePackageImports: ['icon-library'],
        turbo: {}, // Enable turbo bundler
    },
    eslint: {
        // ignoreDuringBuilds: isDev,
        ignoreDuringBuilds: true, // Ignore ESLint during builds to save time
    },
    typescript: {
        // ignoreBuildErrors: isDev,
        ignoreBuildErrors: true, // Ignore TypeScript errors during builds
    },
    output: 'export',
};

export default nextConfig;
