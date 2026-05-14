"use client";

import {useEffect, useMemo, useRef, useState} from "react";
import Image, {type StaticImageData} from "next/image";
import Link from "next/link";
import {Vibrant} from "node-vibrant/browser";
import {
    Music2,
    Pause,
    Play,
} from "lucide-react";
import {SocialIcons} from "@/app/components/shared/socials";
import {track} from "@vercel/analytics";
import {trackInteraction} from "@/lib/track-interaction";
import { trackMetaCustomEvent } from "@/lib/meta-pixel";
import type { SongPageData } from "@/app/config/music-data";

type MusicLandingPageProps = {
    song: SongPageData;
};

type ThemePalette = {
    primary: string;
    secondary: string;
    dark: string;
    border: string;
    textSoft: string;
};

const FALLBACK_PALETTE: ThemePalette = {
    primary: "#2563eb",
    secondary: "#7c3aed",
    dark: "#050505",
    border: "rgba(255,255,255,0.14)",
    textSoft: "rgba(255,255,255,0.72)",
};

function getImageSrc(src: string | StaticImageData): string {
    return typeof src === "string" ? src : src.src;
}

function hexToRgb(hex: string) {
    const clean = hex.replace("#", "");
    const normalized =
        clean.length === 3
            ? clean
                .split("")
                .map((char) => char + char)
                .join("")
            : clean;

    return {
        r: parseInt(normalized.slice(0, 2), 16),
        g: parseInt(normalized.slice(2, 4), 16),
        b: parseInt(normalized.slice(4, 6), 16),
    };
}

function getLuminance(hex: string) {
    const { r, g, b } = hexToRgb(hex);
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function hexToRgba(hex: string, alpha: number): string {
    const clean = hex.replace("#", "");
    const normalized =
        clean.length === 3
            ? clean
                .split("")
                .map((char) => char + char)
                .join("")
            : clean;

    const r = parseInt(normalized.slice(0, 2), 16);
    const g = parseInt(normalized.slice(2, 4), 16);
    const b = parseInt(normalized.slice(4, 6), 16);

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

function lightenColor(hex: string, amount: number) {
    const { r, g, b } = hexToRgb(hex);

    const lighten = (value: number) =>
        Math.min(255, Math.round(value + (255 - value) * amount));

    const nr = lighten(r).toString(16).padStart(2, "0");
    const ng = lighten(g).toString(16).padStart(2, "0");
    const nb = lighten(b).toString(16).padStart(2, "0");

    return `#${nr}${ng}${nb}`;
}

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function getAudioDuration(audio: HTMLAudioElement): number {
    if (Number.isFinite(audio.duration) && audio.duration > 0) {
        return audio.duration;
    }

    if (audio.seekable.length > 0) {
        const seekableEnd = audio.seekable.end(audio.seekable.length - 1);
        if (Number.isFinite(seekableEnd) && seekableEnd > 0) {
            return seekableEnd;
        }
    }

    return 0;
}

function FloatingOrb({
                         className,
                         color,
                     }: {
    className: string;
    color: string;
}) {
    return (
        <div
            className={`pointer-events-none absolute rounded-full blur-3xl ${className}`}
            style={{background: color}}
        />
    );
}

export default function MusicLandingPage({song}: MusicLandingPageProps) {
    const imageSrc = useMemo(() => getImageSrc(song.coverImage), [song.coverImage]);
    const [palette, setPalette] = useState<ThemePalette>(FALLBACK_PALETTE);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasAppliedInitialStartRef = useRef(false);
    const hasTrackedPlayRef = useRef(false);

    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    const [lyrics, setLyrics] = useState<string>("");
    const [lyricsExpanded, setLyricsExpanded] = useState(false);
    const [lyricsMaxHeight, setLyricsMaxHeight] = useState("14rem");
    const lyricsContentRef = useRef<HTMLDivElement | null>(null);
    const hasTrackedLyricsRef = useRef(false);
    const hasTracked = useRef(false);

    useEffect(() => {
        if (hasTracked.current) return;
        hasTracked.current = true;

        trackInteraction({
            song: song.slug,
            action: "song_page_visited",
        });
    }, []);

    useEffect(() => {
        if (!lyricsContentRef.current) return;

        if (lyricsExpanded) {
            setLyricsMaxHeight(`${lyricsContentRef.current.scrollHeight}px`);
        } else {
            setLyricsMaxHeight("14rem");
        }
    }, [lyricsExpanded, lyrics]);

    useEffect(() => {
        if (lyricsExpanded && !hasTrackedLyricsRef.current) {
            hasTrackedLyricsRef.current = true;

            trackInteraction({
                song: song.slug,
                action: "lyrics_review",
            });
        }
    }, [lyricsExpanded, song.slug]);

    useEffect(() => {
        async function loadLyrics() {
            if (!song.lyricsFile) {
                setLyrics("");
                return;
            }

            try {
                const res = await fetch(song.lyricsFile);
                if (!res.ok) throw new Error("Failed to load lyrics");
                const text = await res.text();
                setLyrics(text);
            } catch (error) {
                console.error("Could not load lyrics", error);
                setLyrics("");
            }
        }

        loadLyrics();
    }, [song.lyricsFile]);

    useEffect(() => {
        let cancelled = false;

        async function extractPalette() {
            try {
                const result = await Vibrant.from(imageSrc).getPalette();

                if (cancelled) return;

                const swatches = [
                    result.LightVibrant?.hex,
                    result.Vibrant?.hex,
                    result.LightMuted?.hex,
                    result.Muted?.hex,
                    result.DarkVibrant?.hex,
                    result.DarkMuted?.hex,
                ].filter(Boolean) as string[];

                const brightSwatches = swatches.filter((hex) => getLuminance(hex) > 120);
                const usableSwatches = brightSwatches.length ? brightSwatches : swatches;

                const sortedByLightness = [...usableSwatches].sort(
                    (a, b) => getLuminance(b) - getLuminance(a)
                );

                const primary = lightenColor(
                    sortedByLightness[0] || FALLBACK_PALETTE.primary,
                    0.18
                );

                const secondary = lightenColor(
                    sortedByLightness[1] || FALLBACK_PALETTE.secondary,
                    0.1
                );

                const dark = result.DarkMuted?.hex || result.DarkVibrant?.hex || FALLBACK_PALETTE.dark;
                setPalette({
                    primary,
                    secondary,
                    dark,
                    border: hexToRgba(primary, 0.28),
                    textSoft: hexToRgba(secondary, 0.78),
                });
            } catch (error) {
                console.error("Failed to extract palette", error);
                if (!cancelled) {
                    setPalette(FALLBACK_PALETTE);
                }
            }
        }

        extractPalette();

        return () => {
            cancelled = true;
        };
    }, [imageSrc]);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        let durationReady = false;
        const syncDuration = () => {
            const nextDuration = getAudioDuration(audio);
            if (nextDuration > 0) {
                durationReady = true;
                setDuration(nextDuration);
            }
        };
        const onTimeUpdate = () => {
            syncDuration();
            setCurrentTime(audio.currentTime || 0);
        };
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);

            track("song_preview_complete", {
                song: song.slug,
                title: song.title,
                duration: Math.floor(audio.duration || 0),
            });
            trackMetaCustomEvent("MusicPreviewComplete", {
                content_name: song.slug,
                content_category: "music",
                content_ids: [song.slug],
                content_type: "music",
                duration: Math.floor(audio.duration || 0),
            });
        };

        audio.addEventListener("loadedmetadata", syncDuration);
        audio.addEventListener("durationchange", syncDuration);
        audio.addEventListener("loadeddata", syncDuration);
        audio.addEventListener("canplay", syncDuration);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);
        audio.load();
        syncDuration();
        const metadataPoll = window.setInterval(() => {
            syncDuration();
            if (durationReady) {
                window.clearInterval(metadataPoll);
            }
        }, 250);
        const metadataTimeout = window.setTimeout(() => {
            window.clearInterval(metadataPoll);
        }, 6000);

        return () => {
            audio.removeEventListener("loadedmetadata", syncDuration);
            audio.removeEventListener("durationchange", syncDuration);
            audio.removeEventListener("loadeddata", syncDuration);
            audio.removeEventListener("canplay", syncDuration);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
            window.clearInterval(metadataPoll);
            window.clearTimeout(metadataTimeout);
        };
    }, [song.slug, song.title]);

    async function togglePlay() {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (audio.paused) {
                if (!hasAppliedInitialStartRef.current) {
                    audio.currentTime = song.previewStartTime ?? 0;
                    hasAppliedInitialStartRef.current = true;
                    setCurrentTime(audio.currentTime);
                }

                const nextDuration = getAudioDuration(audio);
                if (nextDuration > 0) {
                    setDuration(nextDuration);
                }

                await audio.play();
                setIsPlaying(true);

                if (!hasTrackedPlayRef.current) {
                    await trackInteraction({
                        song: song.slug,
                        action: "preview_play",
                    });
                    hasTrackedPlayRef.current = true;
                }
            } else {
                audio.pause();
                setIsPlaying(false);

                track("song_preview_pause", {
                    song: song.slug,
                    title: song.title,
                    current_time: Math.floor(audio.currentTime),
                });
                trackMetaCustomEvent("MusicPreviewPause", {
                    content_name: song.slug,
                    content_category: "music",
                    content_ids: [song.slug],
                    content_type: "music",
                    current_time: Math.floor(audio.currentTime),
                });
            }
        } catch (error) {
            console.error("Audio playback failed", error);
        }
    }

    useEffect(() => {
        hasAppliedInitialStartRef.current = false;
        hasTrackedPlayRef.current = false;
        setIsPlaying(false);
        setCurrentTime(0);
        setDuration(0);

        const audio = audioRef.current;
        if (audio) {
            audio.pause();
            audio.load();
        }
    }, [song.slug]);

    function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
        const audio = audioRef.current;
        if (!audio) return;

        const availableDuration = duration || getAudioDuration(audio);
        if (!availableDuration) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const nextTime = Math.max(0, Math.min(availableDuration, percent * availableDuration));

        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
        setDuration(availableDuration);
    }

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
    const streamingPrompt = song.songServiceLinks?.length
        ? "Stream or save on your platform"
        : "Follow for the release";

    return (
        <main className="relative min-h-screen overflow-hidden text-white">
            <div className="absolute inset-0 -z-30">
                <Image
                    src={song.coverImage}
                    alt=""
                    fill
                    priority
                    className="object-cover scale-125 blur-[140px] opacity-60"
                />
            </div>

            <div
                className="absolute inset-0 -z-20"
                style={{
                    background: `
            radial-gradient(circle at top left, ${hexToRgba(palette.primary, 0.45)} 0%, transparent 34%),
            radial-gradient(circle at top right, ${hexToRgba(palette.secondary, 0.28)} 0%, transparent 28%),
            radial-gradient(circle at bottom center, ${hexToRgba(palette.primary, 0.16)} 0%, transparent 35%),
            linear-gradient(to bottom, ${hexToRgba(palette.dark, 0.92)}, #020202)
          `,
                }}
            />

            {song.backgroundVideoUrl ? (
                <div className="absolute inset-0 -z-10 overflow-hidden">
                    <video
                        className="h-full w-full object-cover opacity-14 mix-blend-screen"
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                    >
                        <source src={song.backgroundVideoUrl}/>
                    </video>
                    <div className="absolute inset-0 bg-black/35"/>
                </div>
            ) : null}

            <FloatingOrb
                className="left-[-8rem] top-[-5rem] h-72 w-72"
                color={hexToRgba(palette.primary, 0.3)}
            />
            <FloatingOrb
                className="right-[-6rem] top-[10rem] h-80 w-80"
                color={hexToRgba(palette.secondary, 0.24)}
            />
            <FloatingOrb
                className="bottom-[-8rem] left-1/2 h-96 w-96 -translate-x-1/2"
                color={hexToRgba(palette.primary, 0.14)}
            />

            <div
                className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.06]"/>

            <div className="relative z-20 mx-auto flex w-full max-w-7xl px-4 pt-5 sm:px-6 sm:pt-6 lg:px-8">
                <Link
                    href="/"
                    className="rounded-full border border-white/10 bg-black/30 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white/70 backdrop-blur transition hover:border-white/25 hover:text-white"
                >
                    Back to F.A.T.E.
                </Link>
            </div>

            <section
                className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl items-start px-4 py-6 sm:px-6 sm:py-8 lg:items-center lg:px-8">
                <div className="grid w-full items-start gap-5 sm:gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
                    <div className="order-1 lg:order-2">
                        <div
                            className="relative mx-auto w-full max-w-[300px] sm:max-w-[340px] md:max-w-[380px] lg:max-w-xl">
                            <div
                                className="absolute inset-0 rounded-[32px] blur-2xl"
                                style={{
                                    background: `radial-gradient(circle at top, ${hexToRgba(palette.primary, 0.3)}, transparent 58%)`,
                                }}
                            />
                            <div
                                className="relative overflow-hidden rounded-[24px] p-2.5 shadow-[0_28px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:rounded-[30px] sm:p-3 lg:rounded-[36px] lg:p-4 lg:pt-4"
                                style={{
                                    border: `1px solid ${palette.border}`,
                                    background: `linear-gradient(135deg, ${hexToRgba(palette.primary, 0.1)}, rgba(255,255,255,0.05))`,
                                }}
                            >
                                <div
                                    className="relative overflow-hidden rounded-[20px] sm:rounded-[24px] lg:rounded-[28px]"
                                    style={{
                                        border: `1px solid ${palette.border}`,
                                        boxShadow: `0 18px 60px ${hexToRgba(palette.primary, 0.22)}`,
                                    }}
                                >
                                    <Image
                                        src={song.coverImage}
                                        alt={`${song.title} cover art`}
                                        width={1000}
                                        height={1000}
                                        className="aspect-square h-full w-full object-cover"
                                        priority
                                    />

                                    <div
                                        className="absolute inset-0 bg-gradient-to-t from-black/45 via-black/5 to-transparent"/>

                                    <button
                                        type="button"
                                        aria-label={isPlaying ? "Pause preview" : "Play preview"}
                                        onClick={togglePlay}
                                        className="absolute left-1/2 top-[42%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-2xl backdrop-blur-xl transition hover:scale-105 sm:top-1/2 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9" fill="currentColor"/>
                                        ) : (
                                            <Play className="ml-0.5 h-5 w-5 sm:ml-1 sm:h-7 sm:w-7 lg:h-9 lg:w-9"
                                                  fill="currentColor"/>
                                        )}
                                    </button>

                                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">
                                        <div className="mb-2 sm:mb-3">
                                            {/*<p className="text-[10px] uppercase tracking-[0.24em] text-white/55 sm:text-[11px] lg:text-xs">*/}
                                            {/*    {song.artist ?? "F.A.T.E."}*/}
                                            {/*</p>*/}
                                            {/*<p className="mt-1 text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">*/}
                                            {/*    {song.title}*/}
                                            {/*</p>*/}
                                        </div>

                                        <div
                                            className="rounded-xl px-2.5 py-2.5 backdrop-blur-xl sm:rounded-2xl sm:px-3 sm:py-3"
                                            style={{
                                                border: `1px solid ${hexToRgba(palette.secondary, 0.2)}`,
                                                background: hexToRgba(palette.dark, 0.38),
                                            }}
                                        >
                                            <div
                                                className="mb-2 flex items-center justify-between text-[9px] uppercase tracking-[0.16em] text-white/60 sm:text-[11px] lg:text-xs">
                                                <span>{song.previewStartLabel ?? song.title}</span>
                                                <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
                                            </div>

                                            <div
                                                role="button"
                                                tabIndex={0}
                                                onClick={handleSeek}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                className="h-1 overflow-hidden rounded-full bg-white/15 sm:h-1.5"
                                            >
                                                <div
                                                    className="h-full rounded-full"
                                                    style={{
                                                        width: `${progressPercent}%`,
                                                        background: `linear-gradient(90deg, ${palette.primary}, ${palette.secondary})`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <audio ref={audioRef} preload="metadata" playsInline className="hidden">
                                    <source src={song.previewUrl} type="audio/mpeg"/>
                                    Your browser does not support the audio element.
                                </audio>
                            </div>

                            {/*<div className="mt-3 flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/35 sm:mt-4 sm:text-xs sm:tracking-[0.28em]">*/}
                            {/*    <span>fatemusicofficial.com</span>*/}
                            {/*    <span>•</span>*/}
                            {/*    <span>/music/{song.slug}</span>*/}
                            {/*</div>*/}
                        </div>

                        {/* Mobile CTA */}
                        <div className="mt-4 flex justify-center lg:hidden">
                            <span
                                className="inline-block rounded-full px-4 py-1.5 text-center text-base font-semibold tracking-tight sm:text-lg animate-[ctaFloat_2.6s_ease-in-out_infinite]"
                                style={{
                                    background: hexToRgba(palette.primary, 0.10),
                                    border: `1px solid ${hexToRgba(palette.primary, 0.28)}`,
                                    color: "rgba(255,255,255,0.92)",
                                    boxShadow: `0 0 20px ${hexToRgba(palette.primary, 0.14)}`,
                                }}
                            >
                                {streamingPrompt}
                            </span>
                        </div>

                        {/* Mobile Socials */}
                        <div className="mt-3 flex justify-center lg:hidden w-full px-4">
                            <SocialIcons
                                SocialLinkData={song.songServiceLinks ?? []}
                                SongSlug={song.slug}
                            />
                        </div>
                        {song.spotifyUrl && !song.songServiceLinks?.length ? (
                            <div className="mt-3 flex justify-center lg:hidden">
                                <a
                                    href={song.spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-white px-4 py-2 text-sm font-bold text-black transition hover:-translate-y-0.5"
                                    onClick={() =>
                                        trackInteraction({
                                            song: song.slug,
                                            action: "service_click",
                                            service: "streaming_link",
                                        })
                                    }
                                >
                                    Open streaming link
                                </a>
                            </div>
                        ) : null}
                    </div>

                    <div className="order-2 space-y-5 lg:order-1 lg:space-y-6">
                        {/*<div*/}
                        {/*    className="inline-flex items-center rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.32em] backdrop-blur-xl"*/}
                        {/*    style={{*/}
                        {/*        border: `1px solid ${palette.border}`,*/}
                        {/*        background: hexToRgba(palette.primary, 0.12),*/}
                        {/*        color: "rgba(255,255,255,0.78)",*/}
                        {/*    }}*/}
                        {/*>*/}
                        {/*    <Sparkles className="mr-2 h-3.5 w-3.5" />*/}
                        {/*    {song.releaseLabel ?? "Now Playing"}*/}
                        {/*</div>*/}

                        <div className="space-y-4">
                            <div className="space-y-1 text-center lg:text-left">
                                <p className="text-xs uppercase tracking-[0.35em] text-white/50 sm:text-sm">
                                    {song.artist ?? "F.A.T.E."}
                                </p>

                                <h1 className="text-3xl font-black uppercase leading-[0.9] tracking-tight sm:text-4xl md:text-5xl lg:text-8xl">
                                    {song.title}
                                </h1>
                            </div>

                            {song.subtitle ? (
                                <p
                                    className="mx-auto max-w-2xl text-center text-base leading-7 sm:text-lg lg:mx-0 lg:text-left"
                                    style={{ color: palette.textSoft }}
                                >
                                    {song.subtitle}
                                </p>
                            ) : null}

                            <div className="flex flex-wrap items-center justify-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45 lg:justify-start">
                                {song.tagline ? <span>{song.tagline}</span> : null}
                                {song.releaseLabel ? <span>{song.releaseLabel}</span> : null}
                            </div>
                        </div>
                        {/*Desktop CTA*/}
                        <div className="mb-3 hidden lg:flex justify-center">
                            <span
                                className="inline-block rounded-full px-4 py-1.5 text-center text-base font-semibold tracking-tight sm:text-lg animate-[ctaFloat_2.6s_ease-in-out_infinite]"
                                style={{
                                    background: hexToRgba(palette.primary, 0.10),
                                    border: `1px solid ${hexToRgba(palette.primary, 0.28)}`,
                                    color: "rgba(255,255,255,0.92)",
                                    boxShadow: `0 0 20px ${hexToRgba(palette.primary, 0.14)}`,
                                }}
                            >
                                {streamingPrompt}
                            </span>
                        </div>
                        {/*Desktop Socials*/}
                        <div className="hidden lg:flex w-full justify-center">
                            <SocialIcons
                                SocialLinkData={song.songServiceLinks ?? []}
                                SongSlug={song.slug}
                            />
                        </div>
                        {song.spotifyUrl && !song.songServiceLinks?.length ? (
                            <div className="hidden justify-center lg:flex">
                                <a
                                    href={song.spotifyUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="rounded-full bg-white px-5 py-2 text-sm font-bold text-black transition hover:-translate-y-0.5"
                                    onClick={() =>
                                        trackInteraction({
                                            song: song.slug,
                                            action: "service_click",
                                            service: "streaming_link",
                                        })
                                    }
                                >
                                    Open streaming link
                                </a>
                            </div>
                        ) : null}

                        {/*Show the song lyrics*/}
                        {lyrics ? (
                            <div
                                className="rounded-[28px] p-4 shadow-[0_28px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-5"
                                style={{
                                    border: `1px solid ${palette.border}`,
                                    background: `linear-gradient(135deg, ${hexToRgba(palette.primary, 0.08)}, rgba(255,255,255,0.04))`,
                                }}
                            >
                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
                                    <Music2 className="h-3.5 w-3.5" />
                                    Lyrics
                                </div>

                                <div
                                    className="mt-4 overflow-hidden transition-[max-height] duration-500 ease-in-out"
                                    style={{ maxHeight: lyricsMaxHeight }}
                                >
                                    <div
                                        ref={lyricsContentRef}
                                        className="whitespace-pre-line text-sm leading-7 text-white/80 sm:text-base"
                                        style={
                                            !lyricsExpanded
                                                ? {
                                                    WebkitMaskImage:
                                                        "linear-gradient(to bottom, black 70%, transparent 100%)",
                                                    maskImage:
                                                        "linear-gradient(to bottom, black 70%, transparent 100%)",
                                                }
                                                : undefined
                                        }
                                    >
                                        {lyrics}
                                    </div>
                                </div>

                                <div className="mt-4 flex justify-center">
                                    <button
                                        type="button"
                                        onClick={() => setLyricsExpanded((prev) => !prev)}
                                        className="rounded-full px-4 py-2 text-sm font-medium transition hover:scale-[1.02]"
                                        style={{
                                            border: `1px solid ${palette.border}`,
                                            background: hexToRgba(palette.primary, 0.12),
                                            color: "rgba(255,255,255,0.84)",
                                        }}
                                    >
                                        {lyricsExpanded ? "Show less" : "Show more"}
                                    </button>
                                </div>
                            </div>
                        ) : null}

                        {/*<div className="grid gap-3 sm:grid-cols-3">*/}
                        {/*    <div*/}
                        {/*        className="rounded-2xl p-4 backdrop-blur-xl"*/}
                        {/*        style={{*/}
                        {/*            border: `1px solid ${palette.border}`,*/}
                        {/*            background: hexToRgba(palette.primary, 0.08),*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">*/}
                        {/*            <Heart className="h-3.5 w-3.5" />*/}
                        {/*            Best practice*/}
                        {/*        </div>*/}
                        {/*        <p className="text-sm leading-6 text-white/72">*/}
                        {/*            Hit save after opening Spotify so the algorithm sees real intent.*/}
                        {/*        </p>*/}
                        {/*    </div>*/}

                        {/*    <div*/}
                        {/*        className="rounded-2xl p-4 backdrop-blur-xl"*/}
                        {/*        style={{*/}
                        {/*            border: `1px solid ${palette.border}`,*/}
                        {/*            background: hexToRgba(palette.secondary, 0.08),*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">*/}
                        {/*            <Music2 className="h-3.5 w-3.5" />*/}
                        {/*            Strongest section*/}
                        {/*        </div>*/}
                        {/*        <p className="text-sm leading-6 text-white/72">*/}
                        {/*            You control exactly which part of the song is heard first.*/}
                        {/*        </p>*/}
                        {/*    </div>*/}

                        {/*    <div*/}
                        {/*        className="rounded-2xl p-4 backdrop-blur-xl"*/}
                        {/*        style={{*/}
                        {/*            border: `1px solid ${palette.border}`,*/}
                        {/*            background: hexToRgba(palette.primary, 0.06),*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">*/}
                        {/*            <ExternalLink className="h-3.5 w-3.5" />*/}
                        {/*            Cleaner journey*/}
                        {/*        </div>*/}
                        {/*        <p className="text-sm leading-6 text-white/72">*/}
                        {/*            Fewer distractions. Better branding. Stronger click-through.*/}
                        {/*        </p>*/}
                        {/*    </div>*/}
                        {/*</div>*/}

                        {/*    <div*/}
                        {/*        className="rounded-[28px] p-4 shadow-[0_28px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-5"*/}
                        {/*        style={{*/}
                        {/*            border: `1px solid ${palette.border}`,*/}
                        {/*            background: `linear-gradient(135deg, ${hexToRgba(palette.primary, 0.1)}, rgba(255,255,255,0.05))`,*/}
                        {/*        }}*/}
                        {/*    >*/}
                        {/*        <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">*/}
                        {/*            <div>*/}
                        {/*                <p className="text-xs uppercase tracking-[0.3em] text-white/45">*/}
                        {/*                    Why this page converts better*/}
                        {/*                </p>*/}
                        {/*                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white/95">*/}
                        {/*                    Lead with the best moment, not a random preview.*/}
                        {/*                </h2>*/}
                        {/*            </div>*/}

                        {/*            <div className="flex flex-col justify-between gap-4">*/}
                        {/*                {song.quote ? (*/}
                        {/*                    <blockquote*/}
                        {/*                        className="rounded-2xl p-4 text-sm italic leading-6"*/}
                        {/*                        style={{*/}
                        {/*                            border: `1px solid ${palette.border}`,*/}
                        {/*                            background: hexToRgba(palette.secondary, 0.08),*/}
                        {/*                            color: "rgba(255,255,255,0.78)",*/}
                        {/*                        }}*/}
                        {/*                    >*/}
                        {/*                        “{song.quote}”*/}
                        {/*                    </blockquote>*/}
                        {/*                ) : (*/}
                        {/*                    <p className="text-sm leading-7 text-white/68">*/}
                        {/*                        This layout gives you full control over the first impression while keeping the path fast and clean.*/}
                        {/*                    </p>*/}
                        {/*                )}*/}

                        {/*                {song.lyricsTease?.length ? (*/}
                        {/*                    <div*/}
                        {/*                        className="space-y-2 rounded-2xl p-4"*/}
                        {/*                        style={{*/}
                        {/*                            border: `1px solid ${palette.border}`,*/}
                        {/*                            background: hexToRgba(palette.primary, 0.06),*/}
                        {/*                        }}*/}
                        {/*                    >*/}
                        {/*                        <p className="text-xs uppercase tracking-[0.28em] text-white/40">*/}
                        {/*                            Lyric tease*/}
                        {/*                        </p>*/}
                        {/*                        <div className="space-y-1 text-base font-medium leading-7 text-white/85">*/}
                        {/*                            {song.lyricsTease.map((line) => (*/}
                        {/*                                <p key={line}>{line}</p>*/}
                        {/*                            ))}*/}
                        {/*                        </div>*/}
                        {/*                    </div>*/}
                        {/*                ) : null}*/}

                        {/*                <div*/}
                        {/*                    className="rounded-2xl p-4"*/}
                        {/*                    style={{*/}
                        {/*                        border: `1px solid ${palette.border}`,*/}
                        {/*                        background: `linear-gradient(135deg, ${hexToRgba(palette.primary, 0.12)}, ${hexToRgba(palette.secondary, 0.08)})`,*/}
                        {/*                    }}*/}
                        {/*                >*/}
                        {/*                    <p className="text-xs uppercase tracking-[0.25em] text-white/45">*/}
                        {/*                        Suggested CTA*/}
                        {/*                    </p>*/}
                        {/*                    <p className="mt-2 text-sm leading-6 text-white/75">*/}
                        {/*                        Hear the full track on Spotify and tap save if it hits.*/}
                        {/*                    </p>*/}
                        {/*                </div>*/}
                        {/*            </div>*/}
                        {/*        </div>*/}
                        {/*    </div>*/}
                    </div>
                </div>
            </section>
            <style jsx>{`
                @keyframes ctaFloat {
                    0%, 100% {
                        transform: translateY(0);
                        opacity: 0.92;
                    }
                    50% {
                        transform: translateY(3px);
                        opacity: 1;
                    }
                }
            `}</style>
        </main>
    );
}
