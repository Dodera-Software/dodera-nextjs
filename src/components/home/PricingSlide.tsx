"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slide } from "@/components/deck/Slide";
import { HomeSlide } from "@/config/home";
import { useDict } from "@/i18n/LocaleProvider";
import { SlideHeading } from "@/components/slides/SlideHeading";

export function PricingSlide() {
    const { pricing: t, deck, links } = useDict();
    return (
        <Slide id={HomeSlide.Pricing} label={deck.slides.pricing} labelledBy="pricing-heading">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-[70%] bg-[radial-gradient(45%_60%_at_80%_0%,hsl(var(--brand)/0.16),transparent_70%)]" />
            <div className="wrap relative flex lg:min-h-[100svh] flex-col justify-center py-28">
                <SlideHeading id="pricing-heading" eyebrow={t.label} title={t.titleA} continuation={t.titleB} size="md" />
                <div className="mt-14 grid border-y border-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
                    {t.tiers.map((tier) => (
                        <article
                            key={tier.name}
                            className="reveal group flex flex-col border-foreground/10 py-8 transition-colors duration-500 hover:bg-foreground/[0.02] sm:px-7 sm:[&:nth-child(even)]:border-l lg:border-l lg:first:border-l-0 lg:first:pl-0"
                        >
                            <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{tier.name}</h3>
                            <p className="mt-2 text-sm font-medium text-brand-bright">{tier.tagline}</p>
                            <p className="display mt-8 text-[clamp(1.7rem,2.4vw,2.3rem)] leading-none">{tier.rate}</p>
                            <p className="mt-2 text-xs text-muted-foreground">{tier.rateSub}</p>
                            <p className="mt-6 text-sm leading-relaxed text-foreground/70">{tier.description}</p>
                            <ul className="mt-6 space-y-2.5 text-sm text-foreground/80">
                                {tier.includes.map((item) => (
                                    <li key={item} className="flex gap-3">
                                        <span className="mt-[0.6em] h-px w-3 shrink-0 bg-brand-bright" aria-hidden="true" />
                                        {item}
                                    </li>
                                ))}
                            </ul>
                            {tier.note && <p className="mt-auto pt-6 text-xs text-muted-foreground">{tier.note}</p>}
                        </article>
                    ))}
                </div>
                <div className="reveal mt-10 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <Button size="pill" asChild>
                        <Link href={links.contact}>
                            {t.getStarted}
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                    <p className="text-sm text-muted-foreground">
                        {t.notSure}{" "}
                        <Link href={links.contact} className="font-medium text-foreground underline decoration-brand-bright underline-offset-4">
                            {t.tellUs}
                        </Link>{" "}
                        {t.suggest}
                    </p>
                </div>
            </div>
        </Slide>
    );
}
