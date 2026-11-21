"use client";

import { useMemo, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Disc3, Pause, Play, Star } from "lucide-react";
import { AudioTrack } from "@/app/components/audio-track";
import { MobileDockedPlayer } from "@/app/components/mobile-docked-player";
import { useDockedPlayback } from "@/app/components/use-docked-playback";
import { SectionLink } from "@/app/components/section-link";
import { getArtistSongPath } from "@/app/config/artists";
import type { AlbumData, ArtistConfig, TrackData } from "@/app/config/artists/types";
import { getTrackSlug } from "@/app/config/music-data";
import { isFutureCatalogRelease, parseMusicReleaseDate } from "@/lib/public-catalog";

function parseReleaseDate(dateString: string) {
    return parseMusicReleaseDate(dateString);
}

function getReleaseStatus(dateString: string): "released" | "future" | "tbd" {
    if (!dateString.trim()) return "tbd";

    const date = parseReleaseDate(dateString);
    if (!date) return "tbd";
    return isFutureCatalogRelease(dateString) ? "future" : "released";
}

function formatReleaseDate(dateString: string) {
    const date = parseReleaseDate(dateString);
    if (!date) return dateString;

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        timeZone: "UTC",
    });
}

function hasTrackPage(track: TrackData) {
    return Boolean(
        track.publicSongId ||
        track.featured ||
        track.lyricsUrl ||
        track.songServiceLinks?.length
    );
}

function getEffectiveReleaseDate(track: TrackData, albumReleaseDate?: string) {
    return track.releaseDate?.trim() || albumReleaseDate?.trim() || "";
}

function renderAlbumDescription(description: string) {
    // Support single-asterisk emphasis while keeping all content escaped by React.
    return description.split(/(?<![\\*])\*(?!\s)([^*\r\n]+?)(?<![\s\\])\*(?!\*)/g).map((part, index) =>
        index % 2 === 1 ? <em key={index} className="italic">{part}</em> : part
    );
}

type AlbumsSectionProps = {
    artist: ArtistConfig;
    featuredAlbumId?: string;
};

// Keep the selection on client-side trips to a track page and back.
const browsedAlbums = new Map<ArtistConfig["id"], string>();

const desktopQuery = "(min-width: 40rem)";
function subscribeToLayout(update: () => void) {
    const query = window.matchMedia(desktopQuery);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
}
const desktopLayout = () => window.matchMedia(desktopQuery).matches;
const serverLayout = () => false;

type AlbumTrackListProps = {
    album: AlbumData;
    artist: ArtistConfig;
    desktop: boolean;
    dockHost: HTMLDivElement | null;
};

function AlbumTrackList({ album, artist, desktop, dockHost }: AlbumTrackListProps) {
    const { audioRef, activeTrack, playing: dockPlaying, currentTime, duration, error, toggleTrack, toggle, seek, close } = useDockedPlayback(artist.id);
    const [inlinePlayingId, setInlinePlayingId] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(false);
    const lastTrigger = useRef<HTMLButtonElement | null>(null);
    const selectedId = desktop ? inlinePlayingId : activeTrack?.id;
    const tracks = useMemo(() => album.tracks.map(track => {
        const date = getEffectiveReleaseDate(track, album.releaseDate);
        return { track, date, status: getReleaseStatus(date) };
    }), [album]);

    function dismiss() {
        setExpanded(false);
        close();
        const trigger = lastTrigger.current;
        const focusTarget = trigger?.isConnected ? trigger : document.getElementById("albums");
        focusTarget?.focus({ preventScroll: true });
    }

    return (
        <div className="mt-5 sm:mt-8">
            <h4 className="mb-2 text-lg font-bold text-white sm:hidden">Song previews</h4>
            <div className="border-t border-white/15">
                {tracks.map(({ track, date, status }, index) => {
                    const id = track.publicSongId ?? track.title;
                    const playable = status === "released" && Boolean(track.audioSrc);
                    const selected = id === selectedId;
                    const playing = selected && (desktop || dockPlaying);
                    const titleClass = "block min-w-0 break-words py-3 text-sm font-semibold leading-5 text-zinc-100 group-data-[selected=true]/track:text-[var(--artist-accent-bright)] sm:py-2 sm:text-base";
                    return (
                        <div key={id} data-selected={selected} className="group/track grid min-h-12 grid-cols-[minmax(0,1fr)_auto] items-center gap-x-2 border-b border-white/10 sm:min-h-16 sm:grid-cols-[minmax(0,1fr)_minmax(220px,320px)] sm:gap-3 sm:py-3">
                            <div className="flex min-w-0 items-center gap-3">
                                <span className="w-6 shrink-0 text-xs tabular-nums text-zinc-400">{String(track.trackNumber ?? index + 1).padStart(2, "0")}</span>
                                <div className="min-w-0">
                                    {status === "released" && hasTrackPage(track) ? (
                                        <Link href={getArtistSongPath(artist, getTrackSlug(track))} className={`${titleClass} hover:text-[var(--artist-accent-bright)] focus-visible:outline-2 focus-visible:outline-[var(--artist-accent-bright)]`}>
                                            {track.title}
                                        </Link>
                                    ) : <span className={titleClass}>{track.title}</span>}
                                    {desktop && (track.featured || playing) && (
                                        <div className="flex flex-wrap gap-2 text-[10px] font-semibold uppercase tracking-[0.14em]">
                                            {track.featured && <span className="text-[var(--artist-accent-soft)]">Featured</span>}
                                            {playing && <span className="text-[var(--artist-accent-bright)]">Now playing</span>}
                                        </div>
                                    )}
                                </div>
                            </div>
                            {playable && (desktop ? (
                                <AudioTrack
                                    id={id}
                                    src={track.audioSrc}
                                    trackTitle={track.title}
                                    previewStartTime={0}
                                    projectId={artist.id}
                                    compactOnMobile
                                    onPlay={() => setInlinePlayingId(id)}
                                    onPause={() => setInlinePlayingId(previous => previous === id ? null : previous)}
                                />
                            ) : (
                                <button
                                    type="button"
                                    aria-label={`${playing ? "Pause" : "Play"} ${track.title} preview`}
                                    className="grid size-11 shrink-0 cursor-pointer place-items-center rounded-full text-zinc-100 group-data-[selected=true]/track:text-[var(--artist-accent-bright)] hover:bg-white/5 focus-visible:outline-2 focus-visible:outline-[var(--artist-accent-bright)]"
                                    onClick={event => {
                                        lastTrigger.current = event.currentTarget;
                                        toggleTrack({ id, title: track.title, src: track.audioSrc, coverSrc: track.songImg ?? album.coverSrc });
                                    }}
                                >
                                    {playing ? <Pause className="size-4" fill="currentColor" aria-hidden="true" /> : <Play className="size-4" fill="currentColor" aria-hidden="true" />}
                                </button>
                            ))}
                            {!playable && <p className="col-span-2 pb-2 pl-9 text-xs text-zinc-400 sm:col-span-1 sm:p-0 sm:text-right">
                                {status === "future" ? `Available ${formatReleaseDate(date)}` : status === "released" ? "Audio preview unavailable" : "Release date TBD"}
                            </p>}
                        </div>
                    );
                })}
            </div>
            {!desktop && <audio ref={audioRef} preload="none" />}
            {activeTrack && dockHost && createPortal(
                <MobileDockedPlayer
                    trackTitle={activeTrack.title}
                    artistName={artist.name}
                    coverSrc={activeTrack.coverSrc}
                    playing={dockPlaying}
                    currentTime={currentTime}
                    duration={duration}
                    error={error}
                    onToggle={toggle}
                    onSeek={seek}
                    onClose={dismiss}
                    expanded={expanded}
                    onExpandedChange={setExpanded}
                />, dockHost
            )}
        </div>
    );
}

export function AlbumsSection({ artist, featuredAlbumId }: AlbumsSectionProps) {
    const [selectedAlbumId, setSelectedAlbumId] = useState(() => browsedAlbums.get(artist.id));
    const [dockHost, setDockHost] = useState<HTMLDivElement | null>(null);
    const desktop = useSyncExternalStore(subscribeToLayout, desktopLayout, serverLayout);
    const activeAlbum = artist.albums.find((album) => album.id === selectedAlbumId)
        ?? artist.albums.find((album) => album.id === featuredAlbumId)
        ?? artist.albums[0];

    if (!activeAlbum) {
        return (
            <section
                data-reveal
                className="border-y border-white/10 px-4 py-20 sm:px-8 lg:px-16"
                style={{ backgroundColor: "var(--artist-background-alt)" }}
            >
                <div id="albums" tabIndex={-1} className="artist-section-heading mx-auto max-w-5xl">
                    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                        {artist.musicSection.eyebrow}
                    </p>
                    <h2 className="mt-3 max-w-2xl text-3xl font-black uppercase tracking-normal text-white sm:text-4xl">
                        {artist.catalogStatus === "unavailable" ? "Music is temporarily unavailable" : artist.musicSection.emptyTitle}
                    </h2>
                    <p className="mt-4 max-w-xl text-sm leading-7 text-zinc-400 sm:text-base">
                        {artist.catalogStatus === "unavailable" ? "Please check back shortly. The music catalog could not be loaded." : artist.musicSection.emptyDescription}
                    </p>
                </div>
            </section>
        );
    }

    const albumReleaseDate = activeAlbum.releaseDate
        ? formatReleaseDate(activeAlbum.releaseDate)
        : null;
    const highlightedTrack = activeAlbum.highlightTrack
        ? activeAlbum.tracks.find((track) => track.title === activeAlbum.highlightTrack)
        : undefined;
    const highlightReleaseDate = highlightedTrack
        ? getEffectiveReleaseDate(highlightedTrack, activeAlbum.releaseDate)
        : "";
    const highlightStatus = highlightedTrack
        ? getReleaseStatus(highlightReleaseDate)
        : "tbd";
    const highlightSlug = highlightedTrack ? getTrackSlug(highlightedTrack) : null;

    const selectAlbum = (albumId: string) => {
        if (albumId === activeAlbum.id) return;
        browsedAlbums.set(artist.id, albumId);
        setSelectedAlbumId(albumId);
    };

    const trackList = (
        <AlbumTrackList
            key={desktop ? activeAlbum.id : "docked"}
            album={activeAlbum}
            artist={artist}
            desktop={desktop}
            dockHost={dockHost}
        />
    );

    return (<>
        <section
            data-reveal
            className="relative overflow-hidden border-y border-white/10 px-4 py-20 sm:px-8 lg:px-16"
            style={{
                background: `linear-gradient(125deg, var(--artist-background-alt) 0%, var(--artist-background) 68%, color-mix(in srgb, var(--artist-accent) 12%, #000) 100%)`,
            }}
        >
            <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-y-0 right-0 w-1/3 opacity-20"
                style={{
                    background: "linear-gradient(135deg, transparent 0 46%, var(--artist-accent) 46% 47%, transparent 47% 100%)",
                }}
            />

            <div className="relative mx-auto max-w-6xl">
                <div className="flex flex-col justify-between gap-7 lg:flex-row lg:items-end">
                    <div id="albums" tabIndex={-1} className="artist-section-heading max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
                            {artist.musicSection.eyebrow}
                        </p>
                        <h2 className="mt-3 text-3xl font-black uppercase tracking-normal text-white sm:text-4xl">
                            {artist.musicSection.title}
                        </h2>
                        <p className="mt-4 text-sm leading-7 text-zinc-400 sm:text-base">
                            {artist.musicSection.description}
                        </p>
                    </div>

                    {artist.albums.length > 1 ? (
                        <div role="group" aria-label="Choose a release" className="flex flex-wrap gap-2 lg:justify-end">
                            {artist.albums.map((album) => (
                                <button
                                    key={album.id}
                                    type="button"
                                    onClick={() => selectAlbum(album.id)}
                                    aria-pressed={album.id === activeAlbum.id}
                                    className="min-h-11 max-w-full cursor-pointer break-words rounded-md border border-[var(--artist-border)] bg-[var(--artist-surface)] px-4 py-2 text-sm font-semibold text-[var(--artist-text)] transition-colors hover:border-[var(--artist-accent-soft)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--artist-accent-bright)] aria-pressed:border-[var(--artist-accent-bright)] aria-pressed:bg-[var(--artist-accent-bright)] aria-pressed:text-[var(--artist-background)]"
                                >
                                    {album.title}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>

                <div className="mt-8 grid sm:mt-10 sm:gap-8 lg:grid-cols-[minmax(240px,360px)_1fr] lg:gap-12">
                    <div>
                        <div className="relative isolate aspect-[2/1] overflow-hidden rounded-md bg-black sm:aspect-square sm:border sm:border-white/15">
                            <Image
                                src={activeAlbum.coverSrc}
                                unoptimized={Boolean(artist.catalogStatus)}
                                alt={`${activeAlbum.title} cover art`}
                                fill
                                sizes="(min-width: 1024px) 360px, 92vw"
                                className="object-cover object-[center_42%] sm:object-center"
                            />
                            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/95 via-black/35 to-transparent p-4 text-white sm:hidden">
                                <h3 className="break-words text-3xl font-bold leading-tight tracking-tight">{activeAlbum.title}</h3>
                                <p className="mt-1 text-sm text-zinc-200">{artist.name}{activeAlbum.year > 0 && ` · ${activeAlbum.year}`}</p>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-0">
                        <p className="hidden text-xs font-semibold uppercase tracking-[0.24em] text-zinc-500 sm:block">
                            {activeAlbum.tagline ?? activeAlbum.year}
                        </p>
                        <h3 className="mt-2 hidden text-3xl font-black uppercase tracking-normal text-white sm:block sm:text-4xl">
                            {activeAlbum.title}
                        </h3>
                        {!desktop && trackList}
                        {activeAlbum.description ? (
                            <>
                                <h4 className="mt-6 text-lg font-bold sm:hidden">About this release</h4>
                                <p className="mt-3 max-w-2xl whitespace-pre-line break-words text-sm leading-7 text-zinc-300">
                                    {renderAlbumDescription(activeAlbum.description)}
                                </p>
                            </>
                        ) : null}

                        <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-xs font-semibold uppercase tracking-[0.14em] text-zinc-400">
                            {albumReleaseDate ? (
                                <span className="inline-flex items-center gap-2">
                                    <CalendarDays className="h-4 w-4" style={{ color: "var(--artist-accent-bright)" }} />
                                    {albumReleaseDate}
                                </span>
                            ) : null}
                            <span className="inline-flex items-center gap-2">
                                <Disc3 className="h-4 w-4" style={{ color: "var(--artist-accent-bright)" }} />
                                {activeAlbum.tracks.length} {activeAlbum.tracks.length === 1 ? "track" : "tracks"}
                            </span>
                            {activeAlbum.highlightTrack ? (
                                <span className="inline-flex items-center gap-2" style={{ color: "var(--artist-accent-soft)" }}>
                                    <Star className="h-4 w-4" />
                                    Featured: {activeAlbum.highlightTrack}
                                </span>
                            ) : null}
                        </div>

                        {highlightSlug ? (
                            <div className="mt-6 flex flex-wrap gap-3">
                                {highlightStatus === "released" ? (
                                    <>
                                        <Link
                                            href={getArtistSongPath(artist, highlightSlug)}
                                            className="rounded-md px-5 py-2.5 text-xs font-black uppercase tracking-[0.16em] transition hover:-translate-y-0.5"
                                            style={{
                                                backgroundColor: "var(--artist-accent-bright)",
                                                color: "var(--artist-button-text)",
                                            }}
                                        >
                                            Open {activeAlbum.highlightTrack}
                                        </Link>
                                        <SectionLink
                                            href="#connect"
                                            className="rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-100 transition hover:border-white/35 hover:bg-white/10"
                                        >
                                            Streaming platforms
                                        </SectionLink>
                                    </>
                                ) : (
                                    <span className="inline-flex items-center gap-2 rounded-md border border-white/15 bg-white/5 px-5 py-2.5 text-xs font-bold uppercase tracking-[0.16em] text-zinc-300">
                                        <CalendarDays className="h-4 w-4" style={{ color: "var(--artist-accent-bright)" }} />
                                        {highlightStatus === "future"
                                            ? `Available ${formatReleaseDate(highlightReleaseDate)}`
                                            : "Release date TBD"}
                                    </span>
                                )}
                            </div>
                        ) : null}

                        {desktop && trackList}
                    </div>
                </div>
            </div>
        </section>
        {/* The section's reveal transform would otherwise pin the dock to the album. */}
        <div ref={setDockHost} />
    </>);
}
