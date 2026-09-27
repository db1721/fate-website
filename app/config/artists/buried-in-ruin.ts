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
            audioSrc: "/audio/buried-in-ruin/monster-you-created/created-a-monster.mp3",
            featureDate: "08/10/2026",
            description:
                "The first look at Buried In Ruin: predatory tension, crushing weight, and a chorus built to leave teeth marks.",
        },
        {
            title: "Struggle",
            subtitle: "From the new album You Deserve Better",
            coverSrc: "/artists/buried-in-ruin/struggle-single-cover.jpg",
            audioSrc: "/audio/buried-in-ruin/you-deserve-better/struggle.mp3",
            featureDate: "10/09/2026",
            description:
                "A modern metalcore confrontation with isolation, hidden pain, and the fight to stand tall when the struggle is real.",
        },
    ],
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
    ],
    albums: [
        {
            id: "monster-you-created",
            title: "Monster You Created",
            year: 2026,
            releaseDate: "TBD",
            tagline: "Debut Album",
            highlightTrack: "Created A Monster",
            description:
                "The first Buried In Ruin release opens the project with a stark black-and-white identity and a heavier, more confrontational sound.",
            coverSrc: "/artists/buried-in-ruin/created-a-monster-cover.png",
            tracks: [
                {
                    title: "Created A Monster",
                    releaseDate: "08/21/2026",
                    audioSrc: "/audio/buried-in-ruin/monster-you-created/created-a-monster.mp3",
                    songImg: "/artists/buried-in-ruin/created-a-monster-cover.png",
                    lyricsUrl: "https://app.evolveelevatemedia.com/music/lyrics/buried-in-ruin-created-a-monster",
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
                        {
                            url: "https://tidal.com/album/550221859/track/550221861",
                            network: "tidal",
                            tooltip: "TIDAL",
                        },
                        {
                            url: "https://www.deezer.com/us/track/4210674812",
                            network: "deezer",
                            tooltip: "Deezer",
                        },
                        {
                            url: "https://music.amazon.com/tracks/B0HDFLBQCL",
                            network: "amazon",
                            tooltip: "Amazon Music",
                        },
                        {
                            url: "https://www.youtube.com/watch?v=9xSRE5evOGU",
                            network: "youtube",
                            tooltip: "YouTube",
                        },
                        {
                            url: "https://music.youtube.com/watch?v=9xSRE5evOGU",
                            network: "youtube-music",
                            tooltip: "YouTube Music",
                        },
                    ],
                },
            ],
        },
        {
            id: "you-deserve-better",
            title: "You Deserve Better",
            year: 2026,
            releaseDate: "10/09/2026",
            tagline: "New album",
            highlightTrack: "Struggle",
            description:
                "You Deserve Better turns inward, pairing modern metalcore weight with songs about isolation, survival, and finding the strength to push back.",
            coverSrc: "/artists/buried-in-ruin/you-deserve-better-cover.png",
            tracks: [
                {
                    title: "Struggle",
                    audioSrc: "/audio/buried-in-ruin/you-deserve-better/struggle.mp3",
                    songImg: "/artists/buried-in-ruin/struggle-single-cover.jpg",
                    lyricsUrl: "https://app.evolveelevatemedia.com/music/lyrics/buried-in-ruin-struggle",
                    previewStartTime: 102,
                    previewStartLabel: "Struggle preview",
                    featured: true,
                    songServiceLinks: [],
                },
            ],
        },
    ],
    pressPosts: [],
};
