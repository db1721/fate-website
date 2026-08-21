import Image from "next/image";
import Link from "next/link";
import { AudioTrack } from "@/app/components/audio-track";
import { SocialIcons } from "@/app/components/shared/socials";
import type { ArtistConfig, FeaturedTrack } from "@/app/config/artists/types";
import { getArtistSongPath } from "@/app/config/artists";
import { STREAMING_NETWORKS, filterLinksByNetwork } from "@/app/config/link-groups";
import { slugify } from "@/lib/utils";

type HeroSectionProps = {
    artist: ArtistConfig;
    featuredTrack: FeaturedTrack | null;
};

export function HeroSection({ artist, featuredTrack }: HeroSectionProps) {
    const isBuriedInRuin = artist.id === "buried-in-ruin";
    const heroLinks = filterLinksByNetwork(artist.socialLinks, STREAMING_NETWORKS);
    const featuredPath = featuredTrack
        ? getArtistSongPath(artist, slugify(featuredTrack.title))
        : null;

    return (
        <section
            id="hero"
            className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-8 lg:px-16"
        >
            <div
                className="pointer-events-none absolute inset-0"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 18%, ${artist.theme.heroGlow} 0, transparent 34%),
                        radial-gradient(circle at 78% 55%, ${artist.theme.secondaryGlow} 0, transparent 30%),
                        linear-gradient(180deg, ${artist.theme.background} 0%, ${artist.theme.backgroundAlt} 58%, #000 100%)
                    `,
                }}
            />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:54px_54px] opacity-[0.05]" />

            {artist.hero.image ? (
                <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 right-0 hidden w-[68%] overflow-hidden sm:block lg:w-[56%]"
                    style={{
                        WebkitMaskImage:
                            "linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.68) 46%, transparent 86%)",
                        maskImage:
                            "linear-gradient(to left, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.68) 46%, transparent 86%)",
                    }}
                >
                    <Image
                        src={artist.hero.image}
                        alt=""
                        fill
                        priority
                        sizes="(min-width: 1024px) 56vw, 68vw"
                        className={isBuriedInRuin
                            ? "object-cover opacity-[0.34] brightness-[0.72] contrast-125 sm:opacity-[0.4] lg:opacity-[0.48]"
                            : "object-cover opacity-[0.3] grayscale brightness-[0.82] contrast-125 mix-blend-luminosity sm:opacity-[0.34] lg:opacity-[0.4]"}
                        style={{ objectPosition: artist.hero.imagePosition ?? "center" }}
                    />
                    <div
                        className="absolute inset-0"
                        style={{
                            background: `radial-gradient(circle at 72% 42%, transparent 0, color-mix(in srgb, ${artist.theme.background} 18%, transparent) 34%, color-mix(in srgb, ${artist.theme.background} 62%, transparent) 88%), linear-gradient(90deg, ${artist.theme.background} 0%, color-mix(in srgb, ${artist.theme.background} 52%, transparent) 38%, transparent 100%), linear-gradient(180deg, color-mix(in srgb, ${artist.theme.background} 48%, transparent) 0%, transparent 42%, rgba(0,0,0,0.68) 100%)`,
                        }}
                    />
                </div>
            ) : null}

            <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-14">
                <div className="space-y-7 text-center lg:text-left">
                    <div className="space-y-4">
                        <p
                            className="text-xs font-semibold uppercase tracking-[0.34em]"
                            style={{ color: "var(--artist-accent-bright)" }}
                        >
                            {artist.hero.eyebrow}
                        </p>

                        <h1 className="mx-auto max-w-2xl lg:mx-0">
                            <span className="sr-only">{artist.name}</span>
                            {artist.logo ? (
                                isBuriedInRuin ? (
                                    <Image
                                        src={artist.logo}
                                        alt={artist.logoAlt}
                                        width={466}
                                        height={333}
                                        priority
                                        unoptimized
                                        sizes="(min-width: 1024px) 27rem, (min-width: 640px) 24rem, 18rem"
                                        className="mx-auto h-auto w-72 object-contain sm:w-96 lg:mx-0 lg:w-[27rem]"
                                    />
                                ) : (
                                    <Image
                                        src={artist.logo}
                                        alt={artist.logoAlt}
                                        width={760}
                                        height={270}
                                        priority
                                        className="mx-auto h-auto w-56 sm:w-72 lg:mx-0 lg:w-96"
                                    />
                                )
                            ) : (
                                <span className="block font-[family-name:var(--font-altar-gothic)] text-5xl uppercase leading-none tracking-normal text-white sm:text-7xl lg:text-8xl">
                                    {artist.name}
                                </span>
                            )}
                        </h1>

                        <p className="mx-auto max-w-xl text-base font-medium leading-7 text-zinc-200 sm:text-lg lg:mx-0">
                            {artist.hero.description}
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        {featuredTrack && featuredPath ? (
                            <Link
                                href={featuredPath}
                                className="rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em] shadow-[0_18px_55px_rgba(0,0,0,0.32)] transition hover:-translate-y-0.5"
                                style={{
                                    backgroundColor: "var(--artist-accent-bright)",
                                    color: "var(--artist-button-text)",
                                }}
                            >
                                Play {featuredTrack.title}
                            </Link>
                        ) : (
                            <a
                                href="#about"
                                className="rounded-full px-6 py-3 text-xs font-black uppercase tracking-[0.18em] transition hover:-translate-y-0.5"
                                style={{
                                    backgroundColor: "var(--artist-accent-bright)",
                                    color: "var(--artist-button-text)",
                                }}
                            >
                                Discover {artist.name}
                            </a>
                        )}
                        <a
                            href="#albums"
                            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-100 transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10"
                        >
                            {artist.hero.secondaryCta}
                        </a>
                    </div>

                    {heroLinks.length ? (
                        <div className="mx-auto max-w-sm pt-2 lg:mx-0">
                            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                                Listen on
                            </p>
                            <SocialIcons
                                SocialLinkData={heroLinks}
                                SongSlug="home"
                                ProjectId={artist.id}
                            />
                        </div>
                    ) : null}
                </div>

                <div
                    className="w-full rounded-lg border border-white/15 bg-black/65 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-5"
                    style={{ boxShadow: `0 28px 100px ${artist.theme.accentSoft}22` }}
                >
                    {featuredTrack && featuredPath ? (
                        <>
                            <div className="flex min-w-0 gap-4">
                                <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md border border-zinc-700 sm:h-36 sm:w-36">
                                    <Image
                                        src={featuredTrack.coverSrc}
                                        alt={`${featuredTrack.title} single cover art`}
                                        fill
                                        sizes="144px"
                                        className="object-cover"
                                        priority
                                    />
                                </div>

                                <div className="flex min-w-0 flex-1 flex-col justify-center">
                                    <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                                        {featuredTrack.subtitle}
                                    </p>
                                    <h2 className="mt-1 text-2xl font-black uppercase tracking-wide text-zinc-50">
                                        {featuredTrack.title}
                                    </h2>
                                    <p className="mt-2 hidden text-sm leading-6 text-zinc-400 sm:block">
                                        {featuredTrack.description ?? "Hear the current featured preview."}
                                    </p>
                                    <Link
                                        href={featuredPath}
                                        className="mt-4 hidden w-fit rounded-full px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:brightness-125 sm:inline-flex"
                                        style={{ backgroundColor: "var(--artist-accent)" }}
                                    >
                                        Preview and streaming links
                                    </Link>
                                </div>
                            </div>

                            <div className="mt-5 w-full">
                                <AudioTrack
                                    id={`${featuredTrack.title}-feature`}
                                    src={featuredTrack.audioSrc}
                                    projectId={artist.id}
                                    className="w-full justify-center"
                                />
                            </div>
                        </>
                    ) : (
                        <div className="flex min-h-64 flex-col justify-end overflow-hidden rounded-md border border-white/10 bg-black/35 p-6">
                            <div
                                className="mb-5 h-1 w-20"
                                style={{ backgroundColor: "var(--artist-accent-bright)" }}
                            />
                            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                                Project status
                            </p>
                            <h2 className="mt-3 text-3xl font-black uppercase tracking-normal text-white">
                                {artist.hero.noFeatureTitle}
                            </h2>
                            <p className="mt-3 max-w-md text-sm leading-6 text-zinc-400">
                                {artist.hero.noFeatureDescription}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
