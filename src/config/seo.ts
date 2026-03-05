/** Central SEO configuration – single source of truth for all meta / structured-data values. */

export const SITE = {
    name: "Dodera Software",
    legalName: "Dodera Software S.R.L.",
    tagline: "Reliable Software & AI Development",
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
    favicon: "/favicon.ico",
} as const;

/** Default meta used when a page doesn't override values. */
export const DEFAULT_META = {
    title: `${SITE.name} - ${SITE.tagline}`,
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
