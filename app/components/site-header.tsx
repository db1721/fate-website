import Image from "next/image";
import Link from "next/link";
import { Menu } from "lucide-react";
import type { ArtistConfig } from "@/app/config/artists/types";

type ArtistMarkProps = {
    artist: ArtistConfig;
    compact?: boolean;
};

function ArtistMark({ artist, compact = false }: ArtistMarkProps) {
    if (!artist.logo) {
        return (
            <span className="font-[family-name:var(--font-altar-gothic)] text-xl uppercase leading-none tracking-normal text-white">
                {artist.name}
            </span>
        );
    }

    if (artist.id === "buried-in-ruin") {
        return (
            <span className={`relative block overflow-hidden ${compact ? "h-8 w-24" : "h-9 w-28"}`}>
                <Image
                    src={artist.logo}
                    alt={artist.logoAlt}
                    fill
                    unoptimized
                    sizes="112px"
                    className="scale-[1.55] object-cover object-center"
                    priority
                />
            </span>
        );
    }

    return (
        <Image
            src={artist.logo}
            alt={artist.logoAlt}
            width={72}
            height={32}
            className="h-auto w-16"
            priority
        />
    );
}

type SiteHeaderProps = {
    artist: ArtistConfig;
    artists: ArtistConfig[];
};

export function SiteHeader({ artist, artists }: SiteHeaderProps) {
    const sections = [
        { id: "hero", label: "Home" },
        { id: "about", label: "About" },
        { id: "albums", label: "Music" },
        { id: "connect", label: "Connect" },
        ...(artist.pressPosts.length ? [{ id: "blogs", label: "Press" }] : []),
    ];

    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/85 backdrop-blur-lg">
            <div className="relative mx-auto grid min-h-16 max-w-7xl grid-cols-[1fr_auto] items-center px-4 sm:px-8 md:grid-cols-[1fr_auto_1fr] lg:px-10">
                <Link
                    href={`${artist.homePath}#hero`}
                    className="absolute left-1/2 flex -translate-x-1/2 items-center gap-3 md:static md:translate-x-0 md:justify-self-start"
                    aria-label={`Go to ${artist.name} home`}
                >
                    <ArtistMark artist={artist} />
                    <span className="hidden text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400 xl:inline">
                        {artist.fullName}
                    </span>
                </Link>

                <div className="hidden overflow-hidden rounded-md border border-white/15 bg-white/[0.04] md:flex" aria-label="Choose artist">
                    {artists.map((project) => {
                        const isActive = project.id === artist.id;

                        return (
                            <Link
                                key={project.id}
                                href={project.homePath}
                                aria-current={isActive ? "page" : undefined}
                                className="border-r border-white/10 px-3 py-2 text-[10px] font-black uppercase tracking-[0.16em] transition last:border-r-0 hover:bg-white/10"
                                style={isActive
                                    ? {
                                        backgroundColor: "var(--artist-accent-bright)",
                                        color: "var(--artist-button-text)",
                                    }
                                    : { color: "#a1a1aa" }}
                            >
                                {project.name}
                            </Link>
                        );
                    })}
                </div>

                <nav className="hidden items-center justify-end gap-5 text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-300 md:flex xl:gap-7 xl:text-xs">
                    {sections.map((section) => (
                        <a
                            key={section.id}
                            href={`#${section.id}`}
                            className="transition-colors hover:text-[var(--artist-accent-bright)]"
                        >
                            {section.label}
                        </a>
                    ))}
                </nav>

                <details className="relative col-start-2 justify-self-end md:hidden">
                    <summary
                        className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-md border border-zinc-700 text-zinc-100 transition hover:border-zinc-500 [&::-webkit-details-marker]:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        <Menu className="h-5 w-5" />
                    </summary>
                    <div className="absolute right-0 mt-3 w-64 rounded-md border border-white/15 bg-black/95 p-3 shadow-2xl">
                        <p className="px-2 pb-2 text-[9px] font-semibold uppercase tracking-[0.24em] text-zinc-600">
                            Choose artist
                        </p>
                        <div className="grid grid-cols-2 overflow-hidden rounded-md border border-white/15">
                            {artists.map((project) => {
                                const isActive = project.id === artist.id;

                                return (
                                    <Link
                                        key={project.id}
                                        href={project.homePath}
                                        aria-current={isActive ? "page" : undefined}
                                        className="flex min-h-12 items-center justify-center border-r border-white/10 px-2 text-center text-[10px] font-black uppercase tracking-[0.12em] last:border-r-0"
                                        style={isActive
                                            ? {
                                                backgroundColor: "var(--artist-accent-bright)",
                                                color: "var(--artist-button-text)",
                                            }
                                            : { color: "#d4d4d8" }}
                                    >
                                        {project.name}
                                    </Link>
                                );
                            })}
                        </div>

                        <nav className="mt-3 flex flex-col border-t border-white/10 pt-2 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className="rounded px-3 py-2.5 transition-colors hover:bg-white/10 hover:text-[var(--artist-accent-bright)]"
                                >
                                    {section.label}
                                </a>
                            ))}
                        </nav>
                    </div>
                </details>
            </div>
        </header>
    );
}
