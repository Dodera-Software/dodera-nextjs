"use client";

import { useRef, useEffect } from "react";
import {
    motion,
    useMotionValue,
    useSpring,
    useTransform,
    useInView,
} from "framer-motion";
import Link from "next/link";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { ENGAGEMENT_MODELS } from "@/config/site";
import { CAPABILITIES, FAQ } from "./data";
import { CapabilityCard } from "./CapabilityCard";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

// ── Animated Counter ──────────────────────────────────────────────────────────

/** Counts from `from` to `to` once `trigger` becomes true. */
function AnimatedCounter({
    to,
    from = 0,
    suffix = "",
    trigger,
}: {
    to: number;
    from?: number;
    suffix?: string;
    trigger: boolean;
}) {
    const motionValue = useMotionValue(from);
    const spring = useSpring(motionValue, { stiffness: 50, damping: 16, restDelta: 0.4 });
    const display = useTransform(spring, (v) => `${Math.round(v)}${suffix}`);

    useEffect(() => {
        if (trigger) motionValue.set(to);
    }, [trigger, motionValue, to]);

    return <motion.span className="tabular-nums">{display}</motion.span>;
}

// ── Stats Row ───────────────────────────────────────────────────────────

const STATS = [
    { label: "Specialists", to: 4, from: 0, suffix: "+" },
    { label: "Projects", to: 20, from: 0, suffix: "+" },
    { label: "Client Satisfaction", to: 99, from: 0, suffix: "%" },
] as const;

function StatsRow() {
    const ref = useRef<HTMLDivElement>(null);
    const trigger = useInView(ref, { once: true, margin: "-80px" });
    return (
        <motion.div
            ref={ref}
            variants={fadeInUpLg}
            initial="hidden"
            animate="visible"
            transition={{ duration: 0.4, delay: 0.24 }}
        >
            <dl className="mx-auto flex max-w-2xl items-start justify-center divide-x divide-border">
                {STATS.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center px-14 py-4">
                        <dd className="text-4xl font-bold text-primary sm:text-5xl">
                            <AnimatedCounter
                                to={stat.to}
                                from={stat.from}
                                suffix={stat.suffix}
                                trigger={trigger}
                            />
                        </dd>
                        <dt className="mt-2 text-sm text-muted-foreground">
                            {stat.label}
                        </dt>
                    </div>
                ))}
            </dl>
        </motion.div>
    );
}

// ── Component ─────────────────────────────────────────────────────────────────

export function AboutPageContent() {
    return (
        <>
            {/* ── Breadcrumb ──────────────────────────────────────────────── */}
            <Breadcrumb items={[{ label: "Home", href: "/" }, { label: "About Us" }]} />

            {/* ── Hero ────────────────────────────────────────────────────── */}
            <section aria-labelledby="about-hero-heading" className="relative pb-24 pt-8">
                <div className="absolute inset-0 grid-bg" />

                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4 }}
                        className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                        About Dodera Software
                    </motion.p>

                    <motion.h1
                        id="about-hero-heading"
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.08 }}
                        className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        The engineering team{" "}
                        <span className="text-primary">behind your&nbsp;product.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.16 }}
                        className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        Dodera Software is a software engineering company founded in 2023. We build
                        web applications, presentation websites, AI systems and workflow automations
                        for companies of all sizes. We work per hour, per task, or per project, so
                        you always get the engagement model that fits best for your needs.
                    </motion.p>

                    {/* Animated stat counters */}
                    <StatsRow />
                </div>
            </section>

            {/* ── Our Story ──────────────────────────────────────────────── */}
            <section
                aria-labelledby="our-story-heading"
                className="relative py-24"
            >
                <div className="absolute inset-0 grid-bg-sm" />

                <div className="relative z-10 mx-auto max-w-7xl px-6">
                    <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-20">
                        {/* Text */}
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={{ duration: 0.5 }}
                        >
                            <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                Who We Are
                            </p>
                            <h2
                                id="our-story-heading"
                                className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
                            >
                                A team of builders who{" "}
                                <span className="text-primary">care about craft.</span>
                            </h2>
                            <div className="space-y-4 text-base leading-relaxed text-muted-foreground">
                                <p>
                                    Dodera Software was founded by engineers who were tired of watching
                                    great ideas fail because of poor technical execution. We built the
                                    company around a simple belief: software should be reliable, clear,
                                    and genuinely useful.
                                </p>
                                <p>
                                    Our team spans frontend, backend, AI and infrastructure
                                    disciplines. Every engineer on our roster is senior level, no
                                    juniors learning on your budget. We take ownership from the
                                    first line of architecture to the last deploy.
                                </p>
                                <p>
                                    Whether you need a long-term engineering partner or a specialist
                                    team to ship a single critical feature, we adapt our engagement to
                                    match your pace and goals.
                                </p>
                            </div>
                        </motion.div>

                        {/* Value pillars */}
                        <motion.ul
                            variants={fadeInUpLg}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={{ duration: 0.5, delay: 0.1 }}
                            className="space-y-5"
                            aria-label="Our values"
                        >
                            {[
                                {
                                    title: "Quality Without Compromise",
                                    body: "We write tested, reviewed, and documented code. Every pull request goes through rigorous review before it reaches production.",
                                },
                                {
                                    title: "Speed That Scales",
                                    body: "Our CI/CD pipelines and modular architecture let us move fast without breaking things. Iterative sprints with visible progress every week.",
                                },
                                {
                                    title: "Transparent Partnership",
                                    body: "No black boxes. You get clear communication, weekly updates, and direct access to the engineers working on your product.",
                                },
                                {
                                    title: "International Reach",
                                    body: "Based in Romania, we operate fully async across time zones. English-first communication, competitive European rates.",
                                },
                            ].map((v, i) => (
                                <li
                                    key={v.title}
                                    className="flex gap-4 rounded-xl border border-border bg-card p-5"
                                >
                                    <span
                                        aria-hidden="true"
                                        className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary"
                                    >
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className="mb-1 font-semibold">{v.title}</h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {v.body}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </motion.ul>
                    </div>
                </div>
            </section>

            {/* ── What We Build ───────────────────────────────────────────── */}
            <section aria-labelledby="capabilities-heading" className="relative py-24">
                <div className="relative z-10 mx-auto max-w-7xl px-6">
                    <SectionHeading label="Capabilities" id="capabilities-heading">
                        We build <span className="text-primary">anything digital.</span>
                    </SectionHeading>

                    {/* Row 1 — 3 cards */}
                    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {CAPABILITIES.slice(0, 3).map((cap, i) => (
                            <CapabilityCard key={cap.title} cap={cap} index={i} />
                        ))}
                    </div>

                    {/* Row 2 — remaining cards centered */}
                    <div className="mx-auto mt-6 grid gap-6 sm:grid-cols-2 lg:w-2/3 lg:grid-cols-2">
                        {CAPABILITIES.slice(3).map((cap, i) => (
                            <CapabilityCard key={cap.title} cap={cap} index={i + 3} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Mid-page CTA ────────────────────────────────────────────── */}
            <section aria-labelledby="mid-cta-heading" className="relative py-20">
                <div className="absolute inset-0 grid-bg-sm" />
                <motion.div
                    variants={fadeInUpLg}
                    initial="hidden"
                    whileInView="visible"
                    viewport={viewportOnce}
                    transition={{ duration: 0.4 }}
                    className="relative z-10 mx-auto max-w-3xl px-6 text-center"
                >
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        Ready to ship?
                    </p>
                    <h2 id="mid-cta-heading" className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
                        Got a project in mind?{" "}
                        <span className="text-primary">Let&apos;s talk.</span>
                    </h2>
                    <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                        Book a free 30-minute call. We will review your idea and tell you exactly
                        how we can help, no commitment required.
                    </p>
                    <Link
                        href="#contact"
                        className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
                    >
                        Start a Project
                    </Link>
                </motion.div>
            </section>

            {/* ── Engagement Models ───────────────────────────────────────── */}
            <section aria-labelledby="engagement-heading" className="relative py-24">
                <div className="relative z-10 mx-auto max-w-7xl px-6">
                    <SectionHeading label="Engagement Models" id="engagement-heading">
                        Pick the model that{" "}
                        <span className="text-primary">fits you.</span>
                    </SectionHeading>

                    <div className="grid gap-6 lg:grid-cols-3">
                        {ENGAGEMENT_MODELS.map((model, i) => (
                            <motion.article
                                key={model.title}
                                variants={fadeInUpLg}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={stagger(i)}
                                className="flex flex-col rounded-xl border border-border bg-card p-8 transition-[box-shadow,border-color] hover:border-primary/20 hover:shadow-md"
                            >
                                <div className="mb-5 flex size-12 items-center justify-center rounded-lg border border-border bg-primary/10">
                                    <model.icon className="size-6 text-primary" aria-hidden="true" />
                                </div>
                                <h3 className="mb-1 text-xl font-bold">{model.title}</h3>
                                <p className="mb-4 text-sm font-medium text-primary">
                                    {model.tagline}
                                </p>
                                <p className="mb-6 text-sm leading-relaxed text-muted-foreground">
                                    {model.description}
                                </p>
                                <ul className="mt-auto space-y-2" aria-label="Best for">
                                    {model.bestFor.map((item) => (
                                        <li
                                            key={item}
                                            className="flex items-start gap-2 text-sm text-muted-foreground"
                                        >
                                            <span
                                                aria-hidden="true"
                                                className="mt-0.5 shrink-0 text-primary"
                                            >
                                                ✓
                                            </span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </motion.article>
                        ))}
                    </div>

                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                        transition={{ duration: 0.4, delay: 0.3 }}
                        className="mt-10 text-center text-sm text-muted-foreground"
                    >
                        Not sure which model fits?{" "}
                        <Link
                            href="#contact"
                            className="font-medium text-primary underline-offset-4 hover:underline"
                        >
                            Tell us about your project
                        </Link>{" "}
                        and we&apos;ll suggest the right approach.
                    </motion.p>
                </div>
            </section>

            {/* ── FAQ ─────────────────────────────────────────────────────── */}
            <section aria-labelledby="faq-heading" className="relative py-24">
                <div className="relative z-10 mx-auto max-w-3xl px-6">
                    <SectionHeading label="FAQ" id="faq-heading">
                        Common <span className="text-primary">questions.</span>
                    </SectionHeading>

                    <dl className="space-y-5">
                        {FAQ.map((item, i) => (
                            <motion.div
                                key={item.q}
                                variants={fadeInUp}
                                initial="hidden"
                                whileInView="visible"
                                viewport={viewportOnce}
                                transition={{ duration: 0.4, delay: i * 0.06 }}
                                className="rounded-xl border border-border bg-card p-6"
                            >
                                <dt className="mb-2 font-semibold">{item.q}</dt>
                                <dd className="text-sm leading-relaxed text-muted-foreground">
                                    {item.a}
                                </dd>
                            </motion.div>
                        ))}
                    </dl>
                </div>
            </section>

            {/* ── CTA ─────────────────────────────────────────────────────── */}
            <section
                id="contact"
                aria-labelledby="about-cta-heading"
                className="relative py-32"
            >
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
                            Ready to Build?
                        </p>
                        <h2
                            id="about-cta-heading"
                            className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
                        >
                            Let&apos;s talk about
                            <br />
                            <span className="text-primary">your project.</span>
                        </h2>
                        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                            Book a free 30-minute architecture call. We&apos;ll review your stack,
                            your goals, and tell you exactly how we can help.
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
        </>
    );
}
