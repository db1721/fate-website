import type { MetadataRoute } from "next";
import { ARTISTS, BURIED_IN_RUIN_ARTIST } from "@/app/config/artists";
import { getPublicSongPages } from "@/app/config/music-data";
import { SITE_URL, absoluteUrl } from "@/app/config/site";
import { loadArtistCatalog } from "@/lib/public-catalog.server";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const artists = await Promise.all(ARTISTS.map(loadArtistCatalog));

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
        ...artists.flatMap((artist) => getPublicSongPages(artist)).map((song) => ({
            url: absoluteUrl(`${song.musicPathPrefix}/${song.slug}`),
            lastModified: song.lastModified ?? now,
            changeFrequency: "monthly" as const,
            priority: 0.8,
        })),
    ];
}
