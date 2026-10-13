import { ArtistSite } from "@/app/components/artist-site";
import { BURIED_IN_RUIN_ARTIST } from "@/app/config/artists";
import { generateArtistMetadata } from "@/app/config/artists/metadata";
import { loadArtistCatalog } from "@/lib/public-catalog.server";

export const dynamic = "force-dynamic";
export const metadata = generateArtistMetadata(BURIED_IN_RUIN_ARTIST);

export default async function BuriedInRuinHome() {
    return <ArtistSite artist={await loadArtistCatalog(BURIED_IN_RUIN_ARTIST)} />;
}
