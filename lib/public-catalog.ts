import type { AlbumData, ArtistConfig, SocialLink, TrackData } from "../app/config/artists/types.ts";
import { getCurrentFeaturedTrack } from "../app/config/artists/featured-track.ts";
import { isCatalogSongReleased, musicFeatureDateIso } from "./music-calendar.ts";

export { MUSIC_RELEASE_TIME_ZONE, isCatalogSongReleased, isFutureCatalogRelease, musicReleaseDateIso, parseMusicReleaseDate } from "./music-calendar.ts";

type CatalogRecord = Record<string, unknown>;
const publicCatalogPath = /^\/api\/music\/public-catalog\/[^/]+\/[^/]+\/?$/;
const loopbackHosts = new Set(["localhost", "127.0.0.1", "[::1]"]);

function isDevelopmentLocalCatalog(url: URL): boolean {
    return process.env.NODE_ENV === "development"
        && url.protocol === "http:"
        && loopbackHosts.has(url.hostname)
        && !url.username && !url.password
        && publicCatalogPath.test(url.pathname);
}

function record(value: unknown): CatalogRecord {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error("Invalid catalog record");
    return value as CatalogRecord;
}

function requiredText(value: unknown): string {
    if (typeof value !== "string" || !value.trim()) throw new Error("Missing catalog text");
    return value.trim();
}

function optionalText(value: unknown): string | undefined {
    return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function albumDescription(value: unknown): string | undefined {
    const description = optionalText(value);
    return description && description.length <= 10_000 ? description : undefined;
}

function releaseDate(value: unknown): string | undefined {
    if (value === undefined || value === null || value === "") return undefined;
    if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) throw new Error("Invalid catalog release date");
    const date = new Date(`${value}T00:00:00Z`);
    if (!Number.isFinite(date.getTime()) || date.toISOString().slice(0, 10) !== value) throw new Error("Invalid catalog release date");
    return value;
}

function publicUrl(value: unknown, sourceUrl: string, allowLocalMedia = false): string | undefined {
    if (typeof value !== "string" || !value.trim()) return undefined;
    try {
        const source = new URL(sourceUrl);
        const url = new URL(value, source);
        if (url.username || url.password) return undefined;
        if (url.protocol === "https:") return url.href;
        // Only media from the configured loopback app can use HTTP while developing.
        // Streaming services and every production URL continue to require HTTPS.
        return allowLocalMedia && isDevelopmentLocalCatalog(source) && url.origin === source.origin
            ? url.href
            : undefined;
    } catch {
        return undefined;
    }
}

function order(value: unknown, fallback: number): number {
    return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

function trackKey(value: string): string {
    return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}

function serviceLinks(value: unknown, sourceUrl: string): SocialLink[] {
    if (!Array.isArray(value)) return [];
    const networkNames: Record<string, string> = { applemusic: "apple", itunes: "apple", amazonmusic: "amazon", youtubemusic: "youtube-music", iheartradio: "iheart" };
    const seen = new Set<string>();
    return value.flatMap((item) => {
        if (!item || typeof item !== "object") return [];
        const link = item as CatalogRecord;
        const url = publicUrl(link.url, sourceUrl);
        if (!url || seen.has(url)) return [];
        seen.add(url);
        const service = optionalText(link.service)?.toLowerCase().replaceAll("_", "-") ?? "sharethis";
        return [{ url, network: networkNames[service.replaceAll("-", "")] ?? service, tooltip: optionalText(link.label) ?? service }];
    });
}

/** A configured feed replaces the catalog. Editorial branding is the only local fallback. */
export function applyPublicCatalog(artist: ArtistConfig, payload: unknown, sourceUrl: string, now = new Date()): ArtistConfig {
    const catalog = record(payload);
    if (catalog.schemaVersion !== 1 || !Array.isArray(catalog.albums) || !Array.isArray(catalog.songs)) throw new Error("Unsupported catalog response");
    const publishedArtist = record(catalog.artist);
    const artistId = requiredText(publishedArtist.id);
    const artistName = requiredText(publishedArtist.name);
    const configuredArtistId = decodeURIComponent(new URL(sourceUrl).pathname.split("/").filter(Boolean).at(-1) ?? "");
    const catalogSlug = optionalText(publishedArtist.catalogSlug);
    if (configuredArtistId !== artistId && configuredArtistId !== catalogSlug) throw new Error("Catalog artist does not match its configured URL");
    const localTracks = artist.catalogRequired ? [] : artist.albums.flatMap((album) => album.tracks);
    const albums = new Map<string, AlbumData>();
    const albumRecords = catalog.albums.map(record).map((album, index) => ({ album, index })).sort((a, b) => order(a.album.sortOrder, a.index) - order(b.album.sortOrder, b.index));

    for (const { album } of albumRecords) {
        const id = requiredText(album.id);
        if (albums.has(id)) throw new Error("Duplicate catalog album");
        const title = requiredText(album.title);
        const date = releaseDate(album.releaseDate);
        const editorialAlbum = artist.catalogEditorial?.albums?.find((candidate) => trackKey(candidate.albumTitle) === trackKey(title));
        const legacyAlbum = artist.catalogRequired ? undefined : artist.albums.find((candidate) => trackKey(candidate.title) === trackKey(title));
        albums.set(id, {
            id,
            title,
            year: date ? Number(date.slice(0, 4)) : 0,
            releaseDate: date,
            coverSrc: publicUrl(album.coverUrl, sourceUrl) ?? artist.seo.image,
            tagline: editorialAlbum?.tagline ?? legacyAlbum?.tagline ?? (date ? undefined : "Release"),
            description: albumDescription(album.description),
            highlightTrack: legacyAlbum?.highlightTrack,
            tracks: [],
        });
    }

    const seenSlugs = new Set<string>();
    const seenSongs = new Set<string>();
    const publishedTracks: TrackData[] = [];
    const songRecords = catalog.songs.map(record).map((song, index) => ({ song, index })).sort((a, b) => order(a.song.sortOrder, a.index) - order(b.song.sortOrder, b.index));
    for (const { song } of songRecords) {
        const slug = requiredText(song.slug);
        const songId = requiredText(song.songId);
        if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug) || seenSlugs.has(slug) || seenSongs.has(songId)) throw new Error("Invalid or duplicate catalog song");
        if (requiredText(song.artistId) !== artistId) throw new Error("Unexpected song artist");
        seenSlugs.add(slug);
        seenSongs.add(songId);
        const title = requiredText(song.title);
        const albumId = optionalText(song.albumId);
        if (albumId && !albums.has(albumId)) throw new Error("Unknown catalog album");
        if (typeof song.lyrics !== "string") throw new Error("Missing catalog lyrics");
        let album = albumId ? albums.get(albumId)! : albums.get("__public_singles__");
        if (!album) {
            album = { id: "__public_singles__", title: "Singles", year: 0, tagline: "Singles", coverSrc: artist.seo.image, tracks: [] };
            albums.set(album.id, album);
        }
        const editorial = localTracks.find((track) => track.publicSlug === slug || trackKey(track.title) === trackKey(title));
        const track: TrackData = {
            publicSlug: slug,
            publicSongId: songId,
            publicArtistName: optionalText(song.artist) ?? artistName,
            title,
            audioSrc: publicUrl(song.mainAudioUrl, sourceUrl, true) ?? "",
            songImg: publicUrl(song.coverUrl, sourceUrl) ?? album.coverSrc,
            releaseDate: releaseDate(song.releaseDate) ?? album.releaseDate,
            featureDate: musicFeatureDateIso(song.featureDate),
            lyrics: song.lyrics.trim(),
            behindTheMusic: optionalText(song.behindTheMusic),
            previewStartTime: typeof song.previewStartSeconds === "number" && Number.isFinite(song.previewStartSeconds) && song.previewStartSeconds >= 0 ? song.previewStartSeconds : 0,
            previewStartLabel: editorial?.previewStartLabel,
            trackNumber: typeof song.trackNumber === "number" && Number.isInteger(song.trackNumber) && song.trackNumber > 0 ? song.trackNumber : undefined,
            songServiceLinks: serviceLinks(song.serviceLinks, sourceUrl),
        };
        album.tracks.push(track);
        publishedTracks.push(track);
    }

    const publishedAlbums = [...albums.values()].filter((album) => album.tracks.length).map((album) => {
        const editorialAlbum = artist.catalogEditorial?.albums?.find((candidate) => trackKey(candidate.albumTitle) === trackKey(album.title));
        const highlight = editorialAlbum?.highlightSongSlug
            ? album.tracks.find((track) => track.publicSlug === editorialAlbum.highlightSongSlug)
            : album.tracks.find((track) => track.title === album.highlightTrack);
        return { ...album, highlightTrack: highlight?.title };
    });
    const featureChoices = publishedTracks.flatMap((track) => {
        if (!track.featureDate || !track.audioSrc || !isCatalogSongReleased(track.releaseDate, now)) return [];
        const editorialFeature = artist.catalogEditorial?.features?.find((feature) => feature.songSlug === track.publicSlug);
        const album = publishedAlbums.find((candidate) => candidate.tracks.includes(track));
        return [{
            songSlug: track.publicSlug,
            title: track.title,
            subtitle: editorialFeature?.subtitle ?? album?.title ?? artist.name,
            featureDate: track.featureDate,
            description: editorialFeature?.description,
            audioSrc: track.audioSrc,
            coverSrc: track.songImg ?? artist.seo.image,
            previewStartTime: track.previewStartTime,
        }];
    });
    // Feature scheduling belongs to the app, not local promotional copy. Ties
    // retain feed sortOrder, then original feed order, independently per artist.
    const selectedFeature = getCurrentFeaturedTrack(featureChoices, now);
    const featuredTracks = selectedFeature ? [selectedFeature] : [];
    for (const track of publishedTracks) track.featured = track.publicSlug === selectedFeature?.songSlug;
    return {
        ...artist,
        catalogStatus: "ready",
        albums: publishedAlbums,
        featuredTracks,
    };
}

export async function fetchArtistCatalog(artist: ArtistConfig, configuredUrl?: string, fetcher: typeof fetch = fetch): Promise<ArtistConfig> {
    if (!configuredUrl?.trim()) {
        return artist.catalogRequired
            ? { ...artist, catalogStatus: "unavailable", albums: [], featuredTracks: [] }
            : artist;
    }
    try {
        const url = new URL(configuredUrl.trim());
        if ((url.protocol !== "https:" && !isDevelopmentLocalCatalog(url)) || url.username || url.password || !publicCatalogPath.test(url.pathname)) throw new Error("Invalid public catalog URL");
        const response = await fetcher(url.href, { cache: "no-store", redirect: "error", signal: AbortSignal.timeout(8000), headers: { Accept: "application/json" } });
        if (!response.ok) throw new Error(`Catalog request failed (${response.status})`);
        return applyPublicCatalog(artist, await response.json(), url.href);
    } catch (error) {
        console.error(`Public music catalog unavailable for ${artist.id}`, error);
        return { ...artist, catalogStatus: "unavailable", albums: [], featuredTracks: [] };
    }
}
