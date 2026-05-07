import type { SocialLink } from "@/app/config/music-data";

export const STREAMING_NETWORKS = [
    "spotify",
    "apple",
    "youtube-music",
    "amazon",
    "pandora",
    "tidal",
    "deezer",
    "shazam",
] as const;

export const SOCIAL_NETWORKS = [
    "youtube",
    "tiktok",
    "instagram",
    "facebook",
    "x",
] as const;

export function filterLinksByNetwork(
    links: SocialLink[],
    networks: readonly string[]
) {
    const networkSet = new Set(networks);
    return links.filter((link) => networkSet.has(link.network));
}
