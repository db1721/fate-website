"use client";

import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import { AppleMusicIcon } from "@/app/components/logos/apple";
import type { ArtistId, SocialLink } from "@/app/config/artists/types";
import { trackInteraction } from "@/lib/track-interaction";

export interface SocialIconsProps {
    SocialLinkData?: SocialLink[];
    SongSlug: string;
    ProjectId?: ArtistId;
    trackingAction?: "service_click" | "social_click";
    palette?: {
        border: string;
        primary: string;
        secondary: string;
    };
}

const CUSTOM_ICONS: Record<string, { src: string; label: string; service: string }> = {
    amazon: { src: "/icons/amazon-music.png", label: "Amazon Music", service: "amazon_music" },
    pandora: { src: "/icons/pandora.png", label: "Pandora", service: "pandora_music" },
    tidal: { src: "/icons/tidal.jpg", label: "Tidal", service: "tidal" },
    deezer: { src: "/icons/deezer.png", label: "Deezer", service: "deezer" },
    youtube: { src: "/icons/youtube.jpg", label: "YouTube", service: "youtube" },
    "youtube-music": {
        src: "/icons/youtube-music.png",
        label: "YouTube Music",
        service: "youtube_music",
    },
    instagram: { src: "/icons/instagram.png", label: "Instagram", service: "instagram" },
    shazam: { src: "/icons/shazam.png", label: "Shazam", service: "shazam" },
};

export function SocialIcons({
    SocialLinkData = [],
    SongSlug,
    ProjectId = "fate",
    trackingAction = "service_click",
}: SocialIconsProps) {
    const recordClick = (service: string) => {
        void trackInteraction({
            song: SongSlug,
            project: ProjectId,
            action: trackingAction,
            service,
        });
    };

    return (
        <div className="flex w-full flex-wrap items-center justify-center gap-3">
            {SocialLinkData.map((item) => {
                const size = 40;

                if (item.network === "apple") {
                    return (
                        <a
                            key={item.url}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.tooltip || "Listen on Apple Music"}
                            title={item.tooltip || "Apple Music"}
                            className="flex items-center justify-center rounded-full border border-zinc-700 transition hover:scale-110 hover:border-zinc-400 hover:bg-white/5"
                            style={{ width: size, height: size }}
                            onClick={() => recordClick("apple")}
                        >
                            <AppleMusicIcon className="h-full w-full" style={{ color: "#fc3c44" }} />
                        </a>
                    );
                }

                const customIcon = CUSTOM_ICONS[item.network];
                if (customIcon) {
                    return (
                        <a
                            key={item.url}
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={item.tooltip || customIcon.label}
                            title={item.tooltip || customIcon.label}
                            className="relative flex items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-black transition hover:scale-110 hover:border-zinc-400"
                            style={{ width: size, height: size }}
                            onClick={() => recordClick(customIcon.service)}
                        >
                            <Image
                                src={customIcon.src}
                                alt=""
                                fill
                                unoptimized
                                className={item.network === "deezer" ? "object-contain p-1.5" : "object-cover"}
                            />
                        </a>
                    );
                }

                return (
                    <SocialIcon
                        key={item.url}
                        url={item.url}
                        network={item.network}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={item.tooltip || item.network}
                        title={item.tooltip || item.network}
                        {...(item.bgColor ? { bgColor: item.bgColor } : {})}
                        fgColor="#ffffff"
                        className="transition-transform duration-200 hover:scale-110"
                        style={{ width: size, height: size }}
                        onClick={() => recordClick(item.network)}
                    />
                );
            })}
        </div>
    );
}
