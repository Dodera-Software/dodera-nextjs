"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Slide } from "@/components/deck/Slide";
import { useDeck, useSlideState } from "@/components/deck/Deck";
import { isMotionMode } from "@/components/deck/deck-controller";
import { glideTo } from "@/components/deck/glide";
import { HomeSlide } from "@/config/home";
import { MOTION } from "@/config/theme";
import { PRODUCTS } from "@/config/products";
import { padIndex } from "@/lib/format";
import { useDict } from "@/i18n/LocaleProvider";
import { ProductVisual } from "./ProductVisual";

const COUNT = PRODUCTS.length;
const HOLD_SCREENS = 0.4;
const FADE = { hold: 0.12, span: 0.3 } as const;

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));
const smooth = (x: number) => {
    const t = clamp01(x);
    return t * t * (3 - 2 * t);
};

function hexToRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

const ACCENTS = PRODUCTS.map((p) => hexToRgb(p.accent));

interface StageNodes {
    frame: HTMLElement | null;
    captions: (HTMLElement | null)[];
    visuals: (HTMLElement | null)[];
    bar: HTMLElement | null;
}

function renderStage({ frame, captions, visuals, bar }: StageNodes, x: number) {
    if (!frame) return;
    PRODUCTS.forEach((_, i) => {
        const d = x - i;
        const away = Math.min(1, Math.abs(d));
        const shown = 1 - smooth((Math.abs(d) - FADE.hold) / FADE.span);
        const caption = captions[i];
        const visual = visuals[i];
        if (caption) {
            caption.style.opacity = shown.toFixed(3);
            caption.style.transform = `translate3d(0, ${(-d * 90).toFixed(1)}px, 0)`;
            caption.style.filter = away > 0.02 ? `blur(${(away * 12).toFixed(1)}px)` : "";
            caption.style.visibility = shown > 0.01 ? "visible" : "hidden";
        }
        if (visual) {
            visual.style.opacity = shown.toFixed(3);
            visual.style.transform = `translate3d(0, ${(-d * 38).toFixed(2)}%, ${(-away * 320).toFixed(0)}px) rotateX(${(d * 16).toFixed(2)}deg) rotateY(${(-6 + d * 4).toFixed(2)}deg) scale(${(1 - away * 0.1).toFixed(3)})`;
            visual.style.filter = away > 0.02 ? `blur(${(away * 10).toFixed(1)}px)` : "";
            visual.style.visibility = shown > 0.01 ? "visible" : "hidden";
        }
    });
    const lower = Math.max(0, Math.min(COUNT - 1, Math.floor(x)));
    const upper = Math.min(COUNT - 1, lower + 1);
    const f = clamp01(x - lower);
    const rgb = ACCENTS[lower].map((c, k) => Math.round(c + (ACCENTS[upper][k] - c) * f));
    frame.style.setProperty("--accent", rgb.join(" "));
    if (bar) bar.style.transform = `scaleX(${((x + 1) / COUNT).toFixed(4)})`;
}

export function ProductsSlide() {
    const { products: t, deck: deckCopy } = useDict();
    const deck = useDeck();
    const frameRef = useRef<HTMLDivElement>(null);
    const captionRefs = useRef<(HTMLDivElement | null)[]>([]);
    const visualRefs = useRef<(HTMLDivElement | null)[]>([]);
    const barRef = useRef<HTMLSpanElement>(null);
    const [active, setActive] = useState(0);
    const follow = useRef<((value: number) => void) | null>(null);

    useEffect(() => {
        if (!isMotionMode()) return;
        const nodes = (): StageNodes => ({ frame: frameRef.current, captions: captionRefs.current, visuals: visualRefs.current, bar: barRef.current });
        const state = { x: 0 };
        const onUpdate = () => {
            renderStage(nodes(), state.x);
            const nearest = Math.round(state.x);
            setActive((prev) => (prev === nearest ? prev : nearest));
        };
        const to = gsap.quickTo(state, "x", { duration: MOTION.follow.durationS, ease: "power3.out", onUpdate });
        follow.current = (value: number) => to(value);
        renderStage(nodes(), 0);
        return () => {
            follow.current = null;
            gsap.killTweensOf(state);
        };
    }, []);

    useSlideState(frameRef, ({ progress }) => {
        if (!follow.current) return;
        follow.current(Math.min(COUNT - 1, progress * (COUNT - 1 + HOLD_SCREENS)));
    });

    const goTo = (index: number) => {
        const top = deck?.slideTop(HomeSlide.Products);
        if (top === null || top === undefined) return;
        glideTo(top + (isMotionMode() ? index * window.innerHeight : 0));
    };

    return (
        <Slide
            id={HomeSlide.Products}
            label={deckCopy.slides.products}
            labelledBy="products-heading"
            stops={COUNT}
            stopScreens={1}
            stopLabels={PRODUCTS.map((p) => p.name)}
            className="products-stage"
            style={{ "--stage-screens": COUNT + HOLD_SCREENS } as React.CSSProperties}
        >
            <div ref={frameRef} className="products-frame relative overflow-hidden" style={{ "--accent": ACCENTS[0].join(" ") } as React.CSSProperties}>
                <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_70%_55%,rgb(var(--accent)/0.2),transparent_70%),radial-gradient(35%_40%_at_10%_10%,hsl(var(--brand)/0.1),transparent_70%)] transition-[background] duration-300" />
                <div className="grain" aria-hidden="true" />
                <div className="wrap relative flex h-full flex-col pb-24 pt-28">
                    <div className="flex items-end justify-between gap-10">
                    <header className="products-head max-w-[40rem]">
                        <p className="eyebrow">
                            <span className="eyebrow-dot" aria-hidden="true" />
                            {t.label}
                        </p>
                        <h2 id="products-heading" className="display-md two-tone mt-4">
                            {t.titleA} <em>{t.titleB}</em>
                        </h2>
                        <p className="lede mt-4 max-w-[52ch] text-base">{t.intro}</p>
                    </header>
                    <nav aria-label={t.railAria} className="products-rail hidden items-center gap-6 pb-2 lg:flex">
                        <span className="relative h-px w-32 overflow-hidden bg-foreground/15" aria-hidden="true">
                            <span ref={barRef} className="absolute inset-0 origin-left bg-foreground" style={{ transform: `scaleX(${1 / COUNT})` }} />
                        </span>
                        <ol className="flex gap-5 font-mono text-xs uppercase tracking-[0.08em]">
                            {PRODUCTS.map((product, i) => (
                                <li key={product.id}>
                                    <button
                                        type="button"
                                        onClick={() => goTo(i)}
                                        aria-current={active === i ? "step" : undefined}
                                        className={cn("transition-colors hover:text-foreground", active === i ? "text-foreground" : "text-foreground/40")}
                                    >
                                        {product.name}
                                    </button>
                                </li>
                            ))}
                        </ol>
                    </nav>
                    </div>

                    <div className="products-track relative mt-10 flex-1">
                        {PRODUCTS.map((product, i) => {
                            const copy = t.items[product.id];
                            return (
                                <article key={product.id} className="products-item" aria-labelledby={`product-${product.id}`}>
                                    <div ref={(el) => { captionRefs.current[i] = el; }} className="products-caption">
                                        <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground">
                                            <span className="tabular-nums text-foreground/50">
                                                {padIndex(i + 1)} / {padIndex(COUNT)}
                                            </span>
                                            <span className="size-1.5 rounded-full" style={{ background: product.accent, boxShadow: `0 0 12px ${product.accent}` }} aria-hidden="true" />
                                            {copy.kind}
                                        </p>
                                        <h3 id={`product-${product.id}`} className="mt-5 font-display text-[clamp(1rem,1.2vw,1.15rem)] font-semibold uppercase tracking-[0.14em] text-foreground/60">
                                            {product.name}
                                        </h3>
                                        <p className="display mt-3 max-w-[15ch] text-[clamp(1.9rem,3.3vw,3.4rem)] leading-[0.98]">{copy.title}</p>
                                        <p className="mt-5 max-w-[46ch] text-[0.98rem] leading-relaxed text-muted-foreground">{copy.lede}</p>
                                        <ul className="mt-6 space-y-2 text-sm text-foreground/80">
                                            {copy.points.map((point) => (
                                                <li key={point} className="flex gap-3">
                                                    <span className="mt-[0.6em] h-px w-3 shrink-0" style={{ background: product.accent }} aria-hidden="true" />
                                                    {point}
                                                </li>
                                            ))}
                                        </ul>
                                        <a
                                            href={product.url}
                                            target="_blank"
                                            rel="noopener"
                                            className="group mt-8 inline-flex items-center gap-2 border-b border-foreground/25 pb-1 text-sm font-semibold text-foreground transition-colors hover:border-foreground"
                                        >
                                            {copy.cta}
                                            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
                                        </a>
                                    </div>
                                    <div className="products-visual-wrap">
                                        <div ref={(el) => { visualRefs.current[i] = el; }} className="products-visual">
                                            <ProductVisual product={product} name={`${product.name}: ${copy.title}`} />
                                        </div>
                                    </div>
                                </article>
                            );
                        })}
                    </div>

                </div>
            </div>
        </Slide>
    );
}
