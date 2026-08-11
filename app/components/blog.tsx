import Image, { type StaticImageData } from "next/image";
import Link from "next/link";

export type BlogPost = {
    title: string;
    excerpt: string;
    href: string;
    date: string;
    coverSrc?: StaticImageData;
    tag?: string;
    author?: string;
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
        return new Date(y, m - 1, d);
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
    eyebrow = "Press",
    title = "What listeners are saying",
    subtitle = "Early coverage, reviews, and writeups for the songs as the catalog grows.",
}: Props) {
    const sorted = [...(posts ?? [])].sort(
        (a, b) => toDateSafe(b.date).getTime() - toDateSafe(a.date).getTime()
    );

    if (!sorted.length) return null;

    return (
        <section
            id={id}
            data-reveal
            className="relative scroll-mt-24"
            style={{
                backgroundImage:
                    "radial-gradient(circle at bottom, color-mix(in srgb, var(--artist-accent-bright) 14%, transparent) 0, transparent 34%), radial-gradient(circle at top, var(--artist-accent) 0, #000 58%)",
            }}
        >
            <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
                <div className="max-w-2xl">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        {eyebrow}
                    </h2>
                    <p className="mt-3 text-2xl font-black uppercase tracking-wide text-white sm:text-3xl">
                        {title}
                    </p>
                    <p className="mt-4 text-sm leading-relaxed text-white/70 sm:text-base">
                        {subtitle}
                    </p>
                </div>

                <div className="mt-8 grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {sorted.map((post) => (
                        <Link
                            key={post.href}
                            href={post.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group outline-none"
                            aria-label={`Read: ${post.title}`}
                        >
                            <article className="relative h-full overflow-hidden rounded-lg bg-white/5 ring-1 ring-white/10 transition duration-300 hover:bg-white/[0.07] hover:ring-white/20">
                                <div
                                    aria-hidden="true"
                                    className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100"
                                    style={{
                                        background:
                                            "radial-gradient(520px 260px at 30% 20%, rgba(245,179,1,0.16), transparent 60%)",
                                    }}
                                />

                                <div className="relative h-44 w-full overflow-hidden">
                                    {post.coverSrc ? (
                                        <Image
                                            src={post.coverSrc}
                                            alt={`${post.title} article artwork`}
                                            fill
                                            className="object-cover transition duration-500 group-hover:scale-[1.04]"
                                            sizes="(max-width: 1024px) 100vw, 33vw"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 bg-linear-to-br from-sky-900/40 via-white/5 to-black" />
                                    )}

                                    <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/15 to-transparent" />

                                    <div className="absolute left-4 top-4">
                                        <div className="inline-flex items-center gap-2 rounded-full bg-black/60 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur">
                                            <span
                                                className="inline-block h-1.5 w-1.5 rounded-full"
                                                style={{ backgroundColor: "var(--artist-accent-bright)" }}
                                            />
                                            {formatDate(post.date)}
                                        </div>
                                    </div>

                                    {post.tag ? (
                                        <div className="absolute right-4 top-4">
                                            <div className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-white ring-1 ring-white/15 backdrop-blur">
                                                {post.tag}
                                            </div>
                                        </div>
                                    ) : null}
                                </div>

                                <div className="relative p-5">
                                    <h3 className="text-lg font-extrabold leading-snug text-white line-clamp-2">
                                        {post.title}
                                    </h3>

                                    <p className="mt-3 text-sm leading-relaxed text-white/70 line-clamp-3">
                                        {post.excerpt}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="inline-flex items-center gap-2 text-sm font-extrabold text-white">
                                            Read article
                                            <span className="transition group-hover:translate-x-0.5">-&gt;</span>
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
