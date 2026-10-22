"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Workflow, Rocket, Building2, Cloud, BookOpen, Globe } from "lucide-react";
import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { fadeInUp, fadeInUpLg, viewportOnce, stagger } from "@/lib/animations";
import type { ServicePageData } from "@/types";
import { N8nIcon } from "@/components/icons/N8nIcon";
import { Breadcrumb, BreadcrumbItem } from "@/components/Breadcrumb";
import { useDict } from "@/i18n/LocaleProvider";

/** Wraps matched keywords in a red/primary span for visual emphasis. */
function highlightContent(content: string, highlights?: string[]) {
    if (!highlights?.length) return content;
    const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const splitPattern = new RegExp(`(${escaped.join("|")})`, "gi");
    const testPattern = new RegExp(`^(?:${escaped.join("|")})$`, "i");
    return content.split(splitPattern).map((part, i) =>
        testPattern.test(part) ? (
            <span key={i} className="text-primary font-semibold">
                {part}
            </span>
        ) : (
            part
        )
    );
}

/** Map string names → icon components to keep config serialisable */
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

function resolveIcon(name: string) {
    return ICON_MAP[name] ?? Bot;
}

export interface ServicePageLayoutProps {
    data: ServicePageData;
    /** Parent service label and path, for the breadcrumb on child pages. */
    parentLabel?: string;
    parentHref?: string;
    /** Path of the services overview for the breadcrumb. */
    servicesHref?: string;
}

/**
 * Shared layout for all service pages.
 *
 * Renders a semantic, SEO-optimised page structure:
 * - Single H1 (hero)
 * - H2 content sections
 * - FAQ section with Schema.org markup (answers stay in the HTML
 *   while collapsed — FAQPage markup requires them to be on the page)
 * - Related services
 * - CTA
 */
export function ServicePageLayout({ data, parentLabel, parentHref, servicesHref = "/services" }: ServicePageLayoutProps) {
    const { servicePage: t, breadcrumb, links, caseStudies } = useDict();
    const caseStudy = data.caseStudy !== undefined ? caseStudies.items[data.caseStudy] : undefined;
    return (
        <>
            {/* ── Breadcrumb ──────────────────────────────────── */}
            {(() => {
                const crumbs: BreadcrumbItem[] = [
                    { label: breadcrumb.home, href: links.home },
                    { label: breadcrumb.services, href: servicesHref },
                ];
                if (data.parentSlug && parentLabel) {
                    crumbs.push({ label: parentLabel, href: parentHref ?? `/services/${data.parentSlug}` });
                }
                crumbs.push({ label: data.heroLabel });
                return <Breadcrumb items={crumbs} />;
            })()}

            {/* ── Hero ────────────────────────────────────────── */}
            <section aria-label={t.overviewAria} className="relative pb-20 pt-32">
                <div className="absolute inset-0 grid-bg" />

                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4 }}
                        className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground"
                    >
                        {data.heroLabel}
                    </motion.p>
                    <motion.h1
                        variants={fadeInUpLg}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.06 }}
                        className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl"
                    >
                        {data.heroTitle}{" "}
                        <span className="text-primary">{data.heroHighlight}</span>
                    </motion.h1>
                    <motion.p
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.12 }}
                        className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground"
                    >
                        {data.heroDescription}
                    </motion.p>
                    <motion.div
                        variants={fadeInUp}
                        initial="hidden"
                        animate="visible"
                        transition={{ duration: 0.4, delay: 0.18 }}
                        className="mt-8 flex flex-wrap justify-center gap-3"
                    >
                        <Button size="lg" asChild>
                            <Link href={links.contact}>
                                {t.discuss}
                                <ArrowRight className="ml-1 size-4" />
                            </Link>
                        </Button>
                        {!data.parentSlug && (
                            <Button variant="outline" size="lg" asChild>
                                <Link href={links.process}>{t.ourProcess}</Link>
                            </Button>
                        )}
                    </motion.div>
                </div>
            </section>

            {/* ── Content Sections ────────────────────────────── */}
            {data.sections.map((section, i) => (
                <section
                    key={section.title}
                    aria-labelledby={`section-${i}`}
                    className={`relative py-20 ${i % 2 === 0 ? "" : "bg-card/30"}`}
                >
                    <div className="mx-auto max-w-4xl px-6">
                        <motion.div
                            variants={fadeInUpLg}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={stagger(0)}
                        >
                            <h2
                                id={`section-${i}`}
                                className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl"
                            >
                                {section.title}
                            </h2>
                            <p className="mb-6 text-base leading-relaxed text-muted-foreground">
                                {highlightContent(section.content, section.highlights)}
                            </p>
                            {section.links && section.links.length > 0 && (
                                <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
                                    {section.links.map((l) => (
                                        <li key={l.href}>
                                            <Link href={l.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary underline-offset-4 hover:underline">
                                                {l.label}
                                                <ArrowRight className="size-3.5" aria-hidden="true" />
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            )}
                            {section.bullets && (
                                <ul className="space-y-3">
                                    {section.bullets.map((bullet) => (
                                        <li
                                            key={bullet}
                                            className="flex items-start gap-3 text-sm text-muted-foreground"
                                        >
                                            <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                                            {bullet}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </motion.div>
                    </div>
                </section>
            ))}

            {/* ── Child Services Showcase ─────────────────────── */}
            {data.childServices && data.childServices.length > 0 && (
                <section aria-labelledby="subservices-heading" className="relative py-20 bg-card/30">
                    <div className="mx-auto max-w-5xl px-6">
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            className="mb-12 text-center"
                        >
                            <h2
                                id="subservices-heading"
                                className="text-3xl font-bold tracking-tight sm:text-4xl"
                            >
                                {t.subServicesTitle(data.heroLabel)}
                            </h2>
                        </motion.div>

                        <div
                            className={`grid gap-6 ${data.childServices.length === 1
                                ? "max-w-lg mx-auto"
                                : data.childServices.length === 2
                                    ? "sm:grid-cols-2"
                                    : "sm:grid-cols-3"
                                }`}
                        >
                            {data.childServices.map((child, i) => {
                                const Icon = resolveIcon(child.iconName);
                                return (
                                    <motion.div
                                        key={child.href}
                                        variants={fadeInUpLg}
                                        initial="hidden"
                                        whileInView="visible"
                                        viewport={viewportOnce}
                                        transition={stagger(i)}
                                    >
                                        <Link
                                            href={child.href}
                                            className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 shadow-sm transition-all hover:border-primary/20 hover:shadow-md"
                                        >
                                            <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-border bg-primary/10">
                                                <Icon className="size-6 text-primary" />
                                            </div>
                                            <h3 className="mb-2 text-lg font-semibold group-hover:text-primary transition-colors">
                                                {child.label}
                                            </h3>
                                            <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">
                                                {child.description}
                                            </p>
                                            <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                                                {t.learnMore}
                                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                            </span>
                                        </Link>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </div>
                </section>
            )}

            {/* ── Pricing ─────────────────────────────────────── */}
            {data.pricing && (
                <section aria-labelledby="pricing-heading" className="relative py-20 bg-card/30">
                    <div className="mx-auto max-w-4xl px-6">
                        <h2 id="pricing-heading" className="mb-6 text-2xl font-bold tracking-tight sm:text-3xl">
                            {t.pricingTitle}
                        </h2>
                        <p className="mb-8 text-base leading-relaxed text-muted-foreground">{data.pricing.intro}</p>
                        <dl className="divide-y divide-border rounded-xl border border-border bg-card">
                            {data.pricing.items.map((item) => (
                                <div key={item.label} className="flex flex-col gap-1 p-5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                                    <dt className="text-sm font-medium text-foreground">
                                        {item.label}
                                        {item.note && <span className="mt-1 block text-xs font-normal text-muted-foreground">{item.note}</span>}
                                    </dt>
                                    <dd className="shrink-0 text-base font-bold text-primary">{item.price}</dd>
                                </div>
                            ))}
                        </dl>
                        {data.pricing.footnote && (
                            <p className="mt-4 text-xs leading-relaxed text-muted-foreground">{data.pricing.footnote}</p>
                        )}
                    </div>
                </section>
            )}

            {/* ── Case study ──────────────────────────────────── */}
            {caseStudy && (
                <section aria-labelledby="case-study-heading" className="relative py-20">
                    <div className="mx-auto max-w-4xl px-6">
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            {t.caseStudyTitle} · {caseStudy.industry}
                        </p>
                        <h2 id="case-study-heading" className="mb-2 text-2xl font-bold tracking-tight sm:text-3xl">
                            {caseStudy.headline}
                        </h2>
                        <p className="mb-8 text-sm text-muted-foreground">{caseStudy.client}</p>
                        <div className="grid gap-6 md:grid-cols-2">
                            <div>
                                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground/80">{t.caseStudyProblem}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{caseStudy.problem}</p>
                            </div>
                            <div>
                                <h3 className="mb-2 text-sm font-semibold uppercase tracking-wider text-foreground/80">{t.caseStudySolution}</h3>
                                <p className="text-sm leading-relaxed text-muted-foreground">{caseStudy.solution}</p>
                            </div>
                        </div>
                        <p className="mt-8 rounded-xl border border-primary/20 bg-primary/5 px-6 py-5 text-sm">
                            <span className="font-semibold text-foreground/80">{t.caseStudyResult}:</span>{" "}
                            <span className="text-2xl font-extrabold text-primary">{caseStudy.metric}</span>{" "}
                            <span className="text-foreground/80">{caseStudy.metricLabel}</span>
                        </p>
                    </div>
                </section>
            )}

            {/* ── FAQ Section ─────────────────────────────────── */}
            {data.faqs.length > 0 && (
                <section aria-labelledby="faq-heading" className="relative py-20">
                    <div className="relative z-10 mx-auto max-w-3xl px-6">
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            className="mb-12 text-center"
                        >
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                {t.faqLabel}
                            </p>
                            <h2
                                id="faq-heading"
                                className="text-3xl font-bold tracking-tight sm:text-4xl"
                            >
                                {t.faqTitle}
                            </h2>
                        </motion.div>

                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            transition={{ delay: 0.1 }}
                        >
                            <Accordion type="single" collapsible className="w-full">
                                {data.faqs.map((faq, i) => (
                                    <AccordionItem key={i} value={`faq-${i}`}>
                                        <AccordionTrigger className="text-left text-base font-medium">
                                            {faq.question}
                                        </AccordionTrigger>
                                        <AccordionContent forceMount className="text-sm leading-relaxed text-muted-foreground">
                                            {faq.answer}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </motion.div>
                    </div>
                </section>
            )}

            {/* ── Related Services ────────────────────────────── */}
            {data.relatedServices.length > 0 && (
                <section aria-labelledby="related-heading" className="py-20 bg-card/30">
                    <div className="mx-auto max-w-4xl px-6">
                        <motion.div
                            variants={fadeInUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={viewportOnce}
                            className="mb-10 text-center"
                        >
                            <h2
                                id="related-heading"
                                className="text-2xl font-bold tracking-tight sm:text-3xl"
                            >
                                {t.relatedTitle}
                            </h2>
                        </motion.div>

                        <div className="grid gap-4 sm:grid-cols-3">
                            {data.relatedServices.map((rs, i) => (
                                <motion.div
                                    key={rs.href}
                                    variants={fadeInUpLg}
                                    initial="hidden"
                                    whileInView="visible"
                                    viewport={viewportOnce}
                                    transition={stagger(i)}
                                >
                                    <Link
                                        href={rs.href}
                                        className="group flex items-center justify-between rounded-xl border border-border bg-card p-5 transition-colors hover:bg-accent/40"
                                    >
                                        <span className="text-sm font-medium">{rs.label}</span>
                                        <ArrowRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* ── CTA ─────────────────────────────────────────── */}
            <section aria-labelledby="cta-heading" className="relative py-24">
                <div className="absolute inset-0 grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                    <motion.div
                        variants={fadeInUpLg}
                        initial="hidden"
                        whileInView="visible"
                        viewport={viewportOnce}
                    >
                        <h2
                            id="cta-heading"
                            className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl"
                        >
                            {t.ctaTitle}
                        </h2>
                        <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">
                            {t.ctaBefore}{" "}<strong className="font-semibold text-primary">{t.ctaFree}</strong>{" "}{t.ctaAfter}
                        </p>
                        <Button size="lg" asChild>
                            <Link href={links.contact}>
                                {t.startProject}
                                <ArrowRight className="ml-1 size-4" />
                            </Link>
                        </Button>
                    </motion.div>
                </div>
            </section>
        </>
    );
}
