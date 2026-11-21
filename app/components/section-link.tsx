"use client";

import type { ComponentPropsWithoutRef, MouseEvent } from "react";

type SectionLinkProps = Pick<ComponentPropsWithoutRef<"a">, "children" | "className" | "style"> & {
    href: `#${string}`;
};

export function SectionLink({ href, ...props }: SectionLinkProps) {
    function navigate(event: MouseEvent<HTMLAnchorElement>) {
        if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
        if (window.location.hash === href) return;

        // Native fragment navigation scrolls and focuses the target, but its new
        // history entry needs the artist route's state for Next to restore it on Back.
        event.preventDefault();
        const routeState = window.history.state;
        window.location.hash = href;
        window.history.replaceState(routeState, "");
    }

    return <a href={href} onClick={navigate} {...props} />;
}
