import type { MetadataRoute } from "next";
import { getPublicSongPages } from "@/app/config/music-data";
import { SITE_URL, absoluteUrl } from "@/app/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

    return [
        {
            url: SITE_URL,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1,
        },
        ...getPublicSongPages().map((song) => ({
            url: absoluteUrl(`/music/${song.slug}`),
            lastModified: song.lastModified ?? now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
    ];
}
