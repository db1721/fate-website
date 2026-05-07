import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import bandInfo from "@/app/config/fate-info";
import { ARTIST_FULL_NAME, ARTIST_NAME, GENRES, SITE_DESCRIPTION, SITE_NAME, SITE_URL, absoluteUrl } from "@/app/config/site";
import { slugify } from "@/lib/utils";

export type SocialLink = {
    url: string;
    network: string;
    tooltip: string;
    bgColor?: string;
};

export type SongPageData = {
    slug: string;
    title: string;
    artist?: string;
    subtitle?: string;
    tagline?: string;
    coverImage: string | StaticImageData;
    previewUrl: string;
    lyricsTease?: string[];
    lyricsFile?: string;
    quote?: string;
    releaseLabel?: string;
    releaseDate?: string;
    albumTitle?: string;
    backgroundVideoUrl?: string;
    previewStartLabel?: string;
    previewStartTime?: number;
    songServiceLinks?: SocialLink[];
    spotifyUrl?: string;
};

type TrackData = {
    title: string;
    audioSrc: string;
    songImg?: string | StaticImageData;
    lyricsFile?: string;
    storyBehindTheLyrics?: string;
    single_link_share?: string;
    releaseDate?: string;
    previewStartTime?: number;
    previewStartLabel?: string;
    songServiceLinks?: SocialLink[];
};

type AlbumData = {
    id: string;
    title: string;
    year: number;
    description?: string;
    coverSrc: string | StaticImageData;
    tracks: TrackData[];
};

export function getImageSrc(src: string | StaticImageData): string {
    return typeof src === "string" ? src : src.src;
}

function parseReleaseDate(dateString?: string): Date | null {
    if (!dateString) return null;

    const slashDate = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (slashDate) {
        const [, month, day, year] = slashDate;
        return new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
    }

    const date = new Date(dateString);
    return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(dateString?: string): string | undefined {
    return parseReleaseDate(dateString)?.toISOString().slice(0, 10);
}

function isPublicSongPage(track: TrackData) {
    return Boolean(track.songServiceLinks?.length || track.single_link_share || track.lyricsFile);
}

export function getSongPageDataFromSlug(slug: string): SongPageData | null {
    for (const album of bandInfo.ALBUMS as AlbumData[]) {
        for (const track of album.tracks) {
            const trackSlug = slugify(track.title);

            if (trackSlug === slug) {
                return {
                    slug: trackSlug,
                    title: track.title,
                    lyricsFile: track.lyricsFile,
                    artist: ARTIST_NAME,
                    subtitle: `${track.title} by ${ARTIST_FULL_NAME}`,
                    tagline: album.title ? `From ${album.title}` : undefined,
                    coverImage: track.songImg ?? album.coverSrc,
                    previewUrl: track.audioSrc,
                    spotifyUrl: track.single_link_share ?? bandInfo.MAIN_BAND_PAGE,
                    releaseLabel: track.releaseDate ? `Released ${toIsoDate(track.releaseDate) ?? track.releaseDate}` : undefined,
                    releaseDate: toIsoDate(track.releaseDate),
                    albumTitle: album.title,
                    songServiceLinks: track.songServiceLinks ?? undefined,
                    previewStartTime: track.previewStartTime ?? 0,
                    previewStartLabel: track.previewStartLabel ?? "Preview",
                };
            }
        }
    }

    return null;
}

export function getPublicSongPages() {
    const pages: Array<SongPageData & { lastModified?: Date }> = [];

    for (const album of bandInfo.ALBUMS as AlbumData[]) {
        for (const track of album.tracks) {
            if (!isPublicSongPage(track)) continue;

            const song = getSongPageDataFromSlug(slugify(track.title));
            if (!song) continue;

            pages.push({
                ...song,
                lastModified: parseReleaseDate(track.releaseDate) ?? undefined,
            });
        }
    }

    return pages;
}

export function generateSongMetadata(song: SongPageData): Metadata {
    const pageUrl = absoluteUrl(`/music/${song.slug}`);
    const title = `${song.title} by ${ARTIST_FULL_NAME}`;
    const imageUrl = absoluteUrl(getImageSrc(song.coverImage));
    const description = song.albumTitle
        ? `Listen to ${song.title} by ${ARTIST_FULL_NAME}, read the lyrics, and choose your favorite streaming platform. From ${song.albumTitle}.`
        : `Listen to ${song.title} by ${ARTIST_FULL_NAME}, read the lyrics, and choose your favorite streaming platform.`;

    return {
        title,
        description,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: SITE_NAME,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 1200,
                    alt: `${song.title} cover art by ${ARTIST_FULL_NAME}`,
                },
            ],
            type: "music.song",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [imageUrl],
        },
    };
}

export function getHomeStructuredData() {
    const publicSongs = getPublicSongPages();

    return {
        "@context": "https://schema.org",
        "@type": "MusicGroup",
        "@id": `${SITE_URL}/#musicgroup`,
        name: ARTIST_NAME,
        alternateName: ARTIST_FULL_NAME,
        url: SITE_URL,
        image: absoluteUrl("/icons/fate-white-short.png"),
        logo: absoluteUrl("/icons/fate-white-short.png"),
        description: SITE_DESCRIPTION,
        genre: GENRES,
        sameAs: bandInfo.SOCIAL_LINKS.map((link: SocialLink) => link.url),
        album: (bandInfo.ALBUMS as AlbumData[]).map((album) => ({
            "@type": "MusicAlbum",
            name: album.title,
            byArtist: { "@id": `${SITE_URL}/#musicgroup` },
            datePublished: String(album.year),
            url: absoluteUrl(`/#albums`),
            track: album.tracks.filter(isPublicSongPage).map((track) => ({
                "@type": "MusicRecording",
                name: track.title,
                url: absoluteUrl(`/music/${slugify(track.title)}`),
            })),
        })),
        track: publicSongs.map((song) => ({
            "@type": "MusicRecording",
            name: song.title,
            url: absoluteUrl(`/music/${song.slug}`),
        })),
    };
}

export function getSongStructuredData(song: SongPageData) {
    const songUrl = absoluteUrl(`/music/${song.slug}`);

    return {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        "@id": `${songUrl}#recording`,
        name: song.title,
        url: songUrl,
        image: absoluteUrl(getImageSrc(song.coverImage)),
        datePublished: song.releaseDate,
        genre: GENRES,
        byArtist: {
            "@type": "MusicGroup",
            "@id": `${SITE_URL}/#musicgroup`,
            name: ARTIST_NAME,
            alternateName: ARTIST_FULL_NAME,
            url: SITE_URL,
        },
        inAlbum: song.albumTitle
            ? {
                "@type": "MusicAlbum",
                name: song.albumTitle,
                byArtist: { "@id": `${SITE_URL}/#musicgroup` },
            }
            : undefined,
        audio: {
            "@type": "AudioObject",
            contentUrl: absoluteUrl(song.previewUrl),
            encodingFormat: "audio/mpeg",
        },
        sameAs: song.songServiceLinks?.map((link) => link.url),
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": songUrl,
        },
    };
}
