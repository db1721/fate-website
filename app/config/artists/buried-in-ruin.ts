import type { ArtistConfig } from "@/app/config/artists/types";

export const BURIED_IN_RUIN_ARTIST: ArtistConfig = {
    id: "buried-in-ruin",
    routeSlug: "buried-in-ruin",
    homePath: "/buried-in-ruin",
    musicPathPrefix: "/buried-in-ruin/music",
    name: "Buried In Ruin",
    fullName: "Buried In Ruin",
    logo: "/artists/buried-in-ruin/logo.png?v=20260811",
    logoAlt: "Buried In Ruin",
    hero: {
        eyebrow: "The first transmission",
        description:
            "A heavier project built for crushing riffs, damaged atmosphere, and the weight that melodic rock cannot always carry alone.",
        image: "/artists/buried-in-ruin/created-a-monster-cover.png",
        imagePosition: "center",
        secondaryCta: "Explore the music",
        noFeatureTitle: "The first transmission is coming",
        noFeatureDescription:
            "Buried In Ruin is taking shape now. Releases, previews, and streaming links will surface here first.",
    },
    about: {
        title: "Heavier music for the things that refuse to stay buried",
        intro:
            "Buried In Ruin is the heavier counterpart to F.A.T.E., created for darker stories, harsher textures, and songs that need more impact.",
        paragraphs: [
            "This project creates room for the riffs, rhythms, and emotions that belong at the most aggressive edge of my writing.",
            "The sound will lean into modern metal weight, low-tuned guitars, forceful drums, damaged atmosphere, and melodies that still leave a scar after the noise fades.",
            "Buried In Ruin is not a replacement for F.A.T.E. It is the other side of the same creative life, with its own identity, catalog, visual language, and audience.",
            "The first releases will define the shape of the project song by song.",
        ],
        image: "/images/about-guitar-room.jpg",
        imagePosition: "36% center",
    },
    musicSection: {
        eyebrow: "Buried transmissions",
        title: "Created A Monster breaks the surface",
        description:
            "Hear the debut single, then return as the heavier Buried In Ruin catalog emerges track by track.",
        emptyTitle: "Nothing leaves the ground before it is heavy enough",
        emptyDescription:
            "The catalog is currently in development. The first announced release will automatically become the featured track.",
    },
    connect: {
        title: "Follow Buried In Ruin into the dark",
        description: "Streaming and social destinations will collect here as the project launches.",
        emptyDescription: "Project-specific streaming and social links are coming with the first release.",
    },
    seo: {
        title: "Buried In Ruin | Official Music",
        description:
            "Buried In Ruin is a heavy music project built around crushing riffs, darker atmosphere, emotional weight, and modern metal production.",
        keywords: [
            "Buried In Ruin",
            "modern metal",
            "heavy music",
            "alternative metal",
            "new metal music",
            "metal project",
            "metalcore",
            "post-hardcore",
        ],
        genres: ["Modern metal", "Alternative metal", "Heavy music"],
        image: "/artists/buried-in-ruin/created-a-monster-cover.png",
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
    featuredTracks: [
        {
            title: "Created A Monster",
            subtitle: "Debut single from Buried In Ruin",
            coverSrc: "/artists/buried-in-ruin/created-a-monster-cover.png",
            audioSrc: "/audio/buried-in-ruin/created-a-monster.mp3",
            featureDate: "08/10/2026",
            description:
                "The first look at Buried In Ruin: predatory tension, crushing weight, and a chorus built to leave teeth marks.",
        },
    ],
    socialLinks: [],
    albums: [
        {
            id: "created-a-monster",
            title: "Created A Monster",
            year: 2026,
            tagline: "Debut single",
            highlightTrack: "Created A Monster",
            description:
                "The first Buried In Ruin release opens the project with a stark black-and-white identity and a heavier, more confrontational sound.",
            coverSrc: "/artists/buried-in-ruin/created-a-monster-cover.png",
            tracks: [
                {
                    title: "Created A Monster",
                    audioSrc: "/audio/buried-in-ruin/created-a-monster.mp3",
                    songImg: "/artists/buried-in-ruin/created-a-monster-cover.png",
                    previewStartTime: 0,
                    previewStartLabel: "Debut single preview",
                    featured: true,
                },
            ],
        },
    ],
    pressPosts: [],
};
