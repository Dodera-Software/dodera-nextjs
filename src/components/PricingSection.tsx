"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { PRICING_TIERS } from "@/config/pricing";
import { fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

export function PricingSection() {
    return (
        <section
            id="pricing"
            aria-labelledby="pricing-heading"
            className="relative overflow-hidden bg-card/30 py-32"
        >
            {/* Soft red glow */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[900px] bg-primary/10 blur-3xl" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <SectionHeading label="Pricing" id="pricing-heading">
                    Pick the model that{" "}
                    <span className="text-primary">fits you.</span>
                </SectionHeading>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-4">
                    {PRICING_TIERS.map((tier, i) => {
                        const Icon = tier.icon;
                        return (
                            <motion.div
                                key={tier.name}
                                variants={fadeInUpLg}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={stagger(i, 0.12)}
                            >
                                <div className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-[box-shadow,border-color,transform] hover:border-primary/25 hover:shadow-md hover:scale-[1.03]">
                                    {/* Icon */}
                                    <div className="mb-5 flex size-11 items-center justify-center rounded-lg border border-border bg-primary/10">
                                        <Icon className="size-5 text-primary" />
                                    </div>

                                    {/* Name + tagline */}
                                    <h3 className="mb-1 text-lg font-bold tracking-tight text-foreground">
                                        {tier.name}
                                    </h3>
                                    <p className="mb-3 text-sm font-medium text-primary">
                                        {tier.tagline}
                                    </p>

                                    {/* Description */}
                                    <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                                        {tier.description}
                                    </p>

                                    {/* Includes */}
                                    <ul className="mb-5 flex flex-1 flex-col gap-2.5">
                                        {tier.includes.map((item) => (
                                            <li key={item} className="flex items-start gap-2 text-sm">
                                                <span className="mt-0.5 text-primary" aria-hidden>✓</span>
                                                <span className="text-foreground/75">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Note */}
                                    {tier.note && (
                                        <p className="mb-4 text-xs text-muted-foreground/70">
                                            {tier.note.replace("for free.", "").trim()}{" "}
                                            <span className="font-semibold text-foreground/60">for free.</span>
                                        </p>
                                    )}

                                    {/* Rate */}
                                    <div className="mt-auto flex items-baseline gap-1 border-t border-border/60 pt-4">
                                        <span className="text-base font-bold tracking-tight text-foreground">
                                            {tier.rate}
                                        </span>
                                        <span className="text-xs text-muted-foreground">
                                            {tier.rateSub}
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Single CTA */}
                <motion.div
                    variants={fadeInUpLg}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ delay: 0.5 }}
                    className="mt-10 flex flex-col items-center gap-6"
                >
                    <Link href="/#contact">
                        <Button
                            size="lg"
                            className="gap-2 bg-primary px-10 text-primary-foreground hover:bg-primary/90"
                        >
                            Get Started
                            <ArrowRight className="size-4" />
                        </Button>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                        Not sure which model fits?{" "}
                        <Link
                            href="/#contact"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Tell us about your project
                        </Link>{" "}
                        and we&apos;ll suggest the right approach.
                    </p>
                </motion.div>
            </div>
        </section>
    );
}
