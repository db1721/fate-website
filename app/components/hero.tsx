import Image from "next/image";
import { COLORS } from "@/app/theme";
import { SocialIcon } from "react-social-icons";
import bandInfo from "@/app/config/fate-info";
import {AudioTrack} from "@/app/components/audio-track";

type HeroSectionProps = {
    onScrollDown: () => void;
};

export function HeroSection({ onScrollDown }: HeroSectionProps) {
    return (
        <section
            id="hero"
            data-reveal
            className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-8 lg:px-16"
        >
            {/* Background gradient */}
            <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage: `radial-gradient(circle at top, ${COLORS.accent} 0, #000 55%)`,
                }}
            />

            <div className="relative z-10 flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-center">
                {/* LEFT: text + socials */}
                <div className="flex-1 space-y-8 text-center sm:text-left">
                    {/* Socials */}
                    <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
                        {bandInfo.SOCIAL_LINKS.map((item) => (
                            <SocialIcon
                                key={item.url}
                                url={item.url}
                                network={item.network as any}
                                target="_blank"
                                rel="noopener noreferrer"
                                {...(item.bgColor ? { bgColor: item.bgColor } : {})}
                                fgColor="#ffffff"
                                className="hover:scale-110 transition-transform duration-200"
                                style={{ height: 40, width: 40 }}
                            />
                        ))}
                    </div>

                    {/* Band name + tagline */}
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.32em] text-zinc-200">
                            Modern Rock · Anthems for the battles we all face
                        </p>
                        <h1
                            className="font-logo text-4xl uppercase tracking-[0.25em] text-zinc-50 sm:text-5xl lg:text-6xl"
                        >
                            {bandInfo.band_name_full}
                        </h1>
                    </div>

                    {/* CTAs */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 sm:justify-start">
                        <button
                            onClick={onScrollDown}
                            className="rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 shadow-md hover:brightness-110 transition"
                            style={{ backgroundColor: COLORS.accent }}
                        >
                            See Our Discography
                        </button>
                        <a
                            href={bandInfo.MAIN_BAND_PAGE}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-[0.2em] text-zinc-200 hover:text-white"
                        >
                            Open artist page ↗
                        </a>
                    </div>
                </div>

                {/* RIGHT: featured single card */}
                <div className="w-full max-w-md flex-1 self-center rounded-2xl border bg-black/60 p-4 shadow-xl backdrop-blur-md sm:p-5 lg:mt-0">
                    {/* Cover + text side-by-side */}
                    <div className="flex gap-3 min-w-0">
                        {/* Cover */}
                        <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-zinc-700 sm:h-28 sm:w-28">
                            <Image
                                src={bandInfo.FEATURED_TRACK.coverSrc}
                                alt={`${bandInfo.FEATURED_TRACK.title} cover`}
                                fill
                                style={{ objectFit: "cover" }}
                                unoptimized
                            />
                        </div>

                        {/* Text to the right of the cover */}
                        <div className="flex-1 flex-col justify-center min-w-0">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                {bandInfo.FEATURED_TRACK.subtitle}
                            </p>
                            <h2 className="mt-1 text-lg font-semibold text-zinc-50">
                                {bandInfo.FEATURED_TRACK.title}
                            </h2>
                            {/*<p className="mt-1 text-xs text-zinc-400">*/}
                            {/*    Hit play and dive straight into the sound of{" "}*/}
                            {/*    {bandInfo.band_name ?? bandInfo.band_name_full}.*/}
                            {/*</p>*/}
                            <p className="mt-2 text-[0.7rem] uppercase tracking-[0.18em] text-zinc-400">
                                Available soon on Spotify · Apple Music · TikTok · Instagram
                            </p>
                        </div>
                    </div>

                    {/* Player below everything */}
                    <div className="mt-4 w-full flex justify-center">
                        <AudioTrack
                            id={bandInfo.FEATURED_TRACK.title}
                            src={bandInfo.FEATURED_TRACK.audioSrc}
                            className="max-w-xs"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
