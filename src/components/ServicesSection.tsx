"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/SectionHeading";
import { SERVICES } from "@/config/site";
import { fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

export function ServicesSection() {
    return (
        <section id="services" aria-labelledby="services-heading" className="relative py-32">
            <div className="absolute inset-0 grid-bg-sm" />

            <div className="relative z-10 mx-auto max-w-7xl px-6">
                <SectionHeading label="What We Build" id="services-heading">
                    Engineering that <span className="text-primary">ships</span>
                </SectionHeading>

                <p className="mx-auto mb-16 -mt-8 max-w-2xl text-center text-base leading-relaxed text-muted-foreground">
                    If it&apos;s digital, we can build it. We bring the right expertise to every project, and when a challenge falls outside our stack, we take ownership of finding and managing the right people to deliver it.
                </p>

                {/* Featured service — Software Development */}
                {(() => {
                    const featured = SERVICES[0];
                    return (
                        <Link href={featured.href} className="mb-6 block">
                            <motion.div
                                variants={fadeInUpLg}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={stagger(0)}
                                className="group relative overflow-hidden rounded-xl border border-primary/40 bg-card shadow-sm transition-[box-shadow,border-color] hover:border-primary/70 hover:shadow-lg cursor-pointer"
                            >
                                {/* Subtle primary glow */}
                                <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent" />

                                <div className="relative grid md:grid-cols-[2fr_3fr]">
                                    {/* Image */}
                                    {featured.image && (
                                        <div className="relative h-56 overflow-hidden md:h-full md:min-h-[280px]">
                                            <Image
                                                src={featured.image}
                                                alt={featured.title}
                                                fill
                                                className="object-cover transform-gpu transition-transform duration-500 group-hover:scale-105"
                                                sizes="(max-width: 768px) 100vw, 40vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-card/80 hidden md:block" />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent md:hidden" />
                                        </div>
                                    )}

                                    {/* Content */}
                                    <div className="flex flex-col justify-center p-8 md:p-10">
                                        <div className="mb-4 flex items-center gap-3">
                                            <Badge className="border-primary/40 bg-primary/10 text-[11px] font-semibold uppercase tracking-wider text-primary">
                                                Core Service
                                            </Badge>
                                        </div>
                                        <h3 className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                                            {featured.title}
                                        </h3>
                                        <p className="mb-3 text-sm font-medium text-primary">{featured.subtitle}</p>
                                        <p className="mb-6 max-w-xl text-sm leading-relaxed text-muted-foreground">
                                            {featured.description}
                                        </p>
                                        <div className="mb-6 flex flex-wrap gap-2">
                                            {featured.tags.map((tag) => (
                                                <Badge
                                                    key={tag}
                                                    variant="outline"
                                                    className="border-border bg-muted/50 text-[11px] text-muted-foreground"
                                                >
                                                    {tag}
                                                </Badge>
                                            ))}
                                        </div>
                                        <ul className="mb-6 flex flex-col gap-1.5">
                                            {featured.highlights.map((h) => (
                                                <li key={h.label} className="flex items-center gap-2 text-sm text-foreground/70">
                                                    <span className="text-primary" aria-hidden>›</span>
                                                    {h.label}
                                                </li>
                                            ))}
                                        </ul>
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                                            Learn More
                                            <ArrowRight className="size-4" />
                                        </span>
                                    </div>
                                </div>
                            </motion.div>
                        </Link>
                    );
                })()}

                {/* Remaining services */}
                <div className="grid gap-6 md:grid-cols-3">
                    {SERVICES.slice(1).map((s, i) => (
                        <Link key={s.title} href={s.href}>
                            <motion.div
                                variants={fadeInUpLg}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={stagger(i + 1)}
                                className="group flex flex-col rounded-xl border border-border bg-card overflow-hidden shadow-sm transition-[box-shadow,border-color] hover:shadow-md hover:border-primary/20 cursor-pointer h-full"
                            >
                                {s.image ? (
                                    <div className="relative h-44 w-full overflow-hidden">
                                        <Image
                                            src={s.image}
                                            alt={s.title}
                                            fill
                                            className="object-cover transform-gpu transition-transform duration-500 group-hover:scale-105"
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                    </div>
                                ) : (
                                    <div className="px-8 pt-8">
                                        <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-border bg-primary/10">
                                            <s.icon className="size-6 text-primary" />
                                        </div>
                                    </div>
                                )}
                                <div className="flex flex-1 flex-col p-8 pt-6">
                                    <h3 className="mb-1 text-xl font-bold">{s.title}</h3>
                                    <p className="mb-4 text-sm text-muted-foreground">{s.subtitle}</p>
                                    <p className="mb-6 min-h-[5rem] text-sm leading-relaxed text-muted-foreground">
                                        {s.description}
                                    </p>
                                    <div className="mb-6 flex flex-wrap gap-2">
                                        {s.tags.map((tag) => (
                                            <Badge
                                                key={tag}
                                                variant="outline"
                                                className="border-border bg-muted/50 text-[11px] text-muted-foreground"
                                            >
                                                {tag}
                                            </Badge>
                                        ))}
                                    </div>
                                    <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-primary transition-colors group-hover:text-primary/80">
                                        Learn More
                                        <ArrowRight className="size-4" />
                                    </span>
                                </div>
                            </motion.div>
                        </Link>
                    ))}
                </div>

                {/* CTA Button */}
                <motion.div
                    variants={fadeInUpLg}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className="mt-12 flex justify-center"
                >
                    <Button size="lg" asChild>
                        <Link href="/#contact">
                            Let's Discuss
                            <ArrowRight className="ml-1 size-4" />
                        </Link>
                    </Button>
                </motion.div>
            </div>
        </section>
    );
}
