import {COLORS} from "@/app/theme";
import {useState} from "react";
import bandInfo from "@/app/config/fate-info";
import Image from 'next/image';
import {AudioTrack} from "@/app/components/audio-track";

type Track = {
    title: string;
    audioSrc: string;
    releaseDate: string;
};

function getReleaseStatus(
    dateString: string
): "released" | "future" | "tbd" {
    if (!dateString || dateString.trim() === "") {
        return "tbd";
    }

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "tbd";

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    date.setHours(0, 0, 0, 0);

    if (date > today) return "future";
    return "released";
}

function formatReleaseDate(dateString: string): string {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
    });
}

export function AlbumsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    // Let TS infer the type from bandInfo.ALBUMS
    const activeAlbum = bandInfo.ALBUMS[activeIndex];

    const prevAlbum = () => {
        setActiveIndex((idx) =>
            idx === 0 ? bandInfo.ALBUMS.length - 1 : idx - 1
        );
    };

    const nextAlbum = () => {
        setActiveIndex((idx) =>
            idx === bandInfo.ALBUMS.length - 1 ? 0 : idx + 1
        );
    };

    return (
        <section
            id="albums"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{
                backgroundImage: `radial-gradient(circle at right, ${COLORS.accent} 0, #000 55%)`,
            }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                            &lt; Albums &gt;
                        </h2>
                        {/*<p className="mt-3 text-lg font-semibold text-zinc-50">*/}
                        {/*    Explore the discography*/}
                        {/*</p>*/}
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                        <button
                            onClick={prevAlbum}
                            className="h-12 w-12 rounded-full text-3xl"
                            style={{backgroundColor: COLORS.surface}}
                        >
                            ‹
                        </button>
                        <button
                            onClick={nextAlbum}
                            className="h-12 w-12 rounded-full text-3xl"
                            style={{backgroundColor: COLORS.surface}}
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Carousel card */}
                <div className="flex flex-col gap-6 rounded-xl border p-4 sm:flex-row sm:p-6">
                    {/* Album cover */}
                    <div
                        className="relative h-44 w-44 rounded-xl overflow-hidden sm:h-56 sm:w-56"
                        style={{
                            backgroundColor: COLORS.surface,
                            border: `1px solid ${COLORS.border}`,
                        }}
                    >
                        <Image
                            src={activeAlbum.coverSrc}
                            alt={`${activeAlbum.title} cover`}
                            fill
                            style={{objectFit: "cover"}}
                            unoptimized
                        />
                    </div>


                    {/* Album info + tracks */}
                    <div className="flex flex-1 flex-col gap-4">
                        <div>
                            <h3 className="mt-1 text-xl font-semibold">
                                {activeAlbum.title}
                                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                    {activeAlbum.year}
                                </p>
                            </h3>
                            {/*<p className="mt-2 text-sm text-zinc-300">*/}
                            {/*    {activeAlbum.description}*/}
                            {/*</p>*/}
                        </div>

                        <div className="space-y-3">
                            {activeAlbum.tracks.map((track) => {
                                const status = getReleaseStatus(track.releaseDate);
                                return (
                                    <div
                                        key={track.title}
                                        className="
                                            flex flex-col gap-2
                                            rounded-md border px-3 py-2 text-sm
                                            sm:flex-row sm:items-center sm:justify-between
                                          "
                                        style={{borderColor: COLORS.border}}
                                    >
                                      <span className="font-medium text-zinc-100">
                                        {track.title}
                                      </span>

                                        {status === "released" ? (
                                            <div className="w-full sm:w-auto sm:max-w-xs">
                                                <AudioTrack
                                                    id={track.title}
                                                    src={track.audioSrc}
                                                    className="w-full"
                                                />
                                            </div>
                                        ) : (
                                            <span className="mt-1 text-xs text-zinc-300 sm:mt-0 sm:w-64">
                                              {status === "future"
                                                  ? `Set to be released on ${formatReleaseDate(track.releaseDate)}`
                                                  : "Release date TBD"}
                                            </span>
                                        )}
                                    </div>

                                );
                            })}
                        </div>

                        {/* Mobile carousel controls */}
                        <div className="mt-2 flex items-center justify-between sm:hidden">
                            <button
                                onClick={prevAlbum}
                                className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
                                style={{backgroundColor: COLORS.surface}}
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-2">
                                {bandInfo.ALBUMS.map((album, index) => (
                                    <button
                                        key={album.id}
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-2 w-2 rounded-full ${
                                            index === activeIndex ? "scale-125" : "opacity-50"
                                        }`}
                                        style={{
                                            backgroundColor:
                                                index === activeIndex
                                                    ? COLORS.accent
                                                    : COLORS.textMuted,
                                        }}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={nextAlbum}
                                className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
                                style={{backgroundColor: COLORS.surface}}
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
