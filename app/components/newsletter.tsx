import {COLORS} from "@/app/theme";
import bandInfo from "@/app/config/fate-info";
import React from "react";

export function NewsletterSection() {
    return (
        <section
            id="newsletter"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgAlt }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
                <div className="flex-1">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        Keep update
                    </h2>
                    <p className="mt-3 text-lg font-semibold text-zinc-50">
                        Don&apos;t miss the next shows
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">
                        Join the newsletter for new dates, releases, and exclusive news.
                    </p>
                </div>

                <div
                    className="mt-4 flex-1 rounded-xl border p-4 sm:mt-0"
                    style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
                >
                    <form className="space-y-4">
                        <div className="space-y-1">
                            <label
                                htmlFor="emailNews"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Email
                            </label>
                            <input
                                id="emailNews"
                                type="email"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                    boxShadow: "none",
                                }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                Are you human?
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-200">3 + 4 =</span>
                                <input
                                    id="checkRobotNews"
                                    type="number"
                                    className="w-20 rounded-md border px-3 py-1 text-sm outline-none focus:ring-2"
                                    style={{
                                        backgroundColor: "#000",
                                        borderColor: COLORS.border,
                                        color: COLORS.textPrimary,
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
                            style={{ backgroundColor: COLORS.accent }}
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}
