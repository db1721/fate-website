import Image from "next/image";
import Link from "next/link";
import {COLORS} from "@/app/theme";

export type BlogPost = {
    title: string;
    excerpt: string;
    href: string;
    date: string; // ISO recommended: "2026-03-04"
    coverSrc?: any; // optional image
    tag?: string; // optional e.g. "Gear Guide"
    author?: string; // optional
};

type Props = {
    posts: BlogPost[];
    id?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
};

function toDateSafe(dateStr: string): Date {
    const parts = dateStr.split("-");
    if (parts.length === 3) {
        const [y, m, d] = parts.map(Number);
        return new Date(y, m - 1, d); // local timezone
    }

    const parsed = new Date(dateStr);
    return Number.isNaN(parsed.getTime()) ? new Date(0) : parsed;
}

function formatDate(dateStr: string) {
    const d = toDateSafe(dateStr);
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "2-digit",
        year: "numeric",
    }).format(d);
}

export default function BlogSection({
                                        posts,
                                        id = "blogs",
                                        eyebrow = "Blogs",
                                        title = "Gear guides, reviews, and slowpitch stories",
                                        subtitle = "Short reads, honest takes, and player-first recommendations.",
                                    }: Props) {
    const sorted = [...(posts ?? [])].sort(
        (a, b) => toDateSafe(b.date).getTime() - toDateSafe(a.date).getTime()
    );

    return (
        <section id={id} className="relative scroll-mt-24" style={{
            backgroundImage: `radial-gradient(circle at bottom, ${COLORS.accent} 0, #000 55%)`,
        }}>
            <div className="mx-auto max-w-6xl px-5 sm:px-8 py-12 sm:py-16">
                {/* Header */}
                <div className="max-w-2xl">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        &lt; {eyebrow} &gt;
                    </h2>
                    {/*<h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-white">*/}
                    {/*    {title}*/}
                    {/*</h2>*/}
                    {/*<p className="mt-4 text-sm sm:text-base leading-relaxed text-white/70">*/}
                    {/*    {subtitle}*/}
                    {/*</p>*/}
                </div>

                {/* Grid */}
                <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((post) => (
                        <Link
                            key={post.href}
                            href={post.href}
                            className="group outline-none"
                            aria-label={`Read: ${post.title}`}
                        >
                            <article
                                className="relative overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 transition duration-300 hover:ring-white/20 hover:bg-white/[0.07]">
                                {/* subtle spotlight */}
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                                    style={{
                                        background:
                                            "radial-gradient(520px 260px at 30% 20%, rgba(245,179,1,0.16), transparent 60%)",
                                    }}
                                />

                                {/* cover */}
                                <div className="relative h-44 w-full overflow-hidden">
                                    {post.coverSrc ? (
                                        <Image
                                            src={post.coverSrc}
                                            alt=""
                                            fill
                                            className="object-cover transition duration-500 group-hover:scale-[1.04]"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                            priority={false}
                                        />
                                    ) : (
                                        <div
                                            className="absolute inset-0 bg-linear-to-br from-teal-900/40 via-white/5 to-black"/>
                                    )}

                                    {/* top overlay for readability */}
                                    <div
                                        className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent"/>

                                    {/* Date badge (section for the date) */}
                                    <div className="absolute left-4 top-4">
                                        <div
                                            className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur">
                                            <span className="inline-block h-1.5 w-1.5 rounded-full bg-[#f5b301]"/>
                                            {formatDate(post.date)}
                                        </div>
                                    </div>

                                    {/* Tag (optional) */}
                                    {post.tag ? (
                                        <div className="absolute right-4 top-4">
                                            <div
                                                className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur">
                                                {post.tag}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                {/* content */}
                                <div className="relative p-5">
                                    <h3 className="text-lg font-extrabold text-white leading-snug line-clamp-2">
                                        {post.title}
                                    </h3>

                                    {/* Date row (secondary date area) */}
                                    {/*<div className="mt-2 flex items-center gap-2 text-xs font-semibold text-white/60">*/}
                                    {/*    /!*<span className="inline-block h-1 w-1 rounded-full bg-white/25" />*!/*/}
                                    {/*    /!*<span>{formatDate(post.date)}</span>*!/*/}
                                    {/*    {post.author ? (*/}
                                    {/*        <>*/}
                                    {/*            <span className="inline-block h-1 w-1 rounded-full bg-white/25" />*/}
                                    {/*            <span>{post.author}</span>*/}
                                    {/*        </>*/}
                                    {/*    ) : null}*/}
                                    {/*</div>*/}

                                    <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    {/* footer */}
                                    <div className="mt-5 flex items-center justify-between">
                                        {/*<span className="text-xs font-semibold tracking-wide text-white/60">*/}
                                        {/*  Read article*/}
                                        {/*</span>*/}
                                        <span
                                            className="inline-flex items-center gap-2 text-sm font-extrabold text-white">
                        Read article
                        <svg
                            viewBox="0 0 24 24"
                            className="h-4 w-4 opacity-90 transition group-hover:translate-x-0.5"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                        >
                          <path d="M5 12h14"/>
                          <path d="M13 6l6 6-6 6"/>
                        </svg>
                      </span>
                                    </div>
                                </div>
                            </article>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}