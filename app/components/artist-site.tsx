import type { CSSProperties } from "react";
import Link from "next/link";
import { AboutSection } from "@/app/components/about";
import { ArtistPageTracking } from "@/app/components/artist-page-tracking";
import BlogSection from "@/app/components/blog";
import { ConnectSection } from "@/app/components/connect-section";
import { AlbumsSection } from "@/app/components/discography";
import { HeroSection } from "@/app/components/hero";
import { RevealController } from "@/app/components/reveal-controller";
import { SiteHeader } from "@/app/components/site-header";
import { ARTISTS } from "@/app/config/artists";
import { getCurrentFeaturedTrack } from "@/app/config/artists/featured-track";
import type { ArtistConfig } from "@/app/config/artists/types";
import { getHomeStructuredData } from "@/app/config/music-data";
import { CurrentYear } from "@/app/config/utils";

type ArtistCssProperties = CSSProperties & Record<`--artist-${string}`, string>;

export function ArtistSite({ artist }: { artist: ArtistConfig }) {
    const featuredTrack = getCurrentFeaturedTrack(artist.featuredTracks);
    const socialFooterLinks = artist.socialLinks
        .filter((link) => ["facebook", "instagram", "youtube"].includes(link.network))
        .slice(0, 3);
    const artistStyles: ArtistCssProperties = {
        "--artist-background": artist.theme.background,
        "--artist-background-alt": artist.theme.backgroundAlt,
        "--artist-surface": artist.theme.surface,
        "--artist-border": artist.theme.border,
        "--artist-accent": artist.theme.accent,
        "--artist-accent-bright": artist.theme.accentBright,
        "--artist-accent-soft": artist.theme.accentSoft,
        "--artist-text": artist.theme.text,
        "--artist-text-muted": artist.theme.textMuted,
        "--artist-button-text": artist.theme.buttonText,
        backgroundColor: artist.theme.background,
        color: artist.theme.text,
    };

    return (
        <div className="min-h-screen overflow-x-hidden font-sans" style={artistStyles}>
            <RevealController />
            <ArtistPageTracking projectId={artist.id} artistName={artist.name} />
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(getHomeStructuredData(artist)) }}
            />

            <SiteHeader artist={artist} artists={ARTISTS} />

            <main>
                <HeroSection artist={artist} featuredTrack={featuredTrack} />
                <AboutSection artist={artist} />
                <AlbumsSection artist={artist} />
                <ConnectSection artist={artist} />
                <BlogSection posts={artist.pressPosts} />
            </main>

            <footer
                className="border-t px-4 py-7 sm:px-8 lg:px-16"
                style={{
                    backgroundColor: "var(--artist-background-alt)",
                    borderColor: "var(--artist-border)",
                }}
            >
                <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-xs text-zinc-500 sm:flex-row">
                    <div className="text-center sm:text-left">
                        <p>{CurrentYear()} - {artist.name}. All rights reserved.</p>
                        <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-zinc-600">
                            Official artist site
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
                        {socialFooterLinks.map((link) => (
                            <a
                                key={`${link.network}-${link.url}`}
                                href={link.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:text-[var(--artist-accent-bright)]"
                            >
                                {link.tooltip || link.network}
                            </a>
                        ))}
                        {ARTISTS.filter((project) => project.id !== artist.id).map((project) => (
                            <Link
                                key={project.id}
                                href={project.homePath}
                                className="uppercase tracking-[0.16em] text-zinc-300 transition-colors hover:text-[var(--artist-accent-bright)]"
                            >
                                Switch to {project.name}
                            </Link>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
}
