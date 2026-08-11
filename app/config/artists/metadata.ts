import type { Metadata } from "next";
import type { ArtistConfig, ImageSource } from "@/app/config/artists/types";

function getImageSrc(src: ImageSource) {
    return typeof src === "string" ? src : src.src;
}

export function generateArtistMetadata(artist: ArtistConfig): Metadata {
    const image = getImageSrc(artist.seo.image);

    return {
        title: { absolute: artist.seo.title },
        description: artist.seo.description,
        keywords: artist.seo.keywords,
        alternates: { canonical: artist.homePath },
        openGraph: {
            title: artist.seo.title,
            description: artist.seo.description,
            url: artist.homePath,
            siteName: `${artist.name} Official Music`,
            images: [
                {
                    url: image,
                    width: 1200,
                    height: 1200,
                    alt: `${artist.name} official artwork`,
                },
            ],
            type: "website",
        },
        twitter: {
            card: "summary_large_image",
            title: artist.seo.title,
            description: artist.seo.description,
            images: [image],
        },
    };
}
