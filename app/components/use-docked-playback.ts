"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ArtistId, ImageSource } from "@/app/config/artists/types";
import { useAudioManager } from "@/app/context/audio-manager";
import { getAudioDuration } from "@/lib/audio-preview";
import { trackInteraction } from "@/lib/track-interaction";

export type DockedTrack = {
    id: string;
    title: string;
    src: string;
    coverSrc: ImageSource;
};

const playbackError = "Couldn’t play this track. Try again.";

function releaseSource(audio: HTMLAudioElement) {
    if (!audio.hasAttribute("src")) return;
    audio.pause();
    audio.removeAttribute("src");
    audio.load();
}

export function useDockedPlayback(projectId: ArtistId) {
    const { registerAudio } = useAudioManager();
    const audioRef = useRef<HTMLAudioElement>(null);
    const selected = useRef<DockedTrack | null>(null);
    const playRequest = useRef(0);
    const [activeTrack, setActiveTrack] = useState<DockedTrack | null>(null);
    const [playing, setPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;
        const unregister = registerAudio(audio);
        const tracked = new Set<string>();
        const syncPosition = () => {
            if (!selected.current) return;
            setDuration(getAudioDuration(audio));
            setCurrentTime(audio.ended ? 0 : audio.currentTime);
        };
        const onPlay = () => {
            if (selected.current && !audio.paused) setPlaying(true);
        };
        const onPlaying = () => {
            const track = selected.current;
            if (!track || audio.paused) return;
            if (!tracked.has(track.id)) {
                tracked.add(track.id);
                void trackInteraction({ song: track.id, project: projectId, action: "preview_play" });
            }
        };
        const onPause = () => {
            if (audio.paused) setPlaying(false);
        };
        const onEnded = () => {
            if (!audio.ended) return;
            setPlaying(false);
            setCurrentTime(0);
        };
        const onError = () => {
            if (!selected.current || !audio.error) return;
            setPlaying(false);
            setError(playbackError);
        };
        const listeners = new AbortController();
        const options = { signal: listeners.signal };
        for (const event of ["loadedmetadata", "durationchange", "timeupdate"]) {
            audio.addEventListener(event, syncPosition, options);
        }
        audio.addEventListener("play", onPlay, options);
        audio.addEventListener("playing", onPlaying, options);
        audio.addEventListener("pause", onPause, options);
        audio.addEventListener("ended", onEnded, options);
        audio.addEventListener("error", onError, options);
        return () => {
            listeners.abort();
            playRequest.current += 1;
            unregister();
            releaseSource(audio);
        };
    }, [projectId, registerAudio]);

    const close = useCallback(() => {
        playRequest.current += 1;
        selected.current = null;
        if (audioRef.current) releaseSource(audioRef.current);
        setActiveTrack(null);
        setPlaying(false);
        setCurrentTime(0);
        setDuration(0);
        setError(null);
    }, []);

    function toggleTrack(track: DockedTrack) {
        const audio = audioRef.current;
        if (!audio || !track.src) return;
        const request = ++playRequest.current;
        const changed = selected.current?.id !== track.id || selected.current.src !== track.src;
        if (!changed && !audio.paused && !audio.error) {
            audio.pause();
            return;
        }
        if (changed || audio.error) {
            audio.pause();
            selected.current = track;
            setActiveTrack(track);
            setPlaying(false);
            setCurrentTime(0);
            setDuration(0);
            audio.src = track.src;
            audio.load();
        }
        setError(null);
        // Start in the tap handler so mobile browsers retain the user's playback gesture.
        void audio.play().catch((reason: unknown) => {
            if (request !== playRequest.current || (reason instanceof DOMException && reason.name === "AbortError")) return;
            setPlaying(false);
            setError(playbackError);
        });
    }

    function toggle() {
        if (selected.current) toggleTrack(selected.current);
    }

    function seek(seconds: number) {
        const audio = audioRef.current;
        if (!audio || !selected.current || !Number.isFinite(seconds)) return;
        const length = getAudioDuration(audio);
        if (length <= 0) return;
        audio.currentTime = Math.max(0, Math.min(seconds, length));
        setCurrentTime(audio.currentTime);
    }

    return { audioRef, activeTrack, playing, currentTime, duration, error, toggleTrack, toggle, seek, close };
}
