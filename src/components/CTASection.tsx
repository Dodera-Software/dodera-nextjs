"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/ContactForm";
import { fadeInUpLg, viewportOnce } from "@/lib/animations";
import { CTA } from "@/config/copy";

export function CTASection() {
    return (
        <section id="contact" aria-labelledby="contact-heading" className="relative py-32">
            <div className="absolute inset-0 grid-bg-sm" />

            <div className="relative z-10 mx-auto max-w-5xl px-6">
                <motion.div
                    variants={fadeInUpLg}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mb-12 text-center"
                >
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {CTA.eyebrow}
                    </p>
                    <h2 id="contact-heading" className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        {CTA.headline}
                        <br />
                        <span className="text-primary">{CTA.headlineHighlight}</span>
                    </h2>
                    <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                        {CTA.descriptionPre}{" "}<strong className="font-semibold text-primary">free</strong>{" "}{CTA.descriptionPost}
                    </p>
                </motion.div>

                <motion.div
                    variants={fadeInUpLg}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ delay: 0.1 }}
                >
                    <ContactForm />
                </motion.div>
            </div>
        </section>
    );
}
