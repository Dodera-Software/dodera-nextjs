"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { FounderSection } from "@/components/FounderSection";
import { PricingSlide } from "@/components/home/PricingSlide";
import { ContactSlide } from "@/components/home/ContactSlide";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { SplitSlide } from "@/components/slides/SplitSlide";
import { FaqSlide } from "@/components/slides/FaqSlide";
import { SlideTone } from "@/config/ui";
import { SITE } from "@/config/seo";
import { SERVICE_PATHS } from "@/i18n/paths";
import { padIndex } from "@/lib/format";
import { useDict, useLocale } from "@/i18n/LocaleProvider";

enum AboutSlide {
    Intro = "intro",
    Story = "story",
    Founder = "founder",
    Values = "values",
    Capabilities = "capabilities",
    Faq = "faq",
}

export function AboutPage() {
    const { about: t, breadcrumb, links } = useDict();
    const locale = useLocale();

    return (
        <DeckPage>
            <PageHeroSlide
                id={AboutSlide.Intro}
                label={t.eyebrow}
                title={t.title}
                highlight={t.highlight}
                description={t.lead}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: t.eyebrow }]}
                aside={
                    <dl className="reveal grid grid-cols-3 gap-4 border-y border-foreground/10 lg:grid-cols-1 lg:border-y-0 lg:border-l lg:pl-10">
                        {t.stats.map((stat) => (
                            <div key={stat.label} className="flex flex-col-reverse gap-2 py-6">
                                <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{stat.label}</dt>
                                <dd className="display text-[clamp(1.4rem,4vw,3.5rem)] leading-none">{stat.value}</dd>
                            </div>
                        ))}
                    </dl>
                }
            />

            <SplitSlide id={AboutSlide.Story} label={t.storyLabel} eyebrow={t.storyLabel} title={t.storyTitle}>
                <div className="space-y-6">
                    {t.story.map((paragraph) => (
                        <p key={paragraph} className="lede reveal text-foreground/75">
                            {paragraph}
                        </p>
                    ))}
                </div>
            </SplitSlide>

            {SITE.founder && (
                <Slide id={AboutSlide.Founder} label={SITE.founder.name} fit>
                    <div className="wrap py-24 lg:py-32">
                        <FounderSection locale={locale} />
                    </div>
                </Slide>
            )}

            <SplitSlide id={AboutSlide.Values} label={t.valuesLabel} eyebrow={t.valuesLabel} title={t.valuesTitle} tone={SlideTone.Raised}>
                <ol className="grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2">
                    {t.values.map((value, i) => (
                        <li key={value.title} className="reveal bg-card p-8">
                            <span className="font-mono text-xs text-brand-bright">{padIndex(i + 1)}</span>
                            <h3 className="display mt-6 text-2xl leading-tight">{value.title}</h3>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{value.body}</p>
                        </li>
                    ))}
                </ol>
            </SplitSlide>

            <SplitSlide id={AboutSlide.Capabilities} label={t.capabilitiesLabel} eyebrow={t.capabilitiesLabel} title={t.capabilitiesTitle} tone={SlideTone.Glow}>
                <ul className="border-t border-foreground/10">
                    {t.capabilities.map((capability) => {
                        const href = capability.service ? SERVICE_PATHS[capability.service]?.[locale] : undefined;
                        const body = (
                            <>
                                <span className="min-w-0">
                                    <span className="block text-lg font-semibold">{capability.title}</span>
                                    <span className="mt-1 block text-sm leading-relaxed text-muted-foreground">{capability.description}</span>
                                    <span className="mt-2 flex flex-wrap gap-x-3 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/35">
                                        {capability.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </span>
                                </span>
                                {href && <ArrowUpRight className="mt-1 size-5 shrink-0 text-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-bright" aria-hidden="true" />}
                            </>
                        );
                        return (
                            <li key={capability.title} className="reveal border-b border-foreground/10">
                                {href ? (
                                    <Link href={href} className="group flex items-start justify-between gap-6 py-5">
                                        {body}
                                    </Link>
                                ) : (
                                    <div className="flex items-start justify-between gap-6 py-5">{body}</div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            </SplitSlide>

            <PricingSlide />

            <FaqSlide id={AboutSlide.Faq} label={t.faqTitle} eyebrow={t.faqLabel} title={t.faqTitle} items={t.faq} />

            <ContactSlide />
        </DeckPage>
    );
}
