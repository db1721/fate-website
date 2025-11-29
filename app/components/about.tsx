import {COLORS} from "@/app/theme";
import bandInfo from "@/app/config/fate-info";

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