'use client';

import { useEffect, useRef } from 'react';
import { useAudioManager } from '@/app/context/audio-manager';

type AudioTrackProps = {
    id: string;          // unique id for this track (e.g. slug)
    src: string;         // /audio/path.mp3
    autoPlay?: boolean;  // for hero, if you want
    className?: string;
};

export function AudioTrack({ id, src, autoPlay, className }: AudioTrackProps) {
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const { registerAudio, handlePlay } = useAudioManager();

    useEffect(() => {
        // register this audio element with the manager
        registerAudio(id, audioRef.current);
    }, [id, registerAudio]);

    // Optional: attempt autoplay (browsers may block without user interaction)
    useEffect(() => {
        if (autoPlay && audioRef.current) {
            audioRef.current
                .play()
                .then(() => {
                    handlePlay(id);
                })
                .catch(() => {
                    // Autoplay blocked – you could show a "Play" button if you want
                });
        }
    }, [autoPlay, id, handlePlay]);

    return (
        <audio
            ref={audioRef}
            src={src}
            controls
            className={className}
            onPlay={() => handlePlay(id)}
        >
            Your browser does not support the audio element.
        </audio>
    );
}
