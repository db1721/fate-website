'use client';

import {useEffect, useRef, useState} from "react";
import {useAudioManager} from "@/app/context/audio-manager";

type AudioTrackProps = {
    id: string;          // unique id (track title or slug)
    src: string;         // audio file path
    autoPlay?: boolean;
    className?: string;  // for container
    maxWidth?: string;
    maxHeight?: string;  // optional – we’ll keep it but use a safe minimum
};

function formatTime(seconds: number): string {
    if (!isFinite(seconds) || seconds < 0) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60)
        .toString()
        .padStart(2, "0");
    return `${mins}:${secs}`;
}

export function AudioTrack({
                               id,
                               src,
                               autoPlay,
                               className,
                               maxWidth,
                               maxHeight,
                           }: AudioTrackProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const {registerAudio, handlePlay} = useAudioManager();

    const [isPlaying, setIsPlaying] = useState(false);
    const [duration, setDuration] = useState(0);
    const [currentTime, setCurrentTime] = useState(0);

    // register with audio manager
    useEffect(() => {
        registerAudio(id, audioRef.current);
    }, [id, registerAudio]);

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
            setIsPlaying(false);
        } else {
            el
                .play()
                .then(() => {
                    setIsPlaying(true);
                    handlePlay(id); // let manager stop others
                })
                .catch(() => {
                    // user gesture required etc.
                });
        }
    };

    const handleSeek = (value: number) => {
        const el = audioRef.current;
        if (!el || !duration) return;
        el.currentTime = value;
        setCurrentTime(value);
    };

    return (
        <div
            className={`
        inline-flex items-center gap-3 rounded-md
        bg-black/70 border border-zinc-700
        px-3 py-2 text-[0.7rem] text-zinc-100
        shadow-sm backdrop-blur-sm
        shrink-0
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
                className="hidden"
                onPlay={() => {
                    setIsPlaying(true);
                    handlePlay(id);
                }}
                onPause={() => setIsPlaying(false)}
                onTimeUpdate={(e) => setCurrentTime(e.currentTarget.currentTime)}
                onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
                onEnded={() => {
                    setIsPlaying(false);
                    setCurrentTime(0);
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

            <div className="flex items-center gap-2 min-w-0">
                {/* progress bar */}
                <input
                    type="range"
                    min={0}
                    max={duration || 0}
                    step={0.1}
                    value={currentTime}
                    onChange={(e) => handleSeek(Number(e.target.value))}
                    className="
      h-1 w-28 sm:w-32
      cursor-pointer
      accent-blue-400
    "
                />

                {/* time + playing indicator */}
                <div className="flex items-center gap-1">
    <span className="whitespace-nowrap text-[0.65rem] text-zinc-300">
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
