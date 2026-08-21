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
        eyebrow: "Out now",
        description:
            "A heavier project built for crushing riffs, head banging melodies, and a lot more screaming",
        image: "/artists/buried-in-ruin/created-a-monster-cover.png",
        imagePosition: "center",
        secondaryCta: "Explore the music",
        noFeatureTitle: "More music is being forged",
        noFeatureDescription:
            "Stream Created A Monster now and return for the next Buried In Ruin release.",
    },
    about: {
        title: "Heavier music for the things that refuse to stay buried",
        intro:
            "Buried In Ruin is the heavier counterpart to F.A.T.E., created for darker stories, harsher textures, and songs that need more impact.",
        paragraphs: [
            "This project creates room for the riffs, rhythms, and emotions that belong at the most aggressive edge of my writing.",
            "The sound leans more into modern metalcore.",
            "Buried In Ruin is not a replacement for F.A.T.E. It is the other side of the same creative life, with its own identity, catalog, visual language, and audience.",
            "Created A Monster opens that story, and each release will push the project into heavier territory.",
        ],
        image: "/images/about-guitar-room.jpg",
        imagePosition: "36% center",
    },
    musicSection: {
        eyebrow: "Buried transmissions",
        title: "Created A Monster breaks the surface",
        description:
            "Hear the debut single, then return as the heavier Buried In Ruin catalog emerges track by track.",
        emptyTitle: "Created A Monster is out now",
        emptyDescription:
            "Stream the debut single now and return as more Buried In Ruin releases join the catalog.",
    },
    connect: {
        title: "Follow Buried In Ruin into the dark",
        description: "Stream Created A Monster now and follow Buried In Ruin as the project gets heavier.",
        emptyDescription: "Created A Monster is available now on Spotify.",
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
    socialLinks: [
        {
            url: "https://open.spotify.com/track/5OEYUZNBqy7L5S95aiDRay",
            network: "spotify",
            tooltip: "Spotify",
        },
        {
            url: "https://music.apple.com/us/album/created-a-monster/6799304092?i=6799304094",
            network: "apple",
            tooltip: "Apple Music",
        },
    ],
    albums: [
        {
            id: "created-a-monster",
            title: "Created A Monster",
            year: 2026,
            releaseDate: "08/21/2026",
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
                    single_link_share: "https://open.spotify.com/track/5OEYUZNBqy7L5S95aiDRay",
                    previewStartTime: 0,
                    previewStartLabel: "Debut single preview",
                    featured: true,
                    songServiceLinks: [
                        {
                            url: "https://open.spotify.com/track/5OEYUZNBqy7L5S95aiDRay",
                            network: "spotify",
                            tooltip: "Spotify",
                        },
                        {
                            url: "https://music.apple.com/us/album/created-a-monster/6799304092?i=6799304094",
                            network: "apple",
                            tooltip: "Apple Music",
                        },
                    ],
                },
            ],
        },
    ],
    pressPosts: [],
};
