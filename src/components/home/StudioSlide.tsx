"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { HomeSlide } from "@/config/home";
import { COMPANY, TECH_STACK } from "@/config/site";
import { useDict } from "@/i18n/LocaleProvider";
import { SlideHeading } from "@/components/slides/SlideHeading";

function Column({ label, items }: { label: string; items: readonly string[] }) {
    return (
        <div className="reveal">
            <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{label}</h3>
            <ul className="mt-5 space-y-3 text-lg text-foreground/85">
                {items.map((item) => (
                    <li key={item}>{item}</li>
                ))}
            </ul>
        </div>
    );
}

export function StudioSlide() {
    const { studio: t, deck, links } = useDict();
    return (
        <Slide id={HomeSlide.Studio} label={deck.slides.studio} labelledBy="studio-heading">
            <div className="wrap relative grid lg:min-h-[100svh] content-center gap-16 py-28 lg:grid-cols-[minmax(0,6fr)_minmax(0,6fr)] lg:gap-20">
                <div className="flex flex-col">
                    <SlideHeading id="studio-heading" eyebrow={t.label} title={t.titleA} continuation={t.titleB} lede={t.text} size="md" />
                    <div className="reveal mt-10 flex items-end gap-6">
                        <p className="display text-gradient-ember text-[clamp(4rem,8vw,7rem)] leading-[0.8]">{COMPANY.foundedYear}</p>
                        <p className="pb-2 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                            {t.foundedLabel}
                            <br />
                            {COMPANY.legalName}
                        </p>
                    </div>
                    <Link href={links.about} className="reveal group mt-10 inline-flex items-center gap-2 self-start border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                        {t.aboutCta}
                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                    </Link>
                </div>
                <div className="grid content-center gap-12 sm:grid-cols-2">
                    <Column label={t.disciplinesLabel} items={t.disciplines} />
                    <Column label={t.industriesLabel} items={t.industries} />
                    <div className="reveal sm:col-span-2">
                        <h3 className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{t.stackLabel}</h3>
                        <ul className="mt-5 flex flex-wrap gap-2">
                            {TECH_STACK.map((tech) => (
                                <li key={tech} className="rounded-full border border-foreground/12 px-3.5 py-1.5 font-mono text-xs text-foreground/70">
                                    {tech}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </div>
        </Slide>
    );
}
