"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Breadcrumb } from "@/components/Breadcrumb";
import { Slide } from "@/components/deck/Slide";
import { DeckPage } from "@/components/slides/DeckPage";
import { SplitSlide } from "@/components/slides/SplitSlide";
import { CtaSlide } from "@/components/slides/CtaSlide";
import { SlideTone } from "@/config/ui";
import { PRODUCTS, type ProductId } from "@/config/products";
import { PRODUCT_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { ProductVisual } from "./ProductVisual";
import { FeatureMediaView } from "./FeatureMediaView";
import { AnalyticsEvent, CtaLocation } from "@/config/analytics";
import { trackAttrs } from "@/lib/analytics";

enum ProductSlide {
    Intro = "intro",
    Facts = "facts",
    Start = "start",
}

const featureId = (i: number) => `feature-${i + 1}`;

export function ProductPage({ id }: { id: ProductId }) {
    const { products, productPage: t, breadcrumb, links } = useDict();
    const locale = useLocale();
    const product = PRODUCTS.find((p) => p.id === id)!;
    const copy = products.items[id];
    const others = PRODUCTS.filter((p) => p.id !== id);
    const accent = { "--accent": product.accent } as React.CSSProperties;

    return (
        <DeckPage>
            <Slide id={ProductSlide.Intro} label={product.name} labelledBy="product-title" fit style={accent}>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(50%_70%_at_80%_40%,color-mix(in_oklab,var(--accent)_22%,transparent),transparent_70%),radial-gradient(40%_50%_at_0%_100%,hsl(var(--brand-deep)/0.12),transparent_70%)]" />
                <div className="grain" aria-hidden="true" />
                <div className="wrap relative pb-20 pt-32 lg:pb-28 lg:pt-40">
                    <Breadcrumb items={[{ label: breadcrumb.home, href: links.home }, { label: t.products, href: STATIC_PATHS.products[locale] }, { label: product.name }]} className="mb-10" />
                    <div className="grid items-center gap-14 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
                        <div>
                            <h1 id="product-title" className="display-lg">
                                {product.name}
                            </h1>
                            <p className="display-md mt-5 max-w-[18ch] text-gradient-brand">{copy.title}</p>
                            <p className="lede mt-7 max-w-[52ch]">{copy.lede}</p>
                            <div className="mt-10 flex flex-wrap gap-3">
                                <Button size="pill" asChild>
                                    <a href={product.url} target="_blank" rel="noopener" {...trackAttrs(AnalyticsEvent.ProductVisit, { product: product.id, location: CtaLocation.ProductHero })}>
                                        {copy.cta}
                                        <ArrowUpRight aria-hidden="true" />
                                    </a>
                                </Button>
                                <Button size="pill" variant="glass" asChild>
                                    <Link href={links.contact} {...trackAttrs(AnalyticsEvent.CtaClick, { location: CtaLocation.ProductHero })}>{t.talk}</Link>
                                </Button>
                            </div>
                        </div>
                        <ProductVisual product={product} name={`${product.name}: ${copy.title}`} />
                    </div>
                </div>
            </Slide>

            {copy.features.map((feature, i) => {
                const media = product.features[i];
                const flip = i % 2 === 1;
                return (
                    <Slide key={feature.title} id={featureId(i)} label={feature.title} labelledBy={`${featureId(i)}-title`} fit style={accent}>
                        <div aria-hidden="true" className={cn("pointer-events-none absolute inset-0", flip ? "bg-card/60" : "bg-[radial-gradient(45%_60%_at_75%_50%,color-mix(in_oklab,var(--accent)_14%,transparent),transparent_70%)]")} />
                        <div className="wrap relative grid items-center gap-12 py-24 lg:grid-cols-2 lg:gap-20 lg:py-32">
                            <div className={cn("reveal", flip && "lg:order-2")}>
                                <p className="eyebrow">
                                    <span className="eyebrow-dot" aria-hidden="true" />
                                    {padIndex(i + 1)} / {padIndex(copy.features.length)} · {t.featuresLabel}
                                </p>
                                <h2 id={`${featureId(i)}-title`} className="display-md mt-5 max-w-[18ch]">
                                    {feature.title}
                                </h2>
                                <p className="lede mt-6 max-w-[52ch]">{feature.body}</p>
                            </div>
                            {media && (
                                <div className="reveal">
                                    <FeatureMediaView media={media} product={product} alt={`${product.name}: ${feature.title}`} />
                                </div>
                            )}
                        </div>
                    </Slide>
                );
            })}

            <SplitSlide id={ProductSlide.Facts} label={t.factsTitle} eyebrow={product.name} title={t.factsTitle} tone={SlideTone.Glow}>
                <dl className="grid gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 sm:grid-cols-2 sm:[&>*:last-child:nth-child(odd)]:col-span-2">
                    {copy.facts.map((fact) => (
                        <div key={fact.label} className="reveal bg-background p-7">
                            <dt className="font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">{fact.label}</dt>
                            <dd className="mt-3 text-lg leading-snug text-foreground/90">{fact.value}</dd>
                        </div>
                    ))}
                </dl>
            </SplitSlide>

            <CtaSlide
                id={ProductSlide.Start}
                label={t.builtTitle(product.name)}
                title={t.builtTitle(product.name)}
                text={t.builtText(product.name)}
                action={{ label: t.builtCta, href: links.contact }}
                relatedTitle={t.moreTitle}
                related={others.map((p) => ({ label: p.name, href: PRODUCT_PATHS[p.id][locale]! }))}
            />
        </DeckPage>
    );
}
