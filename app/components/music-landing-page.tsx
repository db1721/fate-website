"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image, { type StaticImageData } from "next/image";
import { Vibrant } from "node-vibrant/browser";
import {
    ExternalLink,
    Heart,
    Music2,
    Pause,
    Play,
    Sparkles,
} from "lucide-react";
import {AppleMusicIcon} from "@/app/components/logos/apple";
import {SocialIcon} from "react-social-icons";
import bandInfo from "@/app/config/fate-info";
import {SocialIcons} from "@/app/components/shared/socials";

export type SongPageData = {
    slug: string;
    title: string;
    artist?: string;
    subtitle?: string;
    tagline?: string;
    coverImage: string | StaticImageData;
    previewUrl: string;
    spotifyUrl: string;
    appleUrl?: string;
    youtubeUrl?: string;
    lyricsTease?: string[];
    quote?: string;
    releaseLabel?: string;
    backgroundVideoUrl?: string;
    previewStartLabel?: string;
};

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

function formatTime(seconds: number): string {
    if (!Number.isFinite(seconds)) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function CTAButton({
                       href,
                       children,
                       primary = false,
                       palette,
                   }: {
    href: string;
    children: React.ReactNode;
    primary?: boolean;
    palette: ThemePalette;
}) {
    return (
        <a
            href={href}
            target="_blank"
            rel="noreferrer"
            className={[
                "group inline-flex min-h-12 items-center justify-center rounded-2xl px-5 py-3 text-sm font-semibold tracking-wide transition duration-200",
                primary ? "text-white hover:-translate-y-0.5" : "hover:-translate-y-0.5",
            ].join(" ")}
            style={
                primary
                    ? {
                        background: `linear-gradient(135deg, ${palette.primary}, ${palette.secondary})`,
                        boxShadow: `0 18px 60px ${hexToRgba(palette.primary, 0.3)}`,
                    }
                    : {
                        border: `1px solid ${palette.border}`,
                        background: hexToRgba(palette.secondary, 0.1),
                        color: "white",
                        backdropFilter: "blur(16px)",
                    }
            }
        >
            <span>{children}</span>
            <ExternalLink className="ml-2 h-4 w-4 opacity-70 transition group-hover:opacity-100" />
        </a>
    );
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
            style={{ background: color }}
        />
    );
}

export function generateSongMetadata(song: SongPageData) {
    const pageUrl = `https://fatemusicofficial.com/music/${song.slug}`;
    const title = `${song.title} | ${song.artist ?? "F.A.T.E."}`;
    const description =
        song.subtitle ??
        `Listen to ${song.title} by ${song.artist ?? "F.A.T.E."} and hear the strongest part of the track first.`;

    return {
        title,
        description,
        alternates: {
            canonical: pageUrl,
        },
        openGraph: {
            title,
            description,
            url: pageUrl,
            siteName: "F.A.T.E.",
            images: [
                {
                    url: getImageSrc(song.coverImage),
                    width: 1200,
                    height: 1200,
                    alt: `${song.title} cover art`,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [getImageSrc(song.coverImage)],
        },
    };
}

export default function MusicLandingPage({ song }: MusicLandingPageProps) {
    const imageSrc = useMemo(() => getImageSrc(song.coverImage), [song.coverImage]);
    const [palette, setPalette] = useState<ThemePalette>(FALLBACK_PALETTE);

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    useEffect(() => {
        let cancelled = false;

        async function extractPalette() {
            try {
                const result = await Vibrant.from(imageSrc).getPalette();

                if (cancelled) return;

                const primary =
                    result.Vibrant?.hex ||
                    result.DarkVibrant?.hex ||
                    result.Muted?.hex ||
                    FALLBACK_PALETTE.primary;

                const secondary =
                    result.LightVibrant?.hex ||
                    result.Muted?.hex ||
                    result.LightMuted?.hex ||
                    FALLBACK_PALETTE.secondary;

                const dark =
                    result.DarkMuted?.hex ||
                    result.DarkVibrant?.hex ||
                    FALLBACK_PALETTE.dark;

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

        const onLoadedMetadata = () => setDuration(audio.duration || 0);
        const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
        const onEnded = () => {
            setIsPlaying(false);
            setCurrentTime(0);
        };

        audio.addEventListener("loadedmetadata", onLoadedMetadata);
        audio.addEventListener("timeupdate", onTimeUpdate);
        audio.addEventListener("ended", onEnded);

        return () => {
            audio.removeEventListener("loadedmetadata", onLoadedMetadata);
            audio.removeEventListener("timeupdate", onTimeUpdate);
            audio.removeEventListener("ended", onEnded);
        };
    }, []);

    async function togglePlay() {
        const audio = audioRef.current;
        if (!audio) return;

        try {
            if (audio.paused) {
                await audio.play();
                setIsPlaying(true);
            } else {
                audio.pause();
                setIsPlaying(false);
            }
        } catch (error) {
            console.error("Audio playback failed", error);
        }
    }

    function handleSeek(event: React.MouseEvent<HTMLDivElement>) {
        const audio = audioRef.current;
        if (!audio || !duration) return;

        const rect = event.currentTarget.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        const nextTime = Math.max(0, Math.min(duration, percent * duration));

        audio.currentTime = nextTime;
        setCurrentTime(nextTime);
    }

    const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

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
                        <source src={song.backgroundVideoUrl} />
                    </video>
                    <div className="absolute inset-0 bg-black/35" />
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

            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:44px_44px] opacity-[0.06]" />

            <section className="relative z-10 mx-auto flex min-h-screen w-full max-w-7xl items-start px-4 py-6 sm:px-6 sm:py-8 lg:items-center lg:px-8">
                <div className="grid w-full items-start gap-5 sm:gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:gap-14">
                    <div className="order-1 lg:order-2">
                        <div className="relative mx-auto w-full max-w-[250px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-xl">
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

                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-black/10" />

                                    <button
                                        type="button"
                                        aria-label={isPlaying ? "Pause preview" : "Play preview"}
                                        onClick={togglePlay}
                                        className="absolute left-1/2 top-[42%] flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white shadow-2xl backdrop-blur-xl transition hover:scale-105 sm:top-1/2 sm:h-16 sm:w-16 lg:h-20 lg:w-20"
                                    >
                                        {isPlaying ? (
                                            <Pause className="h-5 w-5 sm:h-7 sm:w-7 lg:h-9 lg:w-9" fill="currentColor" />
                                        ) : (
                                            <Play className="ml-0.5 h-5 w-5 sm:ml-1 sm:h-7 sm:w-7 lg:h-9 lg:w-9" fill="currentColor" />
                                        )}
                                    </button>

                                    <div className="absolute inset-x-0 bottom-0 p-3 sm:p-4 lg:p-5">
                                        <div className="mb-2 sm:mb-3">
                                            <p className="text-[10px] uppercase tracking-[0.24em] text-white/55 sm:text-[11px] lg:text-xs">
                                                {song.artist ?? "F.A.T.E."}
                                            </p>
                                            <p className="mt-1 text-lg font-bold tracking-tight sm:text-xl lg:text-2xl">
                                                {song.title}
                                            </p>
                                        </div>

                                        <div
                                            className="rounded-xl px-2.5 py-2.5 backdrop-blur-xl sm:rounded-2xl sm:px-3 sm:py-3"
                                            style={{
                                                border: `1px solid ${hexToRgba(palette.secondary, 0.2)}`,
                                                background: hexToRgba(palette.dark, 0.38),
                                            }}
                                        >
                                            <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.16em] text-white/60 sm:text-[11px] lg:text-xs">
                                                <span>{song.previewStartLabel ?? "Hook preview"}</span>
                                                <span>
                          {formatTime(currentTime)} / {formatTime(duration)}
                        </span>
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
                                    <source src={song.previewUrl} type="audio/mpeg" />
                                    Your browser does not support the audio element.
                                </audio>
                            </div>

                            <div className="mt-3 flex items-center justify-center gap-2 text-center text-[10px] uppercase tracking-[0.2em] text-white/35 sm:mt-4 sm:text-xs sm:tracking-[0.28em]">
                                <span>fatemusicofficial.com</span>
                                <span>•</span>
                                <span>/music/{song.slug}</span>
                            </div>
                        </div>
                    </div>

                    <div className="order-2 space-y-5 lg:order-1 lg:space-y-6">
                        <div
                            className="inline-flex items-center rounded-full px-3 py-1.5 text-xs uppercase tracking-[0.32em] backdrop-blur-xl"
                            style={{
                                border: `1px solid ${palette.border}`,
                                background: hexToRgba(palette.primary, 0.12),
                                color: "rgba(255,255,255,0.78)",
                            }}
                        >
                            <Sparkles className="mr-2 h-3.5 w-3.5" />
                            {song.releaseLabel ?? "Now Playing"}
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <p className="text-sm uppercase tracking-[0.35em] text-white/55">
                                    {song.artist ?? "F.A.T.E."}
                                </p>
                                <h1 className="max-w-3xl text-3xl font-black uppercase leading-[0.92] tracking-tight sm:text-4xl md:text-5xl lg:text-8xl">
                                    {song.title}
                                </h1>
                            </div>

                            {song.subtitle ? (
                                <p className="max-w-2xl text-base leading-7 sm:text-lg" style={{ color: palette.textSoft }}>
                                    {song.subtitle}
                                </p>
                            ) : null}

                            {song.tagline ? (
                                <p
                                    className="max-w-xl text-sm uppercase tracking-[0.28em] sm:text-base"
                                    style={{ color: hexToRgba(palette.secondary, 0.76) }}
                                >
                                    {song.tagline}
                                </p>
                            ) : null}
                        </div>

                        <div
                            className="rounded-[28px] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.45)] backdrop-blur-2xl sm:p-5"
                            style={{
                                border: `1px solid ${palette.border}`,
                                background: `linear-gradient(135deg, ${hexToRgba(palette.primary, 0.12)}, rgba(255,255,255,0.05))`,
                            }}
                        >
                            <div className="mb-3 flex items-center justify-between gap-3">
                                <div className="flex items-center gap-2 text-sm font-medium text-white/70">
                                    <Play className="h-4 w-4" />
                                    Preview behavior
                                </div>
                                <div
                                    className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.25em]"
                                    style={{
                                        border: `1px solid ${palette.border}`,
                                        background: hexToRgba(palette.dark, 0.35),
                                        color: "rgba(255,255,255,0.56)",
                                    }}
                                >
                                    Mobile friendly
                                </div>
                            </div>

                            <div
                                className="flex items-start gap-3 rounded-2xl p-3"
                                style={{
                                    border: `1px solid ${hexToRgba(palette.secondary, 0.18)}`,
                                    background: hexToRgba(palette.dark, 0.24),
                                }}
                            >
                                <Play className="mt-0.5 h-4 w-4 shrink-0 text-white/55" />
                                <p className="text-sm leading-6 text-white/55">
                                    The artwork is prioritized first on mobile, shrinks down sooner, and the preview controls are integrated directly into the cover for a cleaner music-first layout.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <CTAButton href={song.spotifyUrl} primary palette={palette}>
                                Listen on Spotify
                            </CTAButton>
                            <SocialIcons SocialLinkData={bandInfo.SOCIAL_LINKS}/>
                        </div>

                        <div className="grid gap-3 sm:grid-cols-3">
                            <div
                                className="rounded-2xl p-4 backdrop-blur-xl"
                                style={{
                                    border: `1px solid ${palette.border}`,
                                    background: hexToRgba(palette.primary, 0.08),
                                }}
                            >
                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
                                    <Heart className="h-3.5 w-3.5" />
                                    Best practice
                                </div>
                                <p className="text-sm leading-6 text-white/72">
                                    Hit save after opening Spotify so the algorithm sees real intent.
                                </p>
                            </div>

                            <div
                                className="rounded-2xl p-4 backdrop-blur-xl"
                                style={{
                                    border: `1px solid ${palette.border}`,
                                    background: hexToRgba(palette.secondary, 0.08),
                                }}
                            >
                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
                                    <Music2 className="h-3.5 w-3.5" />
                                    Strongest section
                                </div>
                                <p className="text-sm leading-6 text-white/72">
                                    You control exactly which part of the song is heard first.
                                </p>
                            </div>

                            <div
                                className="rounded-2xl p-4 backdrop-blur-xl"
                                style={{
                                    border: `1px solid ${palette.border}`,
                                    background: hexToRgba(palette.primary, 0.06),
                                }}
                            >
                                <div className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-white/45">
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    Cleaner journey
                                </div>
                                <p className="text-sm leading-6 text-white/72">
                                    Fewer distractions. Better branding. Stronger click-through.
                                </p>
                            </div>
                        </div>

                        <div
                            className="rounded-[28px] p-4 shadow-[0_28px_120px_rgba(0,0,0,0.6)] backdrop-blur-2xl sm:p-5"
                            style={{
                                border: `1px solid ${palette.border}`,
                                background: `linear-gradient(135deg, ${hexToRgba(palette.primary, 0.1)}, rgba(255,255,255,0.05))`,
                            }}
                        >
                            <div className="grid gap-4 xl:grid-cols-[1fr_1fr]">
                                <div>
                                    <p className="text-xs uppercase tracking-[0.3em] text-white/45">
                                        Why this page converts better
                                    </p>
                                    <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white/95">
                                        Lead with the best moment, not a random preview.
                                    </h2>
                                </div>

                                <div className="flex flex-col justify-between gap-4">
                                    {song.quote ? (
                                        <blockquote
                                            className="rounded-2xl p-4 text-sm italic leading-6"
                                            style={{
                                                border: `1px solid ${palette.border}`,
                                                background: hexToRgba(palette.secondary, 0.08),
                                                color: "rgba(255,255,255,0.78)",
                                            }}
                                        >
                                            “{song.quote}”
                                        </blockquote>
                                    ) : (
                                        <p className="text-sm leading-7 text-white/68">
                                            This layout gives you full control over the first impression while keeping the path to Spotify fast and clean.
                                        </p>
                                    )}

                                    {song.lyricsTease?.length ? (
                                        <div
                                            className="space-y-2 rounded-2xl p-4"
                                            style={{
                                                border: `1px solid ${palette.border}`,
                                                background: hexToRgba(palette.primary, 0.06),
                                            }}
                                        >
                                            <p className="text-xs uppercase tracking-[0.28em] text-white/40">
                                                Lyric tease
                                            </p>
                                            <div className="space-y-1 text-base font-medium leading-7 text-white/85">
                                                {song.lyricsTease.map((line) => (
                                                    <p key={line}>{line}</p>
                                                ))}
                                            </div>
                                        </div>
                                    ) : null}

                                    <div
                                        className="rounded-2xl p-4"
                                        style={{
                                            border: `1px solid ${palette.border}`,
                                            background: `linear-gradient(135deg, ${hexToRgba(palette.primary, 0.12)}, ${hexToRgba(palette.secondary, 0.08)})`,
                                        }}
                                    >
                                        <p className="text-xs uppercase tracking-[0.25em] text-white/45">
                                            Suggested CTA
                                        </p>
                                        <p className="mt-2 text-sm leading-6 text-white/75">
                                            Hear the full track on Spotify and tap save if it hits.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}