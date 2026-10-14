import "@/app/src/env.mjs";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "fate-band.s3.amazonaws.com",
            },
            {
                protocol: "https",
                hostname: "e2-evolve-and-elevate.s3.us-east-1.amazonaws.com",
                pathname: "/user-data/music/**",
            },
        ],
    },
    compiler: {
        styledComponents: true,
        emotion: true,
        reactRemoveProperties: true,
    },
    reactStrictMode: true,
    env: {
        BACKEND_SERVER_URL: process.env.NEXT_PUBLIC_BACKEND_SERVER_URL,
        NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    },
    experimental: {
        optimizePackageImports: ["lucide-react"],
    },
};

export default nextConfig;
