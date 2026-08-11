'use client';

import {useEffect, useRef, useState} from "react";
import { Pause, Play } from "lucide-react";
import {useAudioManager} from "@/app/context/audio-manager";
import { trackInteraction } from "@/lib/track-interaction";
import type { ArtistId } from "@/app/config/artists/types";

type AudioTrackProps = {
    id: string;
    src: string;
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
    const {registerAudio, handlePlay} = useAudioManager();

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

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

    // register with audio manager
    useEffect(() => {
        registerAudio(id, audioRef.current);
    }, [id, registerAudio]);

    useEffect(() => {
        const el = audioRef.current;
        if (!el) return;

        hasTrackedPlayRef.current = false;
        let durationReady = false;
        const syncMetadata = () => {
            const nextDuration = getAudioDuration(el);
            if (nextDuration > 0) {
                durationReady = true;
                setDuration(nextDuration);
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
    }, [src]);

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

        if (isPlaying) {
            el.pause();
        } else {
            if (el.preload === "none") {
                el.preload = "metadata";
                el.load();
            }
            el.play().catch(() => {
                // user gesture required etc.
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
            className={`
        flex w-full max-w-full items-center gap-2 rounded-md
        bg-black/70 border border-zinc-700
        px-3 py-2 text-[0.7rem] text-zinc-100
        shadow-sm backdrop-blur-sm
        overflow-hidden
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
                onPlay={() => {
                    syncDuration();
                    setIsPlaying(true);
                    handlePlay(id);
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
                    setIsPlaying(false);
                    onPause?.();
                }}
                onTimeUpdate={syncCurrentTime}
                onDurationChange={syncDuration}
                onLoadedData={syncDuration}
                onCanPlay={syncDuration}
                onLoadedMetadata={syncDuration}
                onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
                    onPause?.();
                }}
            />

            {/* Play / Pause button */}
            <button
                type="button"
                onClick={togglePlay}
                className={`
          flex h-7 w-7 items-center justify-center
          rounded-full text-black
          hover:brightness-125 active:scale-95
          transition-transform transition-colors
        `}
                style={{ backgroundColor: "var(--artist-accent-bright, #60a5fa)" }}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? <Pause className="h-3.5 w-3.5" fill="currentColor" /> : <Play className="h-3.5 w-3.5" fill="currentColor" />}
            </button>

            <div className="flex min-w-0 flex-1 items-center gap-2">
                {/* progress bar */}
                <input
                    aria-label={`Seek ${id}`}
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    onInput={(e) => handleSeek(Number(e.currentTarget.value))}
                    className="
                      h-1 min-w-0 flex-1
                      cursor-pointer
                    accent-[var(--artist-accent-bright)]
                    "
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
                        {formatTime(currentTime)} / {formatTime(duration)}
                    </span>


                    {/* F.A.T.E mini equalizer */}
                    <div className="flex items-end gap-[2px] w-4 justify-end">
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
