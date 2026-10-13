import type { FeaturedTrack } from "@/app/config/artists/types";
import { musicCalendarToday, musicFeatureDateIso } from "../../../lib/music-calendar.ts";

export function getCurrentFeaturedTrack(
    tracks: FeaturedTrack[],
    now = new Date()
): FeaturedTrack | null {
    const today = musicCalendarToday(now);
    let selected: FeaturedTrack | null = null;
    let latestDate = "";
    for (const track of tracks) {
        const date = musicFeatureDateIso(track.featureDate);
        // Equal dates retain catalog order; never feature future or undated tracks.
        if (date && date <= today && date > latestDate) {
            selected = track;
            latestDate = date;
        }
    }
    return selected;
}
