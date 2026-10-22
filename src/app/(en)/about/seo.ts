/**
 * src/app/about/seo.ts
 *
 * SEO metadata for the About page (/about) — edit here to update
 * the title, description, keywords, and social previews.
 */

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
