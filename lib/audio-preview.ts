export function clampAudioPreviewStart(start: number | undefined, duration: number): number {
    const validStart = typeof start === "number" && Number.isFinite(start) && start >= 0 ? start : 0;
    return Number.isFinite(duration) && duration > 0 ? Math.min(validStart, Math.max(0, duration - 0.1)) : validStart;
}
