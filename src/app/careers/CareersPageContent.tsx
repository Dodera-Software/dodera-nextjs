"use client";

import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

const WHY_ITEMS = [
    {
        title: "Real ownership",
        body: "Every engineer owns their work end-to-end. You design, build, and ship features that reach real users.",
    },
    {
        title: "Fully remote",
        body: "Working from everywhere you are most productive. We are built for distributed collaboration across time zones.",
    },
    {
        title: "High-impact projects",
        body: "Our clients range from seed-stage startups to established companies. You will work on meaningful problems with tangible results.",
    },
    {
        title: "Modern tech stack",
        body: "Next.js, TypeScript, Laravel, AI tooling. We use the best tools for the job and stay current with the ecosystem.",
    },
    {
        title: "Transparent culture",
        body: "Honest feedback, clear expectations and a proactive mindset. We communicate openly and resolve issues before they become problems.",
    },
    {
        title: "Competitive rates",
        body: "We value great work and pay accordingly, with engagement models flexible enough to suit contractors and full-time team members alike.",
    },
] as const;

export function CareersPageContent() {
    return (
        <>
            {/* Hero */}
            <section aria-labelledby="careers-hero-heading" className="relative pb-10 pt-32">
                <div className="absolute inset-0 grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4 }}
                        className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                        Careers
                    </motion.p>
                    <motion.h1
                        id="careers-hero-heading"
                        variants={fadeInUpLg}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.08 }}
                        className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        Be part of{" "}
                        <span className="text-primary">Dodera Software</span>{" "}
                        team.
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.16 }}
                        className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        We are a small, focused team of engineers and designers who care deeply about
                        craft and ownership. We move fast, communicate openly, and build things that
                        matter for clients around the world. If you are passionate about tech, you already belong here.
                    </motion.p>
                </div>
            </section>

            {/* No positions available */}
            <section aria-labelledby="open-roles-heading" className="relative py-12">
                <div className="absolute inset-0 grid-bg-sm" />
                <div className="relative z-10 mx-auto max-w-2xl px-6 text-center">
                    <motion.div
                        variants={fadeInUpLg}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="flex flex-col items-center gap-6"
                    >
                        <div className="flex size-16 items-center justify-center rounded-2xl border border-border bg-card">
                            <Inbox className="size-7 text-muted-foreground" />
                        </div>
                        <div>
                            <h2
                                id="open-roles-heading"
                                className="mb-3 text-2xl font-bold tracking-tight sm:text-3xl"
                            >
                                No open positions right now
                            </h2>
                            <p className="text-base leading-relaxed text-muted-foreground">
                                We don't have any positions open at the moment. If you have
                                a standout skill and think you belong on this team, send us a message.
                                We'd love to meet you.
                            </p>
                        </div>
                        <Button size="lg" asChild>
                            <Link href="mailto:office@doderasoft.com">
                                Contact Us
                                <ArrowRight className="ml-1 size-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>

            {/* Why Dodera */}
            <section aria-labelledby="why-heading" className="relative py-20 bg-card/30 overflow-hidden">
                {/* Red glow */}
                <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-primary/10 blur-3xl" />
                <div className="relative mx-auto max-w-4xl px-6">
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        className="mb-12 text-center"
                    >
                        <h2 id="why-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">
                            Why join Dodera?
                        </h2>
                    </motion.div>

                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {WHY_ITEMS.map((item, i) => (
                            <motion.div
                                key={item.title}
                                variants={fadeInUpLg}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={stagger(i)}
                                className="rounded-xl border border-border bg-card p-6"
                            >
                                <h3 className="mb-2 text-base font-semibold">{item.title}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{item.body}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </>
    );
}
