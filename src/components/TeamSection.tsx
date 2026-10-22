"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

export function TeamSection() {
    const t = useDict().team;
    const locale = useLocale();
    return (
        <section aria-labelledby="team-heading" className="relative py-24">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <SectionHeading label={t.label} id="team-heading">
                    {t.titleA} <span className="text-primary">{t.titleB}</span>
                </SectionHeading>

                <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="-mt-8 mb-14 text-base leading-relaxed text-muted-foreground"
                >
                    {/* TODO(owner): "35+ member" and "7–10+ years" are not backed by data yet
                        (see the SEO report). Kept in English until confirmed; the Romanian
                        text states only what is known. */}
                    {locale === "en" ? (
                        <>
                            We started in <span className="font-semibold text-foreground">2023</span> as a team of dedicated, enthusiastic software engineers — and that energy never left. Today our{" "}
                            <span className="font-semibold text-foreground">35+ member</span> workflow team covers every layer of a product, including in-house engineers, designers, QA specialists, and the external collaborators we rely on to deliver. Most members carry{" "}
                            <span className="font-semibold text-foreground">7–10+ years</span> of hands-on industry experience.
                        </>
                    ) : (
                        <>
                            Am pornit în <span className="font-semibold text-foreground">2023</span>, la Satu Mare, ca o echipă de ingineri software pasionați, iar energia aceea a rămas. Acoperim fiecare strat al unui produs: backend, frontend, design, testare, AI și infrastructură. Acolo unde proiectul o cere, lucrăm cu colaboratori externi de încredere, iar coordonarea rămâne la noi.
                        </>
                    )}
                </motion.p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {t.disciplines.map((d, i) => (
                        <motion.div
                            key={d.label}
                            variants={fadeInUpLg}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={stagger(i)}
                            className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-5 py-4 text-sm font-medium text-foreground/80"
                        >
                            <span className="text-xl">{d.emoji}</span>
                            {d.label}
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
