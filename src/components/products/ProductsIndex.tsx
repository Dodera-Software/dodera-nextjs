"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slide } from "@/components/deck/Slide";
import { DeckPage } from "@/components/slides/DeckPage";
import { PageHeroSlide } from "@/components/slides/PageHeroSlide";
import { BulletList } from "@/components/slides/BulletList";
import { CtaSlide } from "@/components/slides/CtaSlide";
import { PRODUCTS } from "@/config/products";
import { PRODUCT_PATHS } from "@/i18n/paths";
import { padIndex } from "@/lib/format";
import { cn } from "@/lib/utils";
import { useDict, useLocale } from "@/i18n/LocaleProvider";
import { ProductVisual } from "./ProductVisual";
import { AnalyticsEvent, CtaLocation } from "@/config/analytics";
import { trackAttrs } from "@/lib/analytics";

enum IndexSlide {
    Intro = "intro",
    Start = "start",
}

export function ProductsIndex() {
    const { products, productPage: t, cta, nav, breadcrumb, links } = useDict();
    const locale = useLocale();

    return (
        <DeckPage>
            <PageHeroSlide
                id={IndexSlide.Intro}
                label={t.products}
                title={t.indexTitle}
                highlight={t.indexHighlight}
                description={t.indexLead}
                breadcrumb={[{ label: breadcrumb.home, href: links.home }, { label: t.products }]}
            />
            {PRODUCTS.map((product, i) => {
                const copy = products.items[product.id];
                const flip = i % 2 === 1;
                return (
                    <Slide key={product.id} id={product.id} label={product.name} labelledBy={`${product.id}-title`} fit style={{ "--accent": product.accent } as React.CSSProperties}>
                        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(45%_60%_at_75%_50%,color-mix(in_oklab,var(--accent)_18%,transparent),transparent_70%)]" />
                        <div className="wrap relative grid items-center gap-12 py-24 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20 lg:py-32">
                            <div className={cn("reveal", flip && "lg:order-2")}>
                                <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                                    <span className="tabular-nums text-foreground/50">
                                        {padIndex(i + 1)} / {padIndex(PRODUCTS.length)}
                                    </span>
                                    <span className="size-1.5 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" aria-hidden="true" />
                                    {copy.kind}
                                </p>
                                <h2 id={`${product.id}-title`} className="display-lg mt-5">
                                    {product.name}
                                </h2>
                                <p className="display-md mt-4 max-w-[18ch] text-foreground/75">{copy.title}</p>
                                <p className="lede mt-6 max-w-[52ch]">{copy.lede}</p>
                                <BulletList items={copy.points} className="mt-8" />
                                <div className="mt-10 flex flex-wrap gap-3">
                                    <Button size="pill" asChild>
                                        <Link href={PRODUCT_PATHS[product.id][locale]!} {...trackAttrs(AnalyticsEvent.ProductOpen, { product: product.id, location: CtaLocation.ProductsIndex })}>
                                            {t.learnMore}
                                            <ArrowRight aria-hidden="true" />
                                        </Link>
                                    </Button>
                                    <Button size="pill" variant="glass" asChild>
                                        <a href={product.url} target="_blank" rel="noopener" {...trackAttrs(AnalyticsEvent.ProductVisit, { product: product.id, location: CtaLocation.ProductsIndex })}>
                                            {product.domain.split("/")[0]}
                                            <ArrowUpRight aria-hidden="true" />
                                        </a>
                                    </Button>
                                </div>
                            </div>
                            <div className="reveal">
                                <ProductVisual product={product} name={`${product.name}: ${copy.title}`} />
                            </div>
                        </div>
                    </Slide>
                );
            })}
            <CtaSlide
                id={IndexSlide.Start}
                label={cta.titleA}
                title={`${cta.titleA} ${cta.titleB}`}
                text={`${cta.textBefore} ${cta.free} ${cta.textAfter}`}
                action={{ label: nav.getStarted, href: links.contact }}
            />
        </DeckPage>
    );
}
