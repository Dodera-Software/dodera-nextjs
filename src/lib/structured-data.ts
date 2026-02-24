/**
 * Pre-built JSON-LD structured data factories.
 *
 * Each function returns a plain object ready to be serialized
 * as a `<script type="application/ld+json">` tag.
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { SITE, DEFAULT_META } from "@/config/seo";

/* ── Helpers ─────────────────────────────────────────────── */

const SOCIAL_URLS = [
    SITE.social.linkedin,
    SITE.social.instagram,
    SITE.social.facebook,
].filter(Boolean);

function orgSnippet() {
    return {
        "@type": "Organization",
        name: SITE.name,
        url: SITE.url,
        logo: `${SITE.url}${SITE.logo}`,
    };
}

/* ── Schema.org Organization ─────────────────────────────── */
export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo: `${SITE.url}${SITE.logo}`,
        email: SITE.email,
        description: DEFAULT_META.description,
        foundingDate: "2024",
        address: {
            "@type": "PostalAddress",
            addressCountry: SITE.address.country,
        },
        contactPoint: {
            "@type": "ContactPoint",
            email: SITE.email,
            contactType: "customer service",
            availableLanguage: ["English", "Romanian"],
        },
        sameAs: SOCIAL_URLS,
    };
}

/* ── Schema.org WebSite (sitelinks search-box in Google) ── */
export function webSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        description: DEFAULT_META.description,
        inLanguage: SITE.locale.replace("_", "-"),
        publisher: orgSnippet(),
        potentialAction: {
            "@type": "SearchAction",
            target: {
                "@type": "EntryPoint",
                urlTemplate: `${SITE.url}/?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
        },
    };
}

/* ── Schema.org ProfessionalService ───────────────────────── */
export function professionalServiceSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        logo: `${SITE.url}${SITE.logo}`,
        image: `${SITE.url}${SITE.ogImage}`,
        description: DEFAULT_META.description,
        priceRange: "$$$$",
        address: {
            "@type": "PostalAddress",
            addressCountry: SITE.address.country,
        },
        areaServed: {
            "@type": "GeoCircle",
            geoMidpoint: { "@type": "GeoCoordinates", latitude: 44.43, longitude: 26.1 },
            geoRadius: "20000",
        },
        sameAs: SOCIAL_URLS,
        serviceType: [
            "AI Development",
            "Custom Software Development",
            "Smart Documentation",
            "MCP Server Architecture",
            "SaaS Development",
        ],
        knowsAbout: [
            "Artificial Intelligence",
            "Machine Learning",
            "Software Engineering",
            ".NET",
            "Laravel",
            "Nuxt",
            "TypeScript",
            "React",
            "Next.js",
        ],
    };
}

/* ── Schema.org Service (per service page) ────────────────── */
export function serviceSchema(opts: {
    name: string;
    description: string;
    url: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        name: opts.name,
        description: opts.description,
        url: opts.url,
        provider: orgSnippet(),
        areaServed: {
            "@type": "Place",
            name: "Worldwide",
        },
        serviceType: opts.name,
    };
}

/* ── Schema.org CollectionPage (blog listing) ─────────────── */
export function collectionPageSchema(opts: {
    name: string;
    description: string;
    url: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: opts.name,
        description: opts.description,
        url: opts.url,
        isPartOf: {
            "@type": "WebSite",
            name: SITE.name,
            url: SITE.url,
        },
        publisher: orgSnippet(),
    };
}

/* ── Schema.org Article (individual blog post — CMS ready) ── */
export function articleSchema(opts: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    authorName?: string;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: opts.title,
        description: opts.description,
        url: opts.url,
        datePublished: opts.datePublished,
        dateModified: opts.dateModified ?? opts.datePublished,
        image: opts.image ?? `${SITE.url}${SITE.ogImage}`,
        author: {
            "@type": "Organization",
            name: opts.authorName ?? SITE.name,
            url: SITE.url,
        },
        publisher: {
            ...orgSnippet(),
            logo: {
                "@type": "ImageObject",
                url: `${SITE.url}${SITE.logo}`,
            },
        },
        mainEntityOfPage: {
            "@type": "WebPage",
            "@id": opts.url,
        },
    };
}

/* ── Schema.org BreadcrumbList ─────────────────────────────── */
export function breadcrumbSchema(items: { name: string; url: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map((item, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: item.name,
            item: item.url,
        })),
    };
}

/** Schema.org FAQPage */
export function faqSchema(questions: { question: string; answer: string }[]) {
    return {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: questions.map((q) => ({
            "@type": "Question",
            name: q.question,
            acceptedAnswer: {
                "@type": "Answer",
                text: q.answer,
            },
        })),
    };
}
