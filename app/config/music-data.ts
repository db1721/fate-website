import type { Metadata } from "next";
import type { StaticImageData } from "next/image";
import { ARTISTS, getArtistSongPath } from "@/app/config/artists";
import type {
    AlbumData,
    ArtistConfig,
    ArtistId,
    ArtistTheme,
    SocialLink,
    TrackData,
} from "@/app/config/artists/types";
import { CONTACT_EMAIL, SITE_URL, absoluteUrl } from "@/app/config/site";
import { slugify } from "@/lib/utils";

export type SongPageData = {
    slug: string;
    title: string;
    projectId: ArtistId;
    artist: string;
    artistFullName: string;
    homePath: string;
    musicPathPrefix: string;
    genres: string[];
    theme: ArtistTheme;
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

const FEATURED_RELEASE_NETWORKS = new Set([
    "spotify",
    "apple",
    "youtube-music",
    "amazon",
    "pandora",
    "tidal",
    "deezer",
    "shazam",
]);

export function getImageSrc(src: string | StaticImageData) {
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

function toIsoDate(dateString?: string) {
    return parseReleaseDate(dateString)?.toISOString().slice(0, 10);
}

function isPublicSongPage(track: TrackData) {
    return Boolean(
        track.featured ||
        track.songServiceLinks?.length ||
        track.single_link_share ||
        track.lyricsFile
    );
}

function getEffectiveReleaseDate(track: TrackData, album: AlbumData) {
    return track.releaseDate?.trim() || album.releaseDate?.trim() || undefined;
}

function buildSongPageData(
    artist: ArtistConfig,
    album: AlbumData,
    track: TrackData
): SongPageData {
    const trackSlug = slugify(track.title);
    const featuredReleaseLinks = track.featured
        ? artist.socialLinks.filter((link) => FEATURED_RELEASE_NETWORKS.has(link.network))
        : undefined;
    const releaseDate = getEffectiveReleaseDate(track, album);

    return {
        slug: trackSlug,
        title: track.title,
        projectId: artist.id,
        artist: artist.name,
        artistFullName: artist.fullName,
        homePath: artist.homePath,
        musicPathPrefix: artist.musicPathPrefix,
        genres: artist.seo.genres,
        theme: artist.theme,
        lyricsFile: track.lyricsFile,
        subtitle: `${track.title} by ${artist.fullName}`,
        tagline: album.title ? `From ${album.title}` : undefined,
        coverImage: track.songImg ?? album.coverSrc,
        previewUrl: track.previewSrc ?? track.audioSrc,
        spotifyUrl: track.single_link_share ?? artist.mainArtistUrl,
        releaseLabel: releaseDate
            ? `Released ${toIsoDate(releaseDate) ?? releaseDate}`
            : undefined,
        releaseDate: toIsoDate(releaseDate),
        albumTitle: album.title,
        songServiceLinks: track.songServiceLinks ?? featuredReleaseLinks,
        previewStartTime: track.previewStartTime ?? 0,
        previewStartLabel: track.previewStartLabel ?? "Preview",
    };
}

export function getSongPageDataFromSlug(artist: ArtistConfig, slug: string) {
    for (const album of artist.albums) {
        for (const track of album.tracks) {
            if (slugify(track.title) === slug) {
                return buildSongPageData(artist, album, track);
            }
        }
    }

    return null;
}

export function getPublicSongPages(artist?: ArtistConfig) {
    const pages: Array<SongPageData & { lastModified?: Date }> = [];

    for (const project of artist ? [artist] : ARTISTS) {
        for (const album of project.albums) {
            for (const track of album.tracks) {
                if (!isPublicSongPage(track)) continue;

                pages.push({
                    ...buildSongPageData(project, album, track),
                    lastModified:
                        parseReleaseDate(getEffectiveReleaseDate(track, album)) ?? undefined,
                });
            }
        }
    }

    return pages;
}

export function generateSongMetadata(song: SongPageData): Metadata {
    const pagePath = `${song.musicPathPrefix}/${song.slug}`;
    const pageUrl = absoluteUrl(pagePath);
    const title = `${song.title} by ${song.artistFullName}`;
    const imageUrl = absoluteUrl(getImageSrc(song.coverImage));
    const description = song.albumTitle
        ? `Preview ${song.title} by ${song.artistFullName}, then choose your favorite streaming platform. From ${song.albumTitle}.`
        : `Preview ${song.title} by ${song.artistFullName}, then choose your favorite streaming platform.`;

    return {
        title: { absolute: title },
        description,
        keywords: [song.title, song.artist, song.artistFullName, ...song.genres],
        alternates: { canonical: pageUrl },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: `${song.artist} Official Music`,
            images: [
                {
                    url: imageUrl,
                    width: 1200,
                    height: 1200,
                    alt: `${song.title} cover art by ${song.artistFullName}`,
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

export function getHomeStructuredData(artist: ArtistConfig) {
    const artistUrl = absoluteUrl(artist.homePath);
    const artistId = `${artistUrl}${artist.homePath === "/" ? "" : "/"}#musicgroup`;
    const publicSongs = getPublicSongPages(artist);

    return {
        "@context": "https://schema.org",
        "@type": "MusicGroup",
        "@id": artistId,
        name: artist.name,
        alternateName: artist.fullName !== artist.name ? artist.fullName : undefined,
        url: artistUrl,
        image: absoluteUrl(getImageSrc(artist.seo.image)),
        logo: absoluteUrl(getImageSrc(artist.logo ?? artist.seo.image)),
        description: artist.seo.description,
        genre: artist.seo.genres,
        email: CONTACT_EMAIL,
        contactPoint: {
            "@type": "ContactPoint",
            contactType: "business inquiries",
            email: CONTACT_EMAIL,
        },
        sameAs: artist.socialLinks.map((link) => link.url),
        album: artist.albums.map((album) => ({
            "@type": "MusicAlbum",
            name: album.title,
            byArtist: { "@id": artistId },
            datePublished: toIsoDate(album.releaseDate) ?? String(album.year),
            url: `${artistUrl}${artist.homePath === "/" ? "" : "/"}#albums`,
            track: album.tracks.filter(isPublicSongPage).map((track) => ({
                "@type": "MusicRecording",
                name: track.title,
                url: absoluteUrl(getArtistSongPath(artist, slugify(track.title))),
            })),
        })),
        track: publicSongs.map((song) => ({
            "@type": "MusicRecording",
            name: song.title,
            url: absoluteUrl(`${song.musicPathPrefix}/${song.slug}`),
        })),
    };
}

export function getSongStructuredData(song: SongPageData) {
    const songUrl = absoluteUrl(`${song.musicPathPrefix}/${song.slug}`);
    const artistUrl = absoluteUrl(song.homePath);
    const artistId = `${artistUrl}${song.homePath === "/" ? "" : "/"}#musicgroup`;

    return {
        "@context": "https://schema.org",
        "@type": "MusicRecording",
        "@id": `${songUrl}#recording`,
        name: song.title,
        url: songUrl,
        image: absoluteUrl(getImageSrc(song.coverImage)),
        datePublished: song.releaseDate,
        genre: song.genres,
        byArtist: {
            "@type": "MusicGroup",
            "@id": artistId,
            name: song.artist,
            alternateName:
                song.artistFullName !== song.artist ? song.artistFullName : undefined,
            url: artistUrl,
        },
        inAlbum: song.albumTitle
            ? {
                "@type": "MusicAlbum",
                name: song.albumTitle,
                byArtist: { "@id": artistId },
            }
            : undefined,
        audio: {
            "@type": "AudioObject",
            contentUrl: absoluteUrl(song.previewUrl),
            encodingFormat: "audio/mpeg",
        },
        sameAs: song.songServiceLinks?.map((link) => link.url),
        mainEntityOfPage: { "@type": "WebPage", "@id": songUrl },
    };
}

export const MUSIC_SITE_URL = SITE_URL;
