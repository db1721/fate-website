import { COLORS } from "@/app/theme";

export function getYearsSince(dateInput: string | Date): number {
    const date = new Date(dateInput);
    const now = new Date();
    let years = now.getFullYear() - date.getFullYear();

    const hasNotHadAnniversaryThisYear =
        now.getMonth() < date.getMonth() ||
        (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());

    if (hasNotHadAnniversaryThisYear) {
        years--;
    }

    return years;
}

export function AboutSection() {
    return (
        <section
            id="about"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{
                backgroundImage: `radial-gradient(circle at left, ${COLORS.accent} 0, #000 55%)`,
            }}
        >
            <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div className="max-w-xl">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        About
                    </h2>
                    <p className="mt-4 text-2xl font-black uppercase tracking-wide text-zinc-50 sm:text-3xl">
                        Heavy songs with a reason to fight back
                    </p>
                    <p className="mt-4 text-sm leading-6 text-zinc-400">
                        F.A.T.E. stands for Fight Against the Enemy: the pressure, fear, doubt, grief,
                        and inner battles people carry long before anyone hears the song.
                    </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    <p>
                        It’s the culmination of a lifelong obsession with songwriting that has shaped me and, at times,
                        saved me. For over {getYearsSince("2001-12-02")} years, I’ve been writing melodies,
                        building hooks, and turning real experiences into songs. Music has always been where my
                        mind can escape when I can't escape reality and where I can comfortably express my emotions.
                    </p>
                    <p>
                        The sound lives in modern melodic rock: heavy guitars, cinematic production, emotional vocals,
                        and choruses built to stick after the first listen.
                    </p>
                    <p>
                        What began as riffs, raw demos, and notebook lyrics has evolved with modern production tools
                        into something far more expansive.
                    </p>
                    <p>
                        The vocal identity is built from my original recordings and developed into a custom AI vocal
                        profile that carries my phrasing and emotion. I shape the drum programming and experiment with
                        tone and impact myself, building each track with intention from the rhythm up. Modern tools
                        allow the songs to reach the scale and depth I’ve always envisioned.
                    </p>
                    <p>
                        The long-term goal is simple: write songs that bands want to perform and that crowds want to scream back.
                        It’s a dream I’ve carried since I was a kid — and I’m building it song by song.
                    </p>
                    <p>
                        Welcome to F.A.T.E.
                        The fight starts here.
                    </p>
                </div>
            </div>
        </section>
    );
}
