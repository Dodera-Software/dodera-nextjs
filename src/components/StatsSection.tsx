"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce, stagger } from "@/lib/animations";
import { STATS } from "@/config/stats";

export function StatsSection() {
    return (
        <section aria-labelledby="stats-heading" className="border-b border-border/50 py-20">
            <div className="mx-auto max-w-7xl px-6">
                <motion.p
                    variants={fadeInUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    className="mb-12 text-center text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    id="stats-heading"
                >
                    By the numbers
                </motion.p>

                <div className="grid grid-cols-2 gap-y-12 md:grid-cols-5 md:gap-y-0">
                    {STATS.map((stat, i) => (
                        <motion.div
                            key={stat.label}
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={stagger(i, 0.12)}
                            className="flex flex-col items-center gap-1 px-4 text-center md:border-r md:border-border/50 md:last:border-r-0"
                        >
                            <span className="text-5xl font-extrabold tracking-tight text-primary sm:text-6xl">
                                {stat.value}
                            </span>
                            <span className="mt-1 text-sm font-semibold text-foreground">
                                {stat.label}
                            </span>
                            <span className="text-xs text-muted-foreground">
                                {stat.description}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
