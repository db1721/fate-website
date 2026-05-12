import Image from "next/image";
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
            className="relative overflow-hidden px-4 py-16 sm:px-8 lg:px-16"
            style={{
                backgroundImage: `radial-gradient(circle at left, ${COLORS.accent} 0, #000 55%)`,
            }}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 left-0 hidden w-[58%] overflow-hidden md:block lg:w-[46%]"
                style={{
                    WebkitMaskImage:
                        "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.62) 48%, transparent 88%)",
                    maskImage:
                        "linear-gradient(to right, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.62) 48%, transparent 88%)",
                }}
            >
                <Image
                    src="/images/about-guitar-room.jpg"
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 46vw, 58vw"
                    className="object-cover object-[42%_center] opacity-[0.28] grayscale brightness-[0.78] contrast-115 saturate-[0.85] mix-blend-luminosity"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_44%,transparent_0,rgba(0,0,0,0.2)_44%,rgba(0,0,0,0.72)_90%),linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.24)_52%,#000_100%),linear-gradient(180deg,rgba(0,0,0,0.68)_0%,transparent_36%,rgba(0,0,0,0.76)_100%)]" />
            </div>

            <div className="relative z-10 mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
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
