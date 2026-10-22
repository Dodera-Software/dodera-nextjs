/** Central SEO configuration – shared site identity and layout fallback. */

/*
 * TODO(owner): facts still missing — every consumer (footer, JSON-LD,
 * llms.txt) skips a field while it is null, so nothing invented is shown:
 *   - openingHours  real business hours
 *   - founder       name, role, LinkedIn URL, short bio
 *   - googleBusinessProfile  GBP / Maps share link once the profile exists
 *   - geo           confirm the exact pin (currently street-level, OSM)
 */

export interface OpeningHours {
    /** schema.org day names, e.g. ["Monday", "Tuesday"] */
    days: string[];
    opens: string;   // "09:00"
    closes: string;  // "17:00"
}

export interface Founder {
    name: string;
    jobTitle: { en: string; ro: string };
    linkedin: string;
    /** 2–4 sentences of real experience: years, past roles, notable work. */
    bio: { en: string; ro: string };
    /** Square photo in /public, e.g. "/team/founder.jpg". Initials are shown until it exists. */
    photo?: string;
}

export const SITE = {
    name: "Dodera Software",
    legalName: "Dodera Software S.R.L.",
    tagline: "Custom Software & AI Development",
    url: "https://doderasoft.com",
    locale: "en_US",
    themeColor: "#e1432b",
    email: "office@doderasoft.com",
    /** Display format (national). */
    phone: "0748 650 469",
    /** E.164, for tel: links and structured data. */
    phoneE164: "+40748650469",
    /** Display format (international), for the English site. */
    phoneIntl: "+40 748 650 469",
    taxId: "49004234",
    registrationNumber: "J30/958/2023",
    /* Registered in 2023 (J30/958/2023). Older JSON-LD said 2024. */
    foundingDate: "2023",
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
    openingHours: null as OpeningHours | null,
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

/** Cities we serve (local pages, JSON-LD areaServed). */
export const SERVICE_AREA = [
    { name: "Satu Mare", county: "Satu Mare" },
    { name: "Carei", county: "Satu Mare" },
    { name: "Baia Mare", county: "Maramureș" },
    { name: "Zalău", county: "Sălaj" },
    { name: "Oradea", county: "Bihor" },
    { name: "Cluj-Napoca", county: "Cluj" },
] as const;

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
