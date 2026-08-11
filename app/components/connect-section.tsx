import type { ArtistConfig } from "@/app/config/artists/types";
import { SocialIcons } from "@/app/components/shared/socials";
import {
    SOCIAL_NETWORKS,
    STREAMING_NETWORKS,
    filterLinksByNetwork,
} from "@/app/config/link-groups";

export function ConnectSection({ artist }: { artist: ArtistConfig }) {
    const streamingLinks = filterLinksByNetwork(artist.socialLinks, STREAMING_NETWORKS);
    const socialLinks = filterLinksByNetwork(artist.socialLinks, SOCIAL_NETWORKS);
    const hasLinks = streamingLinks.length > 0 || socialLinks.length > 0;

    return (
        <section
            id="connect"
            data-reveal
            className="border-y border-white/10 px-4 py-14 sm:px-8 lg:px-16"
            style={{ backgroundColor: "var(--artist-background-alt)" }}
        >
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        Listen and follow
                    </h2>
                    <p className="mt-3 text-2xl font-black uppercase tracking-wide text-zinc-50 sm:text-3xl">
                        {artist.connect.title}
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                        {artist.connect.description}
                    </p>
                </div>

                {hasLinks ? (
                    <div className="grid gap-5 sm:grid-cols-2">
                        {streamingLinks.length ? (
                            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                                    Stream on
                                </p>
                                <SocialIcons
                                    SocialLinkData={streamingLinks}
                                    SongSlug="home"
                                    ProjectId={artist.id}
                                    trackingAction="service_click"
                                />
                            </div>
                        ) : null}

                        {socialLinks.length ? (
                            <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                                    Follow on
                                </p>
                                <SocialIcons
                                    SocialLinkData={socialLinks}
                                    SongSlug="home"
                                    ProjectId={artist.id}
                                    trackingAction="social_click"
                                />
                            </div>
                        ) : null}
                    </div>
                ) : (
                    <div className="border-l-2 py-6 pl-6" style={{ borderColor: "var(--artist-accent-bright)" }}>
                        <p className="max-w-lg text-base leading-7 text-zinc-300">
                            {artist.connect.emptyDescription}
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
}
