import bandInfo from "@/app/config/fate-info";
import { SocialIcons } from "@/app/components/shared/socials";
import {
    SOCIAL_NETWORKS,
    STREAMING_NETWORKS,
    filterLinksByNetwork,
} from "@/app/config/link-groups";

const streamingLinks = filterLinksByNetwork(bandInfo.SOCIAL_LINKS, STREAMING_NETWORKS);
const socialLinks = filterLinksByNetwork(bandInfo.SOCIAL_LINKS, SOCIAL_NETWORKS);

export function ConnectSection() {
    return (
        <section
            id="connect"
            data-reveal
            className="border-y border-white/10 bg-zinc-950 px-4 py-14 sm:px-8 lg:px-16"
        >
            <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-center">
                <div>
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        Listen and follow
                    </h2>
                    <p className="mt-3 text-2xl font-black uppercase tracking-wide text-zinc-50 sm:text-3xl">
                        Keep F.A.T.E. in your rotation
                    </p>
                    <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                        Save the songs where you listen most, then follow the band for new releases,
                        lyric clips, and behind-the-song updates.
                    </p>
                </div>

                <div className="grid gap-5 sm:grid-cols-2">
                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                            Stream on
                        </p>
                        <SocialIcons
                            SocialLinkData={streamingLinks}
                            SongSlug="home"
                            trackingAction="service_click"
                        />
                    </div>

                    <div className="rounded-lg border border-white/10 bg-white/[0.03] p-5">
                        <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                            Follow on
                        </p>
                        <SocialIcons
                            SocialLinkData={socialLinks}
                            SongSlug="home"
                            trackingAction="social_click"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}
