'use client';

import {useEffect, useId, useRef, useState, type CSSProperties} from "react";
import { Pause, Play } from "lucide-react";
import {useAudioManager} from "@/app/context/audio-manager";
import { trackInteraction } from "@/lib/track-interaction";
import type { ArtistId } from "@/app/config/artists/types";
import { clampAudioPreviewStart } from "@/lib/audio-preview";
import styles from "./audio-track.module.css";

type AudioTrackProps = {
    id: string;
    src: string;
    trackTitle?: string;
    compactOnMobile?: boolean;
    appearance?: "default" | "hero";
    previewStartTime?: number;
    projectId?: ArtistId;
    autoPlay?: boolean;
    className?: string;
    maxWidth?: string;
    maxHeight?: string;
    onPlay?: () => void;
    onPause?: () => void;
};

function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${mins}:${secs}`;
}

function getAudioDuration(el: HTMLAudioElement): number {
    if (Number.isFinite(el.duration) && el.duration > 0) {
        return el.duration;
    }

    if (el.seekable.length > 0) {
        const seekableEnd = el.seekable.end(el.seekable.length - 1);
        if (Number.isFinite(seekableEnd) && seekableEnd > 0) {
            return seekableEnd;
        }
    }

    return 0;
}

export function AudioTrack({
                               id,
                               src,
                               trackTitle,
                               compactOnMobile = false,
                               appearance = "default",
                               previewStartTime,
                               projectId = "fate",
                               autoPlay,
                               className,
                               maxWidth,
                               maxHeight,
                               onPlay,
                               onPause,
                           }: AudioTrackProps) {
    const containerRef = useRef<HTMLDivElement | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hasTrackedPlayRef = useRef(false);
    const hasAppliedStartRef = useRef(false);
    const playRequestRef = useRef(0);
    const errorId = useId();
    const isHero = appearance === "hero";
    const {registerAudio} = useAudioManager();

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackStatus, setPlaybackStatus] = useState<"idle" | "loading" | "error">("idle");

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
    }, [src, registerAudio]);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        hasTrackedPlayRef.current = false;
        hasAppliedStartRef.current = false;
        playRequestRef.current++;
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
    }, [src, previewStartTime]);

    // optional autoplay (hero)
    useEffect(() => {
        if (autoPlay && audioRef.current) {
            audioRef.current
                .play()
                .then(() => {
                    // audio actually started
                })
                .catch(() => {
                    // autoplay blocked – ignore
                });
        }
    }, [autoPlay]);

    const togglePlay = () => {
        const el = audioRef.current;
        if (!el) return;

        if (!el.paused || playbackStatus === "loading") {
            playRequestRef.current++;
            el.pause();
            setPlaybackStatus("idle");
        } else {
            if (el.preload === "none" || playbackStatus === "error") {
                hasAppliedStartRef.current = false;
                el.preload = "metadata";
                el.load();
            }
            const request = ++playRequestRef.current;
            setPlaybackStatus("loading");
            el.play().catch((error: unknown) => {
                if (request !== playRequestRef.current) return;
                setPlaybackStatus(error instanceof DOMException && error.name === "AbortError"
                    ? "idle"
                    : "error");
            });
        }
    };

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
            className={isHero ? `${styles.heroPlayer} ${className ?? ""}` : `
        flex w-full max-w-full items-center text-[0.7rem] text-zinc-100
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
                onPause={() => {
                    playRequestRef.current++;
                    setIsPlaying(false);
                    setPlaybackStatus("idle");
                    onPause?.();
                }}
                onPlaying={() => setPlaybackStatus("idle")}
                onWaiting={() => {
                    if (!audioRef.current?.paused) setPlaybackStatus("loading");
                }}
                onError={() => setPlaybackStatus("error")}
                onEmptied={() => {
                    setIsPlaying(false);
                    setDuration(0);
                    setCurrentTime(0);
                    setPlaybackStatus("idle");
                }}
                onTimeUpdate={syncCurrentTime}
                onDurationChange={syncDuration}
                onLoadedData={syncDuration}
                onCanPlay={syncDuration}
                onLoadedMetadata={syncDuration}
                onEnded={() => {
                    hasAppliedStartRef.current = false;
                    playRequestRef.current++;
                    setIsPlaying(false);
                    setCurrentTime(0);
                    setPlaybackStatus("idle");
                    onPause?.();
                }}
            />

            {/* Play / Pause button */}
            <button
                type="button"
                onClick={togglePlay}
                className={isHero ? styles.play : `
          flex shrink-0 items-center justify-center rounded-full text-black
          ${compactOnMobile ? "h-11 w-11 sm:h-7 sm:w-7" : "h-7 w-7"}
          hover:brightness-125 active:scale-95
          transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--artist-accent-bright)]
        `}
                aria-label={isHero
                    ? `${playbackStatus === "loading" ? "Cancel loading" : isPlaying ? "Pause preview of" : "Play preview of"} ${trackTitle ?? id}`
                    : `${isPlaying ? "Pause" : "Play"}${trackTitle ? ` ${trackTitle}` : ""}`}
                aria-busy={isHero && playbackStatus === "loading" ? true : undefined}
                aria-describedby={isHero && playbackStatus === "error" ? errorId : undefined}
                title={`${isPlaying ? "Pause" : "Play"}${trackTitle ? ` ${trackTitle}` : ""}`}
            >
                {isHero ? (
                    <>
                        {isPlaying ? <Pause size={16} fill="currentColor" aria-hidden="true" /> : <Play size={16} fill="currentColor" aria-hidden="true" />}
                        <span>{playbackStatus === "loading" ? "Loading audio…" : playbackStatus === "error" ? "Try preview again" : isPlaying ? "Pause preview" : "Play preview"}</span>
                    </>
                ) : <span
                    className="flex h-7 w-7 items-center justify-center rounded-full"
                    style={{ backgroundColor: "var(--artist-accent-bright, #60a5fa)" }}
                >
                    {isPlaying ? <Pause className="h-3.5 w-3.5" fill="currentColor" /> : <Play className="h-3.5 w-3.5" fill="currentColor" />}
                </span>}
            </button>

            <div className={isHero ? styles.timeline : "flex min-w-0 flex-1 items-center gap-2"}>
                {/* progress bar */}
                <input
                    aria-label={`Seek ${trackTitle ?? id}`}
                    aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    disabled={isHero && !duration}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    onInput={(e) => handleSeek(Number(e.currentTarget.value))}
                    className={isHero ? styles.seek : `audio-track-seek
                      h-1 min-w-0 flex-1
                      cursor-pointer
                    accent-[var(--artist-accent-bright)]
                    `}
                    style={compactOnMobile || isHero ? {
                        "--audio-progress": `${duration > 0 ? Math.min(100, Math.max(0, currentTime / duration * 100)) : 0}%`,
                    } as CSSProperties : undefined}
                />

                {/* time + playing indicator */}
                <div className="flex shrink-0 items-center gap-1">
                    <span
                        className={isHero ? styles.time : "whitespace-nowrap text-[0.65rem] text-zinc-300"}
                        style={{
                            fontVariantNumeric: "tabular-nums", // all digits same width
                            minWidth: "9.5ch",
                            textAlign: "right",
                        }}
                    >
                        {formatTime(currentTime)} / {isHero && !duration ? "—:—" : formatTime(duration)}
                    </span>


                    {/* F.A.T.E mini equalizer */}
                    {!isHero ? <div aria-hidden="true" className={`${compactOnMobile ? "hidden sm:flex" : "flex"} items-end gap-[2px] w-4 justify-end`}>
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
                    </div> : null}
                </div>
            </div>

            {isHero && playbackStatus === "error" ? (
                <p id={errorId} role="alert" className={styles.message}>
                    Audio couldn’t load. Try again or open Lyrics &amp; streaming.
                </p>
            ) : null}

        </div>
    );
}
