import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { SplitSlide } from "@/components/slides/SplitSlide";
import { SlideTone } from "@/config/ui";
import { CtaSlide } from "@/components/slides/CtaSlide";
import { CASE_STUDY_SERVICES, type CaseStudy } from "@/config/case-studies";
import { SERVICE_PAGES } from "@/config/services";
import { SERVICE_PAGES_RO } from "@/config/services.ro";
import { getDictionary } from "@/i18n/dictionaries";
import { CASE_STUDY_PATHS, SERVICE_PATHS, STATIC_PATHS } from "@/i18n/paths";
import type { Locale } from "@/i18n/config";
import { padIndex } from "@/lib/format";

enum CaseSlide {
    Intro = "intro",
    Problem = "problem",
    Solution = "solution",
    Result = "result",
    Start = "start",
}

const SERVICE_DATA = { en: SERVICE_PAGES, ro: SERVICE_PAGES_RO } as const;

function Metric({ cs, size = "lg" }: { cs: CaseStudy; size?: "lg" | "xl" }) {
    return (
        <span className={size === "xl" ? "display block text-gradient-metal text-[clamp(6rem,14vw,13rem)] leading-[0.85]" : "display block text-gradient-metal text-[clamp(4rem,7vw,6.5rem)] leading-none"}>
            {cs.metric}
        </span>
    );
}

export function CaseStudyPage({ locale, caseStudy: cs }: { locale: Locale; caseStudy: CaseStudy }) {
    const { caseStudyPage: t, breadcrumb, links } = getDictionary(locale);
    const facts = [
        { label: t.client, value: cs.client },
        { label: t.stack, value: cs.tags.join(", ") },
        ...(cs.timeline ? [{ label: t.timeline, value: cs.timeline }] : []),
    ];
    const services = CASE_STUDY_SERVICES[cs.id].map((key) => ({ label: SERVICE_DATA[locale][key]?.heroLabel ?? key, href: SERVICE_PATHS[key][locale]! }));

    return (
        <DeckPage>
            <PageHeroSlide
                id={CaseSlide.Intro}
                label={cs.industry}
                title={cs.headline}
                description={t.lead(cs)}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: t.hub, href: STATIC_PATHS.caseStudies[locale] }, { label: cs.headline }]}
                aside={
                    <div className="glass reveal rounded-3xl p-8">
                        <p className="eyebrow">{t.result}</p>
                        <div className="mt-4">
                            <Metric cs={cs} />
                        </div>
                        <p className="mt-3 text-sm text-foreground/70">{cs.metricLabel}</p>
                        <dl className="mt-8 space-y-4 border-t border-foreground/10 pt-6 text-sm">
                            {facts.map((fact) => (
                                <div key={fact.label} className="grid grid-cols-[7rem_minmax(0,1fr)] gap-4">
                                    <dt className="font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">{fact.label}</dt>
                                    <dd className="text-foreground/85">{fact.value}</dd>
                                </div>
                            ))}
                        </dl>
                    </div>
                }
            />
            <SplitSlide id={CaseSlide.Problem} label={t.problem} title={t.problem} eyebrow={cs.headline} index={1} total={3}>
                <p className="lede reveal text-foreground/80">{cs.problem}</p>
            </SplitSlide>
            <SplitSlide id={CaseSlide.Solution} label={t.solution} title={t.solution} eyebrow={cs.headline} index={2} total={3} tone={SlideTone.Raised}>
                <p className="lede reveal text-foreground/80">{cs.solution}</p>
                <ul className="reveal mt-10 flex flex-wrap gap-2">
                    {cs.tags.map((tag) => (
                        <li key={tag} className="rounded-full border border-foreground/12 px-3.5 py-1.5 font-mono text-xs text-foreground/70">
                            {tag}
                        </li>
                    ))}
                </ul>
            </SplitSlide>
            <SplitSlide id={CaseSlide.Result} label={t.outcome} title={t.outcome} eyebrow={cs.headline} index={3} total={3} tone={SlideTone.Glow}>
                <div className="reveal">
                    <Metric cs={cs} size="xl" />
                    <p className="mt-4 max-w-[30ch] text-lg text-foreground/75">{cs.metricLabel}</p>
                </div>
                {cs.quote && (
                    <blockquote className="reveal mt-12 border-l-2 border-brand-bright pl-6">
                        <p className="text-lg leading-relaxed text-foreground/90">„{cs.quote.text}”</p>
                        <footer className="mt-3 text-sm text-muted-foreground">
                            {cs.quote.author}, {cs.quote.role}
                        </footer>
                    </blockquote>
                )}
            </SplitSlide>
            <CtaSlide id={CaseSlide.Start} label={t.cta} title={t.cta} text={t.ctaText} action={{ label: t.ctaButton, href: links.contact }} relatedTitle={t.services} related={services} />
        </DeckPage>
    );
}

export function CaseStudiesHub({ locale }: { locale: Locale }) {
    const { caseStudyPage: t, caseStudies, breadcrumb, links } = getDictionary(locale);
    return (
        <DeckPage>
            <PageHeroSlide
                id={CaseSlide.Intro}
                label={t.hub}
                title={t.hubTitle}
                highlight={t.hubHighlight}
                description={t.hubLead}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: t.hub }]}
            />
            {caseStudies.items.map((cs, i) => (
                <Slide key={cs.id} id={cs.id} label={cs.headline} labelledBy={`${cs.id}-title`} fit>
                    <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_55%_at_80%_50%,hsl(var(--brand)/0.13),transparent_70%)]" />
                    <div className="wrap relative grid content-start gap-12 py-24 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:items-center lg:gap-20 lg:py-32">
                        <div>
                            <p className="eyebrow reveal">
                                <span className="eyebrow-dot" aria-hidden="true" />
                                {padIndex(i + 1)} / {padIndex(caseStudies.items.length)} · {cs.industry}
                            </p>
                            <h2 id={`${cs.id}-title`} className="display-md reveal mt-6 max-w-[18ch]">
                                {cs.headline}
                            </h2>
                            <p className="reveal mt-4 text-sm text-muted-foreground">{cs.client}</p>
                            <p className="lede reveal mt-8 line-clamp-4">{cs.problem}</p>
                            <Link href={CASE_STUDY_PATHS[cs.id][locale]!} className="reveal group mt-10 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                                {t.readCase}
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                        </div>
                        <div className="reveal lg:text-right">
                            <Metric cs={cs} size="xl" />
                            <p className="mt-4 text-lg text-foreground/70 lg:ml-auto lg:max-w-[28ch]">{cs.metricLabel}</p>
                        </div>
                    </div>
                </Slide>
            ))}
            <CtaSlide id={CaseSlide.Start} label={t.cta} title={t.cta} text={t.ctaText} action={{ label: t.ctaButton, href: links.contact }} />
        </DeckPage>
    );
}
