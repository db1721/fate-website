import {COLORS} from "@/app/theme";
import bandInfo from "@/app/config/fate-info";

type HeroSectionProps = {
    onScrollDown: () => void;
};

export function HeroSection({ onScrollDown }: HeroSectionProps) {
    return (
        <section
            id="hero"
            data-reveal
            className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-8 lg:px-16"
        >
            {/* Background gradient */}
            <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage: `radial-gradient(circle at top, ${COLORS.accent} 0, #000 55%)`,
                }}
            />
            <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 text-center sm:items-start sm:text-left">
                {/* Socials */}
                <div className="flex items-center gap-4">
                    <button
                        className="rounded-full border px-4 py-1 text-xs uppercase tracking-[0.18em] text-zinc-200 hover:bg-zinc-900"
                        style={{ borderColor: COLORS.border }}
                    >
                        Facebook
                    </button>
                    <button
                        className="rounded-full border px-4 py-1 text-xs uppercase tracking-[0.18em] text-zinc-200 hover:bg-zinc-900"
                        style={{ borderColor: COLORS.border }}
                    >
                        Instagram
                    </button>
                </div>

                {/* Band name + tagline */}
                <div className="flex flex-col gap-4">
                    {/*<p className="text-xs uppercase tracking-[0.3em] text-zinc-300">*/}
                    {/*    Rock shows*/}
                    {/*</p>*/}
                    <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
                        {bandInfo.band_name_full}
                    </h1>
                </div>

                {/* Next show card */}
                {/*<div*/}
                {/*    id="nextShow"*/}
                {/*    className="w-full max-w-xl rounded-xl border p-5 backdrop-blur-md sm:flex sm:items-center sm:justify-between"*/}
                {/*    style={{*/}
                {/*        backgroundColor: COLORS.surface,*/}
                {/*        borderColor: COLORS.border,*/}
                {/*    }}*/}
                {/*>*/}
                {/*    <div>*/}
                {/*        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">*/}
                {/*            Next show*/}
                {/*        </p>*/}
                {/*        <p className="mt-2 text-lg font-semibold">*/}
                {/*            29 / 11 — Madison Square Garden*/}
                {/*        </p>*/}
                {/*        <p className="text-sm text-zinc-400">Manhattan · 21:00</p>*/}
                {/*    </div>*/}
                {/*    <div className="mt-4 text-right sm:mt-0">*/}
                {/*        <button*/}
                {/*            className="text-xs font-semibold uppercase tracking-[0.2em]"*/}
                {/*            style={{ color: COLORS.accent }}*/}
                {/*        >*/}
                {/*            Show all dates ➜*/}
                {/*        </button>*/}
                {/*    </div>*/}
                {/*</div>*/}
            </div>

            {/* Scroll down tag */}
            {/*<button*/}
            {/*    onClick={onScrollDown}*/}
            {/*    className="relative z-10 mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-zinc-300"*/}
            {/*>*/}
            {/*    <span className="h-px w-8 bg-zinc-500" />*/}
            {/*    Scroll*/}
            {/*</button>*/}
        </section>
    );
}