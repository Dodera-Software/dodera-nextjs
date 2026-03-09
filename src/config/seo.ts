/** Central SEO configuration – single source of truth for all meta / structured-data values. */

export const SITE = {
    name: "Dodera Software",
    legalName: "Dodera Software S.R.L.",
    tagline: "Custom Software & AI Development",
    url: "https://doderasoft.com",
    locale: "en_US",
    themeColor: "#e1432b",
    email: "office@doderasoft.com",
    phone: "0748 650 469",
    address: {
        street: "Strada Banat 1",
        city: "Satu Mare",
        postalCode: "440043",
        country: "Romania",
        region: "International",
    },
    social: {
        twitter: "@doderasoft",
        linkedin: "https://linkedin.com/company/dodera",
        instagram: "https://instagram.com/doderasoftware",
        facebook: "https://facebook.com/doderasoftware",
    },
    ogImage: "/og-image.png",
    logo: "/logo.png",
    favicon: "/favicon.svg",
} as const;

/** Default meta used when a page doesn't override values (also the layout fallback). */
export const DEFAULT_META = {
    title: `${SITE.name} - Custom Software & AI Development`,
    description:
        "We build web applications, presentation websites, AI systems and workflow automations for companies of all sizes. Based in Romania, serving clients globally.",
    keywords: [
        "software development",
        "AI development",
        "MCP servers",
        "autonomous agents",
        "custom software",
        "SaaS development",
        "enterprise applications",
        "Laravel development",
        "Nuxt development",
        "Romania software company",
        "scalable infrastructure",
        "smart documentation",
        "codebase indexing",
    ],
} as const;

// ── Page-specific metadata ───────────────────────────────────────────────────
// Edit these to change the title/description/keywords for each page.

/** Homepage (/) */
export const HOME_META = {
    title: `${SITE.name} - Custom Software & AI Development`,
    description:
        "We build web applications, presentation websites, AI systems and workflow automations for companies of all sizes. Based in Romania, serving clients globally.",
    keywords: [
        "software development",
        "AI development",
        "MCP servers",
        "autonomous agents",
        "custom software",
        "SaaS development",
        "enterprise applications",
        "Laravel development",
        "Nuxt development",
        "Romania software company",
        "scalable infrastructure",
        "smart documentation",
        "codebase indexing",
    ],
} as const;

/** About Us page (/about) */
export const ABOUT_META = {
    title: "About Us - Meet the Dodera Software Team",
    description:
        "Dodera Software is a boutique software engineering company based in Romania. We build web apps, mobile apps, AI systems, and automations for ambitious companies worldwide — per hour, per task, or per project.",
    keywords: [
        "about Dodera Software",
        "software engineering team",
        "Romanian software company",
        "senior engineers",
        "web development team",
        "AI development team",
        "mobile app developers",
        "full-stack developers Romania",
        "software company Romania",
        "engineering consultancy",
    ],
    openGraph: {
        title: "About Us - Meet the Dodera Software Team",
        description:
            "Senior software engineers specialising in web, mobile, AI, and automation. Based in Romania, serving clients internationally — per hour, per task, or end-to-end project.",
    },
    twitter: {
        title: "About Us - Dodera Software Engineering Team",
        description:
            "Senior engineers across frontend, backend, AI, mobile, and DevOps. Romania-based, serving clients worldwide.",
    },
} as const;

/** Blog page (/blog) */
export const BLOG_META = {
    title: "Blog - Engineering Insights & AI Development",
    description:
        "Technical articles on AI development, software engineering, SaaS architecture, and documentation best practices from the Dodera Software team.",
    keywords: [
        "software engineering blog",
        "AI development articles",
        "SaaS development insights",
        "technical documentation blog",
        "Dodera Software blog",
    ],
} as const;
