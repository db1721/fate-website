import {COLORS} from "@/app/theme";
import bandInfo from "@/app/config/fate-info";

export function ContactSection() {
    return (
        <section
            id="contact"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgAlt }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row">
                {/* Contact info */}
                <div className="lg:w-1/3">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        Contact
                    </h2>
                    <div className="mt-4 space-y-2 text-sm text-zinc-200">
                        <p>- &lt; {bandInfo.band_name} &gt; -</p>
                        <p>New York</p>
                        <p
                            className="mt-3"
                            style={{ color: COLORS.accent }}
                        >
                            contact@yourbandname.com
                        </p>
                    </div>
                </div>

                {/* Contact form */}
                <div className="lg:w-2/3">
                    <form className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1 sm:col-span-1">
                            <label
                                htmlFor="nom"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Name
                            </label>
                            <input
                                id="nom"
                                type="text"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="Your name"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-1">
                            <label
                                htmlFor="telephone"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Phone
                            </label>
                            <input
                                id="telephone"
                                type="tel"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="Your phone"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <label
                                htmlFor="mail"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Email
                            </label>
                            <input
                                id="mail"
                                type="email"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <label
                                htmlFor="message"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="Your message"
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                Subscribe newsletter?
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-zinc-200">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="newsletter" value="yes" />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="newsletter" value="no" />
                                    No
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                Are you human?
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-200">3 + 4 =</span>
                                <input
                                    id="checkRobot"
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

                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className="mt-2 w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
                                style={{ backgroundColor: COLORS.accent }}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}