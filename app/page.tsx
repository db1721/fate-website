"use client";

import React, { useEffect, useState } from "react";
import { COLORS } from "./theme";
import bandInfo from "@/app/config/fate-info";
import {AlbumsSection} from "@/app/components/discography";
import {AboutSection} from "@/app/components/about";
import {HeroSection} from "@/app/components/hero";
import {CurrentYear} from "@/app/config/utils";

// navigation sections
const SECTIONS = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "albums", label: "Discography" },
    // { id: "band", label: "Band" },
    // { id: "shows", label: "Shows" },
    // { id: "discover", label: "Discover" },
    // { id: "contact", label: "Contact" },
];

export default function Home() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [showScrollTop, setShowScrollTop] = useState(false);

    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setIsScrolled(window.scrollY > 50);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);


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
                className={`
                fixed inset-x-0 top-0 z-40
                transition-all duration-300
                ${isScrolled ? "bg-black/80 backdrop-blur-md border-b border-zinc-700" : "bg-transparent border-transparent"}
                `}>
                <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3 sm:px-8 lg:px-16">
                    {/* Desktop nav */}
                    <nav className="hidden md:flex gap-6 text-xs uppercase tracking-[0.22em] text-zinc-300 justify-center w-full">
                    {SECTIONS.map((section) => (
                            <button
                                key={section.id}
                                onClick={() => handleNavClick(section.id)}
                                className="transition-colors hover:text-blue-300"
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
            <main>
                <HeroSection onScrollDown={() => scrollToSection("albums")} />
                <AboutSection />
                <AlbumsSection />
            </main>

            {/* FOOTER */}
            <footer
                className="relative border-t px-4 py-6 sm:px-8 lg:px-16"
                style={{ backgroundColor: COLORS.bgAlt, borderColor: COLORS.border }}
            >
                <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-xs text-zinc-500 sm:flex-row">
                    <div className="flex flex-col items-center gap-1 sm:items-start">
                        <span>{CurrentYear()} · &lt; {bandInfo.band_name} &gt;</span>
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






