"use client";

import { motion } from "framer-motion";
import { ContactForm } from "@/components/ContactForm";
import { fadeInUpLg, viewportOnce } from "@/lib/animations";

export function CTASection() {
    return (
        <section id="contact" aria-labelledby="contact-heading" className="relative py-32">
            <div className="absolute inset-0 grid-bg" />

            <div className="relative z-10 mx-auto max-w-5xl px-6">
                <motion.div
                    variants={fadeInUpLg}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mb-12 text-center"
                >
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Ready to Build?
                    </p>
                    <h2 id="contact-heading" className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
                        Stop searching for talent.
                        <br />
                        <span className="text-primary">Start shipping code.</span>
                    </h2>
                    <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                        Book a{" "}<strong className="font-semibold text-primary">free</strong>{" "}30-minute architecture call. We&apos;ll audit your project and tell you exactly what it takes to ship.
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
