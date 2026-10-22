/**
 * Pre-built JSON-LD structured data factories.
 *
 * Each function returns a plain object ready to be serialized
 * as a `<script type="application/ld+json">` tag (see components/JsonLd).
 *
 * The business is one entity with a stable @id; every other node points at
 * it, so search engines merge the pages into a single knowledge-graph entry.
 * Fields whose facts are still missing (config/seo.ts TODOs) are left out
 * rather than guessed.
 *
 * @see https://schema.org
 * @see https://developers.google.com/search/docs/appearance/structured-data
 */

import { SITE, SERVICE_AREA, DEFAULT_META } from "@/config/seo";
import { PRICE_FACTS } from "@/config/pricing";
import { HTML_LANG, type Locale } from "@/i18n/config";

/* ── Ids & helpers ───────────────────────────────────────── */

export const ORG_ID = `${SITE.url}/#organization`;
export const WEBSITE_ID = `${SITE.url}/#website`;

const SOCIAL_URLS = [
    SITE.social.linkedin,
    SITE.social.instagram,
    SITE.social.facebook,
].filter((u): u is string => Boolean(u));

/** Reference to the business entity, for provider/publisher/about. */
function orgRef() {
    return {
        "@type": "Organization",
        "@id": ORG_ID,
        name: SITE.name,
        url: SITE.url,
    };
}

function logoObject() {
    return {
        "@type": "ImageObject",
        url: `${SITE.url}${SITE.logo}`,
    };
}

function postalAddress() {
    return {
        "@type": "PostalAddress",
        streetAddress: SITE.address.street,
        addressLocality: SITE.address.city,
        addressRegion: SITE.address.county,
        postalCode: SITE.address.postalCode,
        addressCountry: SITE.address.countryCode,
    };
}

/** The cities from config/seo.ts SERVICE_AREA plus Romania. */
export function areaServed() {
    return [
        ...SERVICE_AREA.map((c) => ({ "@type": "City", name: c.name })),
        { "@type": "Country", name: "Romania" },
    ];
}

/** The published pricing models, as schema.org offers. */
function pricingOffers() {
    return [
        {
            "@type": "Offer",
            name: "Hourly",
            priceSpecification: {
                "@type": "UnitPriceSpecification",
                minPrice: PRICE_FACTS.hourly.min,
                maxPrice: PRICE_FACTS.hourly.max,
                priceCurrency: PRICE_FACTS.currency,
                unitCode: "HUR",
            },
        },
        {
            "@type": "Offer",
            name: "Fixed-price task",
            priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: PRICE_FACTS.taskFrom,
                priceCurrency: PRICE_FACTS.currency,
            },
        },
        {
            "@type": "Offer",
            name: "Fixed-price project",
            priceSpecification: {
                "@type": "PriceSpecification",
                minPrice: PRICE_FACTS.projectFrom,
                priceCurrency: PRICE_FACTS.currency,
            },
        },
    ];
}

/* ── Schema.org Organization + ProfessionalService ─────────
 * ProfessionalService is a LocalBusiness (and so an Organization), which
 * lets one node carry both the brand facts and the local-business facts.
 */
export function businessSchema(opts: { description?: string } = {}) {
    const hours = SITE.openingHours;
    const founder = SITE.founder;

    return {
        "@context": "https://schema.org",
        "@type": "ProfessionalService",
        "@id": ORG_ID,
        name: SITE.name,
        legalName: SITE.legalName,
        url: SITE.url,
        logo: logoObject(),
        image: `${SITE.url}${SITE.ogImage}`,
        description: opts.description ?? DEFAULT_META.description,
        email: SITE.email,
        telephone: SITE.phoneE164,
        taxID: SITE.taxId,
        foundingDate: SITE.foundingDate,
        address: postalAddress(),
        geo: {
            "@type": "GeoCoordinates",
            latitude: SITE.geo.latitude,
            longitude: SITE.geo.longitude,
        },
        hasMap: SITE.googleBusinessProfile ?? SITE.mapsUrl,
        ...(hours && {
            openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: hours.days,
                opens: hours.opens,
                closes: hours.closes,
            },
        }),
        ...(founder && {
            founder: {
                "@type": "Person",
                name: founder.name,
                jobTitle: founder.jobTitle,
                sameAs: [founder.linkedin],
            },
        }),
        areaServed: areaServed(),
        priceRange: `${PRICE_FACTS.hourly.min}-${PRICE_FACTS.hourly.max} EUR/h; projects from ${PRICE_FACTS.projectFrom} EUR`,
        contactPoint: {
            "@type": "ContactPoint",
            email: SITE.email,
            telephone: SITE.phoneE164,
            contactType: "sales",
            areaServed: "RO",
            availableLanguage: ["en", "ro"],
        },
        sameAs: SOCIAL_URLS,
        knowsAbout: [
            "Custom software development",
            "Web application development",
            "Presentation websites",
            "E-commerce",
            "AI agents",
            "Workflow automation",
            "n8n",
            "Technical documentation",
            "Laravel",
            "Next.js",
            "Nuxt",
            "React",
            "Vue.js",
            "Node.js",
            "TypeScript",
            "PostgreSQL",
        ],
    };
}

/* ── Schema.org WebSite ───────────────────────────────────── */
export function webSiteSchema(opts: { languages?: Locale[] } = {}) {
    const languages = (opts.languages ?? ["en"]).map((l) => HTML_LANG[l]);
    return {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE.name,
        url: SITE.url,
        description: DEFAULT_META.description,
        inLanguage: languages.length === 1 ? languages[0] : languages,
        publisher: { "@id": ORG_ID },
    };
}

/* ── Schema.org Service (per service page) ────────────────── */
export function serviceSchema(opts: {
    name: string;
    description: string;
    url: string;
    serviceType?: string;
    /** Limit areaServed to one city (local pages); defaults to every city served plus Romania. */
    city?: { name: string; county: string };
}) {
    return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": `${opts.url}#service`,
        name: opts.name,
        description: opts.description,
        url: opts.url,
        serviceType: opts.serviceType ?? opts.name,
        provider: orgRef(),
        areaServed: opts.city
            ? {
                "@type": "City",
                name: opts.city.name,
                containedInPlace: { "@type": "AdministrativeArea", name: `Județul ${opts.city.county}` },
            }
            : areaServed(),
        offers: pricingOffers(),
    };
}

/* ── Schema.org CollectionPage (blog listing) ─────────────── */
export function collectionPageSchema(opts: {
    name: string;
    description: string;
    url: string;
    locale?: Locale;
}) {
    return {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: opts.name,
        description: opts.description,
        url: opts.url,
        isPartOf: { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE.name, url: SITE.url },
        publisher: orgRef(),
        ...(opts.locale && { inLanguage: HTML_LANG[opts.locale] }),
    };
}

/* ── Schema.org BlogPosting (individual blog post) ────────── */
export function articleSchema(opts: {
    title: string;
    description: string;
    url: string;
    datePublished: string;
    dateModified?: string;
    image?: string;
    authorName?: string;
    /** Author page or profile (LinkedIn) URL. */
    authorUrl?: string;
    locale?: Locale;
}) {
    // A post signed with a person's name gets a Person author; posts with no
    // byline (or signed by the company) are attributed to the organization.
    const isPerson = !!opts.authorName && opts.authorName.trim() !== SITE.name;

    return {
        "@context": "https://schema.org",
        "@type": "BlogPosting",
        headline: opts.title,
        description: opts.description,
        url: opts.url,
        datePublished: opts.datePublished,
        dateModified: opts.dateModified ?? opts.datePublished,
        image: opts.image ?? `${SITE.url}${SITE.ogImage}`,
        author: isPerson
            ? {
                "@type": "Person",
                name: opts.authorName,
                ...(opts.authorUrl && { url: opts.authorUrl }),
                worksFor: orgRef(),
            }
            : orgRef(),
        publisher: { ...orgRef(), logo: logoObject() },
        mainEntityOfPage: { "@type": "WebPage", "@id": opts.url },
        ...(opts.locale && { inLanguage: HTML_LANG[opts.locale] }),
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

/* ── Schema.org AboutPage ─────────────────────────────────── */
export function aboutPageSchema(opts: { name: string; description: string; url: string; locale?: Locale }) {
    return {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: opts.name,
        description: opts.description,
        url: opts.url,
        isPartOf: { "@type": "WebSite", "@id": WEBSITE_ID, name: SITE.name, url: SITE.url },
        about: orgRef(),
        ...(opts.locale && { inLanguage: HTML_LANG[opts.locale] }),
    };
}

/**
 * Schema.org FAQPage — only for pages where every answer is in the
 * rendered HTML (Google requires the content to be visible on the page).
 */
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
