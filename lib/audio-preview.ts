export function clampAudioPreviewStart(start: number | undefined, duration: number): number {
    const validStart = typeof start === "number" && Number.isFinite(start) && start >= 0 ? start : 0;
    return Number.isFinite(duration) && duration > 0 ? Math.min(validStart, Math.max(0, duration - 0.1)) : validStart;
}

export function formatAudioTime(seconds: number): string {
    if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
    const minutes = Math.floor(seconds / 60);
    const remainder = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${minutes}:${remainder}`;
}

export function getAudioDuration(audio: HTMLAudioElement): number {
    if (Number.isFinite(audio.duration) && audio.duration > 0) return audio.duration;

    if (audio.seekable.length > 0) {
        const end = audio.seekable.end(audio.seekable.length - 1);
        if (Number.isFinite(end) && end > 0) return end;
    }

    return 0;
}
