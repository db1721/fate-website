import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MusicLandingPage from "@/app/components/music-landing-page";
import {
    generateSongMetadata,
    getSongPageDataFromSlug,
    getSongStructuredData,
} from "@/app/config/music-data";
import { FATE_ARTIST } from "@/app/config/artists";
import { loadLyricsFromUrl } from "@/lib/lyrics.server";
import { loadArtistCatalog } from "@/lib/public-catalog.server";

export const dynamic = "force-dynamic";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const song = getSongPageDataFromSlug(await loadArtistCatalog(FATE_ARTIST), slug);

    if (!song) {
        return {};
    }

    return generateSongMetadata(song);
}

export default async function SongPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const song = getSongPageDataFromSlug(await loadArtistCatalog(FATE_ARTIST), slug);

    if (!song) {
        notFound();
    }

    const lyrics = song.lyrics ?? await loadLyricsFromUrl(song.lyricsUrl);

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getSongStructuredData(song)).replace(/</g, "\\u003c") }}
            />
            <MusicLandingPage song={song} lyrics={lyrics} />
        </>
    );
}
