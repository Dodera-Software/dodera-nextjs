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
    Monitor,
    Search,
    Layers,
    Zap,
    Handshake,
    Linkedin,
    Instagram,
    Clock,
    CheckSquare,
    Briefcase,
} from "lucide-react";

import type {
    Service,
    ProcessStep,
    NavLink,
    FooterLinkGroup,
    TerminalLine,
    SocialLink,
    EngagementModel,
} from "@/types";

// ── Company ─────────────────────────────────────────────

export const COMPANY = {
    name: "Dodera Software",
    taxId: "49004234",
    registrationNumber: "J30/958/2023",
    legalName: "Dodera Software S.R.L.",
    foundedYear: 2023,
    email: "office@doderasoft.com",
    url: "https://doderasoft.com",
    phone: "0748 650 469",
    address: "Strada Banat 1, 440043 Satu Mare",
    location: "Romania · International",
    hours: "Open 24 hours",
    tagline:
        "Custom software and AI development from Romania, serving clients internationally.",
} as const;

// ── Services ────────────────────────────────────────────

export const SERVICES: Service[] = [
    {
        icon: Code2,
        title: "Software Development",
        subtitle: "From Idea to Launch",
        description:
            "Custom web applications built on modern stacks (Laravel, Next.js, Node.js and more). From early-stage MVPs to full-scale platforms, we handle the full delivery.",
        tags: ["Laravel", "Nuxt", "Vue.js", "React"],
        image: "/software-development.jpg",
        highlights: [
            { label: "MVP to Market", href: "/services/software-development/mvp-to-market" },
            { label: "Enterprise Platforms", href: "/services/software-development/enterprise-platforms" },
            { label: "SaaS Products", href: "/services/software-development/saas-products" },
        ],
        href: "/services/software-development",
    },
    {
        icon: Monitor,
        title: "Presentation Websites",
        subtitle: "Stunning Sites That Convert",
        description:
            "Fast, personalized and responsive websites built to rank and convert. We cover everything from design and performance to technical SEO, so your site works as hard as your team does.",
        tags: ["Brand Design", "Landing Pages", "Conversion"],
        image: "/presentation-website.png",
        highlights: [
            { label: "Business Showcase Sites", href: "/services/presentation-websites/business-showcase-sites" },
        ],
        href: "/services/presentation-websites",
    },
    {
        icon: Cpu,
        title: "AI Development",
        subtitle: "Intelligent Workflows & Agents",
        description:
            "AI agents and automation workflows using LLM from OpenAI, Anthropic and others. We connect them to your existing tools and data to run complex operations hands-free.",
        tags: ["Workflow Automation", "AI Agents", "Process Optimization"],
        image: "/ai-development.jpg",
        highlights: [
            { label: "Custom AI Agents", href: "/services/ai-development/custom-ai-agents" },
            { label: "AI Powered Automations", href: "/services/ai-development/ai-powered-automations" },
        ],
        href: "/services/ai-development",
    },
    {
        icon: FileText,
        title: "Technical Documentation",
        subtitle: "Knowledge Systems & Indexing",
        description:
            "Your codebase, processes, and internal knowledge turned into structured, AI-ready documentation - making information easy to find and use, for both your team and your tools.",
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
            "Structured discovery sessions map your goals to measurable outcomes, so scope is locked before a single line of code is planned.",
    },
    {
        icon: Layers,
        title: "Design the Blueprint",
        description:
            "Tech stack chosen for your scale, not ours. APIs, data models, and component contracts are documented and signed off before the first commit.",
    },
    {
        icon: Zap,
        title: "Build & Iterate",
        description:
            "Weekly deployments to staging so you test real builds, not mockups. Blockers are flagged early with no surprises at the deadline.",
    },
    {
        icon: Handshake,
        title: "Ship & Support",
        description:
            "Go-live comes with runbooks, monitoring dashboards, and a stabilization window. Not just a handoff ZIP and good luck.",
    },
];

// ── Engagement Models ────────────────────────────────────────

export const ENGAGEMENT_MODELS: EngagementModel[] = [
    {
        icon: Clock,
        title: "Per Hour",
        tagline: "Flexible & On-Demand",
        description:
            "Tap into senior engineering capacity exactly when you need it. Perfect for ongoing support, code reviews, technical audits, and iterative feature development.",
        bestFor: [
            "Ongoing maintenance & bug fixes",
            "Technical audits & architecture reviews",
            "Staff augmentation for existing teams",
            "Ad-hoc feature work or integrations",
        ],
    },
    {
        icon: CheckSquare,
        title: "Per Task",
        tagline: "Scoped & Predictable",
        description:
            "Defined deliverable, fixed price. You specify what you need, we give you a clear estimate and timeline. No surprises, no scope creep - just results.",
        bestFor: [
            "Individual features or components",
            "API integrations & third-party connections",
            "Performance optimisations",
            "One-off automation or AI workflows",
        ],
    },
    {
        icon: Briefcase,
        title: "Per Project",
        tagline: "End-to-End Ownership",
        description:
            "We own the entire journey from discovery to deployment. Ideal for greenfield builds and complete product launches where you want a dedicated engineering partner.",
        bestFor: [
            "New product or SaaS builds from scratch",
            "Complete website or platform redesigns",
            "Mobile app development (iOS, Android, PWA)",
            "Full AI system implementation",
        ],
    },
];

// ── Navigation ───────────────────────────────────────────────

export const NAV_LINKS: NavLink[] = [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
    { label: "Contact", href: "/#contact" },
];

// ── Social Media ────────────────────────────────────────

export const SOCIAL_LINKS: SocialLink[] = [
    { label: "LinkedIn", href: "https://www.linkedin.com/company/dodera-software/", icon: Linkedin },
    { label: "Instagram", href: "https://www.instagram.com/doderasoft/", icon: Instagram },
];

// ── Footer ──────────────────────────────────────────────

export const FOOTER_LINK_GROUPS: FooterLinkGroup[] = [
    {
        heading: "Services",
        links: [
            { label: "Software Development", href: "/services/software-development" },
            { label: "Presentation Websites", href: "/services/presentation-websites" },
            { label: "AI Development", href: "/services/ai-development" },
            { label: "Technical Documentation", href: "/services/technical-documentation" },
        ],
    },
    {
        heading: "Company",
        links: [
            { label: "About Us", href: "/about" },
            { label: "Process", href: "/#process" },
            { label: "Blog", href: "/blog" },
            { label: "Careers", href: "/careers" },
            { label: "Contact", href: "/#contact" },
        ],
    },
    {
        heading: "Legal",
        links: [
            { label: "Privacy Policy", href: "/privacy-policy" },
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
