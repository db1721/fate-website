export async function trackInteraction(data: {
    song: string;
    action: "service_click" | "preview_play" | "lyrics_review";
    service?: string;
}) {
    try {
        await fetch("/api/track-interaction", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...data,
                page: window.location.pathname,
                userAgent: navigator.userAgent,
            }),
            keepalive: true,
        });
    } catch (error) {
        console.error("Tracking failed", error);
    }
}