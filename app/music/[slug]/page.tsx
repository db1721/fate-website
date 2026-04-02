import { notFound } from "next/navigation";
import MusicLandingPage, {SongPageData} from "@/app/components/music-landing-page";
import bandInfo from "@/app/config/fate-info";

function slugify(value: string) {
    return value
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

function getSongPageDataFromSlug(slug: string): SongPageData | null {
    for (const album of bandInfo.ALBUMS) {
        for (const track of album.tracks) {
            const trackSlug = slugify(track.title);

            if (trackSlug === slug) {
                return {
                    slug: trackSlug,
                    title: track.title,
                    lyricsFile: track.lyricsFile,
                    artist: bandInfo.band_name,
                    subtitle: album.title ? `${track.title} from ${album.title}` : undefined,
                    coverImage: track.songImg ?? album.coverSrc,
                    previewUrl: track.audioSrc,
                    spotifyUrl: track.single_link_share ?? bandInfo.MAIN_BAND_PAGE,
                    releaseLabel: track.releaseDate ? `Released ${track.releaseDate}` : undefined,
                    songServiceLinks: track.songServiceLinks ?? undefined,
                    previewStartTime: track.previewStartTime ?? 0,
                };
            }
        }
    }

    return null;
}

export default async function SongPage({
                                           params,
                                       }: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const song = getSongPageDataFromSlug(slug);

    if (!song) {
        notFound();
    }

    return <MusicLandingPage song={song} />;
}