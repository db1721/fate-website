import { trackMetaInteraction } from "@/lib/meta-pixel";

export async function trackInteraction(data: {
    song: string;
    action: "service_click" | "social_click" | "preview_play" | "lyrics_review" | "song_page_visited";
    service?: string;
    project?: string;
}) {
    // Ad tracking must not prevent our own event from reaching Django.
    try {
        trackMetaInteraction(data);
    } catch (error) {
        console.error("Meta tracking error", error);
    }

    try {
        const params = new URLSearchParams(window.location.search);

        const source = params.get("utm_source");
        const medium = params.get("utm_medium");
        const campaign = params.get("utm_campaign");

        const response = await fetch(
            `/api/track-interaction/`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ...data,
                    page: window.location.pathname,
                    userAgent: navigator.userAgent,
                    referrer: document.referrer,
                    source,
                    medium,
                    campaign,
                }),
                keepalive: true,
            }
        );

        if (!response.ok) {
            throw new Error(`Tracking request failed with HTTP ${response.status}`);
        }
        const result = await response.json();
        if (result?.ok !== true) throw new Error("Tracking was not acknowledged by the server");
        return true;
    } catch (error) {
        console.error("Tracking request failed", {
            song: data.song,
            action: data.action,
            service: data.service,
            error: error instanceof Error ? error.message : String(error),
        });
        return false;
    }
}
