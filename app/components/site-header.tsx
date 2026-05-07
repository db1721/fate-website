import Image from "next/image";
import bandInfo from "@/app/config/fate-info";

const SECTIONS = [
    { id: "hero", label: "Home" },
    { id: "about", label: "About" },
    { id: "albums", label: "Music" },
    { id: "connect", label: "Listen" },
    { id: "blogs", label: "Press" },
];

export function SiteHeader() {
    return (
        <header className="fixed inset-x-0 top-0 z-40 border-b border-white/10 bg-black/75 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-8 lg:px-10">
                <a href="#hero" className="flex items-center gap-3" aria-label="Go to F.A.T.E. home">
                    <Image
                        src="/icons/fate-white-short.png"
                        alt=""
                        width={72}
                        height={32}
                        className="h-auto w-16"
                        priority
                    />
                    <span className="hidden text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-300 sm:inline">
                        {bandInfo.band_name_full}
                    </span>
                </a>

                <nav className="hidden items-center gap-7 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-300 md:flex">
                    {SECTIONS.map((section) => (
                        <a key={section.id} href={`#${section.id}`} className="transition-colors hover:text-[#f5b301]">
                            {section.label}
                        </a>
                    ))}
                </nav>

                <details className="relative md:hidden">
                    <summary
                        className="flex h-9 w-9 cursor-pointer list-none items-center justify-center rounded-md border border-zinc-700 text-zinc-100 [&::-webkit-details-marker]:hidden"
                        aria-label="Toggle navigation menu"
                    >
                        <span className="flex flex-col gap-1.5">
                            <span className="block h-[2px] w-5 bg-zinc-200" />
                            <span className="block h-[2px] w-5 bg-zinc-200" />
                            <span className="block h-[2px] w-5 bg-zinc-200" />
                        </span>
                    </summary>
                    <nav className="absolute right-0 mt-3 flex min-w-44 flex-col rounded-md border border-white/10 bg-black/95 p-2 text-xs font-semibold uppercase tracking-[0.2em] text-zinc-300 shadow-2xl">
                        {SECTIONS.map((section) => (
                            <a
                                key={section.id}
                                href={`#${section.id}`}
                                className="rounded px-3 py-2 transition-colors hover:bg-white/10 hover:text-[#f5b301]"
                            >
                                {section.label}
                            </a>
                        ))}
                    </nav>
                </details>
            </div>
        </header>
    );
}
