/**
 * src/app/blog/data.ts
 *
 * All editable copy for the Blog listing page — edit here to update
 * the hero headline, eyebrow, description, or section headings on /blog.
 */

// ── Hero ──────────────────────────────────────────────────────────────────────

export const BLOG_HERO = {
    eyebrow: "Blog",
    headlinePre: "Engineering",
    headlineHighlight: "Insights",
    headlinePost: "& AI Development",
    description:
        "Deep dives into AI development, software architecture, SaaS best practices, and technical documentation – from the team that builds production systems every day.",
} as const;

// ── Posts section ─────────────────────────────────────────────────────────────

export const BLOG_POSTS_SECTION = {
    heading: "Latest Articles",
    readMore: "Read More",
} as const;
