import { AppleMusicIcon } from "@/app/components/logos/apple";
import Image from "next/image";
import { SocialIcon } from "react-social-icons";
import {trackInteraction} from "@/lib/track-interaction";

export type SocialLink = {
    url: string;
    network: string;
    tooltip: string;
    bgColor?: string;
};

export interface SocialIconsProps {
    SocialLinkData?: SocialLink[];
    SongSlug: string;
    palette?: {
        border: string;
        primary: string;
        secondary: string;
    };
}

export function SocialIcons({
                                SocialLinkData = [],
                                SongSlug,
                            }: SocialIconsProps) {
    const primaryNetworks: any[] = [];
    const primary = primaryNetworks
        .map((network) => SocialLinkData.find((item) => item.network === network))
        .filter(Boolean);

    const secondary = SocialLinkData.filter(
        (item) => !primaryNetworks.includes(item.network)
    );

    function renderIcon(item: any, isPrimary = false) {
        const size = isPrimary ? 35 : 40;

        if (item.network === "apple") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Listen on Apple Music"
                    className="flex items-center justify-center rounded-full border border-zinc-700 hover:border-zinc-400 hover:bg-white/5 hover:scale-110 transition-transform duration-200"
                    style={{ width: size, height: size }}
                    onClick={() =>
                        trackInteraction({
                        song: SongSlug,
                        action: "service_click",
                        service: "apple",
                    })
                }
                >
                    <AppleMusicIcon
                        className="h-full w-full"
                        style={{ color: "#fc3c44" }}
                    />
                </a>
            );
        }

        if (item.network === "amazon") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Listen on Amazon Music"
                    className="relative flex items-center justify-center rounded-full border border-zinc-700 hover:scale-110 transition-transform duration-200 overflow-hidden"
                    style={{ width: size, height: size }}
                    onClick={() =>
                        trackInteraction({
                        song: SongSlug,
                        action: "service_click",
                        service: "amazon_music",
                    })
                }
                >
                    <Image
                        src="/icons/amazon-music.png"
                        alt="Amazon Music"
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </a>
            );
        }

        if (item.network === "pandora") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Listen on Pandora"
                    className="relative flex items-center justify-center rounded-full border border-zinc-700 hover:scale-110 transition-transform duration-200 overflow-hidden"
                    style={{ width: size, height: size }}
                    onClick={() =>
                            trackInteraction({
                            song: SongSlug,
                            action: "service_click",
                            service: "pandora_music",
                        })
                    }
                >
                    <Image
                        src="/icons/pandora.png"
                        alt="Pandora"
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </a>
            );
        }

        if (item.network === "tidal") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Listen on Tidal"
                    className="relative flex items-center justify-center rounded-full border border-zinc-700 hover:scale-110 transition-transform duration-200 overflow-hidden"
                    style={{ width: size, height: size }}
                    onClick={() =>
                            trackInteraction({
                            song: SongSlug,
                            action: "service_click",
                            service: "tidal",
                        })
                    }
                >
                    <Image
                        src="/icons/tidal.jpg"
                        alt="Tidal"
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </a>
            );
        }

        if (item.network === "deezer") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Listen on Deezer"
                    onClick={() =>
                            trackInteraction({
                            song: SongSlug,
                            action: "service_click",
                            service: "deezer",
                        })
                    }
                    className="relative flex h-10 w-10 items-center justify-center rounded-full border border-zinc-700 bg-black hover:scale-110 transition-transform duration-200 overflow-hidden">
                    <Image
                        src="/icons/deezer.png"
                        alt="Deezer"
                        width={28}
                        height={28}
                        className="object-contain"
                    />
                </a>
            );
        }

        if (item.network === "youtube") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Listen on YouTube"
                    className="relative flex items-center justify-center rounded-full border border-zinc-700 hover:scale-110 transition-transform duration-200 overflow-hidden"
                    style={{width: size, height: size}}
                    onClick={() =>
                            trackInteraction({
                            song: SongSlug,
                            action: "service_click",
                            service: "youtube",
                        })
                    }
                >
                    <Image
                        src="/icons/youtube.jpg"
                        alt="YouTube"
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </a>
            );
        }

        if (item.network === "youtube-music") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Listen on YouTube"
                    className="relative flex items-center justify-center rounded-full border border-zinc-700 hover:scale-110 transition-transform duration-200 overflow-hidden"
                    style={{width: size, height: size}}
                    onClick={() =>
                        trackInteraction({
                            song: SongSlug,
                            action: "service_click",
                            service: "youtube_music",
                        })
                    }
                >
                    <Image
                        src="/icons/youtube-music.png"
                        alt="YouTube Music"
                        fill
                        unoptimized
                        className="object-cover"
                    />
                </a>
            );
        }

        if (item.network === "instagram") {
            return (
                <a
                    key={item.url}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Find us on Instagram"
                    style={{width: size, height: size}}
                    onClick={() =>
                    trackInteraction({
                        song: SongSlug,
                        action: "service_click",
                        service: "instagram",
                    })
                }
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
            );
        }

        return (
            <SocialIcon
                key={item.url}
                url={item.url}
                network={item.network as any}
                target="_blank"
                rel="noopener noreferrer"
                {...(item.bgColor ? {bgColor: item.bgColor} : {})}
                fgColor="#ffffff"
                className="hover:scale-110 transition-transform duration-200"
                style={{ width: size, height: size }}
                onClick={() =>
                    trackInteraction({
                    song: SongSlug,
                    action: "service_click",
                    service: item.network,
                })

                }
            />
        );
    }

    return (
        <div className="flex w-full flex-col gap-3 items-center">
            {primary.length > 0 && (
                <div className="flex w-full flex-wrap items-center justify-center gap-3">
                    {primary.map((item) => renderIcon(item, true))}
                </div>
            )}

            {secondary.length > 0 && (
                <div className="flex w-full flex-wrap items-center justify-center gap-3">
                    {secondary.map((item) => renderIcon(item, false))}
                </div>
            )}
        </div>
    );
}