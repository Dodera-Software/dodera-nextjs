/**
 * Every page's path in each locale — plain data, no content imports, so the
 * client-side language switcher can use it without pulling page content
 * into the bundle. src/i18n/routes.ts builds the full route map from it.
 *
 * Only list a locale's path once that page is live in that locale.
 */

import type { Locale } from "./config";

export type LocalePaths = Partial<Record<Locale, string>>;

export const STATIC_PATHS = {
    home: { en: "/", ro: "/ro" },
    services: { en: "/services", ro: "/ro/servicii" },
    about: { en: "/about", ro: "/ro/despre-noi" },
    contact: { en: "/contact", ro: "/ro/contact" },
    blog: { en: "/blog" },
    careers: { en: "/careers", ro: "/ro/cariere" },
    privacy: { en: "/privacy-policy", ro: "/ro/politica-de-confidentialitate" },
    locations: { ro: "/ro/locatii" },
    caseStudies: { en: "/case-studies", ro: "/ro/studii-de-caz" },
    webSatuMare: { ro: "/ro/dezvoltare-solutii-web-satu-mare" },
} satisfies Record<string, LocalePaths>;

/** City pages (Romanian only), keyed by slug — see config/locations.ro.ts. */
export const LOCATION_SLUGS = ["satu-mare", "carei", "baia-mare", "zalau", "oradea", "cluj-napoca"] as const;

export const locationPath = (slug: string) => `/ro/locatii/${slug}`;

/** Case-study pages, keyed by case-study id (config/case-studies.ts). */
export const CASE_STUDY_PATHS: Record<string, LocalePaths> = {
    "freight-automation": {
        en: "/case-studies/freight-forwarding-automation",
        ro: "/ro/studii-de-caz/automatizare-expeditii-marfuri",
    },
    "saas-reporting": {
        en: "/case-studies/b2b-saas-reporting-dashboard",
        ro: "/ro/studii-de-caz/dashboard-raportare-saas-b2b",
    },
    "clinic-booking": {
        en: "/case-studies/clinic-booking-platform",
        ro: "/ro/studii-de-caz/platforma-programari-clinici",
    },
};

/** Service pages, keyed by the English service key (config/services.ts). */
export const SERVICE_PATHS: Record<string, LocalePaths> = {
    "software-development": {
        en: "/services/software-development",
        ro: "/ro/servicii/dezvoltare-software",
    },
    "software-development/mvp-to-market": {
        en: "/services/software-development/mvp-to-market",
        ro: "/ro/servicii/dezvoltare-software/mvp",
    },
    "software-development/enterprise-platforms": {
        en: "/services/software-development/enterprise-platforms",
        ro: "/ro/servicii/dezvoltare-software/platforme-enterprise",
    },
    "software-development/saas-products": {
        en: "/services/software-development/saas-products",
        ro: "/ro/servicii/dezvoltare-software/produse-saas",
    },
    "presentation-websites": {
        en: "/services/presentation-websites",
        ro: "/ro/servicii/site-uri-de-prezentare",
    },
    "presentation-websites/business-showcase-sites": {
        en: "/services/presentation-websites/business-showcase-sites",
        ro: "/ro/servicii/site-uri-de-prezentare/site-de-prezentare-firma",
    },
    "ai-development": {
        en: "/services/ai-development",
        ro: "/ro/servicii/dezvoltare-ai",
    },
    "ai-development/custom-ai-agents": {
        en: "/services/ai-development/custom-ai-agents",
        ro: "/ro/servicii/dezvoltare-ai/agenti-ai-personalizati",
    },
    "ai-development/ai-powered-automations": {
        en: "/services/ai-development/ai-powered-automations",
        ro: "/ro/servicii/dezvoltare-ai/automatizari-ai-n8n",
    },
    "technical-documentation": {
        en: "/services/technical-documentation",
        ro: "/ro/servicii/documentatie-tehnica",
    },
    "technical-documentation/documentation-systems": {
        en: "/services/technical-documentation/documentation-systems",
        ro: "/ro/servicii/documentatie-tehnica/sisteme-de-documentare",
    },
};

const ALL_PATHS: LocalePaths[] = [
    ...Object.values(STATIC_PATHS),
    ...Object.values(SERVICE_PATHS),
    ...Object.values(CASE_STUDY_PATHS),
    ...LOCATION_SLUGS.map((s) => ({ ro: locationPath(s) })),
];

/** Locale implied by a pathname. */
export function localeOfPath(pathname: string): Locale {
    return pathname === "/ro" || pathname.startsWith("/ro/") ? "ro" : "en";
}

/**
 * The equivalent of `pathname` in `target` — used by the language switcher.
 * Pages without a translation fall back to the target locale's homepage.
 */
export function switchLocalePath(pathname: string, target: Locale): string {
    const clean = pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname;
    const match = ALL_PATHS.find((p) => Object.values(p).includes(clean));
    return match?.[target] ?? STATIC_PATHS.home[target];
}
