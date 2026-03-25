"use client";

import { motion } from "framer-motion";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

const CLIENT_INDUSTRIES = [
    { emoji: "🏥", sector: "Healthcare" },
    { emoji: "⚖️", sector: "Legal Services" },
    { emoji: "🚁", sector: "Drone & Aerospace" },
    { emoji: "💪", sector: "Fitness & Wellness" },
    { emoji: "🏢", sector: "Software Companies" },
];

export function NotableClients() {
    return (
        <section aria-labelledby="clients-heading" className="border-b border-border/50 py-20">
            <div className="mx-auto max-w-7xl px-6">
                <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    id="clients-heading"
                >
                    Industries served
                </motion.p>

                <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-12 text-center text-sm text-muted-foreground"
                >
                    Backed by a{" "}
                    <span className="font-semibold text-foreground">35+ member workflow team</span> - full-time engineers, long-term collaborators, and trusted specialists, all pulling in the same direction.
                </motion.p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {CLIENT_INDUSTRIES.map((client, i) => (
                        <motion.div
                            key={client.sector}
                            variants={fadeInUpLg}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={stagger(i, 0.1)}
                            className="flex flex-col items-center gap-2 rounded-xl border border-border/60 bg-card/60 px-4 py-5 text-center"
                        >
                            <span className="text-2xl">{client.emoji}</span>
                            <span className="text-sm font-semibold text-foreground/90">{client.sector}</span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
