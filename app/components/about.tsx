import {COLORS} from "@/app/theme";

export function getYearsSince(dateInput: string | Date): number {
    const date = new Date(dateInput);
    const now = new Date();

    let years = now.getFullYear() - date.getFullYear();

    // adjust if the month/day hasn't been reached yet this year
    const hasNotHadAnniversaryThisYear =
        now.getMonth() < date.getMonth() ||
        (now.getMonth() === date.getMonth() && now.getDate() < date.getDate());

    if (hasNotHadAnniversaryThisYear) {
        years--;
    }

    return years;
}


export function AboutSection() {
    return (
        <section
            id="about"
            data-reveal
            className="px-4 py-16 sm:px-8 lg:px-16"
            style={{
                backgroundImage: `radial-gradient(circle at left, ${COLORS.accent} 0, #000 55%)`,
            }}
        >
            <div className="mx-auto flex max-w-5xl flex-col gap-8">
                <div className="max-w-xl">
                    <h2 className="text-sm uppercase tracking-[0.28em] text-zinc-400">
                        &lt; ABOUT &gt;
                    </h2>
                    <p className="mt-4 text-xl font-semibold text-zinc-50">
                        &quot;F.A.T.E. (Fight Against The Enemy) is more than a music project&quot;
                    </p>
                </div>
                <div className="space-y-4 text-sm leading-relaxed text-zinc-300 sm:text-base">
                    <p>
                        It’s the culmination of a lifelong obsession with heavy, emotionally driven rock. For
                        over {getYearsSince("2001-12-02")} years, I’ve been writing music, shaping melodies, and
                        building stories through sound. Music has always been the place where my thoughts get
                        loud, my emotions make sense, and the battles I’ve faced find a voice.
                    </p>
                    <p>
                        But it’s not just about the struggles. It’s about the strength that comes from them.
                        Through every song, I aim to inspire, to give listeners something real to hold onto; whether
                        they’re fighting their own battles or chasing something bigger in their lives. If my music
                        can make someone feel understood, motivated, or unshakably alive for even a moment, then
                        I’ve done what I set out to do.
                    </p>
                    <p>
                        What started as riffs and notebook lyrics back in my teens has evolved into something bigger
                        than I ever imagined. Thanks to modern production tools and the power of AI-assisted creation,
                        I can finally bring these songs to life the way they always sounded in my head; massive,
                        detailed, cinematic, and unapologetically honest. AI doesn’t replace the heart behind the
                        music; it amplifies it. It lets me take ideas I’ve carried for decades and turn them into
                        fully produced tracks with the intensity, clarity, and depth they deserve.
                    </p>
                    <p>
                        F.A.T.E. blends influences from the bands that shaped me and pushes them into a modern,
                        expressive direction. Every song is built on real experience, real emotion, and a relentless
                        drive to create something meaningful.
                    </p>
                    <p>
                        This isn’t just a hobby. This is my story finally being told the way I always wanted:
                        loud, raw, real; and meant to lift others up along the way.
                    </p>
                    <p>
                        Welcome to F.A.T.E.
                        The fight starts here.
                    </p>
                </div>
            </div>
        </section>
    );
}