import { ArtistSite } from "@/app/components/artist-site";
import { FATE_ARTIST } from "@/app/config/artists";
import { generateArtistMetadata } from "@/app/config/artists/metadata";
import { loadArtistCatalog } from "@/lib/public-catalog.server";

export const dynamic = "force-dynamic";
export const metadata = generateArtistMetadata(FATE_ARTIST);

export default async function Home() {
    return <ArtistSite artist={await loadArtistCatalog(FATE_ARTIST)} />;
}
