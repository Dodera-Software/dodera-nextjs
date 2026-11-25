"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slide } from "@/components/deck/Slide";
import { HomeSlide } from "@/config/home";
import { useDict } from "@/i18n/LocaleProvider";
import { HeroVisual } from "./HeroVisual";

export function HeroSlide() {
    const { hero: t, deck, links } = useDict();
    return (
        <Slide id={HomeSlide.Intro} label={deck.slides.intro} ariaLabel={t.ariaLabel}>
            <HeroVisual />
            <div className="wrap relative z-10 flex min-h-[100svh] flex-col justify-end pb-14 pt-32 lg:pb-24">
                <p className="eyebrow">
                    <span className="eyebrow-dot" aria-hidden="true" />
                    {t.eyebrow}
                </p>
                <h1 className="display-xl mt-7 max-w-[10.5ch] lg:max-w-[min(10.5ch,56%)]">
                    {t.titleA}{" "}
                    <span className="bg-gradient-to-r from-brand-bright via-brand-bright to-[hsl(20_100%_70%)] bg-clip-text pr-[0.04em] text-transparent">{t.titleB}</span>
                </h1>
                <div className="mt-10 grid items-end gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
                    <p className="lede max-w-[54ch]">{t.text}</p>
                    <div className="flex flex-wrap gap-3">
                        <Button size="pill" asChild>
                            <Link href={links.contact}>
                                {t.primaryCta}
                                <ArrowRight aria-hidden="true" />
                            </Link>
                        </Button>
                        <Button size="pill" variant="glass" asChild>
                            <Link href={`#${HomeSlide.Products}`}>{t.secondaryCta}</Link>
                        </Button>
                    </div>
                </div>
                <ul className="mt-12 grid gap-3 border-t border-foreground/10 pt-6 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground sm:grid-cols-3">
                    {t.facts.map((fact) => (
                        <li key={fact} className="flex items-center gap-2.5">
                            <span className="size-1 rounded-full bg-brand-bright" aria-hidden="true" />
                            {fact}
                        </li>
                    ))}
                </ul>
            </div>
        </Slide>
    );
}
