"use client";

import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { CASE_STUDIES } from "@/config/case-studies";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

export function CaseStudiesSection() {
    return (
        <section
            id="case-studies"
            aria-labelledby="case-studies-heading"
            className="relative py-32"
        >
            <div className="absolute inset-0 grid-bg" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <SectionHeading label="Case Studies" id="case-studies-heading">
                    Real problems.{" "}
                    <span className="text-primary">Measurable results.</span>
                </SectionHeading>

                <div className="flex flex-col gap-8">
                    {CASE_STUDIES.map((cs, i) => {
                        const isEven = i % 2 === 0;
                        return (
                            <motion.article
                                key={cs.headline}
                                variants={fadeInUpLg}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={stagger(i, 0.15)}
                                aria-label={cs.headline}
                                className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[box-shadow,border-color] hover:border-primary/20 hover:shadow-md"
                            >
                                {/* Subtle accent line on the left */}
                                <div className="absolute left-0 top-0 h-full w-[3px] bg-gradient-to-b from-primary/60 via-primary/30 to-transparent" />

                                <div
                                    className={`grid gap-0 md:grid-cols-2 ${isEven ? "" : "md:[&>*:first-child]:order-2"}`}
                                >
                                    {/* LEFT / PROBLEM SIDE */}
                                    <div className="flex flex-col justify-between border-b border-border/60 p-8 md:border-b-0 md:border-r md:p-10">
                                        <div>
                                            <motion.div
                                                variants={fadeInUp}
                                                initial="hidden"
                                                whileInView="visible"
                                                viewport={viewportOnce}
                                                transition={{ delay: i * 0.15 + 0.1 }}
                                                className="mb-4 flex flex-wrap items-center gap-2"
                                            >
                                                <Badge
                                                    variant="outline"
                                                    className="border-primary/30 bg-primary/5 text-[11px] font-semibold uppercase tracking-wider text-primary"
                                                >
                                                    {cs.industry}
                                                </Badge>
                                                <span className="text-xs text-muted-foreground">
                                                    {cs.client}
                                                </span>
                                            </motion.div>

                                            <h3 className="mb-5 text-xl font-bold leading-snug tracking-tight text-foreground sm:text-2xl">
                                                {cs.headline}
                                            </h3>

                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="h-px flex-1 bg-border/70" />
                                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                                                    The Problem
                                                </span>
                                                <span className="h-px flex-1 bg-border/70" />
                                            </div>
                                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                {cs.problem}
                                            </p>
                                        </div>

                                        {/* Tech tags */}
                                        <div className="mt-8 flex flex-wrap gap-2">
                                            {cs.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="border-border bg-muted/50 text-[11px] text-muted-foreground"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                    </div>

                                    {/* RIGHT / SOLUTION SIDE */}
                                    <div className="flex flex-col justify-between p-8 md:p-10">
                                        <div>
                                            <div className="mb-2 flex items-center gap-2">
                                                <span className="h-px flex-1 bg-border/70" />
                                                <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                                                    How We Fixed It
                                                </span>
                                                <span className="h-px flex-1 bg-border/70" />
                                            </div>
                                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                                                {cs.solution}
                                            </p>
                                        </div>

                                        {/* Metric callout */}
                                        <div className="mt-8 flex items-end gap-4 rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
                                            <span
                                                className="font-extrabold leading-none tracking-tight text-primary"
                                                style={{ fontSize: "clamp(2.5rem, 5vw, 3.5rem)" }}
                                                aria-label={`${cs.metric} ${cs.metricLabel}`}
                                            >
                                                {cs.metric}
                                            </span>
                                            <span className="mb-1 text-sm font-medium leading-snug text-foreground/80">
                                                {cs.metricLabel}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </motion.article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
