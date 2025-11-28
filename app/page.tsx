"use client";

import React, { useEffect, useState } from "react";
import { COLORS } from "./theme";
// import type {Metadata} from "next";
import bandInfo from "@/app/config/fate-info";

// export const metadata: Metadata = {
//     title: bandInfo.band_name,
//     description: "Official site of Your Band Name – rock shows, music, and news.",
// };

// navigation sections
const SECTIONS = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "band", label: "Band" },
    { id: "albums", label: "Albums" },
    { id: "shows", label: "Shows" },
    { id: "discover", label: "Discover" },
    { id: "contact", label: "Contact" },
];

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    // show scroll-to-top button
    useEffect(() => {
        const handleScroll = () => {
            setShowScrollTop(window.scrollY > 600);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // scroll reveal for sections
    useEffect(() => {
        const elements = Array.from(
            document.querySelectorAll<HTMLElement>("[data-reveal]")
        );

        if (!("IntersectionObserver" in window)) {
            elements.forEach((el) => el.classList.add("reveal-visible"));
            return;
        }

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add("reveal-visible");
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.2 }
        );

        elements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    const handleNavClick = (id: string) => {
        setMenuOpen(false);
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const scrollToSection = (id: string) => {
        const el = document.getElementById(id);
        if (el) {
            el.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    };

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div
            className="min-h-screen text-zinc-50 font-sans"
            style={{ backgroundColor: COLORS.bgMain }}
        >
            {/* NAVBAR / HAMBURGER */}
            <header
                className="fixed inset-x-0 top-0 z-40 border-b bg-black/80 backdrop-blur-md"
                style={{ borderColor: COLORS.border }}
            >
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8 lg:px-16">
                    <button
                        className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-200"
                        onClick={() => handleNavClick("hero")}
                    >
                        &lt; {bandInfo.band_name} &gt;
                    </button>

                    {/* Desktop nav */}
                    <nav className="hidden gap-6 text-xs uppercase tracking-[0.22em] text-zinc-300 md:flex">
                        {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => handleNavClick(section.id)}
                                className="transition-colors hover:text-orange-400"
                            >
                                {section.label}
                            </button>
                        ))}
                    </nav>

                    {/* Mobile hamburger */}
                    <button
                        className="flex h-9 w-9 items-center justify-center rounded-md border md:hidden"
                        style={{ borderColor: COLORS.border }}
                        onClick={() => setMenuOpen((prev) => !prev)}
                        aria-label="Toggle navigation menu"
                    >
            <span className="flex flex-col gap-1.5">
              <span className="block h-[2px] w-5 bg-zinc-200" />
              <span className="block h-[2px] w-5 bg-zinc-200" />
              <span className="block h-[2px] w-5 bg-zinc-200" />
            </span>
                    </button>
                </div>

                {/* Mobile nav dropdown */}
                {menuOpen && (
                    <div
                        className="border-t bg-black/95 md:hidden"
                        style={{ borderColor: COLORS.border }}
                    >
                        <nav className="mx-auto flex max-w-5xl flex-col px-4 py-3 text-xs uppercase tracking-[0.22em] text-zinc-300">
                            {SECTIONS.map((section) => (
                                <button
                                    key={section.id}
                                    onClick={() => handleNavClick(section.id)}
                                    className="w-full py-2 text-left hover:text-orange-400"
                                >
                                    {section.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                )}
            </header>

            {/* MAIN CONTENT */}
            <main className="pt-20">
                <HeroSection onScrollDown={() => scrollToSection("about")} />
                <AboutSection />
                <BandSection />
                <AlbumsSection />
                <ShowsSection />
                <NewsletterSection />
                <DiscoverSection />
                <ContactSection />
            </main>

            {/* FOOTER */}
            <footer
                className="relative border-t px-4 py-6 sm:px-8 lg:px-16"
                style={{ backgroundColor: COLORS.bgAlt, borderColor: COLORS.border }}
            >
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-zinc-500 sm:flex-row">
                    <div className="flex flex-col items-center gap-1 sm:items-start">
                        <span>2025 · &lt; {bandInfo.band_name} &gt;</span>
                        <span>All rights reserved</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <button className="text-xs uppercase tracking-[0.18em] text-zinc-300">
                            Facebook
                        </button>
                        <button className="text-xs uppercase tracking-[0.18em] text-zinc-300">
                            Instagram
                        </button>
                    </div>
                </div>
            </footer>

            {/* Scroll to top button */}
            {showScrollTop && (
                <button
                    aria-label="Scroll to top"
                    onClick={scrollToTop}
                    className="fixed bottom-6 right-6 flex h-10 w-10 items-center justify-center rounded-full text-black shadow-lg"
                    style={{
                        backgroundColor: COLORS.accent,
                        boxShadow: `0 10px 30px ${COLORS.accentSoft}`,
                    }}
                >
                    ↑
                </button>
            )}
        </div>
    );
}

/* ---------- SECTIONS BELOW ---------- */

type HeroSectionProps = {
    onScrollDown: () => void;
};

function HeroSection({ onScrollDown }: HeroSectionProps) {
    return (
        <section
            id="hero"
            data-reveal
            className="relative flex min-h-[80vh] flex-col items-center justify-center overflow-hidden px-4 py-16 sm:px-8 lg:px-16"
        >
            {/* Background gradient */}
            <div
                className="pointer-events-none absolute inset-0 opacity-70"
                style={{
                    backgroundImage: `radial-gradient(circle at top, ${COLORS.accent} 0, #000 55%)`,
                }}
            />
            <div className="relative z-10 flex w-full max-w-5xl flex-col items-center gap-10 text-center sm:items-start sm:text-left">
                {/* Socials */}
                <div className="flex items-center gap-4">
                    <button
                        className="rounded-full border px-4 py-1 text-xs uppercase tracking-[0.18em] text-zinc-200 hover:bg-zinc-900"
                        style={{ borderColor: COLORS.border }}
                    >
                        Facebook
                    </button>
                    <button
                        className="rounded-full border px-4 py-1 text-xs uppercase tracking-[0.18em] text-zinc-200 hover:bg-zinc-900"
                        style={{ borderColor: COLORS.border }}
                    >
                        Instagram
                    </button>
                </div>

                {/* Band name + tagline */}
                <div className="flex flex-col gap-4">
                    <p className="text-xs uppercase tracking-[0.3em] text-zinc-300">
                        Rock shows
                    </p>
                    <h1 className="text-4xl font-bold uppercase tracking-tight sm:text-5xl lg:text-6xl">
                        {bandInfo.band_name}
                    </h1>
                    <p className="max-w-xl text-sm text-zinc-300 sm:text-base">
                        Loud guitars. Heavy drums. Nights you&apos;ll never forget.
                    </p>
                </div>

                {/* Next show card */}
                <div
                    id="nextShow"
                    className="w-full max-w-xl rounded-xl border p-5 backdrop-blur-md sm:flex sm:items-center sm:justify-between"
                    style={{
                        backgroundColor: COLORS.surface,
                        borderColor: COLORS.border,
                    }}
                >
                    <div>
                        <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                            Next show
                        </p>
                        <p className="mt-2 text-lg font-semibold">
                            29 / 11 — Madison Square Garden
                        </p>
                        <p className="text-sm text-zinc-400">Manhattan · 21:00</p>
                    </div>
                    <div className="mt-4 text-right sm:mt-0">
                        <button
                            className="text-xs font-semibold uppercase tracking-[0.2em]"
                            style={{ color: COLORS.accent }}
                        >
                            Show all dates ➜
                        </button>
                    </div>
                </div>
            </div>

            {/* Scroll down tag */}
            <button
                onClick={onScrollDown}
                className="relative z-10 mt-16 flex items-center gap-2 text-xs uppercase tracking-[0.35em] text-zinc-300"
            >
                <span className="h-px w-8 bg-zinc-500" />
                Scroll
            </button>
        </section>
    );
}

function AboutSection() {
    return (
        <section
            id="about"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgAlt }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <div className="max-w-xl">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        &lt; {bandInfo.band_name} &gt;
                    </h2>
                    <p className="mt-4 text-xl font-semibold text-zinc-50">
                        &quot;Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                        Provident..&quot;
                    </p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam,
                        vel quia modi obcaecati quas velit nam illo itaque autem porro
                        repellat, animi magni enim est ullam quaerat nobis aspernatur id?
                        Aut provident officia autem expedita doloremque tenetur natus
                        laborum dolorum mollitia quisquam tempore molestiae.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Earum
                        pariatur eum rem inventore error, nobis ea aperiam, tenetur saepe
                        iure ipsa reiciendis! Animi aliquid numquam aliquam eos quisquam
                        ducimus quam sequi dolorum unde sint voluptatem, quae corrupti modi
                        nisi! Omnis amet, distinctio sapiente expedita quod possimus cum
                        fugit similique, architecto.
                    </p>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Iste
                        dicta, cupiditate, deleniti adipisci dolorum nesciunt cumque qui!
                        Iusto dicta ab perspiciatis, deserunt autem tempora fuga eligendi
                        sint aliquid?
                    </p>
                </div>
            </div>
        </section>
    );
}

function BandSection() {
    const members = [
        { name: "Greg", role: "Guitars" },
        { name: "Charly", role: "Drums" },
        { name: "Jim", role: "Bass · Keyboards" },
    ];

    return (
        <section
            id="band"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgMain }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-10">
                <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                    The band
                </h2>
                <div className="grid gap-8 sm:grid-cols-3">
                    {members.map((member) => (
                        <article
                            key={member.name}
                            className="flex flex-col items-center gap-4 text-center"
                        >
                            <div
                                className="h-40 w-40 rounded-full shadow-lg"
                                style={{
                                    backgroundColor: COLORS.surface,
                                    boxShadow: `0 10px 30px ${COLORS.accentSoft}`,
                                }}
                            />
                            <div>
                                <h3 className="text-lg font-semibold">{member.name}</h3>
                                <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                    {member.role}
                                </p>
                            </div>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}

/* ---------- ALBUMS CAROUSEL SECTION ---------- */

type Track = {
    title: string;
    audioSrc: string;
};

type Album = {
    id: string;
    title: string;
    year: number;
    description: string;
    coverSrc: string;
    tracks: Track[];
};

// dummy data – replace with your actual files
const ALBUMS: Album[] = [
    {
        id: "collapse-rebuild",
        title: "Collapse // Rebuild",
        year: 2025,
        description: "Heavy, melodic metalcore with big choruses.",
        coverSrc: "/albums/collapse-rebuild.jpg",
        tracks: [
            { title: "New Beginning", audioSrc: "/audio/new-beginning.mp3" },
            { title: "Barbie", audioSrc: "/audio/barbie.mp3" },
            { title: "Chase Your Dreams", audioSrc: "/audio/chase-your-dreams.mp3" },
        ],
    },
    {
        id: "monster-you-made",
        title: "Monster You Made",
        year: 2024,
        description: "Dark, emotional riffs and breakdowns.",
        coverSrc: "/albums/monster-you-made.jpg",
        tracks: [
            { title: "Had It All", audioSrc: "/audio/had-it-all.mp3" },
            { title: "Losing My Grip", audioSrc: "/audio/losing-my-grip.mp3" },
        ],
    },
];

function AlbumsSection() {
    const [activeIndex, setActiveIndex] = useState(0);

    const activeAlbum = ALBUMS[activeIndex];

    const prevAlbum = () => {
        setActiveIndex((idx) => (idx === 0 ? ALBUMS.length - 1 : idx - 1));
    };

    const nextAlbum = () => {
        setActiveIndex((idx) => (idx === ALBUMS.length - 1 ? 0 : idx + 1));
    };

    return (
        <section
            id="albums"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgAlt }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <div className="flex items-center justify-between gap-4">
                    <div>
                        <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                            Albums
                        </h2>
                        <p className="mt-3 text-lg font-semibold text-zinc-50">
                            Explore the discography
                        </p>
                    </div>
                    <div className="hidden items-center gap-2 sm:flex">
                        <button
                            onClick={prevAlbum}
                            className="h-8 w-8 rounded-full text-sm"
                            style={{ backgroundColor: COLORS.surface }}
                        >
                            ‹
                        </button>
                        <button
                            onClick={nextAlbum}
                            className="h-8 w-8 rounded-full text-sm"
                            style={{ backgroundColor: COLORS.surface }}
                        >
                            ›
                        </button>
                    </div>
                </div>

                {/* Carousel card */}
                <div className="flex flex-col gap-6 rounded-xl border p-4 sm:flex-row sm:p-6">
                    {/* Album cover */}
                    <div className="flex-shrink-0">
                        <div
                            className="h-44 w-44 rounded-xl bg-cover bg-center bg-no-repeat sm:h-56 sm:w-56"
                            style={{
                                backgroundImage: `url(${activeAlbum.coverSrc})`,
                                backgroundColor: COLORS.surface,
                                borderColor: COLORS.border,
                                borderWidth: 1,
                            }}
                        />
                    </div>

                    {/* Album info + tracks */}
                    <div className="flex flex-1 flex-col gap-4">
                        <div>
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                {activeAlbum.year}
                            </p>
                            <h3 className="mt-1 text-xl font-semibold">
                                {activeAlbum.title}
                            </h3>
                            <p className="mt-2 text-sm text-zinc-300">
                                {activeAlbum.description}
                            </p>
                        </div>

                        <div className="space-y-3">
                            {activeAlbum.tracks.map((track) => (
                                <div
                                    key={track.title}
                                    className="flex flex-col gap-1 rounded-md border px-3 py-2 text-sm sm:flex-row sm:items-center sm:justify-between"
                                    style={{ borderColor: COLORS.border }}
                                >
                  <span className="font-medium text-zinc-100">
                    {track.title}
                  </span>
                                    <audio
                                        controls
                                        src={track.audioSrc}
                                        className="mt-1 w-full sm:mt-0 sm:w-64"
                                    >
                                        Your browser does not support the audio element.
                                    </audio>
                                </div>
                            ))}
                        </div>

                        {/* Mobile carousel controls */}
                        <div className="mt-2 flex items-center justify-between sm:hidden">
                            <button
                                onClick={prevAlbum}
                                className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
                                style={{ backgroundColor: COLORS.surface }}
                            >
                                Previous
                            </button>
                            <div className="flex items-center gap-2">
                                {ALBUMS.map((album, index) => (
                                    <button
                                        key={album.id}
                                        onClick={() => setActiveIndex(index)}
                                        className={`h-2 w-2 rounded-full ${
                                            index === activeIndex ? "scale-125" : "opacity-50"
                                        }`}
                                        style={{
                                            backgroundColor:
                                                index === activeIndex ? COLORS.accent : COLORS.textMuted,
                                        }}
                                    />
                                ))}
                            </div>
                            <button
                                onClick={nextAlbum}
                                className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.16em]"
                                style={{ backgroundColor: COLORS.surface }}
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

/* ---------- REST OF SECTIONS (SHOWS / NEWSLETTER / DISCOVER / CONTACT) ---------- */

function ShowsSection() {
    const shows = [
        "29/11/2019 · Madison Square Garden · Manhattan · 21h",
        "20/09/2019 · Carnegie Hall · Manhattan · 21h",
        "26/07/2019 · Fox Theater · Detroit · 21h",
        "20/07/2019 · Apollo Theater · Manhattan · 21h",
        "10/05/2019 · 924 Gilman Street · Berkeley · 21h",
    ];

    return (
        <section
            id="shows"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgMain }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                    Shows
                </h2>
                <div className="space-y-4 text-sm text-zinc-200 sm:text-base">
                    {shows.map((line) => (
                        <p
                            key={line}
                            className="flex flex-col border-b pb-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                            style={{ borderColor: COLORS.border }}
                        >
                            <span>{line}</span>
                        </p>
                    ))}
                </div>
            </div>
        </section>
    );
}

function NewsletterSection() {
    return (
        <section
            id="newsletter"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgAlt }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8 lg:flex-row lg:items-start">
                <div className="flex-1">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        Keep update
                    </h2>
                    <p className="mt-3 text-lg font-semibold text-zinc-50">
                        Don&apos;t miss the next shows
                    </p>
                    <p className="mt-2 text-sm text-zinc-300">
                        Join the newsletter for new dates, releases, and exclusive news.
                    </p>
                </div>

                <div
                    className="mt-4 flex-1 rounded-xl border p-4 sm:mt-0"
                    style={{ backgroundColor: COLORS.surface, borderColor: COLORS.border }}
                >
                    <form className="space-y-4">
                        <div className="space-y-1">
                            <label
                                htmlFor="emailNews"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Email
                            </label>
                            <input
                                id="emailNews"
                                type="email"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                    boxShadow: "none",
                                }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-3">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                Are you human?
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-200">3 + 4 =</span>
                                <input
                                    id="checkRobotNews"
                                    type="number"
                                    className="w-20 rounded-md border px-3 py-1 text-sm outline-none focus:ring-2"
                                    style={{
                                        backgroundColor: "#000",
                                        borderColor: COLORS.border,
                                        color: COLORS.textPrimary,
                                    }}
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            className="mt-2 w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
                            style={{ backgroundColor: COLORS.accent }}
                        >
                            Subscribe
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
}

function DiscoverSection() {
    return (
        <section
            id="discover"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgMain }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                    Discover
                </h2>
                <p className="text-lg font-semibold text-zinc-50">
                    &lt; Your clip name here &gt;
                </p>
                <div
                    className="aspect-video w-full overflow-hidden rounded-xl border bg-black/70"
                    style={{ borderColor: COLORS.border }}
                >
                    <video controls className="h-full w-full object-cover">
                        <source src="/video/your-clip.mp4" type="video/mp4" />
                        Your browser does not support this video file format.
                    </video>
                </div>
            </div>
        </section>
    );
}

function ContactSection() {
    return (
        <section
            id="contact"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{ backgroundColor: COLORS.bgAlt }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-10 lg:flex-row">
                {/* Contact info */}
                <div className="lg:w-1/3">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        Contact
                    </h2>
                    <div className="mt-4 space-y-2 text-sm text-zinc-200">
                        <p>- &lt; {bandInfo.band_name} &gt; -</p>
                        <p>New York</p>
                        <p
                            className="mt-3"
                            style={{ color: COLORS.accent }}
                        >
                            contact@yourbandname.com
                        </p>
                    </div>
                </div>

                {/* Contact form */}
                <div className="lg:w-2/3">
                    <form className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-1 sm:col-span-1">
                            <label
                                htmlFor="nom"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Name
                            </label>
                            <input
                                id="nom"
                                type="text"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="Your name"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-1">
                            <label
                                htmlFor="telephone"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Phone
                            </label>
                            <input
                                id="telephone"
                                type="tel"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="Your phone"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <label
                                htmlFor="mail"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Email
                            </label>
                            <input
                                id="mail"
                                type="email"
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="you@example.com"
                            />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                            <label
                                htmlFor="message"
                                className="text-xs uppercase tracking-[0.25em] text-zinc-400"
                            >
                                Message
                            </label>
                            <textarea
                                id="message"
                                rows={4}
                                className="w-full rounded-md border px-3 py-2 text-sm outline-none focus:ring-2"
                                style={{
                                    backgroundColor: "#000",
                                    borderColor: COLORS.border,
                                    color: COLORS.textPrimary,
                                }}
                                placeholder="Your message"
                            />
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                Subscribe newsletter?
                            </p>
                            <div className="flex flex-wrap gap-4 text-sm text-zinc-200">
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="newsletter" value="yes" />
                                    Yes
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="radio" name="newsletter" value="no" />
                                    No
                                </label>
                            </div>
                        </div>

                        <div className="space-y-2 sm:col-span-2">
                            <p className="text-xs uppercase tracking-[0.25em] text-zinc-400">
                                Are you human?
                            </p>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-200">3 + 4 =</span>
                                <input
                                    id="checkRobot"
                                    type="number"
                                    className="w-20 rounded-md border px-3 py-1 text-sm outline-none focus:ring-2"
                                    style={{
                                        backgroundColor: "#000",
                                        borderColor: COLORS.border,
                                        color: COLORS.textPrimary,
                                    }}
                                />
                            </div>
                        </div>

                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className="mt-2 w-full rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-black"
                                style={{ backgroundColor: COLORS.accent }}
                            >
                                Send
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </section>
    );
}
