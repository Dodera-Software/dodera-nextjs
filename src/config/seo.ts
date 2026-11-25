/** Central SEO configuration – shared site identity and layout fallback. */

export interface OpeningHours {
    /** schema.org day names, e.g. ["Monday", "Tuesday"] */
    days: string[];
    opens: string;   // "09:00"
    closes: string;  // "17:00"
}

export interface Founder {
    name: string;
    jobTitle: { en: string; ro: string };
    profiles: string[];
    bio: { en: string; ro: string };
    photo?: string;
}

export const SITE = {
    name: "Dodera Software",
    legalName: "Dodera Software S.R.L.",
    tagline: "Custom Software & AI Development",
    url: "https://doderasoft.com",
    locale: "en_US",
    themeColor: "#0a0a0c",
    email: "office@doderasoft.com",
    /** Display format (national). */
    phone: "0748 650 469",
    /** E.164, for tel: links and structured data. */
    phoneE164: "+40748650469",
    /** Display format (international), for the English site. */
    phoneIntl: "+40 748 650 469",
    taxId: "49004234",
    registrationNumber: "J30/958/2023",
    /* Registered 25 October 2023 (J30/958/2023, public registry). Older JSON-LD said 2024. */
    foundingDate: "2023-10-25",
    address: {
        street: "Strada Banat 1",
        city: "Satu Mare",
        county: "Satu Mare",
        postalCode: "440043",
        country: "Romania",
        countryCode: "RO",
        region: "International",
    },
    /* Street-level coordinates for Strada Banat, Satu Mare (OpenStreetMap). */
    geo: { latitude: 47.7998, longitude: 22.8819 },
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Dodera+Software%2C+Strada+Banat+1%2C+440043+Satu+Mare",
    googleBusinessProfile: null as string | null,
    openingHours: { days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "09:00", closes: "18:00" } as OpeningHours | null,
    founder: null as Founder | null,
    social: {
        twitter: "@doderasoft",
        /* The URLs linked in the site header/footer (config/site.ts SOCIAL_LINKS). */
        linkedin: "https://www.linkedin.com/company/dodera-software/",
        instagram: "https://www.instagram.com/doderasoft/",
        // TODO(owner): confirm — older config used facebook.com/doderasoftware; not linked anywhere on the site.
        facebook: null as string | null,
    },
    ogImage: "/og-images/og-homepage.png",
    logo: "/logo.png",
    favicon: "/favicon.ico",
} as const;

/**
 * Where we work: clients across Romania and internationally (remote).
 * The registered address is in Satu Mare, but the site does not target a city.
 */
export const SERVICE_AREA = {
    country: "Romania",
    international: true,
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
