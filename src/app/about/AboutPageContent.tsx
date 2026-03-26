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
import { Badge } from "@/components/ui/badge";
import { SectionHeading } from "@/components/SectionHeading";
import { ContactForm } from "@/components/ContactForm";
import { PricingSection } from "@/components/PricingSection";
import { CapabilityCard, CAPABILITIES } from "./CapabilityCard";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";

// ── About page copy ───────────────────────────────────────────────────────────

const ABOUT_STATS: { label: string; to: number; from: number; suffix: string }[] = [
    { label: "AI Applications", to: 20, from: 0, suffix: "+" },
    { label: "Web Applications", to: 50, from: 0, suffix: "+" },
    { label: "Client Satisfaction", to: 99, from: 0, suffix: "%" },
];

const ABOUT_VALUES = [
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
] as const;

export const FAQ = [
    {
        q: "Where is Dodera Software based?",
        a: "We are based in Romania and serve clients internationally, from startups in Western Europe to enterprises in North America. All work is delivered remotely with clear async communication.",
    },
    {
        q: "What size of projects do you take on?",
        a: "We work on everything from single-feature tasks billed per hour to full product builds delivered as end-to-end projects. If you need a single API endpoint or a complete SaaS platform, we can help.",
    },
    {
        q: "Can your team integrate with our existing developers?",
        a: "Absolutely. Many clients bring us in as a dedicated extension of their internal team. We adapt to your stack, your Git workflow, and your sprint cadence.",
    },
    {
        q: "How do you ensure code quality?",
        a: "Every project goes through code review, automated testing, and a structured QA phase before delivery. Our CI/CD engineers set up pipelines that keep standards enforced on every commit.",
    },
    {
        q: "Do you work with early-stage startups?",
        a: "Yes. We have helped several founders go from idea to launched MVP. We offer architecture advice, tech-stack guidance, and can move quickly to meet investor or market deadlines.",
    },
    {
        q: "What industries do you have experience in?",
        a: "Our team has shipped products in fintech, healthcare, logistics, e-commerce, education, and media. We understand the compliance, performance, and UX expectations of each vertical.",
    },
] as const;

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
                {ABOUT_STATS.map((stat) => (
                    <div key={stat.label} className="flex flex-col items-center px-4 py-4 sm:px-10 md:px-14">
                        <dd className="text-3xl font-bold text-primary sm:text-4xl md:text-5xl">
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
            {/* ── Hero ────────────────────────────────────────────────────── */}
            <section aria-labelledby="about-hero-heading" className="relative pb-24 pt-32">
                <div className="absolute inset-0 grid-bg" />

                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4 }}
                        className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                        About Us
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
                        <span className="text-primary">behind your product.</span>
                    </motion.h1>

                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.16 }}
                        className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        Dodera Software is a software engineering company founded in 2023. We build web applications, presentation websites, AI systems and workflow automations for companies of all sizes. We work per hour, per task, or per project, so you always get the engagement model that fits best for your needs.
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
                                <p>Dodera Software was founded by engineers who were tired of watching great ideas fail because of poor technical execution. We built the company around a simple belief: software should be reliable, clear, and genuinely useful.</p>
                                <p>Our team spans frontend, backend, AI and infrastructure disciplines. Every engineer on our roster is senior level, no juniors learning on your budget. We take ownership from the first line of architecture to the last deploy.</p>
                                <p>Whether you need a long-term engineering partner or a specialist team to ship a single critical feature, we adapt our engagement to match your pace and goals.</p>
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
                            {ABOUT_VALUES.map((v, i) => (
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

            {/* ── Pricing ─────────────────────────────────────────────────── */}
            <PricingSection />

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
                            We want to
                            <br />
                            <span className="text-primary">meet you!</span>
                        </h2>
                        <p className="mx-auto max-w-xl text-lg leading-relaxed text-muted-foreground">
                            Book a{" "}<strong className="font-semibold text-primary">free</strong>{" "}30-minute architecture call. We&apos;ll review your stack, your goals, and tell you exactly how we can help.
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
