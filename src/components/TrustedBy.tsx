"use client";

import { motion } from "framer-motion";
import { TRUSTED_LOGOS } from "@/config/site";
import { SocialIconList } from "@/components/SocialIconList";
import { fadeIn, viewportOnce } from "@/lib/animations";

export function TrustedBy() {
    return (
        <section aria-label="Trusted by" className="relative border-y border-border/50 py-16">
            <div className="mx-auto max-w-7xl px-6">
                <p className="mb-10 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                    Using globally trusted technologies like
                </p>

                {/* Social icons — desktop, absolute right */}
                <div className="absolute right-6 top-1/2 hidden -translate-y-1/2 flex-col items-end gap-2 lg:flex">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                        Find us on:
                    </p>
                    <SocialIconList />
                </div>

                <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
                    {TRUSTED_LOGOS.map((name, i) => (
                        <motion.span
                            key={name}
                            variants={fadeIn}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={{ delay: i * 0.08, duration: 0.4 }}
                            className="select-none text-lg font-bold tracking-tight text-muted-foreground/40 transition-colors hover:text-muted-foreground/70"
                        >
                            {name}
                        </motion.span>
                    ))}
                </div>

                {/* Social icons — mobile/tablet */}
                <div className="mt-10 flex flex-col items-center gap-3 lg:hidden">
                    <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground/50">
                        Find us on:
                    </p>
                    <SocialIconList />
                </div>
            </div>
        </section>
    );
}
