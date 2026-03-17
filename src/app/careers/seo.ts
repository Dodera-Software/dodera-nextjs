/**
 * src/app/careers/seo.ts
 *
 * SEO metadata for the Careers page (/careers).
 */

export const CAREERS_META = {
    title: "Careers - Join the Dodera Software Team",
    description:
        "We are always on the lookout for talented engineers and designers to join our team. Check back here for open positions or reach out directly.",
    keywords: [
        "careers Dodera Software",
        "software engineering jobs",
        "jobs Romania",
        "remote software jobs",
        "join Dodera",
        "software developer jobs",
        "AI engineer jobs",
        "tech jobs Romania",
    ],
    openGraph: {
        title: "Careers - Join the Dodera Software Team",
        description:
            "No open positions right now, but we are always interested in hearing from talented people. Send us a message and let's talk.",
    },
    twitter: {
        title: "Careers - Dodera Software",
        description:
            "No open positions right now, but we'd love to hear from talented engineers and designers. Reach out any time.",
    },
} as const;
