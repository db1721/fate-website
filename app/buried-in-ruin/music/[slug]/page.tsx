import { notFound } from "next/navigation";
import type { Metadata } from "next";
import MusicLandingPage from "@/app/components/music-landing-page";
import { BURIED_IN_RUIN_ARTIST } from "@/app/config/artists";
import {
    generateSongMetadata,
    getPublicSongPages,
    getSongPageDataFromSlug,
    getSongStructuredData,
} from "@/app/config/music-data";

export function generateStaticParams() {
    return getPublicSongPages(BURIED_IN_RUIN_ARTIST).map((song) => ({
        slug: song.slug,
    }));
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const song = getSongPageDataFromSlug(BURIED_IN_RUIN_ARTIST, slug);

    return song ? generateSongMetadata(song) : {};
}

export default async function BuriedInRuinSongPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = await params;
    const song = getSongPageDataFromSlug(BURIED_IN_RUIN_ARTIST, slug);

    if (!song) notFound();

    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getSongStructuredData(song)) }}
            />
            <MusicLandingPage song={song} />
        </>
    );
}
