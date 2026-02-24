/** Central SEO configuration – single source of truth for all meta / structured-data values. */

export const SITE = {
    name: "Dodera Software",
    legalName: "Dodera Software S.R.L.",
    tagline: "Mission-Critical Software & AI Development",
    url: "https://doderasoft.com",
    locale: "en_US",
    themeColor: "#e1432b",
    email: "office@doderasoft.com",
    phone: "",
    address: {
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
    favicon: "/favicon.ico",
} as const;

/** Default meta used when a page doesn't override values. */
export const DEFAULT_META = {
    title: `${SITE.name} - ${SITE.tagline}`,
    description:
        "We build mission-critical applications, AI agents, and scalable infrastructure for companies that can't afford downtime. Based in Romania, serving clients internationally.",
    keywords: [
        "software development",
        "AI development",
        "MCP servers",
        "autonomous agents",
        "custom software",
        "SaaS development",
        "enterprise applications",
        ".NET development",
        "Laravel development",
        "Nuxt development",
        "Romania software company",
        "mission-critical applications",
        "scalable infrastructure",
        "smart documentation",
        "codebase indexing",
    ],
} as const;
