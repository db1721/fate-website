"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { COLORS } from "@/app/theme";
import bandInfo from "@/app/config/fate-info";
import { AudioTrack } from "@/app/components/audio-track";
import { slugify } from "@/lib/utils";

type Track = {
    title: string;
    audioSrc: string;
    releaseDate: string;
    songServiceLinks?: unknown[];
    single_link_share?: string;
};

function getReleaseStatus(dateString: string): "released" | "future" | "tbd" {
    if (!dateString || dateString.trim() === "") {
        return "tbd";
    }

    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return "tbd";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    return date > today ? "future" : "released";
}

function formatReleaseDate(dateString: string): string {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

function hasTrackPage(track: Track) {
    return Boolean(track.songServiceLinks?.length || track.single_link_share);
}

export function AlbumsSection() {
    const [activeIndex, setActiveIndex] = useState(0);
    const [currentlyPlaying, setCurrentlyPlaying] = useState<string | null>(null);
    const activeAlbum = bandInfo.ALBUMS[activeIndex];

    const prevAlbum = () => {
        setActiveIndex((idx) =>
            idx === 0 ? bandInfo.ALBUMS.length - 1 : idx - 1
        );
    };

    const nextAlbum = () => {
        setActiveIndex((idx) =>
            idx === bandInfo.ALBUMS.length - 1 ? 0 : idx + 1
        );
    };

    return (
        <section
            id="albums"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{
                backgroundImage: `radial-gradient(circle at right, rgba(245,179,1,0.13) 0, transparent 32%), radial-gradient(circle at left, ${COLORS.accent} 0, #000 58%)`,
            }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <div className="flex items-center justify-between gap-4">
                    <div className="max-w-2xl">
                        <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                            Music
                        </h2>
                        <p className="mt-3 text-2xl font-black uppercase tracking-wide text-zinc-50 sm:text-3xl">
                            Singles, lyrics, and previews
                        </p>
                        <p className="mt-3 text-sm leading-6 text-zinc-400 sm:text-base">
                            Press play, find the songs that hit, then open the dedicated track pages for lyrics and full streaming links.
                        </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                        <button
                            onClick={prevAlbum}
                            aria-label="Previous album"
                            className="flex h-12 w-12 items-center justify-center rounded-full transition hover:-translate-y-0.5"
                            style={{ backgroundColor: COLORS.surface }}
                        >
                            <ChevronLeft className="h-5 w-5" />
                        </button>
                        <button
                            onClick={nextAlbum}
                            aria-label="Next album"
                            className="flex h-12 w-12 items-center justify-center rounded-full transition hover:-translate-y-0.5"
                            style={{ backgroundColor: COLORS.surface }}
                        >
                            <ChevronRight className="h-5 w-5" />
                        </button>
                    </div>
                </div>

                <div className="flex items-center justify-center gap-3">
                    {bandInfo.ALBUMS.map((album, index) => {
                        const isActive = index === activeIndex;

                        return (
                            <button
                                key={album.id}
                                onClick={() => setActiveIndex(index)}
                                aria-label={`Go to album ${index + 1}`}
                                aria-current={isActive ? "true" : "false"}
                                className={[
                                    "flex items-center justify-center rounded-full",
                                    "transition-all duration-200 ease-out",
                                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black",
                                    isActive ? "scale-110" : "opacity-60 hover:opacity-90",
                                ].join(" ")}
                                style={{
                                    width: isActive ? 42 : 32,
                                    height: isActive ? 42 : 32,
                                    backgroundColor: isActive ? "#f5b301" : COLORS.surface,
                                    border: `1px solid ${isActive ? "#f5b301" : COLORS.border}`,
                                    color: isActive ? "#000" : "#fff",
                                    fontWeight: isActive ? 700 : 500,
                                }}
                            >
                                {index + 1}
                            </button>
                        );
                    })}
                </div>

                <div className="flex flex-col gap-6 rounded-lg border border-white/10 bg-black/35 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.32)] sm:flex-row sm:p-6">
                    <div
                        className="relative h-44 w-44 shrink-0 overflow-hidden rounded-lg sm:h-56 sm:w-56"
                        style={{
                            backgroundColor: COLORS.surface,
                            border: `1px solid ${COLORS.border}`,
                        }}
                    >
                        <Image
                            src={activeAlbum.coverSrc}
                            alt={`${activeAlbum.title} cover art`}
                            fill
                            sizes="224px"
                            className="object-cover"
                        />
                    </div>

                    <div className="flex flex-1 flex-col gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                                {activeAlbum.year}
                            </p>
                            <h3 className="mt-1 text-2xl font-black uppercase tracking-wide">
                                {activeAlbum.title}
                            </h3>
                            <p className="mt-2 text-sm text-zinc-300">
                                {activeAlbum.description}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {activeAlbum.tracks.map((track: Track) => {
                                const status = getReleaseStatus(track.releaseDate);
                                const canOpenTrackPage = hasTrackPage(track);

                                return (
                                    <div
                                        key={track.title}
                                        className="flex flex-col gap-2 rounded-md border border-white/10 bg-white/[0.03] px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                                    >
                                        {canOpenTrackPage ? (
                                            <Link
                                                href={`/music/${slugify(track.title)}`}
                                                className="group inline-flex items-center gap-2 font-medium text-zinc-100 transition-colors hover:text-[#f5b301]"
                                            >
                                                <span>{track.title}</span>
                                                {currentlyPlaying === track.title && (
                                                    <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-[0.16em] text-[#f5b301] opacity-90 animate-fadeIn">
                                                        <span className="inline-block animate-[streamNudge_1s_ease-in-out_infinite]">
                                                            &lt;-
                                                        </span>
                                                        <span>Stream here</span>
                                                    </span>
                                                )}
                                            </Link>
                                        ) : (
                                            <span className="font-medium text-zinc-100">
                                                {track.title}
                                            </span>
                                        )}

                                        {status === "released" ? (
                                            <div className="w-full sm:w-auto sm:max-w-xs">
                                                <AudioTrack
                                                    id={track.title}
                                                    src={track.audioSrc}
                                                    className="w-full"
                                                    onPlay={() => setCurrentlyPlaying(track.title)}
                                                    onPause={() =>
                                                        setCurrentlyPlaying((prev) =>
                                                            prev === track.title ? null : prev
                                                        )
                                                    }
                                                />
                                            </div>
                                        ) : (
                                            <span className="mt-1 text-xs text-zinc-300 sm:mt-0 sm:w-64">
                                                {status === "future"
                                                    ? `Planned release date ${formatReleaseDate(track.releaseDate)}`
                                                    : "Release date TBD"}
                                            </span>
                                        )}
                                    </div>
                                );
                            })}
                        </div>

                        <div className="mt-2 flex items-center justify-between sm:hidden">
                            <button
                                onClick={prevAlbum}
                                className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
                                style={{ backgroundColor: COLORS.surface }}
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-2">
                                {bandInfo.ALBUMS.map((album, index) => (
                                    <button
                                        key={album.id}
                                        aria-label={`Go to album ${index + 1}`}
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-2 w-2 rounded-full ${
                                            index === activeIndex ? "scale-125" : "opacity-50"
                                        }`}
                                        style={{
                                            backgroundColor:
                                                index === activeIndex ? "#f5b301" : COLORS.textMuted,
                                        }}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={nextAlbum}
                                className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
                                style={{ backgroundColor: COLORS.surface }}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
