import { COLORS } from "./theme";
import bandInfo from "@/app/config/fate-info";
import { AlbumsSection } from "@/app/components/discography";
import { AboutSection } from "@/app/components/about";
import { HeroSection } from "@/app/components/hero";
import { CurrentYear } from "@/app/config/utils";
import BlogSection from "@/app/components/blog";
import { SiteHeader } from "@/app/components/site-header";
import { RevealController } from "@/app/components/reveal-controller";
import { getHomeStructuredData } from "@/app/config/music-data";
import { ConnectSection } from "@/app/components/connect-section";

function getSocialUrl(network: string) {
    return bandInfo.SOCIAL_LINKS.find((link) => link.network === network)?.url ?? "#hero";
}

export default function Home() {
    return (
        <div
            className="min-h-screen overflow-x-hidden text-zinc-50 font-sans"
            style={{ backgroundColor: COLORS.bgMain }}
        >
            <RevealController />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomeStructuredData()) }}
            />

            <SiteHeader />

            <main>
                <HeroSection />
                <AboutSection />
                <AlbumsSection />
                <ConnectSection />
                <BlogSection posts={bandInfo.BLOGS} />
            </main>

            <footer
                className="relative border-t px-4 py-6 sm:px-8 lg:px-16"
                style={{ backgroundColor: COLORS.bgAlt, borderColor: COLORS.border }}
            >
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-zinc-500 sm:flex-row">
                    <div className="flex flex-col items-center gap-1 sm:items-start">
                        <span>{CurrentYear()} - {bandInfo.band_name}</span>
                        <span>All rights reserved</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <a
                            href={getSocialUrl("facebook")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:text-[#f5b301]"
                        >
                            Facebook
                        </a>
                        <a
                            href={getSocialUrl("instagram")}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs uppercase tracking-[0.18em] text-zinc-300 transition-colors hover:text-[#f5b301]"
                        >
                            Instagram
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
}
