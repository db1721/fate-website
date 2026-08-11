"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Music2, Pause, Play } from "lucide-react";
import { track } from "@vercel/analytics";
import { SocialIcons } from "@/app/components/shared/socials";
import type { SongPageData } from "@/app/config/music-data";
import { trackMetaCustomEvent } from "@/lib/meta-pixel";
import { trackInteraction } from "@/lib/track-interaction";

function hexToRgba(hex: string, alpha: number) {
    const normalized = hex.replace("#", "");
    const value = normalized.length === 3
        ? normalized.split("").map((character) => character + character).join("")
        : normalized;
    const red = Number.parseInt(value.slice(0, 2), 16);
    const green = Number.parseInt(value.slice(2, 4), 16);
    const blue = Number.parseInt(value.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${alpha})`;
}

function formatTime(seconds: number) {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainingSeconds}`;
}

function getAudioDuration(audio: HTMLAudioElement) {
    if (Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration;

    if (audio.seekable.length > 0) {
        const seekableEnd = audio.seekable.end(audio.seekable.length - 1);
        if (Number.isFinite(seekableEnd) && seekableEnd > 0) return seekableEnd;
    }

    return 0;
}

export default function MusicLandingPage({ song }: { song: SongPageData }) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const lyricsContentRef = useRef<HTMLDivElement | null>(null);
    const hasAppliedStartRef = useRef(false);
    const hasTrackedPlayRef = useRef(false);
    const hasTrackedVisitRef = useRef(false);
    const hasTrackedLyricsRef = useRef(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [lyrics, setLyrics] = useState("");
    const [lyricsExpanded, setLyricsExpanded] = useState(false);
    const [lyricsMaxHeight, setLyricsMaxHeight] = useState("15rem");

    const syncDuration = () => {
        const audio = audioRef.current;
        if (!audio) return;

        const nextDuration = getAudioDuration(audio);
        if (nextDuration > 0) setDuration(nextDuration);
    };

    useEffect(() => {
        if (hasTrackedVisitRef.current) return;
        hasTrackedVisitRef.current = true;

        void trackInteraction({
            song: song.slug,
            project: song.projectId,
            action: "song_page_visited",
        });
    }, [song.projectId, song.slug]);

    useEffect(() => {
        let cancelled = false;

        async function loadLyrics() {
            if (!song.lyricsFile) {
                setLyrics("");
                return;
            }

            try {
                const response = await fetch(song.lyricsFile);
                if (!response.ok) throw new Error("Failed to load lyrics");
                const text = await response.text();
                if (!cancelled) setLyrics(text);
            } catch (error) {
                console.error("Could not load lyrics", error);
                if (!cancelled) setLyrics("");
            }
        }

        void loadLyrics();
        return () => {
            cancelled = true;
        };
    }, [song.lyricsFile]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        hasAppliedStartRef.current = false;
        hasTrackedPlayRef.current = false;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        let durationReady = false;
        const updateDuration = () => {
            const nextDuration = getAudioDuration(audio);
            if (nextDuration > 0) {
                durationReady = true;
                setDuration(nextDuration);
            }
        };
        const updateTime = () => {
            updateDuration();
            setCurrentTime(audio.currentTime || 0);
        };
        const handleEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
            track("song_preview_complete", {
                song: song.slug,
                project: song.projectId,
                duration: Math.floor(audio.duration || 0),
            });
            trackMetaCustomEvent("MusicPreviewComplete", {
                content_name: song.slug,
                content_category: "music",
                content_ids: [`${song.projectId}:${song.slug}`],
                content_type: "music",
                project: song.projectId,
                duration: Math.floor(audio.duration || 0),
            });
        };

        audio.addEventListener("loadedmetadata", updateDuration);
        audio.addEventListener("durationchange", updateDuration);
        audio.addEventListener("loadeddata", updateDuration);
        audio.addEventListener("canplay", updateDuration);
        audio.addEventListener("timeupdate", updateTime);
        audio.addEventListener("ended", handleEnded);
        audio.load();
        updateDuration();

        const metadataPoll = window.setInterval(() => {
            updateDuration();
            if (durationReady) window.clearInterval(metadataPoll);
        }, 250);
        const metadataTimeout = window.setTimeout(() => window.clearInterval(metadataPoll), 6000);

        return () => {
            audio.removeEventListener("loadedmetadata", updateDuration);
            audio.removeEventListener("durationchange", updateDuration);
            audio.removeEventListener("loadeddata", updateDuration);
            audio.removeEventListener("canplay", updateDuration);
            audio.removeEventListener("timeupdate", updateTime);
            audio.removeEventListener("ended", handleEnded);
            window.clearInterval(metadataPoll);
            window.clearTimeout(metadataTimeout);
        };
    }, [song.previewUrl, song.projectId, song.slug]);

    useEffect(() => {
        if (!lyricsContentRef.current) return;
        setLyricsMaxHeight(lyricsExpanded ? `${lyricsContentRef.current.scrollHeight}px` : "15rem");
    }, [lyrics, lyricsExpanded]);

    async function togglePlay() {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (audio.paused) {
                if (!hasAppliedStartRef.current) {
                    audio.currentTime = song.previewStartTime ?? 0;
                    hasAppliedStartRef.current = true;
                    setCurrentTime(audio.currentTime);
                }

                syncDuration();
                await audio.play();
                setIsPlaying(true);

                if (!hasTrackedPlayRef.current) {
                    hasTrackedPlayRef.current = true;
                    await trackInteraction({
                        song: song.slug,
                        project: song.projectId,
                        action: "preview_play",
                    });
                }
            } else {
                audio.pause();
                setIsPlaying(false);
                track("song_preview_pause", {
                    song: song.slug,
                    project: song.projectId,
                    current_time: Math.floor(audio.currentTime),
                });
                trackMetaCustomEvent("MusicPreviewPause", {
                    content_name: song.slug,
                    content_category: "music",
                    content_ids: [`${song.projectId}:${song.slug}`],
                    content_type: "music",
                    project: song.projectId,
                    current_time: Math.floor(audio.currentTime),
                });
            }
        } catch (error) {
            console.error("Audio playback failed", error);
        }
    }

    function seek(nextTime: number) {
        const audio = audioRef.current;
        if (!audio) return;

        const availableDuration = duration || getAudioDuration(audio);
        if (!availableDuration) return;

        const clampedTime = Math.max(0, Math.min(nextTime, availableDuration));
        audio.currentTime = clampedTime;
        setCurrentTime(clampedTime);
        setDuration(availableDuration);
    }

    function toggleLyrics() {
        const nextExpanded = !lyricsExpanded;
        setLyricsExpanded(nextExpanded);

        if (nextExpanded && !hasTrackedLyricsRef.current) {
            hasTrackedLyricsRef.current = true;
            void trackInteraction({
                song: song.slug,
                project: song.projectId,
                action: "lyrics_review",
            });
        }
    }

    const hasStreamingLinks = Boolean(song.songServiceLinks?.length);

    return (
        <main
            className="relative min-h-screen overflow-hidden text-white"
            style={{ backgroundColor: song.theme.background }}
        >
            <div className="pointer-events-none absolute inset-0 -z-20">
                <Image
                    src={song.coverImage}
                    alt=""
                    fill
                    priority
                    className="scale-110 object-cover opacity-[0.14] grayscale"
                />
            </div>
            <div
                className="pointer-events-none absolute inset-0 -z-10"
                style={{
                    background: `linear-gradient(90deg, ${song.theme.background} 0%, ${hexToRgba(song.theme.background, 0.9)} 48%, ${hexToRgba(song.theme.accent, 0.24)} 100%), linear-gradient(180deg, ${hexToRgba(song.theme.background, 0.7)} 0%, ${song.theme.background} 100%)`,
                }}
            />
            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.05]" />

            <div className="relative z-20 mx-auto flex max-w-7xl px-4 pt-5 sm:px-8 lg:px-10">
                <Link
                    href={song.homePath}
                    className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-black/35 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/75 backdrop-blur transition hover:border-white/35 hover:text-white"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to {song.artist}
                </Link>
            </div>

            <section className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-10 sm:px-8 lg:grid-cols-[1fr_0.86fr] lg:gap-16 lg:px-10">
                <div className="order-2 lg:order-1">
                    <p
                        className="text-xs font-black uppercase tracking-[0.32em]"
                        style={{ color: song.theme.accentBright }}
                    >
                        {song.artist}
                    </p>
                    <h1 className="mt-4 max-w-3xl text-4xl font-black uppercase leading-[0.95] tracking-normal sm:text-6xl lg:text-7xl">
                        {song.title}
                    </h1>
                    <div className="mt-5 flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/50">
                        {song.tagline ? <span>{song.tagline}</span> : null}
                        {song.releaseLabel ? <span>{song.releaseLabel}</span> : null}
                    </div>
                    {song.subtitle ? (
                        <p className="mt-5 max-w-2xl text-base leading-7 text-white/70 sm:text-lg">
                            {song.subtitle}
                        </p>
                    ) : null}

                    <div className="mt-8 border-y border-white/15 py-6">
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.26em] text-white/40">
                            {hasStreamingLinks ? "Choose your platform" : "Streaming release"}
                        </p>
                        {hasStreamingLinks ? (
                            <div className="max-w-lg">
                                <SocialIcons
                                    SocialLinkData={song.songServiceLinks}
                                    SongSlug={song.slug}
                                    ProjectId={song.projectId}
                                />
                            </div>
                        ) : song.spotifyUrl ? (
                            <a
                                href={song.spotifyUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex rounded-md px-5 py-2.5 text-sm font-black uppercase tracking-[0.14em] transition hover:-translate-y-0.5"
                                style={{
                                    backgroundColor: song.theme.accentBright,
                                    color: song.theme.buttonText,
                                }}
                                onClick={() => void trackInteraction({
                                    song: song.slug,
                                    project: song.projectId,
                                    action: "service_click",
                                    service: "streaming_link",
                                })}
                            >
                                Open streaming link
                            </a>
                        ) : (
                            <p className="text-sm leading-6 text-white/60">
                                Project-specific streaming links will appear here when the single is released.
                            </p>
                        )}
                    </div>

                    {lyrics ? (
                        <div className="mt-8 border-b border-white/15 pb-8">
                            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-white/45">
                                <Music2 className="h-4 w-4" />
                                Lyrics
                            </div>
                            <div
                                className="mt-4 overflow-hidden transition-[max-height] duration-500 ease-in-out"
                                style={{
                                    maxHeight: lyricsMaxHeight,
                                    WebkitMaskImage: lyricsExpanded
                                        ? undefined
                                        : "linear-gradient(to bottom, black 72%, transparent 100%)",
                                    maskImage: lyricsExpanded
                                        ? undefined
                                        : "linear-gradient(to bottom, black 72%, transparent 100%)",
                                }}
                            >
                                <div
                                    ref={lyricsContentRef}
                                    className="whitespace-pre-line text-sm leading-7 text-white/75 sm:text-base"
                                >
                                    {lyrics}
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={toggleLyrics}
                                className="mt-4 rounded-md border border-white/15 bg-white/5 px-4 py-2 text-sm font-semibold text-white/80 transition hover:border-white/35 hover:bg-white/10"
                            >
                                {lyricsExpanded ? "Show less" : "Read full lyrics"}
                            </button>
                        </div>
                    ) : null}
                </div>

                <div className="order-1 lg:order-2">
                    <div className="mx-auto w-full max-w-lg">
                        <div
                            className="relative aspect-square overflow-hidden rounded-md border bg-black shadow-[0_30px_100px_rgba(0,0,0,0.55)]"
                            style={{ borderColor: song.theme.border }}
                        >
                            <Image
                                src={song.coverImage}
                                alt={`${song.title} cover art`}
                                fill
                                priority
                                sizes="(min-width: 1024px) 42vw, 92vw"
                                className="object-cover"
                            />
                            <button
                                type="button"
                                onClick={togglePlay}
                                aria-label={isPlaying ? "Pause preview" : "Play preview"}
                                className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-black/60 text-white shadow-2xl backdrop-blur transition hover:scale-105 sm:h-20 sm:w-20"
                            >
                                {isPlaying
                                    ? <Pause className="h-7 w-7" fill="currentColor" />
                                    : <Play className="ml-1 h-7 w-7" fill="currentColor" />}
                            </button>
                        </div>

                        <div className="mt-4 rounded-md border border-white/15 bg-black/55 p-4 backdrop-blur">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-xs font-black uppercase tracking-[0.18em] text-white/70">
                                    {song.previewStartLabel ?? "Preview"}
                                </p>
                                <p className="shrink-0 text-xs tabular-nums text-white/55">
                                    {formatTime(currentTime)} / {formatTime(duration)}
                                </p>
                            </div>
                            <input
                                type="range"
                                aria-label={`Seek ${song.title}`}
                                min={0}
                                max={duration || 0}
                                step={0.1}
                                value={currentTime}
                                onChange={(event) => seek(Number(event.target.value))}
                                onInput={(event) => seek(Number(event.currentTarget.value))}
                                className="mt-4 h-1.5 w-full cursor-pointer"
                                style={{ accentColor: song.theme.accentBright }}
                            />
                            <audio ref={audioRef} src={song.previewUrl} preload="metadata" playsInline />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
