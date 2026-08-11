import { BURIED_IN_RUIN_ARTIST } from "@/app/config/artists/buried-in-ruin";
import { FATE_ARTIST } from "@/app/config/artists/fate";
import type { ArtistConfig, ArtistId } from "@/app/config/artists/types";

export const ARTISTS: ArtistConfig[] = [FATE_ARTIST, BURIED_IN_RUIN_ARTIST];

export function getArtistById(id: ArtistId) {
    return ARTISTS.find((artist) => artist.id === id) ?? null;
}

export function getArtistSongPath(artist: ArtistConfig, songSlug: string) {
    return `${artist.musicPathPrefix}/${songSlug}`;
}

export { BURIED_IN_RUIN_ARTIST, FATE_ARTIST };
export type { ArtistConfig, ArtistId } from "@/app/config/artists/types";
