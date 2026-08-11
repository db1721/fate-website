"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, ChevronLeft, ChevronRight, Disc3, Star } from "lucide-react";
import { AudioTrack } from "@/app/components/audio-track";
import { getArtistSongPath } from "@/app/config/artists";
import type { ArtistConfig, TrackData } from "@/app/config/artists/types";
import { slugify } from "@/lib/utils";

function parseReleaseDate(dateString: string) {
    const match = dateString.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (match) {
        const [, month, day, year] = match;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    return new Date(dateString);
}

function getReleaseStatus(dateString: string): "released" | "future" | "tbd" {
    if (!dateString.trim()) return "tbd";

    const date = parseReleaseDate(dateString);
    if (Number.isNaN(date.getTime())) return "tbd";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date > today ? "future" : "released";
}

function formatReleaseDate(dateString: string) {
    const date = parseReleaseDate(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function hasTrackPage(track: TrackData) {
    return Boolean(
        track.featured ||
        track.lyricsFile ||
        track.songServiceLinks?.length ||
        track.single_link_share
    );
}

function getEffectiveReleaseDate(track: TrackData, albumReleaseDate?: string) {
    return track.releaseDate?.trim() || albumReleaseDate?.trim() || "";
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
                        {artist.musicSection.emptyTitle}
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                        {artist.musicSection.emptyDescription}
                    </p>
                </div>
            </section>
        );
    }

    const albumReleaseDate = activeAlbum.releaseDate
        ? formatReleaseDate(activeAlbum.releaseDate)
        : null;
    const highlightSlug = activeAlbum.highlightTrack
        ? slugify(activeAlbum.highlightTrack)
        : null;

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
                            <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-300">
                                {activeAlbum.description}
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
                            </div>
                        ) : null}

                        <div className="mt-8 border-t border-white/15">
                            {activeAlbum.tracks.map((track, index) => {
                                const effectiveReleaseDate = getEffectiveReleaseDate(
                                    track,
                                    activeAlbum.releaseDate
                                );
                                const status = getReleaseStatus(effectiveReleaseDate);
                                const canOpenTrackPage = hasTrackPage(track);

                                return (
                                    <div
                                        key={track.title}
                                        className="grid min-h-16 items-center gap-3 border-b border-white/10 py-3 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)]"
                                    >
                                        <div className="flex min-w-0 items-center gap-3">
                                            <span className="w-6 shrink-0 text-xs tabular-nums text-zinc-600">
                                                {String(index + 1).padStart(2, "0")}
                                            </span>
                                            <div className="min-w-0">
                                                {canOpenTrackPage ? (
                                                    <Link
                                                        href={getArtistSongPath(artist, slugify(track.title))}
                                                        className="font-semibold text-zinc-100 transition-colors hover:text-[var(--artist-accent-bright)]"
                                                    >
                                                        {track.title}
                                                    </Link>
                                                ) : (
                                                    <span className="font-semibold text-zinc-100">{track.title}</span>
                                                )}
                                                <div className="mt-1 flex flex-wrap items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                                                    {track.featured ? (
                                                        <span style={{ color: "var(--artist-accent-soft)" }}>Featured</span>
                                                    ) : null}
                                                    {currentlyPlaying === track.title ? (
                                                        <span style={{ color: "var(--artist-accent-bright)" }}>Now playing</span>
                                                    ) : null}
                                                </div>
                                            </div>
                                        </div>

                                        {status === "released" ? (
                                            <AudioTrack
                                                id={track.title}
                                                src={track.audioSrc}
                                                projectId={artist.id}
                                                className="w-full"
                                                onPlay={() => setCurrentlyPlaying(track.title)}
                                                onPause={() => setCurrentlyPlaying((playing) =>
                                                    playing === track.title ? null : playing
                                                )}
                                            />
                                        ) : (
                                            <p className="text-xs text-zinc-400 sm:text-right">
                                                {status === "future"
                                                    ? `Available ${formatReleaseDate(effectiveReleaseDate)}`
                                                    : "Release date TBD"}
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
