'use client';

import {useEffect, useRef, useState} from "react";
import {useAudioManager} from "@/app/context/audio-manager";
import { trackInteraction } from "@/lib/track-interaction";

type AudioTrackProps = {
    id: string;
    src: string;
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
                               autoPlay,
                               className,
                               maxWidth,
                               maxHeight,
                               onPlay,
                               onPause,
                           }: AudioTrackProps) {
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

        el.load();
        syncMetadata();

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
                preload="metadata"
                className="hidden"
                onPlay={() => {
                    syncDuration();
                    setIsPlaying(true);
                    handlePlay(id);
                    if (!hasTrackedPlayRef.current) {
                        hasTrackedPlayRef.current = true;
                        void trackInteraction({
                            song: id,
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
          rounded-full bg-blue-400 text-black
          hover:bg-blue-800 active:scale-95
          transition-transform transition-colors
        `}
                aria-label={isPlaying ? "Pause" : "Play"}
            >
                {isPlaying ? (
                    // pause icon
                    <span className="flex gap-[2px]">
            <span className="h-3 w-[2px] bg-black rounded-sm"/>
            <span className="h-3 w-[2px] bg-black rounded-sm"/>
          </span>
                ) : (
                    // play triangle
                    <span
                        className="ml-[2px]"
                        style={{
                            width: 0,
                            height: 0,
                            borderTop: "6px solid transparent",
                            borderBottom: "6px solid transparent",
                            borderLeft: "9px solid black",
                        }}
                    />
                )}
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
                      accent-blue-400
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
