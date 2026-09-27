import { parse } from "node-html-parser";

export function extractLyrics(source: string, contentType: string): string {
    if (contentType.includes("text/plain")) return source.trim();
    if (!contentType.includes("text/html")) {
        throw new Error("Unsupported lyrics response type");
    }

    const document = parse(source);
    const section = document.querySelector('section[aria-label$=" lyrics"]');
    if (!section) throw new Error("Lyrics section not found");

    section.querySelectorAll("script, style, template, noscript").forEach((node) => node.remove());
    section.querySelectorAll("br").forEach((node) => node.replaceWith("\n"));

    // The publisher uses one paragraph per line, including blank verse separators.
    const paragraphs = section.querySelectorAll("p");
    const lyrics = paragraphs.length
        ? paragraphs.map((paragraph) => paragraph.text.trim()).join("\n")
        : section.structuredText;

    const normalized = lyrics.replace(/\r\n?/g, "\n").trim();
    if (!normalized) throw new Error("Lyrics section is empty");
    return normalized;
}

export async function loadLyricsFromUrl(lyricsUrl?: string): Promise<string> {
    if (!lyricsUrl) return "";

    try {
        const url = new URL(lyricsUrl);
        if (url.protocol !== "https:") throw new Error("Lyrics URLs must use HTTPS");

        const response = await fetch(url.href, {
            next: { revalidate: 3600 },
            signal: AbortSignal.timeout(8000),
        });
        if (!response.ok) throw new Error(`Lyrics request failed (${response.status})`);

        return extractLyrics(await response.text(), response.headers.get("content-type") ?? "");
    } catch (error) {
        // Lyrics are optional: a publisher outage must not break the song page.
        console.error("Could not load remote lyrics", lyricsUrl, error);
        return "";
    }
}
