/**
 * src/app/about/data.ts
 *
 * All editable copy for the About page — edit here to update any text,
 * stats, capability cards, FAQs, or CTA blocks on /about.
 */

import { Globe, Brain, Workflow, Server, GitBranch } from "lucide-react";
import type { LucideIcon } from "lucide-react";

// ── Hero ──────────────────────────────────────────────────────────────────────

export const ABOUT_HERO = {
    eyebrow: "About Dodera Software",
    headline: "The engineering team",
    headlineHighlight: "behind your product.",
    description:
        "Dodera Software is a software engineering company founded in 2023. We build web applications, presentation websites, AI systems and workflow automations for companies of all sizes. We work per hour, per task, or per project, so you always get the engagement model that fits best for your needs.",
} as const;

// ── Stats ─────────────────────────────────────────────────────────────────────

export const ABOUT_STATS: { label: string; to: number; from: number; suffix: string }[] = [
    { label: "Specialists", to: 4, from: 0, suffix: "+" },
    { label: "Projects", to: 20, from: 0, suffix: "+" },
    { label: "Client Satisfaction", to: 99, from: 0, suffix: "%" },
];

// ── Story section ─────────────────────────────────────────────────────────────

export const ABOUT_STORY = {
    eyebrow: "Who We Are",
    headline: "A team of builders who",
    headlineHighlight: "care about craft.",
    paragraphs: [
        "Dodera Software was founded by engineers who were tired of watching great ideas fail because of poor technical execution. We built the company around a simple belief: software should be reliable, clear, and genuinely useful.",
        "Our team spans frontend, backend, AI and infrastructure disciplines. Every engineer on our roster is senior level, no juniors learning on your budget. We take ownership from the first line of architecture to the last deploy.",
        "Whether you need a long-term engineering partner or a specialist team to ship a single critical feature, we adapt our engagement to match your pace and goals.",
    ],
} as const;

// ── Values ────────────────────────────────────────────────────────────────────

export const ABOUT_VALUES = [
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

// ── Mid-page CTA ──────────────────────────────────────────────────────────────

export const ABOUT_MID_CTA = {
    eyebrow: "Ready to ship?",
    headline: "Got a project in mind?",
    headlineHighlight: "Let's talk.",
    descriptionPre: "Book a",
    descriptionPost:
        "30-minute call. We will review your idea and tell you exactly how we can help, no commitment required.",
    cta: "Start a Project",
} as const;

// ── Bottom CTA ────────────────────────────────────────────────────────────────

export const ABOUT_BOTTOM_CTA = {
    eyebrow: "Ready to Build?",
    headline: "We want to",
    headlineHighlight: "meet you!",
    descriptionPre: "Book a",
    descriptionPost:
        "30-minute architecture call. We'll review your stack, your goals, and tell you exactly how we can help.",
} as const;

// ── Capability cards ("What We Build") ───────────────────────────────────────

export interface Capability {
    icon: LucideIcon;
    title: string;
    description: string;
    tags: readonly string[];
}

export const CAPABILITIES: Capability[] = [
    {
        icon: Globe,
        title: "Web Applications",
        description:
            "SaaS platforms, enterprise dashboards, e-commerce systems, and everything in between, built to scale.",
        tags: ["React", "Next.js", "Nuxt", "Laravel"],
    },
    {
        icon: Brain,
        title: "AI Systems",
        description:
            "We integrate OpenAI and Claude models into your products, building custom agents, chat interfaces, and intelligent pipelines that automate real business decisions.",
        tags: ["OpenAI", "Claude"],
    },
    {
        icon: Workflow,
        title: "Automations",
        description:
            "End-to-end workflow automations that eliminate repetitive tasks and connect your tools without code locks.",
        tags: ["n8n", "Custom Pipelines"],
    },
    {
        icon: Server,
        title: "APIs & Back-End",
        description:
            "We design and build REST APIs, database schemas, and server-side logic that are fast, secure, and easy to maintain.",
        tags: ["Node.js", "PostgreSQL", "Postman"],
    },
    {
        icon: GitBranch,
        title: "DevOps & CI/CD",
        description:
            "Container orchestration, automated deployment pipelines, and cloud infrastructure from zero to production.",
        tags: ["Docker", "Kubernetes", "GitHub Actions", "AWS"],
    },
];

// ── FAQ ───────────────────────────────────────────────────────────────────────

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
