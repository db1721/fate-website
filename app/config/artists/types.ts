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
    songSlug?: string;
    previewStartTime?: number;
    title: string;
    subtitle: string;
    coverSrc: ImageSource;
    audioSrc: string;
    featureDate: string;
    description?: string;
};

export type TrackData = {
    /** Exact publisher slug; never derive it again from the display title. */
    publicSlug?: string;
    publicSongId?: string;
    publicArtistName?: string;
    trackNumber?: number;
    lyrics?: string;
    behindTheMusic?: string;
    title: string;
    audioSrc: string;
    previewSrc?: string;
    songImg?: ImageSource;
    lyricsUrl?: string;
    storyBehindTheLyrics?: string;
    releaseDate?: string;
    /** Optional app-owned date to begin considering this song for the featured hero. */
    featureDate?: string;
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
    /** No bundled song catalog: this artist must be supplied by the app. */
    catalogRequired?: boolean;
    /** Website-only copy and curation, never a second source of song metadata. */
    catalogEditorial?: {
        albums?: {
            albumTitle: string;
            tagline?: string;
            description?: string;
            highlightSongSlug?: string;
        }[];
        features?: {
            songSlug: string;
            subtitle: string;
            description?: string;
        }[];
    };
    catalogStatus?: "ready" | "unavailable";
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
