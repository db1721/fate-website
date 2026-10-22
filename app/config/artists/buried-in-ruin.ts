import type { ArtistConfig } from "@/app/config/artists/types";

export const BURIED_IN_RUIN_ARTIST: ArtistConfig = {
    id: "buried-in-ruin",
    routeSlug: "buried-in-ruin",
    homePath: "/buried-in-ruin",
    musicPathPrefix: "/buried-in-ruin/music",
    name: "Buried In Ruin",
    fullName: "Buried In Ruin",
    logo: "/artists/buried-in-ruin/logo.png?v=20260821",
    logoAlt: "Buried In Ruin",
    hero: {
        eyebrow: "",
        description: "",
        imagePosition: "center",
        secondaryCta: "Explore the music",
        noFeatureTitle: "More music is being forged",
        noFeatureDescription:
            "Stream Created A Monster now and return for the next Buried In Ruin release.",
    },
    about: {
        title: "Heavier music for the things that need to be screamed",
        intro:
            "Buried In Ruin is the heavier counterpart to F.A.T.E., created for darker stories, harsher lessons, and songs that have heavier impact.",
        paragraphs: [
            "This project creates room for the riffs, rhythms, and emotions that belong at the most aggressive edge of my writing.",
            "The sound leans more into modern metalcore.",
            "Buried In Ruin is the other side of F.A.T.E. where the angrier side of life boils over.",
        ],
        image: "/images/about-guitar-room.jpg",
        imagePosition: "36% center",
    },
    musicSection: {
        eyebrow: "Buried transmissions",
        title: "The catalog gets heavier",
        description:
            "Hear Created A Monster and explore You Deserve Better as Buried In Ruin expands track by track.",
        emptyTitle: "Created A Monster is out now",
        emptyDescription:
            "Stream the debut single now and return as more Buried In Ruin releases join the catalog.",
    },
    connect: {
        title: "Follow Buried In Ruin into the dark",
        description: "Stream Buried In Ruin and follow the project as the catalog gets heavier.",
        emptyDescription: "Streaming links for the current release will appear here as they become available.",
    },
    seo: {
        title: "Buried In Ruin | Official Music",
        description:
            "Buried In Ruin is a heavy music project built around crushing riffs, darker atmosphere, emotional weight, and modern metal production.",
        keywords: [
            "Buried In Ruin",
            "modern metal",
            "modern metalcore",
            "heavy music",
            "alternative metal",
            "new metal music",
            "metal project",
            "metalcore",
            "post-hardcore",
        ],
        genres: ["Modern metal", "Alternative metal", "Heavy music"],
        image: "/artists/buried-in-ruin/logo.png?v=20260821",
    },
    theme: {
        background: "#050101",
        backgroundAlt: "#090202",
        surface: "#100606",
        border: "#4a1717",
        accent: "#9f171d",
        accentBright: "#ef313b",
        accentSoft: "#ff6b72",
        text: "#f7f3f3",
        textMuted: "#aaa0a0",
        buttonText: "#ffffff",
        heroGlow: "rgba(185, 28, 28, 0.34)",
        secondaryGlow: "rgba(239, 49, 59, 0.18)",
    },
    catalogRequired: true,
    catalogEditorial: {
        albums: [
            {
                albumTitle: "Monster You Created",
                tagline: "Debut Album",
                highlightSongSlug: "buried-in-ruin-created-a-monster",
            },
            {
                albumTitle: "You Deserve Better",
                tagline: "New album",
                highlightSongSlug: "buried-in-ruin-struggle",
            },
        ],
        features: [
            {
                songSlug: "buried-in-ruin-created-a-monster",
                subtitle: "Debut single from Buried In Ruin",
                description:
                    "The first look at Buried In Ruin: predatory tension, crushing weight, and a chorus built to leave teeth marks.",
            },
            {
                songSlug: "buried-in-ruin-struggle",
                subtitle: "From the new album You Deserve Better",
                description:
                    "A modern metalcore confrontation with isolation, hidden pain, and the fight to stand tall when the struggle is real.",
            },
        ],
    },
    featuredTracks: [],
    socialLinks: [
        {
            url: "https://open.spotify.com/artist/7dtGVzhWBtwIdvvYa1wCOC",
            network: "spotify",
            tooltip: "Spotify",
        },
        {
            url: "https://music.apple.com/us/artist/buried-in-ruin/6799197483",
            network: "apple",
            tooltip: "Apple Music",
        },
        {
            url: "https://tidal.com/artist/84066612",
            network: "tidal",
            tooltip: "TIDAL",
        },
        {
            url: "https://www.deezer.com/us/artist/408897142",
            network: "deezer",
            tooltip: "Deezer",
        },
        {
            url: "https://music.amazon.com/artists/B0HDFKVNRD/buried-in-ruin",
            network: "amazon",
            tooltip: "Amazon Music",
        },
        {
            url: "https://www.youtube.com/channel/UC7B5gGR88a5h6ZKW3rQdU6w",
            network: "youtube",
            tooltip: "YouTube",
        },
        {
            url: "https://music.youtube.com/channel/UC7B5gGR88a5h6ZKW3rQdU6w",
            network: "youtube-music",
            tooltip: "YouTube Music",
        },
        {
            url: "https://www.iheart.com/artist/buried-in-ruin-51797880",
            network: "iheart",
            tooltip: "iHeart",
        },
    ],
    albums: [],
    pressPosts: [],
};
