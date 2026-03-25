"use client";

import { motion } from "framer-motion";
import { SectionHeading } from "@/components/SectionHeading";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

const DISCIPLINES = [
    { emoji: "⚙️", label: "Backend Engineering" },
    { emoji: "🖥️", label: "Frontend Development" },
    { emoji: "🎨", label: "UI / UX Design" },
    { emoji: "🧪", label: "QA & Testing" },
    { emoji: "🤖", label: "AI & Automation" },
    { emoji: "☁️", label: "Cloud & DevOps" },
];

export function TeamSection() {
    return (
        <section aria-labelledby="team-heading" className="relative py-24">
            <div className="mx-auto max-w-4xl px-6 text-center">
                <SectionHeading label="The Team" id="team-heading">
                    Built by people who <span className="text-primary">care deeply</span>
                </SectionHeading>

                <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="-mt-8 mb-14 text-base leading-relaxed text-muted-foreground"
                >
                    We started in <span className="font-semibold text-foreground">2023</span> as a team of dedicated, enthusiastic software engineers - and that energy never left. Today our{" "}
                    <span className="font-semibold text-foreground">35+ member</span> workflow team covers every layer of a product, including in-house engineers, designers, QA specialists, and the external collaborators we rely on to deliver. Most members carry{" "}
                    <span className="font-semibold text-foreground">7–10+ years</span> of hands-on industry experience.
                </motion.p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                    {DISCIPLINES.map((d, i) => (
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
