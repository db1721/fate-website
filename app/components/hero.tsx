import Image from "next/image";
import { COLORS } from "@/app/theme";
import { SocialIcon } from "react-social-icons";
import bandInfo from "@/app/config/fate-info";
import {AudioTrack} from "@/app/components/audio-track";
import {AppleMusicIcon} from "@/app/components/logos/apple";

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

            <div
                className="
                relative z-10
                flex w-full max-w-6xl flex-col items-center gap-10
                lg:flex-row lg:items-center lg:justify-between"
            >
            {/* LEFT: text + socials */}
                <div className="flex-1 space-y-8 text-center lg:text-left">
                    {/* Socials */}
                    <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                        {bandInfo.SOCIAL_LINKS.map((item) =>
                            item.network === "apple" ? (
                                <a
                                    key={item.url}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex h-10 w-10 items-center justify-center
                                    rounded-full border border-zinc-700 hover:border-zinc-400
                                    hover:bg-white/5 hover:scale-110 transition-transform duration-200"
                                    aria-label="Listen on Apple Music"
                                >
                                    <AppleMusicIcon className="h-10 w-10" />
                                </a>
                            ) : item.network === "amazon" ? (
                                <a
                                    key={item.url}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Listen on Amazon Music"
                                    className="
                                        relative
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-full border border-zinc-700
                                        hover:scale-110 transition-transform duration-200
                                        overflow-hidden
                                      "
                                >
                                    <Image
                                        src="/icons/amazon-music.png"
                                        alt="Amazon Music"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </a>

                            ) : item.network === "shazam" ? (
                                <a
                                    key={item.url}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Listen on Shazam"
                                    className="
                                        relative
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-full border border-zinc-700
                                        hover:scale-110 transition-transform duration-200
                                        overflow-hidden
                                      "
                                >
                                    <Image
                                        src="/icons/shazam.png"
                                        alt="Shazam"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </a>

                            ) : item.network === "youtube-music" ? (
                                <a
                                    key={item.url}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Listen on YouTube Music"
                                    className="
                                        relative
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-full border border-zinc-700
                                        hover:scale-110 transition-transform duration-200
                                        overflow-hidden
                                      "
                                >
                                    <Image
                                        src="/icons/youtube-music.png"
                                        alt="YouTube Music"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </a>

                            ): item.network === "instagram" ? (
                                <a
                                    key={item.url}
                                    href={item.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label="Find us on Instagram"
                                    className="
                                        relative bg-white
                                        flex h-10 w-10
                                        items-center justify-center
                                        rounded-full border border-zinc-700
                                        hover:scale-110 transition-transform duration-200
                                        overflow-hidden
                                      "
                                >
                                    <Image
                                        src="/icons/instagram.png"
                                        alt="Instagram"
                                        fill
                                        unoptimized
                                        className="object-cover"
                                    />
                                </a>
                            ) : (
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
                            )
                        )}
                    </div>

                    {/* Band name + tagline */}
                    <div className="space-y-4">
                        <p className="text-xs uppercase tracking-[0.32em] text-zinc-200">
                            {bandInfo.band_name_full}
                        </p>

                        <img
                            src="/icons/fate-white-short.png"
                            alt="F.A.T.E. Logo"
                            className="
                            mx-auto lg:mx-0
                            w-48 sm:w-64 lg:w-80
                            h-auto
                          "
                        />
                    </div>


                    {/* CTAs */}
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-4 lg:justify-start">
                        <button
                            onClick={onScrollDown}
                            className="rounded-full px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 shadow-md hover:brightness-110 transition"
                            style={{ backgroundColor: COLORS.accent }}
                        >
                            See Our Discography
                        </button>
                        {/*<a*/}
                        {/*    href={bandInfo.MAIN_BAND_PAGE}*/}
                        {/*    target="_blank"*/}
                        {/*    rel="noopener noreferrer"*/}
                        {/*    className="text-xs uppercase tracking-[0.2em] text-zinc-200 hover:text-white"*/}
                        {/*>*/}
                        {/*    Open artist page ↗*/}
                        {/*</a>*/}
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
                            <button
                                onClick={() => window.open(bandInfo.FEATURED_TRACK.link, "_blank")}
                                className="rounded-full mt-3 px-6 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-200 shadow-md hover:brightness-110 transition"
                                style={{ backgroundColor: COLORS.accent }}
                            >
                                Stream Here →
                            </button>
                        </div>
                    </div>

                    {/* Player below everything */}
                    <div className="mt-4 w-full flex justify-center">
                        <AudioTrack
                            id={`${bandInfo.FEATURED_TRACK.title}-feature`}
                            src={bandInfo.FEATURED_TRACK.audioSrc}
                            className="max-w-xs"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
