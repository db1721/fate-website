'use client';

import { createContext, useContext, useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Pause, Play } from "lucide-react";
import {useAudioManager} from "@/app/context/audio-manager";
import { trackInteraction } from "@/lib/track-interaction";
import type { ArtistId } from "@/app/config/artists/types";
import { clampAudioPreviewStart, formatAudioTime, getAudioDuration } from "@/lib/audio-preview";

type AudioTrackProps = {
    id: string;
    src: string;
    trackTitle?: string;
    compactOnMobile?: boolean;
    previewStartTime?: number;
    projectId?: ArtistId;
    className?: string;
    maxWidth?: string;
    maxHeight?: string;
    onPlay?: () => void;
    onPause?: () => void;
};

function usePlayerState() {
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    return { audioRef, isPlaying, setIsPlaying };
}

const FeaturedPreviewContext = createContext<ReturnType<typeof usePlayerState> | null>(null);

export function FeaturedPreviewGroup({ children, className }: { children: ReactNode; className: string }) {
    const player = usePlayerState();
    return (
        <FeaturedPreviewContext.Provider value={player}>
            <div className={className}>{children}</div>
        </FeaturedPreviewContext.Provider>
    );
}

function togglePlayback(audio: HTMLAudioElement | null) {
    if (!audio) return;
    if (!audio.paused) {
        audio.pause();
        return;
    }

    if (audio.preload === "none") {
        audio.preload = "metadata";
        audio.load();
    }
    void audio.play().catch(() => {
        // Native play/pause events keep both controls in sync if a play request is interrupted.
    });
}

export function FeaturedPreviewButton({ title }: { title: string }) {
    const player = useContext(FeaturedPreviewContext);
    if (!player) throw new Error("FeaturedPreviewButton requires FeaturedPreviewGroup");
    return (
        <button
            type="button"
            onClick={() => togglePlayback(player.audioRef.current)}
            className="min-h-11 cursor-pointer rounded-full bg-[var(--artist-accent-bright)] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--artist-button-text)] shadow-[0_18px_55px_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--artist-accent-bright)]"
        >
            {player.isPlaying ? "Pause" : "Play"} {title}
        </button>
    );
}

export function AudioTrack({
                               id,
                               src,
                               trackTitle,
                               compactOnMobile = false,
                               previewStartTime,
                               projectId = "fate",
                               className,
                               maxWidth,
                               maxHeight,
                               onPlay,
                               onPause,
                           }: AudioTrackProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const localPlayer = usePlayerState();
    const featuredPlayer = useContext(FeaturedPreviewContext);
    const { audioRef, isPlaying, setIsPlaying } = featuredPlayer ?? localPlayer;
    const hasTrackedPlayRef = useRef(false);
    const hasAppliedStartRef = useRef(false);
    const {registerAudio} = useAudioManager();

    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const previewStart = clampAudioPreviewStart(previewStartTime, duration);

    const syncDuration = () => {
        const el = audioRef.current;
        if (!el) return;

        const nextDuration = getAudioDuration(el);
        if (nextDuration > 0) {
            setDuration(nextDuration);
        }
    };

    const syncCurrentTime = () => {
        const el = audioRef.current;
        if (!el) return;

        syncDuration();
        setCurrentTime(el.currentTime || 0);
    };

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;
        return registerAudio(el);
    }, [src, registerAudio, audioRef]);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        hasTrackedPlayRef.current = false;
        hasAppliedStartRef.current = false;
        let durationReady = false;
        const syncMetadata = () => {
            const nextDuration = getAudioDuration(el);
            if (nextDuration > 0) {
                durationReady = true;
                setDuration(nextDuration);
                if (!hasAppliedStartRef.current && el.readyState >= 1) {
                    el.currentTime = clampAudioPreviewStart(previewStartTime, nextDuration);
                    hasAppliedStartRef.current = true;
                    setCurrentTime(el.currentTime);
                }
            }
        };
        const syncPlaybackPosition = () => {
            syncMetadata();
            setCurrentTime(el.currentTime || 0);
        };

        setIsPlaying(false);
        setDuration(0);
        setCurrentTime(0);

        el.addEventListener("loadedmetadata", syncMetadata);
        el.addEventListener("durationchange", syncMetadata);
        el.addEventListener("loadeddata", syncMetadata);
        el.addEventListener("canplay", syncMetadata);
        el.addEventListener("timeupdate", syncPlaybackPosition);

        const beginMetadataLoad = () => {
            if (el.preload === "metadata") return;
            el.preload = "metadata";
            el.load();
            syncMetadata();
        };

        let observer: IntersectionObserver | null = null;
        if (typeof IntersectionObserver === "undefined" || !containerRef.current) {
            beginMetadataLoad();
        } else {
            observer = new IntersectionObserver(
                (entries) => {
                    if (!entries.some((entry) => entry.isIntersecting)) return;
                    beginMetadataLoad();
                    observer?.disconnect();
                },
                { rootMargin: "240px 0px" }
            );
            observer.observe(containerRef.current);
        }

        const metadataPoll = window.setInterval(() => {
            syncMetadata();
            if (durationReady) {
                window.clearInterval(metadataPoll);
            }
        }, 250);
        const metadataTimeout = window.setTimeout(() => {
            window.clearInterval(metadataPoll);
        }, 6000);

        return () => {
            el.removeEventListener("loadedmetadata", syncMetadata);
            el.removeEventListener("durationchange", syncMetadata);
            el.removeEventListener("loadeddata", syncMetadata);
            el.removeEventListener("canplay", syncMetadata);
            el.removeEventListener("timeupdate", syncPlaybackPosition);
            window.clearInterval(metadataPoll);
            window.clearTimeout(metadataTimeout);
            observer?.disconnect();
        };
    }, [src, previewStartTime, audioRef, setIsPlaying]);

    const handleSeek = (value: number) => {
        const el = audioRef.current;
        if (!el) return;

        const availableDuration = duration || getAudioDuration(el);
        if (!availableDuration) return;

        const nextTime = Math.max(0, Math.min(value, availableDuration));
        el.currentTime = nextTime;
        setCurrentTime(nextTime);
    };

    return (
        <div
            ref={containerRef}
            className={`
        flex w-full max-w-full items-center text-[0.7rem] text-zinc-100
        ${previewStart > 0 ? "flex-wrap" : ""}
        ${compactOnMobile
            ? "audio-track--compact gap-1 sm:gap-2 sm:rounded-md sm:border sm:border-zinc-700 sm:bg-black/70 sm:px-3 sm:py-2 sm:shadow-sm sm:backdrop-blur-sm"
            : "gap-2 rounded-md border border-zinc-700 bg-black/70 px-3 py-2 shadow-sm backdrop-blur-sm overflow-hidden"}
        ${className ?? ""}
      `}
            style={{
                maxWidth: maxWidth ?? "100%",
                ...(maxHeight ? {maxHeight} : {}),
            }}
        >
            {/* hidden native audio element */}
            <audio
                ref={audioRef}
                src={src}
                preload="none"
                className="hidden"
                onPlay={(event) => {
                    if (event.currentTarget.paused) return;
                    syncDuration();
                    setIsPlaying(true);
                    if (!hasTrackedPlayRef.current) {
                        hasTrackedPlayRef.current = true;
                        void trackInteraction({
                            song: id,
                            project: projectId,
                            action: "preview_play",
                        });
                    }
                    onPlay?.();
                }}
                onPause={(event) => {
                    if (!event.currentTarget.paused) return;
                    setIsPlaying(false);
                    onPause?.();
                }}
                onError={() => {
                    setIsPlaying(false);
                    onPause?.();
                }}
                onTimeUpdate={syncCurrentTime}
                onDurationChange={syncDuration}
                onLoadedData={syncDuration}
                onCanPlay={syncDuration}
                onLoadedMetadata={syncDuration}
                onEnded={() => {
                    hasAppliedStartRef.current = false;
                    setIsPlaying(false);
                    setCurrentTime(0);
                    onPause?.();
                }}
            />

            {previewStart > 0 ? (
                <p className="w-full text-xs text-[var(--artist-text-muted)]">
                    Preview starts at {formatAudioTime(previewStart)}
                </p>
            ) : null}

            <button
                type="button"
                onClick={() => togglePlayback(audioRef.current)}
                className={`
          flex shrink-0 items-center justify-center rounded-full text-black
          h-11 w-11 sm:h-7 sm:w-7
          hover:brightness-125 active:scale-95
          transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--artist-accent-bright)]
        `}
                aria-label={`${isPlaying ? "Pause" : "Play"}${trackTitle ? ` ${trackTitle}` : ""}`}
                title={`${isPlaying ? "Pause" : "Play"}${trackTitle ? ` ${trackTitle}` : ""}`}
            >
                <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--artist-accent-bright, #60a5fa)" }}
                >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" fill="currentColor" /> : <Play className="h-3.5 w-3.5" fill="currentColor" />}
                </span>
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
                {/* progress bar */}
                <input
                    aria-label={`Seek ${trackTitle ?? id}`}
                    aria-valuetext={duration > 0 ? `${formatAudioTime(currentTime)} of ${formatAudioTime(duration)}` : undefined}
                    disabled={duration <= 0}
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    onInput={(e) => handleSeek(Number(e.currentTarget.value))}
                    className="audio-track-seek
                      h-1 min-w-0 flex-1
                      cursor-pointer disabled:cursor-default disabled:opacity-30
                    accent-[var(--artist-accent-bright)]
                    "
                    style={compactOnMobile ? {
                        "--audio-progress": `${duration > 0 ? Math.min(100, Math.max(0, currentTime / duration * 100)) : 0}%`,
                    } as CSSProperties : undefined}
                />

                {/* time + playing indicator */}
                <div className="flex shrink-0 items-center gap-1">
                    <span
                        className="whitespace-nowrap text-[0.65rem] text-zinc-300"
                        style={{
                            fontVariantNumeric: "tabular-nums", // all digits same width
                            minWidth: "9.5ch",
                            textAlign: "right",
                        }}
                    >
                        {duration > 0 ? `${formatAudioTime(currentTime)} / ${formatAudioTime(duration)}` : "—"}
                    </span>


                    {/* F.A.T.E mini equalizer */}
                    <div aria-hidden="true" className={`${compactOnMobile ? "hidden sm:flex" : "flex"} items-end gap-[2px] w-4 justify-end`}>
                        {isPlaying ? (
                            <>
                                <span className="fate-bar origin-bottom" style={{animationDelay: "0s"}}/>
                                <span className="fate-bar origin-bottom" style={{animationDelay: "0.15s"}}/>
                                <span className="fate-bar origin-bottom" style={{animationDelay: "0.3s"}}/>
                            </>
                        ) : (
                            <>
                                <span className="h-2 w-[2px] rounded-full bg-zinc-600/70"/>
                                <span className="h-1 w-[2px] rounded-full bg-zinc-600/70"/>
                                <span className="h-[6px] w-[2px] rounded-full bg-zinc-600/70"/>
                            </>
                        )}
                    </div>
                </div>
            </div>

        </div>
    );
}
