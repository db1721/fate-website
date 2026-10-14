export type ArtworkPalette = {
    primary: string;
    secondary: string;
    dark: string;
};

type Swatch = { hex: string; population: number };
type Swatches = Partial<Record<"Vibrant" | "LightVibrant" | "DarkVibrant" | "Muted" | "LightMuted" | "DarkMuted", Swatch | null>>;

function rgb(hex: string) {
    const value = hex.replace("#", "");
    const normalized = value.length === 3
        ? value.split("").map((character) => character + character).join("")
        : value;
    return [0, 2, 4].map((offset) => Number.parseInt(normalized.slice(offset, offset + 2), 16));
}

export function artworkColor(hex: string, alpha: number) {
    return `rgba(${rgb(hex).join(", ")}, ${alpha})`;
}

export function paletteFromSwatches(swatches: Swatches, fallback: ArtworkPalette): ArtworkPalette {
    // Ignore synthesized Vibrant swatches so monochrome covers stay monochrome.
    const colors = [swatches.Vibrant, swatches.Muted, swatches.LightVibrant,
        swatches.LightMuted, swatches.DarkVibrant, swatches.DarkMuted]
        .filter((swatch): swatch is Swatch => Boolean(swatch && swatch.population > 0 && /^#[\da-f]{6}$/i.test(swatch.hex)));
    if (!colors.length) return fallback;

    const primary = colors[0].hex;
    const secondary = colors.find((swatch) => swatch.hex !== primary)?.hex ?? primary;
    const darkest = [...colors].sort((a, b) => {
        const luminance = (hex: string) => {
            const [r, g, b] = rgb(hex);
            return r * 0.2126 + g * 0.7152 + b * 0.0722;
        };
        return luminance(a.hex) - luminance(b.hex);
    })[0].hex;
    const dark = `#${rgb(darkest).map((channel) => Math.round(channel * 0.28).toString(16).padStart(2, "0")).join("")}`;

    return { primary, secondary, dark };
}

export function artworkBackground(palette: ArtworkPalette) {
    return `linear-gradient(125deg, ${artworkColor(palette.primary, 0.42)} 0%, transparent 55%), linear-gradient(235deg, ${artworkColor(palette.secondary, 0.36)} 0%, transparent 65%), linear-gradient(180deg, ${palette.dark} 0%, #050505 100%)`;
}
