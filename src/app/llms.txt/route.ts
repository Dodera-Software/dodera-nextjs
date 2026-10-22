import { SITE } from "@/config/seo";
import { PRICE_FACTS } from "@/config/pricing";
import { SERVICE_PAGES } from "@/config/services";
import { SERVICE_PAGES_RO } from "@/config/services.ro";
import { CASE_STUDIES } from "@/config/case-studies";
import { getDictionary } from "@/i18n/dictionaries";
import { ROUTES, absoluteUrl, type PageId, type StaticPageId } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";

/**
 * /llms.txt — a short Markdown brief for AI assistants and answer engines
 * (https://llmstxt.org). Built from the same config as the site, so prices,
 * contact details and page lists cannot drift from what the pages say.
 */

export const dynamic = "force-static";

const PAGE_TITLES: Record<StaticPageId, Record<Locale, string>> = {
    home: { en: "Home", ro: "Acasă" },
    services: { en: "All services", ro: "Toate serviciile" },
    about: { en: "About us", ro: "Despre noi" },
    contact: { en: "Contact", ro: "Contact" },
    blog: { en: "Blog", ro: "Blog" },
    careers: { en: "Careers", ro: "Cariere" },
    privacy: { en: "Privacy policy", ro: "Politica de confidențialitate" },
    caseStudies: { en: "Case studies", ro: "Studii de caz" },
};

function pageTitle(id: PageId, locale: Locale): string {
    if (id.startsWith("case:")) {
        const items = locale === "ro" ? getDictionary("ro").caseStudies.items : CASE_STUDIES;
        return items.find((c) => c.id === id.slice("case:".length))?.headline ?? id;
    }
    if (id.startsWith("service:")) {
        const key = id.slice("service:".length);
        return (locale === "ro" ? SERVICE_PAGES_RO[key] : SERVICE_PAGES[key])?.heroLabel ?? id;
    }
    return PAGE_TITLES[id as StaticPageId]?.[locale] ?? id;
}

function pageList(locale: Locale): string {
    return Object.entries(ROUTES)
        .filter(([, r]) => r.paths[locale])
        .map(([id, r]) => `- [${pageTitle(id as PageId, locale)}](${absoluteUrl(r.paths[locale]!)})`)
        .join("\n");
}

export function GET() {
    const p = PRICE_FACTS;
    const hasRomanian = Object.values(ROUTES).some((r) => r.paths.ro);

    const body = `# ${SITE.name}

> ${SITE.name} (${SITE.legalName}) is a software development company from Romania. We build custom web applications, presentation websites, AI agents and workflow automations for companies in Romania and abroad, at a fixed price per project or per hour, with a weekly demo of working software.

## Services

- **Software development**: custom web applications, MVPs, SaaS products and enterprise platforms (Laravel, Next.js, Nuxt, React, Vue.js, Node.js, PostgreSQL). ${absoluteUrl("/services/software-development")}
- **Presentation websites**: fast, SEO-ready business websites. ${absoluteUrl("/services/presentation-websites")}
- **AI development**: custom AI agents on OpenAI, Anthropic and open-source models, and AI-powered automations built with n8n. ${absoluteUrl("/services/ai-development")}
- **Technical documentation**: documentation systems and AI-ready knowledge bases for codebases and internal processes. ${absoluteUrl("/services/technical-documentation")}

## Prices (${p.currency})

- Per hour: ${p.hourly.min}–${p.hourly.max} ${p.currency}
- Per task (fixed price): from ${p.taskFrom} ${p.currency}
- Per project (fixed price, scoped together for free): from ${p.projectFrom} ${p.currency} up to ${p.projectUpTo.toLocaleString("en-US")}+ ${p.currency}
- Monthly retainer: from ${p.retainerFrom} ${p.currency}/month

## Location and area served

- Clients across Romania and internationally; delivery is remote, with a weekly demo
- Registered office: ${SITE.address.street}, ${SITE.address.postalCode} ${SITE.address.city}, Romania
- Languages: Romanian, English

## Contact

- Email: ${SITE.email}
- Phone: ${SITE.phoneIntl}
- Website: ${SITE.url}
- LinkedIn: ${SITE.social.linkedin}

## Company

- Legal name: ${SITE.legalName}
- Registration: ${SITE.registrationNumber}, tax ID (CUI) ${SITE.taxId}
- Founded: ${SITE.foundingDate}

## Key pages (English)

${pageList("en")}
${hasRomanian ? `
## Pe scurt, în română

Dodera Software este o firmă de dezvoltare software din România care construiește aplicații web, site-uri de prezentare, agenți AI și automatizări n8n pentru companii din toată România. Preț fix pe proiect de la ${p.projectFrom} EUR, pe sarcină de la ${p.taskFrom} EUR, pe oră ${p.hourly.min}–${p.hourly.max} EUR, abonament de la ${p.retainerFrom} EUR/lună. Lucrăm cu clienți din România și din străinătate, de la distanță, cu demo săptămânal.

## Pagini cheie (Română)

${pageList("ro")}
` : ""}`;

    return new Response(body, {
        headers: {
            "Content-Type": "text/markdown; charset=utf-8",
            "Cache-Control": "public, max-age=3600",
        },
    });
}
