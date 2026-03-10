/**
 * src/app/data.ts
 *
 * Homepage copy — edit here to update the hero section and the shared CTA.
 */

// ── Homepage hero ─────────────────────────────────────────────────────────────

export const HERO = {
    headline: "Software that",
    headlineHighlight: "Means Business.",
    description:
        "We offer premium IT consultancy specializing in high-performance AI infrastructure, custom SaaS launches, and smart technical documentation for visionary enterprises.",
    cta1: "Start a Project",
    cta2: "View Services",
} as const;

// ── Contact / CTA section ─────────────────────────────────────────────────────
// Used on the homepage and as the closing CTA on service pages.

export const CTA = {
    eyebrow: "Ready to Build?",
    headline: "Stop searching for talent.",
    headlineHighlight: "Start shipping code.",
    /** Text that comes before the highlighted word "free". */
    descriptionPre: "Book a",
    /** Text that comes after the highlighted word "free". */
    descriptionPost:
        "30-minute architecture call. We'll audit your project and tell you exactly what it takes to ship.",
} as const;
