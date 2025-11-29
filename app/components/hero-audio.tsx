'use client';

import { useEffect, useRef } from 'react';
import bandInfo from "@/app/config/fate-info";

export function HeroAudio() {
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const heroTrack = bandInfo.FEATURED_TRACK.audioSrc

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        audio.volume = 0.6;

        const tryPlay = async () => {
            try {
                await audio.play();
            } catch {
                // Autoplay blocked: audio will stay paused until user interacts.
                // You can show a "Play" button in the hero if you want.
            }
        };

        tryPlay();

        return () => {
            audio.pause();
        };
    }, []);

    return (
        <audio
            ref={audioRef}
    src={heroTrack}
    preload="auto"
    loop
    // If you want it totally invisible:
    className="hidden"
        />
);
}