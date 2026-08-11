import { trackMetaInteraction } from "@/lib/meta-pixel";

export async function trackInteraction(data: {
    song: string;
    action: "service_click" | "social_click" | "preview_play" | "lyrics_review" | "song_page_visited";
    service?: string;
    project?: string;
}) {
    try {
        trackMetaInteraction(data);

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

        const text = await response.text();
        console.log("Tracking success", text);
    } catch (error) {
        console.error("Tracking request error", error);
    }
}
