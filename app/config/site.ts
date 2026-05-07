export const SITE_URL = "https://fatemusicofficial.com";
export const SITE_NAME = "F.A.T.E.";
export const ARTIST_NAME = "F.A.T.E.";
export const ARTIST_FULL_NAME = "Fight Against the Enemy";

export const SITE_DESCRIPTION =
    "F.A.T.E. (Fight Against the Enemy) is a modern melodic rock project built on heavy guitars, emotional lyrics, and anthemic hooks for anyone fighting through the hard parts of life.";

export const GENRES = [
    "Modern rock",
    "Melodic hard rock",
    "Alternative rock",
    "Post-grunge",
];

export function absoluteUrl(path = "") {
    if (!path) return SITE_URL;
    if (/^https?:\/\//.test(path)) return path;

    return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}
