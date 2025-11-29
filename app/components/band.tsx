import {COLORS} from "@/app/theme";

export function BandSection() {
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
