import type { FeaturedTrack } from "@/app/config/artists/types";

function parseFeatureDate(dateString: string): Date | null {
    const slashDate = dateString.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);

    if (slashDate) {
        const [, month, day, year] = slashDate;
        return new Date(Number(year), Number(month) - 1, Number(day));
    }

    const parsed = new Date(dateString);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function getCurrentFeaturedTrack(
    tracks: FeaturedTrack[],
    now = new Date()
): FeaturedTrack | null {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const scheduled = tracks
        .map((track) => ({ track, date: parseFeatureDate(track.featureDate) }))
        .filter((item): item is { track: FeaturedTrack; date: Date } => Boolean(item.date))
        .sort((a, b) => a.date.getTime() - b.date.getTime());

    const active = scheduled.filter((item) => item.date <= today).at(-1);

    // Keep the hero populated before the first scheduled date, then advance on schedule.
    return active?.track ?? scheduled[0]?.track ?? tracks[0] ?? null;
}
