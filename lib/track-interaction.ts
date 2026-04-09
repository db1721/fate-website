export async function trackInteraction(data: {
    song: string;
    action: "service_click" | "preview_play" | "lyrics_review" | "song_page_visited";
    service?: string;
}) {
    try {
        const params = new URLSearchParams(window.location.search);

        const source = params.get("utm_source");
        const medium = params.get("utm_medium");
        const campaign = params.get("utm_campaign");

        const response = await fetch(
            `${process.env.NEXT_PUBLIC_DJANGO_API_URL}/api/music/track-interaction/`,
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

        if (!response.ok) {
            console.error("Tracking failed", {
                status: response.status,
                statusText: response.statusText,
                body: text,
            });
            return;
        }

        console.log("Tracking success", text);
    } catch (error) {
        console.error("Tracking request error", error);
    }
}