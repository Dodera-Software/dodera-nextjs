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
    Facebook,
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
    TeamMember,
    EngagementModel,
} from "@/types";

// ── Company ─────────────────────────────────────────────

export const COMPANY = {
    name: "Dodera Software",
    legalName: "Dodera Software S.R.L.",
    email: "office@doderasoft.com",
    url: "https://doderasoft.com",
    phone: "0748 650 469",
    address: "Strada Banat 1, 440043 Satu Mare",
    location: "Romania · International",
    hours: "Open 24 hours",
    tagline:
        "Premium software and AI development from Romania, serving clients internationally.",
} as const;

// ── Services ────────────────────────────────────────────

export const SERVICES: Service[] = [
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
        icon: Monitor,
        title: "Presentation Websites",
        subtitle: "Stunning Sites That Convert",
        description:
            "Make a lasting first impression. We design and build polished, fast-loading presentation websites that showcase your brand and turn visitors into leads.",
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

// ── Team Members ────────────────────────────────────────────

export const TEAM_MEMBERS: TeamMember[] = [
    {
        name: "Andrei Marin",
        role: "Co-founder & Solutions Architect",
        bio: "Andrei leads system design and technical strategy. With a decade of experience building distributed systems, he ensures every solution is scalable, maintainable, and production-ready from day one.",
        expertise: [".NET", "Azure", "Microservices", "System Design", "C#"],
    },
    {
        name: "Radu Constantin",
        role: "Senior Full-Stack Engineer",
        bio: "Radu specialises in high-performance web applications. He bridges frontend and backend with clean architecture, building SaaS products and enterprise platforms that scale to millions of users.",
        expertise: ["React", "Next.js", "TypeScript", "Node.js", "PostgreSQL"],
    },
    {
        name: "Elena Popa",
        role: "Frontend Engineer",
        bio: "Elena crafts pixel-perfect, accessible interfaces. She brings designs to life with smooth animations, responsive layouts, and best-in-class Lighthouse scores across all devices.",
        expertise: ["Vue.js", "Nuxt", "TailwindCSS", "Framer Motion", "Accessibility"],
    },
    {
        name: "Mihai Ionescu",
        role: "Backend Engineer",
        bio: "Mihai architects robust server-side systems. From complex database schemas to high-throughput APIs, he ensures the backbone of every application is fast, secure, and resilient.",
        expertise: ["Laravel", "PHP", "PostgreSQL", "Redis", "REST & GraphQL"],
    },
    {
        name: "Ana Dumitrescu",
        role: "AI & Automation Engineer",
        bio: "Ana builds the intelligent layer of our products. She designs LLM pipelines, RAG systems, and autonomous agents that turn complex workflows into seamless automated experiences.",
        expertise: ["Python", "LangChain", "OpenAI", "RAG", "n8n"],
    },
    {
        name: "Bogdan Stanescu",
        role: "DevOps & CI/CD Engineer",
        bio: "Bogdan keeps the build pipeline green and deployments fearless. He architects cloud infrastructure and automation pipelines that give every team member confidence to ship fast.",
        expertise: ["Docker", "Kubernetes", "GitHub Actions", "AWS", "Terraform"],
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
