"use client";

import { motion } from "framer-motion";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

export function NotableClients() {
    const t = useDict().industries;
    const locale = useLocale();
    return (
        <section aria-labelledby="clients-heading" className="relative border-b border-border/50 py-20">
            <div className="absolute inset-0 grid-bg" />
            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mb-4 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    id="clients-heading"
                >
                    {t.label}
                </motion.p>

                <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ duration: 0.4, delay: 0.1 }}
                    className="mb-12 text-center text-sm text-muted-foreground"
                >
                    {locale === "en" ? (
                        <>
                            Backed by a{" "}
                            <span className="font-semibold text-foreground">dedicated team</span> of engineers, long-term collaborators and trusted specialists, all pulling in the same direction.
                        </>
                    ) : (
                        <>
                            În spatele fiecărui proiect stă o{" "}
                            <span className="font-semibold text-foreground">echipă dedicată</span> de ingineri, colaboratori pe termen lung și specialiști de încredere.
                        </>
                    )}
                </motion.p>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                    {t.items.map((client, i) => (
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
