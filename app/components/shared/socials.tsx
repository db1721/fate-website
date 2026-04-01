import {AppleMusicIcon} from "@/app/components/logos/apple";
import Image from "next/image";
import {SocialIcon} from "react-social-icons";
import bandInfo from "@/app/config/fate-info";

interface SocialIconsProps {
    SocialLinkData: { url: string; network: string; tooltip: string }[];
}

export function SocialIcons({ SocialLinkData }: SocialIconsProps) {
    return (
        <div className="flex flex-wrap items-center justify-center gap-3 lg:justify-start">
            {SocialLinkData?.map((item: {
                url: string
                network: string
                tooltip: string
            }) =>
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
                        <AppleMusicIcon className="h-10 w-10"/>
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

                ) : item.network === "tidal" ? (
                    <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Listen on Tidal"
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
                            src="/icons/tidal.jpg"
                            alt="Tidal"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </a>
                ) : item.network === "pandora" ? (
                    <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Listen on Pandora"
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
                            src="/icons/pandora.png"
                            alt="Pandora"
                            fill
                            unoptimized
                            className="object-cover"
                        />
                    </a>
                ) : item.network === "deezer" ? (
                    <a
                        key={item.url}
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Listen on Deezer"
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
                            src="/icons/deezer.png"
                            alt="Deezer"
                            fill
                            unoptimized
                            className="object-cover scale-85"
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

                ) : item.network === "instagram" ? (
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
                        {...(item.bgColor ? {bgColor: item.bgColor} : {})}
                        fgColor="#ffffff"
                        className="hover:scale-110 transition-transform duration-200"
                        style={{height: 40, width: 40}}
                    />
                )
            )}
        </div>
    );
}