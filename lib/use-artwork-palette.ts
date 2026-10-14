"use client";

import { useEffect, useState } from "react";
import { getImageProps } from "next/image";
import { paletteFromSwatches, type ArtworkPalette } from "./artwork-palette";

export function useArtworkPalette(imageSrc: string, fallback: ArtworkPalette) {
    const [extracted, setExtracted] = useState<{ src: string; palette: ArtworkPalette } | null>(null);
    const { primary, secondary, dark } = fallback;

    useEffect(() => {
        let cancelled = false;
        async function extract() {
            try {
                // Sample a small same-origin thumbnail: catalog artwork need not enable CORS.
                const { props } = getImageProps({ src: imageSrc, alt: "", width: 96, height: 96 });
                const { Vibrant } = await import("node-vibrant/browser");
                if (cancelled) return;
                const swatches = await Vibrant.from(props.src).getPalette();
                if (!cancelled) {
                    setExtracted({ src: imageSrc, palette: paletteFromSwatches(swatches, { primary, secondary, dark }) });
                }
            } catch {
                // The artist gradient and colored artwork remain visible if extraction fails.
                if (!cancelled) setExtracted(null);
            }
        }
        void extract();
        return () => { cancelled = true; };
    }, [imageSrc, primary, secondary, dark]);

    // Never show the last song's palette while the next cover is being sampled.
    return extracted?.src === imageSrc ? extracted.palette : fallback;
}
