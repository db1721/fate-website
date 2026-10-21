"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Disc3, Star } from "lucide-react";
import { AudioTrack } from "@/app/components/audio-track";
import { getArtistSongPath } from "@/app/config/artists";
import type { ArtistConfig, TrackData } from "@/app/config/artists/types";
import { getTrackSlug } from "@/app/config/music-data";
import { isFutureCatalogRelease, parseMusicReleaseDate } from "@/lib/public-catalog";

function parseReleaseDate(dateString: string) {
    return parseMusicReleaseDate(dateString);
}

function getReleaseStatus(dateString: string): "released" | "future" | "tbd" {
    if (!dateString.trim()) return "tbd";

    const date = parseReleaseDate(dateString);
    if (!date) return "tbd";
    return isFutureCatalogRelease(dateString) ? "future" : "released";
}

function formatReleaseDate(dateString: string) {
    const date = parseReleaseDate(dateString);
    if (!date) return dateString;

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

function hasTrackPage(track: TrackData) {
    return Boolean(
        track.publicSongId ||
        track.featured ||
        track.lyricsUrl ||
        track.songServiceLinks?.length
    );
}

function getEffectiveReleaseDate(track: TrackData, albumReleaseDate?: string) {
    return track.releaseDate?.trim() || albumReleaseDate?.trim() || "";
}

function renderAlbumDescription(description: string) {
    // Support single-asterisk emphasis while keeping all content escaped by React.
    return description.split(/(?<![\\*])\*(?!\s)([^*\r\n]+?)(?<![\s\\])\*(?!\*)/g).map((part, index) =>
        index % 2 === 1 ? <em key={index} className="italic">{part}</em> : part
    );
}

type AlbumsSectionProps = {
    artist: ArtistConfig;
};

export function AlbumsSection({ artist }: AlbumsSectionProps) {
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const activeAlbum = artist.albums[activeIndex] ?? artist.albums[0];

    if (!activeAlbum) {
        return (
            <section
                id="albums"
                data-reveal
                className="border-y border-white/10 px-4 py-20 sm:px-8 lg:px-16"
                style={{ backgroundColor: "var(--artist-background-alt)" }}
            >
                <div className="mx-auto max-w-5xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                        {artist.musicSection.eyebrow}
                    </p>
                    <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase tracking-normal text-white sm:text-4xl">
                        {artist.catalogStatus === "unavailable" ? "Music is temporarily unavailable" : artist.musicSection.emptyTitle}
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                        {artist.catalogStatus === "unavailable" ? "Please check back shortly. The music catalog could not be loaded." : artist.musicSection.emptyDescription}
                    </p>
                </div>
            </section>
        );
    }

    const albumReleaseDate = activeAlbum.releaseDate
        ? formatReleaseDate(activeAlbum.releaseDate)
        : null;
    const highlightedTrack = activeAlbum.highlightTrack
        ? activeAlbum.tracks.find((track) => track.title === activeAlbum.highlightTrack)
        : undefined;
    const highlightReleaseDate = highlightedTrack
        ? getEffectiveReleaseDate(highlightedTrack, activeAlbum.releaseDate)
        : "";
    const highlightStatus = highlightedTrack
        ? getReleaseStatus(highlightReleaseDate)
        : "tbd";
    const highlightSlug = highlightedTrack ? getTrackSlug(highlightedTrack) : null;

    const prevAlbum = () => {
        setCurrentlyPlaying(null);
        setActiveIndex((index) => (index === 0 ? artist.albums.length - 1 : index - 1));
    };

    const nextAlbum = () => {
        setCurrentlyPlaying(null);
        setActiveIndex((index) => (index === artist.albums.length - 1 ? 0 : index + 1));
    };

    return (
        <section
            id="albums"
            data-reveal
            className="relative overflow-hidden border-y border-white/10 px-4 py-20 sm:px-8 lg:px-16"
            style={{
                background: `linear-gradient(125deg, var(--artist-background-alt) 0%, var(--artist-background) 68%, color-mix(in srgb, var(--artist-accent) 12%, #000) 100%)`,
            }}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-20"
                style={{
                    background: "linear-gradient(135deg, transparent 0 46%, var(--artist-accent) 46% 47%, transparent 47% 100%)",
                }}
            />

            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col justify-between gap-7 md:flex-row md:items-end">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                            {artist.musicSection.eyebrow}
                        </p>
                        <h2 className="mt-3 text-3xl font-black uppercase tracking-normal text-white sm:text-4xl">
                            {artist.musicSection.title}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                            {artist.musicSection.description}
                        </p>
                    </div>

                    {artist.albums.length > 1 ? (
                        <div className="flex items-center gap-2" aria-label="Release navigation">
                            <button
                                type="button"
                                onClick={prevAlbum}
                                aria-label="Previous release"
                                className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:border-white/35 hover:bg-white/10"
                            >
                                <ChevronLeft className="h-5 w-5" />
                            </button>
                            <div className="flex overflow-hidden rounded-md border border-white/15">
                                {artist.albums.map((album, index) => (
                                    <button
                                        key={album.id}
                                        type="button"
                                        onClick={() => {
                                            setCurrentlyPlaying(null);
                                            setActiveIndex(index);
                                        }}
                                        aria-label={`Show ${album.title}`}
                                        aria-current={index === activeIndex ? "true" : undefined}
                                        className="h-11 min-w-11 border-r border-white/10 px-3 text-xs font-bold transition last:border-r-0"
                                        style={index === activeIndex
                                            ? {
                                                backgroundColor: "var(--artist-accent-bright)",
                                                color: "var(--artist-button-text)",
                                            }
                                            : { backgroundColor: "rgba(255,255,255,0.04)", color: "#d4d4d8" }}
                                    >
                                        {index + 1}
                                    </button>
                                ))}
                            </div>
                            <button
                                type="button"
                                onClick={nextAlbum}
                                aria-label="Next release"
                                className="flex h-11 w-11 items-center justify-center rounded-md border border-white/15 bg-white/5 text-white transition hover:border-white/35 hover:bg-white/10"
                            >
                                <ChevronRight className="h-5 w-5" />
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(240px,360px)_1fr] lg:gap-12">
                    <div>
                        <div className="relative aspect-square overflow-hidden rounded-md border border-white/15 bg-black">
                            <Image
                                src={activeAlbum.coverSrc}
                                unoptimized={Boolean(artist.catalogStatus)}
                                alt={`${activeAlbum.title} cover art`}
                                fill
                                sizes="(min-width: 1024px) 360px, 92vw"
                                className="object-cover"
                            />
                        </div>
                        {artist.albums.length > 1 ? (
                            <p className="mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-600">
                                Release {activeIndex + 1} of {artist.albums.length}
                            </p>
                        ) : null}
                    </div>

                    <div className="min-w-0">
                        <p className="text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500">
                            {activeAlbum.tagline ?? activeAlbum.year}
                        </p>
                        <h3 className="mt-2 text-3xl font-black uppercase tracking-normal text-white sm:text-4xl">
                            {activeAlbum.title}
                        </h3>
                        {activeAlbum.description ? (
                            <p className="mt-3 max-w-2xl whitespace-pre-line break-words text-sm leading-7 text-zinc-300">
                                {renderAlbumDescription(activeAlbum.description)}
                            </p>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                            {albumReleaseDate ? (
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" style={{ color: "var(--artist-accent-bright)" }} />
                                    {albumReleaseDate}
                                </span>
                            ) : null}
                            <span className="inline-flex items-center gap-2">
                                <Disc3 className="h-4 w-4" style={{ color: "var(--artist-accent-bright)" }} />
                                {activeAlbum.tracks.length} {activeAlbum.tracks.length === 1 ? "track" : "tracks"}
                            </span>
                            {activeAlbum.highlightTrack ? (
                                <span className="inline-flex items-center gap-2" style={{ color: "var(--artist-accent-soft)" }}>
                                    <Star className="h-4 w-4" />
                                    Featured: {activeAlbum.highlightTrack}
                                </span>
                            ) : null}
                        </div>

                        {highlightSlug ? (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {highlightStatus === "released" ? (
                                    <>
                                        <Link
                                            href={getArtistSongPath(artist, highlightSlug)}
                                            className="rounded-md px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition hover:-translate-y-0.5"
                                            style={{
                                                backgroundColor: "var(--artist-accent-bright)",
                                                color: "var(--artist-button-text)",
                                            }}
                                        >
                                            Open {activeAlbum.highlightTrack}
                                        </Link>
                                        <a
                                            href="#connect"
                                            className="rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-100 transition hover:border-white/35 hover:bg-white/10"
                                        >
                                            Streaming platforms
                                        </a>
                                    </>
                                ) : (
                                    <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">
                                        <CalendarDays className="h-4 w-4" style={{ color: "var(--artist-accent-bright)" }} />
                                        {highlightStatus === "future"
                                            ? `Available ${formatReleaseDate(highlightReleaseDate)}`
                                            : "Release date TBD"}
                                    </span>
                                )}
                            </div>
                        ) : null}

                        <div className="mt-8 border-t border-white/15">
                            {activeAlbum.tracks.map((track, index) => {
                                const playbackId = track.publicSongId ?? track.title;
                                const effectiveReleaseDate = getEffectiveReleaseDate(
                                    track,
                                    activeAlbum.releaseDate
                                );
                                const status = getReleaseStatus(effectiveReleaseDate);
                                const canOpenTrackPage = status === "released" && hasTrackPage(track);

                                return (
                                    <div
                                        key={playbackId}
                                        className="group/track grid min-h-16 grid-cols-[64px_minmax(0,1fr)] items-center gap-x-3 border-b border-white/10 py-2.5 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] sm:gap-3 sm:py-3"
                                        data-playing={currentlyPlaying === playbackId}
                                    >
                                        <div className="relative col-start-1 row-span-2 row-start-1 aspect-square overflow-hidden rounded sm:hidden">
                                            <Image
                                                src={track.songImg ?? activeAlbum.coverSrc}
                                                alt=""
                                                fill
                                                sizes="64px"
                                                className="object-cover"
                                            />
                                        </div>
                                        <div className="col-start-2 row-start-1 flex min-w-0 items-start gap-2 sm:col-start-1 sm:items-center sm:gap-3">
                                            <span className="shrink-0 text-[11px] leading-5 tabular-nums text-zinc-400 sm:w-6 sm:text-xs sm:text-zinc-600">
                                                {String(track.trackNumber ?? index + 1).padStart(2, "0")}
                                            </span>
                                            <div className="min-w-0">
                                                {canOpenTrackPage ? (
                                                    <Link
                                                        href={getArtistSongPath(artist, getTrackSlug(track))}
                                                        className="block break-words text-sm leading-5 font-semibold text-zinc-100 transition-colors group-data-[playing=true]/track:text-[var(--artist-accent-bright)] hover:text-[var(--artist-accent-bright)] sm:text-base sm:leading-normal"
                                                    >
                                                        {track.title}
                                                    </Link>
                                                ) : (
                                                    <span className="block break-words text-sm leading-5 font-semibold text-zinc-100 group-data-[playing=true]/track:text-[var(--artist-accent-bright)] sm:text-base sm:leading-normal">{track.title}</span>
                                                )}
                                                <div className="mt-1 hidden flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em] sm:flex">
                                                    {track.featured ? (
                                                        <span style={{ color: "var(--artist-accent-soft)" }}>Featured</span>
                                                    ) : null}
                                                    {currentlyPlaying === playbackId ? (
                                                        <span style={{ color: "var(--artist-accent-bright)" }}>Now playing</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {status === "released" && track.audioSrc ? (
                                            <AudioTrack
                                                id={playbackId}
                                                src={track.audioSrc}
                                                trackTitle={track.title}
                                                previewStartTime={0}
                                                projectId={artist.id}
                                                compactOnMobile
                                                className="col-start-2 row-start-2 w-full sm:row-start-1"
                                                onPlay={() => setCurrentlyPlaying(playbackId)}
                                                onPause={() => setCurrentlyPlaying((playing) =>
                                                    playing === playbackId ? null : playing
                                                )}
                                            />
                                        ) : (
                                            <p className="col-start-2 row-start-2 py-2 text-xs text-zinc-400 sm:row-start-1 sm:py-0 sm:text-right">
                                                {status === "future"
                                                    ? `Available ${formatReleaseDate(effectiveReleaseDate)}`
                                                    : status === "released" ? "Audio preview unavailable" : "Release date TBD"}
                                            </p>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
