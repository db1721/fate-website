import Image from "next/image";
import Link from "next/link";
import { COLORS } from "@/app/theme";
import bandInfo from "@/app/config/fate-info";
import { AudioTrack } from "@/app/components/audio-track";
import { SocialIcons } from "@/app/components/shared/socials";
import { slugify } from "@/lib/utils";
import { STREAMING_NETWORKS, filterLinksByNetwork } from "@/app/config/link-groups";

export function HeroSection() {
    const featuredSlug = slugify(bandInfo.FEATURED_TRACK.title);
    const heroLinks = filterLinksByNetwork(bandInfo.SOCIAL_LINKS, STREAMING_NETWORKS);
    const featuredTitle = bandInfo.FEATURED_TRACK.title;

    return (
        <section
            id="hero"
            className="relative flex min-h-[88vh] flex-col items-center justify-center overflow-hidden px-4 pb-16 pt-28 sm:px-8 lg:px-16"
        >
            <div
                className="pointer-events-none absolute inset-0 opacity-95"
                style={{
                    backgroundImage: `
                        radial-gradient(circle at 20% 18%, rgba(14, 165, 233, 0.26) 0, transparent 34%),
                        radial-gradient(circle at 78% 55%, rgba(245, 179, 1, 0.14) 0, transparent 28%),
                        linear-gradient(180deg, #020617 0%, #030712 58%, #000 100%)
                    `,
                }}
            />

            <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:54px_54px] opacity-[0.05]" />

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
                    src="/images/dan-beck-hero.jpg"
                    alt=""
                    fill
                    priority
                    sizes="(min-width: 1024px) 56vw, 68vw"
                    className="object-cover object-[58%_center] opacity-[0.3] grayscale brightness-[0.88] contrast-115 mix-blend-luminosity sm:opacity-[0.34] lg:opacity-[0.38]"
                />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_42%,transparent_0,rgba(2,6,23,0.08)_34%,rgba(2,6,23,0.46)_88%),linear-gradient(90deg,#020617_0%,rgba(2,6,23,0.52)_38%,rgba(2,6,23,0.08)_100%),linear-gradient(180deg,rgba(2,6,23,0.48)_0%,transparent_42%,rgba(0,0,0,0.58)_100%)]" />
            </div>

            <div className="relative z-10 grid w-full max-w-6xl items-center gap-10 lg:grid-cols-[1fr_0.92fr] lg:gap-14">
                <div className="space-y-7 text-center lg:text-left">
                    <div className="space-y-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[#f5b301]">
                            {bandInfo.band_name_full}
                        </p>

                        <h1 className="mx-auto max-w-xl lg:mx-0">
                            <span className="sr-only">F.A.T.E. - Fight Against the Enemy</span>
                            <Image
                                src="/icons/fate-white-short.png"
                                alt="F.A.T.E."
                                width={760}
                                height={270}
                                priority
                                className="mx-auto h-auto w-56 sm:w-72 lg:mx-0 lg:w-96"
                            />
                        </h1>

                        <p className="mx-auto max-w-xl text-base font-medium leading-7 text-zinc-200 sm:text-lg lg:mx-0">
                            Heavy melodic rock for the battles you carry quietly, built with driving guitars,
                            anthemic hooks, and lyrics meant to be screamed back.
                        </p>

                        {/*<p className="mx-auto max-w-xl text-sm leading-6 text-zinc-400 lg:mx-0">*/}
                        {/*    The debut album <span className="font-semibold text-zinc-100">New Beginnings</span> drops*/}
                        {/*    May 8, 2026. Start with <span className="font-semibold text-zinc-100">{featuredTitle}</span>,*/}
                        {/*    then jump into the full record.*/}
                        {/*</p>*/}
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        <Link
                            href={`/music/${featuredSlug}`}
                            className="rounded-full bg-[#f5b301] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-black shadow-[0_18px_55px_rgba(245,179,1,0.2)] transition hover:-translate-y-0.5 hover:bg-[#ffd766]"
                        >
                            Play {featuredTitle}
                        </Link>
                        <a
                            href="#albums"
                            className="rounded-full border border-white/15 bg-white/5 px-6 py-3 text-xs font-bold uppercase tracking-[0.18em] text-zinc-100 transition hover:-translate-y-0.5 hover:border-white/35 hover:bg-white/10"
                        >
                            New Beginnings
                        </a>
                    </div>

                    <div className="mx-auto max-w-sm pt-2 lg:mx-0">
                        <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                            Listen on
                        </p>
                        <SocialIcons SocialLinkData={heroLinks} SongSlug="home" />
                    </div>
                </div>

                <div
                    className="w-full rounded-lg border border-white/15 bg-black/65 p-4 shadow-[0_28px_100px_rgba(0,0,0,0.45)] backdrop-blur-md sm:p-5"
                    style={{ boxShadow: `0 28px 100px ${COLORS.accentSoft}22` }}
                >
                    <div className="flex gap-4 min-w-0">
                        <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-md border border-zinc-700 sm:h-36 sm:w-36">
                            <Image
                                src={bandInfo.FEATURED_TRACK.coverSrc}
                                alt={`${bandInfo.FEATURED_TRACK.title} single cover art`}
                                fill
                                sizes="144px"
                                className="object-cover"
                                priority
                            />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col justify-center">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">
                                {bandInfo.FEATURED_TRACK.subtitle}
                            </p>
                            <h2 className="mt-1 text-2xl font-black uppercase tracking-wide text-zinc-50">
                                {bandInfo.FEATURED_TRACK.title}
                            </h2>
                            <p className="mt-2 text-sm leading-6 text-zinc-400">
                                Hear the featured preview now, then be ready when the album lands May 8.
                            </p>
                            <Link
                                href={`/music/${featuredSlug}`}
                                className="mt-4 inline-flex w-fit rounded-full bg-[#03346E] px-5 py-2 text-xs font-bold uppercase tracking-[0.18em] text-zinc-100 transition hover:bg-[#0f6fad]"
                            >
                                Preview and album links
                            </Link>
                        </div>
                    </div>

                    <div className="mt-5 w-full">
                        <AudioTrack
                            id={`${bandInfo.FEATURED_TRACK.title}-feature`}
                            src={bandInfo.FEATURED_TRACK.audioSrc}
                            className="w-full justify-center"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
