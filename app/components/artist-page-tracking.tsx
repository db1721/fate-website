"use client";

import { useEffect, useRef } from "react";
import { track } from "@vercel/analytics";
import type { ArtistId } from "@/app/config/artists/types";
import { trackMetaCustomEvent } from "@/lib/meta-pixel";

export function ArtistPageTracking({
    projectId,
    artistName,
}: {
    projectId: ArtistId;
    artistName: string;
}) {
    const trackedRef = useRef(false);

    useEffect(() => {
        if (trackedRef.current) return;
        trackedRef.current = true;

        const parameters = {
            project: projectId,
            content_name: artistName,
            content_category: "artist_project",
            content_ids: [projectId],
            content_type: "music",
        };

        track("artist_project_view", {
            project: projectId,
            artist: artistName,
        });
        trackMetaCustomEvent("ArtistProjectView", parameters);
    }, [artistName, projectId]);

    return null;
}
