"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { HomeSlide } from "@/config/home";
import { CASE_STUDY_PATHS } from "@/i18n/paths";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { SlideHeading } from "@/components/slides/SlideHeading";

export function WorkSlide() {
    const { caseStudies: t, deck, links } = useDict();
    const locale = useLocale();
    return (
        <Slide id={HomeSlide.Work} label={deck.slides.work} labelledBy="work-heading">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_45%_at_20%_100%,hsl(var(--brand)/0.14),transparent_70%)]" />
            <div className="wrap relative flex lg:min-h-[100svh] flex-col justify-center py-28">
                <div className="flex flex-wrap items-end justify-between gap-6">
                    <SlideHeading id="work-heading" eyebrow={t.label} title={t.titleA} continuation={t.titleB} />
                    <Link href={links.caseStudies} className="reveal group inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                        {deck.slides.work}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                </div>
                <div className="mt-12 grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 lg:grid-cols-3">
                    {t.items.map((study) => {
                        const href = CASE_STUDY_PATHS[study.id]?.[locale];
                        return (
                            <article key={study.id} className="reveal group relative flex flex-col bg-background p-8 transition-colors duration-500 hover:bg-card lg:p-10">
                                <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-muted-foreground">{study.industry}</p>
                                <p className="display mt-6 bg-gradient-to-b from-foreground to-foreground/45 bg-clip-text text-[clamp(4rem,6.5vw,6.25rem)] leading-none text-transparent">
                                    {study.metric}
                                </p>
                                <p className="mt-3 max-w-[26ch] text-sm text-foreground/70">{study.metricLabel}</p>
                                <h3 className="mt-8 text-lg font-semibold leading-snug">{study.headline}</h3>
                                <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-muted-foreground">{study.problem}</p>
                                {href && (
                                    <Link href={href} className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-bright after:absolute after:inset-0">
                                        {t.readMore}
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                                    </Link>
                                )}
                            </article>
                        );
                    })}
                </div>
            </div>
        </Slide>
    );
}
