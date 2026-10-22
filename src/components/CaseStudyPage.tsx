import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero } from "@/components/PageHero";
import type { CaseStudy } from "@/config/case-studies";
import type { Locale } from "@/i18n/config";
import { CASE_STUDY_PATHS, SERVICE_PATHS, STATIC_PATHS } from "@/i18n/paths";

/** Services each case study demonstrates — linked from the case study and back from those service pages. */
export const CASE_STUDY_SERVICES: Record<CaseStudy["id"], string[]> = {
    "freight-automation": ["ai-development/ai-powered-automations", "ai-development"],
    "saas-reporting": ["software-development", "software-development/enterprise-platforms"],
    "clinic-booking": ["software-development", "software-development/saas-products"],
};

const COPY = {
    en: {
        home: "Home",
        hub: "Case Studies",
        client: "Client",
        industry: "Industry",
        stack: "Stack",
        timeline: "Timeline",
        result: "Result",
        problem: "The problem",
        solution: "What we built",
        outcome: "The result",
        services: "Services used",
        cta: "Have a similar problem?",
        ctaText: "Tell us about it. The first call, where we scope it together, is free.",
        ctaButton: "Start a Project",
        contact: "/#contact",
        lead: (cs: CaseStudy) =>
            `Dodera Software built this for a ${cs.client.charAt(0).toLowerCase()}${cs.client.slice(1)}${cs.timeline ? ` in ${cs.timeline}` : ""}. Result: ${cs.metric} ${cs.metricLabel}.`,
        hubTitle: "Case studies",
        hubLead: "Real problems we solved for clients, with the stack, the timeline and the measurable result. Client names are withheld at their request.",
        readCase: "Read the case study",
    },
    ro: {
        home: "Acasă",
        hub: "Studii de caz",
        client: "Client",
        industry: "Domeniu",
        stack: "Tehnologii",
        timeline: "Durată",
        result: "Rezultat",
        problem: "Problema",
        solution: "Ce am construit",
        outcome: "Rezultatul",
        services: "Servicii folosite",
        cta: "Aveți o problemă asemănătoare?",
        ctaText: "Spuneți-ne despre ea. Prima discuție, în care stabilim scopul împreună, este gratuită.",
        ctaButton: "Începeți un proiect",
        contact: STATIC_PATHS.contact.ro,
        // Gender-neutral phrasing: the client descriptions mix feminine ("companie") and masculine ("grup").
        lead: (cs: CaseStudy) =>
            `Studiu de caz Dodera Software, ${cs.industry.toLowerCase()}. Client: ${cs.client.charAt(0).toLowerCase()}${cs.client.slice(1)}${cs.timeline ? `; proiect livrat în ${cs.timeline}` : ""}. Rezultat: ${cs.metric} ${cs.metricLabel}.`,
        hubTitle: "Studii de caz",
        hubLead: "Probleme reale pe care le-am rezolvat pentru clienți, cu tehnologiile folosite, durata și rezultatul măsurabil. Numele clienților nu sunt publicate, la cererea lor.",
        readCase: "Citiți studiul de caz",
    },
} as const;

/** Labels for the service keys linked from a case study. */
const SERVICE_LABELS_EN: Record<string, string> = {
    "ai-development": "AI Development",
    "ai-development/ai-powered-automations": "AI-Powered Automations",
    "software-development": "Software Development",
    "software-development/enterprise-platforms": "Enterprise Platforms",
    "software-development/saas-products": "SaaS Products",
};

const SERVICE_LABELS_RO: Record<string, string> = {
    "ai-development": "Dezvoltare AI",
    "ai-development/ai-powered-automations": "Automatizări AI cu n8n",
    "software-development": "Dezvoltare software",
    "software-development/enterprise-platforms": "Platforme enterprise",
    "software-development/saas-products": "Produse SaaS",
};

function serviceLabel(locale: Locale, key: string) {
    return (locale === "ro" ? SERVICE_LABELS_RO : SERVICE_LABELS_EN)[key] ?? key;
}

export function caseStudyLead(locale: Locale, cs: CaseStudy) {
    return COPY[locale].lead(cs);
}

/** Full case-study page body. Server component. */
export function CaseStudyPage({ locale, caseStudy: cs }: { locale: Locale; caseStudy: CaseStudy }) {
    const t = COPY[locale];
    const hubHref = STATIC_PATHS.caseStudies[locale];

    return (
        <>
            <Breadcrumb
                items={[
                    { label: t.home, href: STATIC_PATHS.home[locale] },
                    { label: t.hub, href: hubHref },
                    { label: cs.headline },
                ]}
            />
            <PageHero eyebrow={cs.industry} title={cs.headline} lead={t.lead(cs)} id="case-study-page-heading" />

            <section className="pb-8">
                <dl className="mx-auto grid max-w-4xl gap-4 px-6 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-xl border border-border bg-card p-5">
                        <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.client}</dt>
                        <dd className="text-sm">{cs.client}</dd>
                    </div>
                    <div className="rounded-xl border border-border bg-card p-5">
                        <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.stack}</dt>
                        <dd className="text-sm">{cs.tags.join(", ")}</dd>
                    </div>
                    {cs.timeline && (
                        <div className="rounded-xl border border-border bg-card p-5">
                            <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.timeline}</dt>
                            <dd className="text-sm">{cs.timeline}</dd>
                        </div>
                    )}
                    <div className="rounded-xl border border-primary/20 bg-primary/5 p-5">
                        <dt className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{t.result}</dt>
                        <dd className="text-sm">
                            <span className="text-xl font-extrabold text-primary">{cs.metric}</span> {cs.metricLabel}
                        </dd>
                    </div>
                </dl>
            </section>

            <section aria-labelledby="cs-problem" className="py-12">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 id="cs-problem" className="mb-4 text-2xl font-bold tracking-tight">{t.problem}</h2>
                    <p className="text-base leading-relaxed text-muted-foreground">{cs.problem}</p>
                </div>
            </section>

            <section aria-labelledby="cs-solution" className="bg-card/30 py-12">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 id="cs-solution" className="mb-4 text-2xl font-bold tracking-tight">{t.solution}</h2>
                    <p className="text-base leading-relaxed text-muted-foreground">{cs.solution}</p>
                </div>
            </section>

            <section aria-labelledby="cs-result" className="py-12">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 id="cs-result" className="mb-4 text-2xl font-bold tracking-tight">{t.outcome}</h2>
                    <p className="rounded-xl border border-primary/20 bg-primary/5 px-6 py-5">
                        <span className="text-4xl font-extrabold text-primary">{cs.metric}</span>{" "}
                        <span className="text-base text-foreground/80">{cs.metricLabel}</span>
                    </p>
                    {cs.quote && (
                        <blockquote className="mt-8 border-l-2 border-primary pl-5">
                            <p className="text-base italic leading-relaxed text-foreground/90">„{cs.quote.text}”</p>
                            <footer className="mt-2 text-sm text-muted-foreground">
                                {cs.quote.author}, {cs.quote.role}
                            </footer>
                        </blockquote>
                    )}
                </div>
            </section>

            <section aria-labelledby="cs-services" className="bg-card/30 py-12">
                <div className="mx-auto max-w-3xl px-6">
                    <h2 id="cs-services" className="mb-4 text-xl font-bold tracking-tight">{t.services}</h2>
                    <ul className="flex flex-wrap gap-x-6 gap-y-2">
                        {CASE_STUDY_SERVICES[cs.id].map((key) => (
                            <li key={key}>
                                <Link href={SERVICE_PATHS[key][locale]!} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                                    {serviceLabel(locale, key)} <ArrowRight className="size-3.5" aria-hidden="true" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </section>

            <section aria-labelledby="cs-cta" className="py-20">
                <div className="mx-auto max-w-3xl px-6 text-center">
                    <h2 id="cs-cta" className="mb-4 text-3xl font-bold tracking-tight">{t.cta}</h2>
                    <p className="mx-auto mb-8 max-w-xl text-muted-foreground">{t.ctaText}</p>
                    <Link
                        href={t.contact}
                        className="inline-flex h-11 items-center gap-1 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90"
                    >
                        {t.ctaButton} <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </>
    );
}

/** Case-study hub body (/case-studies, /ro/studii-de-caz). */
export function CaseStudiesHub({ locale, items }: { locale: Locale; items: CaseStudy[] }) {
    const t = COPY[locale];
    return (
        <>
            <Breadcrumb items={[{ label: t.home, href: STATIC_PATHS.home[locale] }, { label: t.hub }]} />
            <PageHero eyebrow={t.hub} title={t.hubTitle} lead={t.hubLead} id="case-studies-hub-heading" />
            <section className="pb-24">
                <ul className="mx-auto grid max-w-5xl gap-6 px-6 md:grid-cols-3">
                    {items.map((cs) => (
                        <li key={cs.id}>
                            <Link
                                href={CASE_STUDY_PATHS[cs.id][locale]!}
                                className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30"
                            >
                                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">{cs.industry}</p>
                                <h2 className="mb-2 text-lg font-bold leading-snug group-hover:text-primary">{cs.headline}</h2>
                                <p className="mb-4 text-sm text-muted-foreground">{cs.client}</p>
                                <p className="mb-6 flex-1 text-sm">
                                    <span className="text-2xl font-extrabold text-primary">{cs.metric}</span> {cs.metricLabel}
                                </p>
                                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                                    {t.readCase} <ArrowRight className="size-4" aria-hidden="true" />
                                </span>
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </>
    );
}
