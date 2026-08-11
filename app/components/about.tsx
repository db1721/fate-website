import Image from "next/image";
import type { ArtistConfig } from "@/app/config/artists/types";

export function AboutSection({ artist }: { artist: ArtistConfig }) {
    return (
        <section
            id="about"
            data-reveal
            className="relative overflow-hidden px-4 py-16 sm:px-8 lg:px-16"
            style={{
                backgroundImage:
                    "radial-gradient(circle at left, color-mix(in srgb, var(--artist-accent) 72%, transparent) 0, #000 58%)",
            }}
        >
            {artist.about.image ? (
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
                        src={artist.about.image}
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 46vw, 58vw"
                        className="object-cover opacity-[0.3] grayscale brightness-[0.72] contrast-125 saturate-[0.8] mix-blend-luminosity"
                        style={{ objectPosition: artist.about.imagePosition ?? "center" }}
                    />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_44%,transparent_0,rgba(0,0,0,0.2)_44%,rgba(0,0,0,0.72)_90%),linear-gradient(90deg,rgba(0,0,0,0)_0%,rgba(0,0,0,0.24)_52%,#000_100%),linear-gradient(180deg,rgba(0,0,0,0.68)_0%,transparent_36%,rgba(0,0,0,0.76)_100%)]" />
                </div>
            ) : null}

            <div className="relative z-10 mx-auto grid max-w-5xl gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
                <div className="max-w-xl">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">About</h2>
                    <p className="mt-4 text-2xl font-black uppercase tracking-wide text-zinc-50 sm:text-3xl">
                        {artist.about.title}
                    </p>
                    <p className="mt-4 text-sm leading-6 text-zinc-400">
                        {artist.about.intro}
                    </p>
                </div>

                <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    {artist.about.paragraphs.map((paragraph) => (
                        <p key={paragraph}>{paragraph}</p>
                    ))}
                </div>
            </div>
        </section>
    );
}
