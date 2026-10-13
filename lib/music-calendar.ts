export const MUSIC_RELEASE_TIME_ZONE = "America/New_York";

/** Music dates are calendar dates, not instants to shift into the viewer's time zone. */
export function parseMusicReleaseDate(value?: string): Date | null {
    if (!value?.trim()) return null;
    const text = value.trim();
    const iso = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
    const slash = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    const parts = iso ? [Number(iso[1]), Number(iso[2]), Number(iso[3])] : slash ? [Number(slash[3]), Number(slash[1]), Number(slash[2])] : null;
    if (!parts) return null;
    const [year, month, day] = parts;
    if (year < 1) return null;
    const date = new Date(0);
    date.setUTCFullYear(year, month - 1, day);
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? date : null;
}

export function musicReleaseDateIso(value?: string): string | undefined {
    return parseMusicReleaseDate(value)?.toISOString().slice(0, 10);
}

/** Feature scheduling accepts only the app's exact, real ISO calendar dates. */
export function musicFeatureDateIso(value: unknown): string | undefined {
    return typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)
        ? musicReleaseDateIso(value)
        : undefined;
}

export function musicCalendarToday(now = new Date()): string {
    const parts = new Intl.DateTimeFormat("en-US", { timeZone: MUSIC_RELEASE_TIME_ZONE, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(now);
    return `${parts.find((part) => part.type === "year")!.value}-${parts.find((part) => part.type === "month")!.value}-${parts.find((part) => part.type === "day")!.value}`;
}

export function isFutureCatalogRelease(value: string | undefined, now = new Date()): boolean {
    const date = musicReleaseDateIso(value);
    return Boolean(date && date > musicCalendarToday(now));
}

export function isCatalogSongReleased(value: string | undefined, now = new Date()): boolean {
    return Boolean(musicReleaseDateIso(value)) && !isFutureCatalogRelease(value, now);
}
