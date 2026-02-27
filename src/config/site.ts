/**
 * Central data store for the entire site.
 *
 * Every piece of copy, every link list, every data array that appears in more
 * than one component (or is likely to grow) lives here. Components import
 * only what they render - zero duplicated literals.
 */

import {
    Cpu,
    Code2,
    FileText,
    Search,
    Layers,
    Zap,
    Handshake,
    Linkedin,
    Instagram,
    Facebook,
} from "lucide-react";

import type {
    Service,
    ProcessStep,
    NavLink,
    FooterLinkGroup,
    TerminalLine,
    SocialLink,
} from "@/types";

// ── Company ─────────────────────────────────────────────

export const COMPANY = {
    name: "Dodera Software",
    legalName: "Dodera Software S.R.L.",
    email: "office@doderasoft.com",
    url: "https://doderasoft.com",
    location: "Romania · International",
    tagline:
        "Premium software and AI development from Romania, serving clients internationally.",
} as const;

// ── Services ────────────────────────────────────────────

export const SERVICES: Service[] = [
    {
        icon: Cpu,
        title: "AI Development",
        subtitle: "Intelligent Workflows & Agents",
        description:
            "Automate repetitive tasks and workflows with custom AI agents. We build intelligent systems that handle daily operations, data processing, and decision-making at scale.",
        tags: ["Workflow Automation", "AI Agents", "Process Optimization"],
        image: "/ai-development.jpg",
        highlights: [
            { label: "Custom AI Agents", href: "/services/ai-development/custom-ai-agents" },
            { label: "AI Powered Automations", href: "/services/ai-development/ai-powered-automations" },
        ],
        href: "/services/ai-development",
    },
    {
        icon: Code2,
        title: "Software Development",
        subtitle: "From Idea to Launch",
        description:
            "Launch your digital product with confidence. We handle everything from MVP development to enterprise-grade platforms using proven tech stacks.",
        tags: ["Laravel", "Nuxt", "Full-Stack"],
        image: "/software-development.jpg",
        highlights: [
            { label: "MVP to Market", href: "/services/software-development/mvp-to-market" },
            { label: "Enterprise Platforms", href: "/services/software-development/enterprise-platforms" },
            { label: "SaaS Products", href: "/services/software-development/saas-products" },
        ],
        href: "/services/software-development",
    },
    {
        icon: FileText,
        title: "Technical Documentation",
        subtitle: "Knowledge Systems & Indexing",
        description:
            "Transform your codebase and internal docs into AI-ready knowledge bases. Make your team's expertise searchable, accessible, and actionable.",
        tags: ["Knowledge Indexing", "AI Context", "Documentation"],
        image: "/technical-documentation.png",
        highlights: [
            { label: "Documentation Systems", href: "/services/technical-documentation/documentation-systems" },
        ],
        href: "/services/technical-documentation",
    },
];

// ── Process steps ───────────────────────────────────────

export const PROCESS_STEPS: ProcessStep[] = [
    {
        icon: Search,
        title: "Understand Your Vision",
        description:
            "We listen first. Deep-dive into your goals, challenges, and users to build a roadmap that makes sense.",
    },
    {
        icon: Layers,
        title: "Design the Blueprint",
        description:
            "Every great product starts with solid architecture. We plan every layer before writing a single line of code.",
    },
    {
        icon: Zap,
        title: "Build & Iterate",
        description:
            "Rapid development in focused sprints. You see real progress every week, with room to refine as we go.",
    },
    {
        icon: Handshake,
        title: "Ship & Support",
        description:
            "We deliver production-ready code, full documentation, and stay with you long after launch.",
    },
];

// ── Navigation ──────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
    { label: "Process", href: "/#process" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/#contact" },
];

// ── Social Media ────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
    { label: "LinkedIn", href: "https://linkedin.com/company/dodera", icon: Linkedin },
    { label: "Instagram", href: "https://instagram.com/doderasoftware", icon: Instagram },
    { label: "Facebook", href: "https://facebook.com/doderasoftware", icon: Facebook },
];

// ── Footer ──────────────────────────────────────────────

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
    {
        heading: "Services",
        links: [
            { label: "AI Development", href: "/services/ai-development" },
            { label: "Software Development", href: "/services/software-development" },
            { label: "Technical Documentation", href: "/services/technical-documentation" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "Process", href: "/#process" },
            { label: "Blog", href: "/blog" },
            { label: "Contact", href: "/#contact" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Privacy Policy", href: "#" },
            { label: "Terms of Service", href: "#" },
        ],
    },
];

// ── Trusted-by logos ────────────────────────────────────

export const TRUSTED_LOGOS: string[] = [
    "Vue",
    "React",
    "Next.js",
    "Nuxt",
    "Laravel",
    "Vercel",
    "Stripe",
];

// ── Terminal lines ──────────────────────────────────────

export const TERMINAL_LINES: TerminalLine[] = [
    { type: "input", text: "dodera deploy --target production" },
    { type: "output", text: "▸ Building application..." },
    { type: "output", text: "▸ Running 247 tests - all passed ✓" },
    { type: "output", text: "▸ Optimizing bundle - 63% smaller" },
    { type: "output", text: "▸ Deploying to 3 regions..." },
    { type: "success", text: "✓ Deployed successfully in 4.2s" },
    { type: "input", text: "dodera status" },
    { type: "success", text: "✓ All systems operational - 99.99% uptime" },
];
