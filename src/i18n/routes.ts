/**
 * Route map — the single source of truth for which page exists in which
 * locale and at which path.
 *
 * It drives canonical + hreflang alternates (page metadata), the sitemap,
 * the language switcher and llms.txt. A page only gets hreflang alternates
 * once it exists in more than one locale, so never add a path here before
 * the page is live.
 *
 * `sources` lists the files whose content makes up the page; the sitemap's
 * lastmod for the page is the latest git commit touching any of them
 * (see scripts/generate-lastmod.ts → src/config/lastmod.json).
 */

import type { Metadata } from "next";
import { SITE } from "@/config/seo";
import { SERVICE_PAGE_SLUGS } from "@/config/services";
import { DEFAULT_LOCALE, HTML_LANG, LOCALES, type Locale } from "./config";
import { LOCATION_SLUGS, SERVICE_PATHS, STATIC_PATHS, locationPath } from "./paths";

export interface PageRoute {
    paths: Partial<Record<Locale, string>>;
    sources: string[];
    changeFrequency: "weekly" | "monthly" | "yearly";
    priority: number;
}

const SERVICE_SOURCES = ["src/config/services.ts", "src/config/services.ro.ts", "src/components/ServicePageLayout.tsx"];

const STATIC_ROUTES = {
    home: {
        paths: STATIC_PATHS.home,
        sources: [
            "src/app/(en)/page.tsx",
            "src/app/(en)/seo.ts",
            "src/app/(ro)/ro/page.tsx",
            "src/i18n/dictionaries/ro.ts",
            "src/config/site.ts",
            "src/config/pricing.ts",
            "src/config/case-studies.ts",
            "src/config/testimonials.ts",
            "src/components/HeroSection.tsx",
            "src/components/ServicesSection.tsx",
            "src/components/ProcessSection.tsx",
            "src/components/PricingSection.tsx",
            "src/components/CaseStudiesSection.tsx",
            "src/components/TeamSection.tsx",
        ],
        changeFrequency: "weekly",
        priority: 1.0,
    },
    services: {
        paths: STATIC_PATHS.services,
        sources: ["src/app/(en)/services/page.tsx", "src/app/(ro)/ro/servicii/page.tsx", "src/config/site.ts", "src/components/ServicesIndex.tsx"],
        changeFrequency: "monthly",
        priority: 0.9,
    },
    about: {
        paths: STATIC_PATHS.about,
        sources: ["src/app/(ro)/ro/despre-noi/page.tsx", "src/app/(en)/about/page.tsx", "src/app/(en)/about/AboutPageContent.tsx", "src/app/(en)/about/seo.ts"],
        changeFrequency: "monthly",
        priority: 0.9,
    },
    contact: {
        paths: STATIC_PATHS.contact,
        sources: ["src/app/(en)/contact/page.tsx", "src/app/(ro)/ro/contact/page.tsx", "src/components/ContactPage.tsx"],
        changeFrequency: "yearly",
        priority: 0.8,
    },
    blog: {
        paths: STATIC_PATHS.blog,
        sources: ["src/app/(en)/blog/page.tsx", "src/app/(en)/blog/seo.ts"],
        changeFrequency: "weekly",
        priority: 0.8,
    },
    careers: {
        paths: STATIC_PATHS.careers,
        sources: ["src/app/(ro)/ro/cariere/page.tsx", "src/app/(en)/careers/page.tsx", "src/components/CareersPageContent.tsx", "src/app/(en)/careers/seo.ts"],
        changeFrequency: "monthly",
        priority: 0.7,
    },
    locations: {
        paths: STATIC_PATHS.locations,
        sources: ["src/app/(ro)/ro/locatii/page.tsx", "src/config/locations.ro.ts"],
        changeFrequency: "monthly",
        priority: 0.8,
    },
    webSatuMare: {
        paths: STATIC_PATHS.webSatuMare,
        sources: ["src/app/(ro)/ro/dezvoltare-solutii-web-satu-mare/page.tsx"],
        changeFrequency: "monthly",
        priority: 0.9,
    },
    privacy: {
        paths: STATIC_PATHS.privacy,
        sources: ["src/app/(en)/privacy-policy/page.tsx", "src/app/(ro)/ro/politica-de-confidentialitate/page.tsx"],
        changeFrequency: "yearly",
        priority: 0.3,
    },
} satisfies Record<string, PageRoute>;

export type StaticPageId = keyof typeof STATIC_ROUTES;
export type ServicePageId = `service:${string}`;
export type LocationPageId = `location:${string}`;
export type PageId = StaticPageId | ServicePageId | LocationPageId;

function serviceRoute(key: string): PageRoute {
    return {
        paths: SERVICE_PATHS[key] ?? { en: `/services/${key}` },
        sources: SERVICE_SOURCES,
        changeFrequency: "monthly",
        priority: key.includes("/") ? 0.7 : 0.9,
    };
}

/** Every page in the route map, keyed by page id. */
export const ROUTES: Record<PageId, PageRoute> = {
    ...STATIC_ROUTES,
    ...Object.fromEntries(SERVICE_PAGE_SLUGS.map((key) => [`service:${key}`, serviceRoute(key)])),
    ...Object.fromEntries(
        LOCATION_SLUGS.map((slug) => [
            `location:${slug}`,
            {
                paths: { ro: locationPath(slug) },
                sources: ["src/config/locations.ro.ts", "src/app/(ro)/ro/locatii/[oras]/page.tsx"],
                changeFrequency: "monthly",
                priority: 0.8,
            } satisfies PageRoute,
        ]),
    ),
};

/* ── Helpers ─────────────────────────────────────────────── */

export function absoluteUrl(path: string): string {
    return path === "/" ? SITE.url : `${SITE.url}${path}`;
}

export function pagePath(id: PageId, locale: Locale): string | undefined {
    return ROUTES[id]?.paths[locale];
}

/** hreflang map ({ en, ro, x-default }) for a page, or undefined when it exists in one locale only. */
export function hreflangFor(paths: Partial<Record<Locale, string>>): Record<string, string> | undefined {
    const available = LOCALES.filter((l) => paths[l]);
    if (available.length < 2) return undefined;

    const languages: Record<string, string> = {};
    for (const l of available) languages[HTML_LANG[l]] = absoluteUrl(paths[l]!);
    languages["x-default"] = absoluteUrl(paths[DEFAULT_LOCALE] ?? paths[available[0]]!);
    return languages;
}

/** `alternates` for page metadata: self-canonical plus hreflang when the page exists in both locales. */
export function alternatesFor(id: PageId, locale: Locale): NonNullable<Metadata["alternates"]> {
    const route = ROUTES[id];
    const path = route.paths[locale];
    if (!path) throw new Error(`No ${locale} path for page "${id}"`);

    const languages = hreflangFor(route.paths);
    return {
        canonical: absoluteUrl(path),
        ...(languages ? { languages } : {}),
    };
}
