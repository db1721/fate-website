"use client";

import { useEffect } from "react";

export function RevealController() {
    useEffect(() => {
        const root = document.documentElement;
        root.classList.add("reveal-ready");

        const elements = Array.from(
            document.querySelectorAll<HTMLElement>("[data-reveal]")
        );

        if (!("IntersectionObserver" in window)) {
            elements.forEach((el) => el.classList.add("reveal-visible"));
            return () => root.classList.remove("reveal-ready");
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
            { threshold: 0.16, rootMargin: "0px 0px -8% 0px" }
        );

        elements.forEach((el) => observer.observe(el));

        return () => {
            observer.disconnect();
            root.classList.remove("reveal-ready");
        };
    }, []);

    return null;
}
