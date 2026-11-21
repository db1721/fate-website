"use client";

import type { ReactNode } from "react";
import { Menu } from "lucide-react";

export function MobileNavigation({ children }: { children: ReactNode }) {
    return (
        <details
            className="relative col-start-2 justify-self-end md:hidden"
            onClick={(event) => {
                if (event.target instanceof Element && event.target.closest("a[href]")) {
                    event.currentTarget.open = false;
                }
            }}
            onKeyDown={(event) => {
                if (event.key === "Escape" && event.currentTarget.open) {
                    event.currentTarget.open = false;
                    event.currentTarget.querySelector("summary")?.focus();
                }
            }}
        >
            <summary
                className="flex h-11 w-11 cursor-pointer list-none items-center justify-center rounded-md border border-zinc-700 text-zinc-100 transition hover:border-zinc-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--artist-accent-bright)] [&::-webkit-details-marker]:hidden"
                aria-label="Toggle navigation menu"
            >
                <Menu className="h-5 w-5" aria-hidden="true" />
            </summary>
            {children}
        </details>
    );
}
