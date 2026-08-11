import type { StaticImageData } from "next/image";

export type ArtistId = "fate" | "buried-in-ruin";
export type ImageSource = string | StaticImageData;

export type ArtistTheme = {
    background: string;
    backgroundAlt: string;
    surface: string;
    border: string;
    accent: string;
    accentBright: string;
    accentSoft: string;
    text: string;
    textMuted: string;
    buttonText: string;
    heroGlow: string;
    secondaryGlow: string;
};

export type SocialLink = {
    url: string;
    network: string;
    tooltip: string;
    bgColor?: string;
};

export type FeaturedTrack = {
    title: string;
    subtitle: string;
    coverSrc: ImageSource;
    audioSrc: string;
    featureDate: string;
    description?: string;
};

export type TrackData = {
    title: string;
    audioSrc: string;
    previewSrc?: string;
    songImg?: ImageSource;
    lyricsFile?: string;
    storyBehindTheLyrics?: string;
    single_link_share?: string;
    releaseDate?: string;
    previewStartTime?: number;
    previewStartLabel?: string;
    featured?: boolean;
    songServiceLinks?: SocialLink[];
};

export type AlbumData = {
    id: string;
    title: string;
    year: number;
    releaseDate?: string;
    tagline?: string;
    highlightTrack?: string;
    description?: string;
    coverSrc: ImageSource;
    tracks: TrackData[];
};

export type PressPost = {
    title: string;
    excerpt: string;
    href: string;
    date: string;
    coverSrc?: StaticImageData;
    tag?: string;
    author?: string;
};

export type ArtistConfig = {
    id: ArtistId;
    routeSlug: string;
    homePath: string;
    musicPathPrefix: string;
    name: string;
    fullName: string;
    logo?: ImageSource;
    logoAlt: string;
    hero: {
        eyebrow: string;
        description: string;
        image?: ImageSource;
        imagePosition?: string;
        secondaryCta: string;
        noFeatureTitle: string;
        noFeatureDescription: string;
    };
    about: {
        title: string;
        intro: string;
        paragraphs: string[];
        image?: ImageSource;
        imagePosition?: string;
    };
    musicSection: {
        eyebrow: string;
        title: string;
        description: string;
        emptyTitle: string;
        emptyDescription: string;
    };
    connect: {
        title: string;
        description: string;
        emptyDescription: string;
    };
    seo: {
        title: string;
        description: string;
        keywords: string[];
        genres: string[];
        image: ImageSource;
    };
    theme: ArtistTheme;
    featuredTracks: FeaturedTrack[];
    mainArtistUrl?: string;
    socialLinks: SocialLink[];
    albums: AlbumData[];
    pressPosts: PressPost[];
};
