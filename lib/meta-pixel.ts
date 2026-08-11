type MetaPixelValue =
    | string
    | number
    | boolean
    | string[]
    | number[]
    | null
    | undefined;

type MetaPixelParameters = Record<string, MetaPixelValue>;

type TrackInteractionPayload = {
    song: string;
    project?: string;
    action:
        | "service_click"
        | "social_click"
        | "preview_play"
        | "lyrics_review"
        | "song_page_visited";
    service?: string;
};

declare global {
    interface Window {
        fbq?: (
            command: "track" | "trackCustom" | "init",
            eventName: string,
            parameters?: MetaPixelParameters
        ) => void;
    }
}

function cleanMetaParams(parameters?: MetaPixelParameters): MetaPixelParameters | undefined {
    if (!parameters) return undefined;

    return Object.fromEntries(
        Object.entries(parameters).filter(([, value]) => {
            if (value === null || typeof value === "undefined") return false;
            if (typeof value === "string") return value.trim().length > 0;
            if (Array.isArray(value)) return value.length > 0;
            return true;
        })
    ) as MetaPixelParameters;
}

export function trackMetaEvent(eventName: string, parameters?: MetaPixelParameters) {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;

    window.fbq("track", eventName, cleanMetaParams(parameters));
}

export function trackMetaCustomEvent(eventName: string, parameters?: MetaPixelParameters) {
    if (typeof window === "undefined" || typeof window.fbq !== "function") return;

    window.fbq("trackCustom", eventName, cleanMetaParams(parameters));
}

export function trackMetaPageView() {
    trackMetaEvent("PageView");
}

export function trackMetaInteraction({
    song,
    project = "fate",
    action,
    service,
}: TrackInteractionPayload) {
    const baseParams: MetaPixelParameters = {
        content_name: song,
        content_category: "music",
        content_ids: [`${project}:${song}`],
        content_type: "music",
        project,
        service,
    };

    if (action === "song_page_visited") {
        trackMetaEvent("ViewContent", baseParams);
        trackMetaCustomEvent("SongPageVisited", baseParams);
        return;
    }

    if (action === "preview_play") {
        trackMetaCustomEvent("MusicPreviewPlay", baseParams);
        return;
    }

    if (action === "lyrics_review") {
        trackMetaCustomEvent("LyricsReview", baseParams);
        return;
    }

    if (action === "service_click") {
        const leadParams = {
            ...baseParams,
            lead_type: "streaming_click",
        };

        trackMetaCustomEvent("StreamingServiceClick", leadParams);
        trackMetaEvent("Lead", leadParams);
        return;
    }

    if (action === "social_click") {
        trackMetaCustomEvent("SocialClick", {
            ...baseParams,
            lead_type: "social_click",
        });
    }
}
