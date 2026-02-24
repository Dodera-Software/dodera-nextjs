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

/** Schema.org Organization */
export function organizationSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo: `${SITE.url}/logo.png`,
        email: SITE.email,
        description: DEFAULT_META.description,
        address: {
            "@type": "PostalAddress",
            addressCountry: SITE.address.country,
        },
        sameAs: [
            "https://linkedin.com/company/dodera",
            "https://instagram.com/doderasoftware",
            "https://facebook.com/doderasoftware",
        ],
    };
}

/** Schema.org WebSite (enables sitelinks search-box in Google) */
export function webSiteSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: SITE.name,
        url: SITE.url,
        description: DEFAULT_META.description,
        inLanguage: "en-US",
        publisher: {
            "@type": "Organization",
            name: SITE.name,
            url: SITE.url,
        },
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

/** Schema.org ProfessionalService */
export function professionalServiceSchema() {
    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        name: SITE.name,
        url: SITE.url,
        email: SITE.email,
        description: DEFAULT_META.description,
        address: {
            "@type": "PostalAddress",
            addressCountry: SITE.address.country,
        },
        areaServed: {
            "@type": "Place",
            name: "Worldwide",
        },
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
        ],
    };
}

/** Schema.org BreadcrumbList */
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
