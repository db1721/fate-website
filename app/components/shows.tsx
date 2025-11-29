import {COLORS} from "@/app/theme";
import React from "react";

export function ShowsSection() {
    const shows = [
        "29/11/2019 · Madison Square Garden · Manhattan · 21h",
        "20/09/2019 · Carnegie Hall · Manhattan · 21h",
        "26/07/2019 · Fox Theater · Detroit · 21h",
        "20/07/2019 · Apollo Theater · Manhattan · 21h",
        "10/05/2019 · 924 Gilman Street · Berkeley · 21h",
    ];

    return (
        <section
            id="shows"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgMain }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                    Shows
                </h2>
                <div className="space-y-4 text-sm text-zinc-200 sm:text-base">
                    {shows.map((line) => (
                        <p
                            key={line}
                            className="flex flex-col border-b pb-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                            style={{ borderColor: COLORS.border }}
                        >
                            <span>{line}</span>
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}
