import {COLORS} from "@/app/theme";
import bandInfo from "@/app/config/fate-info";
import React from "react";

export function DiscoverSection() {
    return (
        <section
            id="discover"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgMain }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                    Discover
                </h2>
                <p className="text-lg font-semibold text-zinc-50">
                    &lt; Your clip name here &gt;
                </p>
                <div
                    className="aspect-video w-full overflow-hidden rounded-xl border bg-black/70"
                    style={{ borderColor: COLORS.border }}
                >
                    <video controls className="h-full w-full object-cover">
                        <source src="/video/your-clip.mp4" type="video/mp4" />
                        Your browser does not support this video file format.
                    </video>
                </div>
            </div>
        </section>
    );
}