import { PRODUCTS } from "@/config/products";
import { SERVICE_PAGES } from "@/config/services";
import { SERVICE_PAGES_RO } from "@/config/services.ro";
import { CASE_STUDY_PATHS, SERVICE_PATHS } from "@/i18n/paths";
import { getDictionary } from "@/i18n/dictionaries";
import { absoluteUrl } from "@/i18n/routes";
import type { Locale } from "@/i18n/config";
import type { ServicePageData } from "@/types";

const SERVICE_DATA: Record<Locale, Record<string, ServicePageData>> = { en: SERVICE_PAGES, ro: SERVICE_PAGES_RO };

const LABELS: Record<Locale, { products: string; services: string; caseStudies: string; faq: string; problem: string; solution: string; result: string; pricing: string }> = {
    en: { products: "Our products", services: "Services", caseStudies: "Case studies", faq: "Questions", problem: "Problem", solution: "What we built", result: "Result", pricing: "Pricing" },
    ro: { products: "Produsele noastre", services: "Servicii", caseStudies: "Studii de caz", faq: "Întrebări", problem: "Problema", solution: "Ce am construit", result: "Rezultat", pricing: "Prețuri" },
};

export const MARKDOWN_HEADERS = {
    "Content-Type": "text/markdown; charset=utf-8",
    "Cache-Control": "public, max-age=3600",
} as const;

export function productsMarkdown(locale: Locale): string {
    const copy = getDictionary(locale).products.items;
    return PRODUCTS.map((product) => {
        const item = copy[product.id];
        return `- **[${product.name}](${product.url})** (${item.kind}): ${item.title} ${item.lede}`;
    }).join("\n");
}

function servicePageMarkdown(key: string, page: ServicePageData, locale: Locale): string {
    const path = SERVICE_PATHS[key]?.[locale];
    const t = LABELS[locale];
    const sections = page.sections
        .map((section) => [`#### ${section.title}`, section.content, ...(section.bullets ?? []).map((b) => `- ${b}`)].join("\n\n"))
        .join("\n\n");
    const pricing = page.pricing
        ? `#### ${t.pricing}\n\n${page.pricing.intro}\n\n${page.pricing.items.map((i) => `- ${i.label}: ${i.price}${i.note ? ` (${i.note})` : ""}`).join("\n")}`
        : "";
    const faqs = page.faqs.length ? `#### ${t.faq}\n\n${page.faqs.map((f) => `**${f.question}**\n${f.answer}`).join("\n\n")}` : "";
    return [`### ${page.heroLabel}`, path ? `URL: ${absoluteUrl(path)}` : "", page.heroDescription, sections, pricing, faqs].filter(Boolean).join("\n\n");
}

export function servicesMarkdown(locale: Locale): string {
    return Object.entries(SERVICE_DATA[locale])
        .map(([key, page]) => servicePageMarkdown(key, page, locale))
        .join("\n\n---\n\n");
}

export function caseStudiesMarkdown(locale: Locale): string {
    const t = LABELS[locale];
    return getDictionary(locale)
        .caseStudies.items.map((study) => {
            const path = CASE_STUDY_PATHS[study.id]?.[locale];
            return [
                `### ${study.headline}`,
                path ? `URL: ${absoluteUrl(path)}` : "",
                `${study.industry} · ${study.client}`,
                `**${t.problem}:** ${study.problem}`,
                `**${t.solution}:** ${study.solution}`,
                `**${t.result}:** ${study.metric} ${study.metricLabel}`,
            ]
                .filter(Boolean)
                .join("\n\n");
        })
        .join("\n\n");
}

export function fullMarkdown(locale: Locale): string {
    const t = LABELS[locale];
    const dict = getDictionary(locale);
    return [
        `## ${locale === "en" ? "English" : "Română"}`,
        `${dict.hero.titleA} ${dict.hero.titleB} ${dict.hero.text}`,
        `### ${t.products}`,
        productsMarkdown(locale),
        `## ${t.services}`,
        servicesMarkdown(locale),
        `## ${t.caseStudies}`,
        caseStudiesMarkdown(locale),
    ].join("\n\n");
}
