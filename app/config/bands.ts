import fate from "@/app/config/fate-info";
import aoc from "@/app/config/aoc-info";

export const BANDS = {
    fate,
    aoc,
} as const;

export type BandKey = keyof typeof BANDS;

export function getBandInfo(band?: string) {
    const key = (band?.toLowerCase() as BandKey) || "fate";
    return BANDS[key] ?? BANDS.fate;
}
