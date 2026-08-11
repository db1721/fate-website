import { ArtistSite } from "@/app/components/artist-site";
import { BURIED_IN_RUIN_ARTIST } from "@/app/config/artists";
import { generateArtistMetadata } from "@/app/config/artists/metadata";

export const revalidate = 3600;
export const metadata = generateArtistMetadata(BURIED_IN_RUIN_ARTIST);

export default function BuriedInRuinHome() {
    return <ArtistSite artist={BURIED_IN_RUIN_ARTIST} />;
}
