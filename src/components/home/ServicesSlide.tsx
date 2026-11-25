"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slide } from "@/components/deck/Slide";
import { HomeSlide } from "@/config/home";
import { padIndex } from "@/lib/format";
import { useDict } from "@/i18n/LocaleProvider";
import { SlideHeading } from "@/components/slides/SlideHeading";
import { AnalyticsEvent, CtaLocation } from "@/config/analytics";
import { trackAttrs } from "@/lib/analytics";


export function ServicesSlide() {
    const { services: t, deck, links } = useDict();
    return (
        <Slide id={HomeSlide.Services} label={deck.slides.services} labelledBy="services-heading">
            <div className="wrap grid lg:min-h-[100svh] content-center gap-14 py-28 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-20">
                <div className="flex flex-col justify-between gap-10">
                    <SlideHeading id="services-heading" eyebrow={t.label} title={t.titleA} continuation={t.titleB} lede={t.intro} size="md" />
                    <Button size="pill" asChild className="reveal self-start">
                        <Link href={links.contact} {...trackAttrs(AnalyticsEvent.CtaClick, { location: CtaLocation.HomeServices })}>
                            {t.cta}
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                </div>
                <ol className="border-t border-foreground/10">
                    {t.items.map((service, i) => (
                        <li key={service.href} className="reveal border-b border-foreground/10">
                            <Link
                                href={service.href}
                                aria-label={t.exploreAria(service.title)}
                                className="group relative grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-x-6 gap-y-2 py-7 sm:gap-x-10"
                            >
                                <span className="self-start pt-3 font-mono text-xs tabular-nums text-foreground/40 transition-colors group-hover:text-brand-bright">{padIndex(i + 1)}</span>
                                <span className="min-w-0">
                                    <span className="display block text-[clamp(1.6rem,3vw,2.9rem)] leading-none transition-transform duration-500 ease-out-expo group-hover:translate-x-2">
                                        {service.title}
                                    </span>
                                    <span className="mt-3 block text-sm text-muted-foreground">{service.subtitle}</span>
                                    <span className="mt-3 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[11px] uppercase tracking-[0.08em] text-foreground/35">
                                        {service.tags.map((tag) => (
                                            <span key={tag}>{tag}</span>
                                        ))}
                                    </span>
                                </span>
                                <span className="grid size-11 place-items-center rounded-full border border-foreground/15 transition-all duration-500 ease-out-expo group-hover:rotate-45 group-hover:border-brand group-hover:bg-brand">
                                    <ArrowUpRight className="size-4" aria-hidden="true" />
                                </span>
                                {service.image && (
                                    <span
                                        aria-hidden="true"
                                        className="pointer-events-none absolute right-20 top-1/2 hidden h-36 w-56 -translate-y-1/2 overflow-hidden rounded-xl opacity-0 shadow-2xl transition-all duration-500 ease-out-expo [clip-path:inset(30%_30%_30%_30%_round_12px)] group-hover:opacity-100 group-hover:[clip-path:inset(0_0_0_0_round_12px)] xl:block"
                                    >
                                        <Image src={service.image} alt="" fill sizes="224px" className="object-cover" />
                                    </span>
                                )}
                            </Link>
                        </li>
                    ))}
                </ol>
            </div>
        </Slide>
    );
}
