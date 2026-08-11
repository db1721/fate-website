import type { MetadataRoute } from "next";
import { BURIED_IN_RUIN_ARTIST } from "@/app/config/artists";
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
        {
            url: absoluteUrl(BURIED_IN_RUIN_ARTIST.homePath),
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.95,
        },
        ...getPublicSongPages().map((song) => ({
            url: absoluteUrl(`${song.musicPathPrefix}/${song.slug}`),
            lastModified: song.lastModified ?? now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
    ];
}
