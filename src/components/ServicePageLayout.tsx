"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Bot, BookOpen, Building2, Cloud, Globe, Rocket, Workflow } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { N8nIcon } from "@/components/icons/N8nIcon";
import type { BreadcrumbItem } from "@/components/Breadcrumb";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { SplitSlide } from "@/components/slides/SplitSlide";
import { SlideTone } from "@/config/ui";
import { BulletList } from "@/components/slides/BulletList";
import { FaqSlide } from "@/components/slides/FaqSlide";
import { CtaSlide } from "@/components/slides/CtaSlide";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { CASE_STUDY_PATHS } from "@/i18n/paths";
import type { ServicePageData } from "@/types";
import { AnalyticsEvent, CtaLocation } from "@/config/analytics";
import { trackAttrs } from "@/lib/analytics";

const ICON_MAP: Record<string, LucideIcon | React.ComponentType<{ className?: string }>> = {
    Bot,
    Workflow,
    Rocket,
    Building2,
    Cloud,
    BookOpen,
    Globe,
    N8nIcon,
};

enum ServiceSlide {
    Overview = "overview",
    SubServices = "subservices",
    Pricing = "pricing",
    CaseStudy = "case-study",
    Faq = "faq",
    Start = "start",
}

const sectionId = (i: number) => `section-${i + 1}`;

function highlightContent(content: string, highlights?: string[]) {
    if (!highlights?.length) return content;
    const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const split = new RegExp(`(${escaped.join("|")})`, "gi");
    const match = new RegExp(`^(?:${escaped.join("|")})$`, "i");
    return content.split(split).map((part, i) =>
        match.test(part) ? (
            <strong key={i} className="font-semibold text-foreground">
                {part}
            </strong>
        ) : (
            part
        ),
    );
}

export interface ServicePageLayoutProps {
    data: ServicePageData;
    parentLabel?: string;
    parentHref?: string;
    servicesHref?: string;
}

export function ServicePageLayout({ data, parentLabel, parentHref, servicesHref = "/services" }: ServicePageLayoutProps) {
    const { servicePage: t, breadcrumb, links, caseStudies } = useDict();
    const locale = useLocale();
    const caseStudy = data.caseStudy !== undefined ? caseStudies.items[data.caseStudy] : undefined;
    const caseStudyHref = caseStudy ? CASE_STUDY_PATHS[caseStudy.id]?.[locale] : undefined;
    const crumbs: BreadcrumbItem[] = [
        { label: breadcrumb.home, href: links.home },
        { label: breadcrumb.services, href: servicesHref },
        ...(data.parentSlug && parentLabel ? [{ label: parentLabel, href: parentHref ?? `/services/${data.parentSlug}` }] : []),
        { label: data.heroLabel },
    ];

    return (
        <DeckPage>
            <PageHeroSlide
                id={ServiceSlide.Overview}
                label={data.heroLabel}
                title={data.heroTitle}
                highlight={data.heroHighlight}
                description={data.heroDescription}
                breadcrumb={crumbs}
                actions={
                    <>
                        <Button size="pill" asChild>
                            <Link href={links.contact} {...trackAttrs(AnalyticsEvent.CtaClick, { location: CtaLocation.ServiceHero })}>
                                {t.discuss}
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                        {!data.parentSlug && (
                            <Button size="pill" variant="glass" asChild>
                                <Link href={links.process}>{t.ourProcess}</Link>
                            </Button>
                        )}
                    </>
                }
            />

            {data.sections.map((section, i) => (
                <SplitSlide
                    key={section.title}
                    id={sectionId(i)}
                    label={section.title}
                    title={section.title}
                    eyebrow={data.heroLabel}
                    index={i + 1}
                    total={data.sections.length}
                    tone={i % 2 === 1 ? SlideTone.Raised : SlideTone.Plain}
                >
                    <p className="lede reveal text-foreground/75">{highlightContent(section.content, section.highlights)}</p>
                    {section.bullets && <BulletList items={section.bullets} columns={section.bullets.length > 4 ? 2 : 1} className="mt-10" />}
                    {section.links && section.links.length > 0 && (
                        <ul className="reveal mt-10 flex flex-wrap gap-x-8 gap-y-3">
                            {section.links.map((l) => (
                                <li key={l.href}>
                                    <Link href={l.href} className="group inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                                        {l.label}
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </SplitSlide>
            ))}

            {data.childServices && data.childServices.length > 0 && (
                <SplitSlide id={ServiceSlide.SubServices} label={t.subServicesTitle(data.heroLabel)} title={t.subServicesTitle(data.heroLabel)} eyebrow={data.heroLabel} tone={SlideTone.Glow}>
                    <ul className="grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10">
                        {data.childServices.map((child) => {
                            const Icon = ICON_MAP[child.iconName] ?? Bot;
                            return (
                                <li key={child.href} className="reveal bg-background">
                                    <Link href={child.href} className="group grid grid-cols-[auto_minmax(0,1fr)_auto] items-start gap-6 p-7 transition-colors duration-500 hover:bg-card">
                                        <span className="grid size-12 place-items-center rounded-2xl border border-foreground/10 bg-brand/10">
                                            <Icon className="size-5 text-brand-bright" aria-hidden="true" />
                                        </span>
                                        <span>
                                            <span className="display block text-2xl leading-tight">{child.label}</span>
                                            <span className="mt-2 block text-sm leading-relaxed text-muted-foreground">{child.description}</span>
                                        </span>
                                        <ArrowUpRight className="size-5 text-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-bright" aria-hidden="true" />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </SplitSlide>
            )}

            {data.pricing && (
                <SplitSlide id={ServiceSlide.Pricing} label={t.pricingTitle} title={t.pricingTitle} eyebrow={data.heroLabel} tone={SlideTone.Raised}>
                    <p className="lede reveal">{data.pricing.intro}</p>
                    <dl className="mt-10 border-t border-foreground/10">
                        {data.pricing.items.map((item) => (
                            <div key={item.label} className="reveal flex flex-col gap-2 border-b border-foreground/10 py-6 sm:flex-row sm:items-baseline sm:justify-between sm:gap-10">
                                <dt className="text-base font-medium">
                                    {item.label}
                                    {item.note && <span className="mt-1 block text-sm font-normal text-muted-foreground">{item.note}</span>}
                                </dt>
                                <dd className="display shrink-0 text-2xl text-brand-bright">{item.price}</dd>
                            </div>
                        ))}
                    </dl>
                    {data.pricing.footnote && <p className="reveal mt-6 text-xs leading-relaxed text-muted-foreground">{data.pricing.footnote}</p>}
                </SplitSlide>
            )}

            {caseStudy && (
                <SplitSlide id={ServiceSlide.CaseStudy} label={t.caseStudyTitle} title={caseStudy.headline} eyebrow={`${t.caseStudyTitle} · ${caseStudy.industry}`} tone={SlideTone.Glow}>
                    <div className="reveal flex items-end gap-6">
                        <p className="display text-gradient-metal text-[clamp(4.5rem,9vw,8rem)] leading-none">{caseStudy.metric}</p>
                        <p className="max-w-[24ch] pb-3 text-sm text-foreground/70">{caseStudy.metricLabel}</p>
                    </div>
                    <div className="mt-12 grid gap-10 md:grid-cols-2">
                        <div className="reveal">
                            <h3 className="eyebrow">{t.caseStudyProblem}</h3>
                            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{caseStudy.problem}</p>
                        </div>
                        <div className="reveal">
                            <h3 className="eyebrow">{t.caseStudySolution}</h3>
                            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{caseStudy.solution}</p>
                        </div>
                    </div>
                    {caseStudyHref && (
                        <Link href={caseStudyHref} className="reveal group mt-10 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                            {t.readCaseStudy}
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                        </Link>
                    )}
                </SplitSlide>
            )}

            {data.faqs.length > 0 && <FaqSlide id={ServiceSlide.Faq} label={t.faqTitle} eyebrow={t.faqLabel} title={t.faqTitle} items={data.faqs} />}

            <CtaSlide
                id={ServiceSlide.Start}
                label={t.ctaTitle}
                title={t.ctaTitle}
                text={
                    <>
                        {t.ctaBefore} <strong className="font-semibold text-foreground">{t.ctaFree}</strong> {t.ctaAfter}
                    </>
                }
                action={{ label: t.startProject, href: links.contact }}
                relatedTitle={t.relatedTitle}
                related={data.relatedServices}
            />
        </DeckPage>
    );
}
