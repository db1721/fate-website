"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackMetaPageView } from "@/lib/meta-pixel";

export function MetaPixelPageViews() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const isInitialPageView = useRef(true);

    useEffect(() => {
        if (isInitialPageView.current) {
            isInitialPageView.current = false;
            return;
        }

        trackMetaPageView();
    }, [pathname, searchParams]);

    return null;
}
