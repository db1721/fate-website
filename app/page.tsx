import { ArtistSite } from "@/app/components/artist-site";
import { FATE_ARTIST } from "@/app/config/artists";
import { generateArtistMetadata } from "@/app/config/artists/metadata";

export const revalidate = 3600;
export const metadata = generateArtistMetadata(FATE_ARTIST);

export default function Home() {
    return <ArtistSite artist={FATE_ARTIST} />;
}
