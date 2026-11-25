"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Slide } from "@/components/deck/Slide";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { CtaSlide } from "@/components/slides/CtaSlide";
import { padIndex } from "@/lib/format";
import { useDict } from "@/i18n/LocaleProvider";

const INTRO_ID = "services";
const CTA_ID = "start";

export function ServicesIndex() {
    const { servicesIndex: t, services, breadcrumb, links } = useDict();
    return (
        <DeckPage>
            <PageHeroSlide
                id={INTRO_ID}
                label={t.eyebrow}
                title={t.title}
                highlight={t.highlight}
                description={t.intro}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: breadcrumb.services }]}
            />
            {services.items.map((service, i) => (
                <Slide key={service.href} id={service.href.split("/").pop() ?? `service-${i}`} label={service.title} labelledBy={`service-${i}-title`}>
                    {service.image && (
                        <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 right-0 hidden w-[46%] lg:block">
                            <Image src={service.image} alt="" fill sizes="46vw" className="object-cover opacity-50 [mask-image:linear-gradient(to_right,transparent,black_45%)]" />
                            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/40 to-background/10" />
                        </div>
                    )}
                    <span aria-hidden="true" className="display pointer-events-none absolute -bottom-[0.12em] left-[2vw] select-none text-[clamp(10rem,28vw,26rem)] leading-none text-foreground/[0.035]">
                        {padIndex(i + 1)}
                    </span>
                    <div className="wrap relative flex flex-col pb-28 pt-24 lg:min-h-[100svh] lg:pt-32">
                        <div className="max-w-2xl">
                            <p className="eyebrow reveal">
                                <span className="eyebrow-dot" aria-hidden="true" />
                                {padIndex(i + 1)} / {padIndex(services.items.length)} · {service.subtitle}
                            </p>
                            <h2 id={`service-${i}-title`} className="display-lg reveal mt-6">
                                <Link href={service.href} className="transition-colors hover:text-brand-bright">
                                    {service.title}
                                </Link>
                            </h2>
                            <p className="lede reveal mt-8">{service.description}</p>
                            <p className="reveal mt-6 flex flex-wrap gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-[0.1em] text-foreground/40">
                                {service.tags.map((tag) => (
                                    <span key={tag}>{tag}</span>
                                ))}
                            </p>
                            {service.highlights.length > 0 && (
                                <div className="reveal mt-10">
                                    <h3 className="eyebrow">{t.subServices}</h3>
                                    <ul className="mt-4 border-t border-foreground/10">
                                        {service.highlights.map((h) => (
                                            <li key={h.href} className="border-b border-foreground/10">
                                                <Link href={h.href} className="group flex items-center justify-between gap-4 py-4 text-lg font-medium">
                                                    {h.label}
                                                    <ArrowUpRight className="size-5 text-foreground/40 transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-bright" aria-hidden="true" />
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                            <Link href={service.href} className="reveal group mt-10 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold hover:border-foreground">
                                {t.learnMore}
                                <span className="sr-only">: {service.title}</span>
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
                            </Link>
                        </div>
                    </div>
                </Slide>
            ))}
            <CtaSlide id={CTA_ID} label={t.ctaTitle} title={t.ctaTitle} text={t.ctaText} action={{ label: t.ctaButton, href: links.contact }} />
        </DeckPage>
    );
}
