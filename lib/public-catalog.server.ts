import { cache } from "react";
import type { ArtistConfig } from "@/app/config/artists/types";
import { fetchArtistCatalog } from "@/lib/public-catalog";

// React cache only deduplicates within a server render; publication is rechecked on every request.
export const loadArtistCatalog = cache((artist: ArtistConfig) => fetchArtistCatalog(
    artist,
    artist.id === "fate" ? process.env.MUSIC_CATALOG_FATE_URL : process.env.MUSIC_CATALOG_BURIED_IN_RUIN_URL,
));
