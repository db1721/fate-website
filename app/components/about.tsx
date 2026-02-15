import {COLORS} from "@/app/theme";

export function getYearsSince(dateInput: string | Date): number {
    const date = new Date(dateInput);
    const now = new Date();

    let years = now.getFullYear() - date.getFullYear();

    // adjust if the month/day hasn't been reached yet this year
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
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <div className="max-w-xl">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        &lt; ABOUT &gt;
                    </h2>
                    <p className="mt-4 text-xl font-semibold text-zinc-50">
                        &quot;F.A.T.E. (Fight Against The Enemy) is more than a music project&quot;
                    </p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    <p>
                        It’s the culmination of a lifelong obsession with songwriting that has shaped me and, at times,
                        saved me. For over {getYearsSince("2001-12-02")} years, I’ve been writing melodies,
                        building hooks, and turning real experiences into songs. Music has always been where my
                        thoughts get loud enough to understand and where the battles I’ve faced find structure
                        instead of chaos.
                    </p>
                    <p>
                        Songwriting is the craft. Everything else is the vehicle.
                    </p>
                    <p>
                        I write heavy, melodic rock rooted in tension, release, and emotional honesty. Every
                        lyric starts as something lived. Every chorus is built to hit hard enough to mean something.
                        Every melody crafted for long-term resonance.
                    </p>
                    <p>
                        What began as riffs, raw demos, and notebook lyrics has evolved with modern production tools
                        into something far more expansive — cinematic, detailed, unapologetic.
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