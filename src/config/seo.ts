/** Central SEO configuration – shared site identity and layout fallback. */

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