"use client";

import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDict } from "@/i18n/LocaleProvider";
import { useDeck } from "./Deck";
import { glideTo, glidingTo } from "./glide";
import { AnalyticsEvent } from "@/config/analytics";
import { trackAttrs } from "@/lib/analytics";

interface NextTarget {
    index: number;
    total: number;
    label: string;
    y: number;
}

const FORM_FIELDS = "input, textarea, select, [contenteditable='true']";
const HERO_EXIT_SHARE = 0.5;

export function DeckNext() {
    const deck = useDeck();
    const t = useDict().deck;
    const [target, setTarget] = useState<NextTarget | null>(null);
    const [typing, setTyping] = useState(false);
    const [inHero, setInHero] = useState(true);

    useEffect(() => {
        if (!deck) return;
        const refresh = () => {
            const stops = deck.getStops();
            if (!stops.length) return setTarget(null);
            setInHero(stops.length > 1 && window.scrollY < stops[1].y * HERO_EXIT_SHARE);
            const heading = glidingTo();
            const from = heading === null ? deck.currentStopIndex() : stops.findIndex((s) => Math.abs(s.y - heading) < 2);
            const index = from + 1;
            const atEnd = index >= stops.length;
            const next: NextTarget = atEnd
                ? { index: stops.length, total: stops.length, label: t.backToTop, y: 0 }
                : { index: index + 1, total: stops.length, label: stops[index].label, y: stops[index].y };
            setTarget((prev) => (prev && prev.index === next.index && prev.y === next.y && prev.label === next.label ? prev : next));
        };
        refresh();
        return deck.observeDeck(refresh);
    }, [deck, t.backToTop]);

    useEffect(() => {
        const update = () => setTyping(Boolean((document.activeElement as HTMLElement | null)?.matches?.(FORM_FIELDS)));
        document.addEventListener("focusin", update);
        document.addEventListener("focusout", update);
        return () => {
            document.removeEventListener("focusin", update);
            document.removeEventListener("focusout", update);
        };
    }, []);

    if (!target) return null;
    const atEnd = target.index === target.total && target.y === 0;
    const hidden = typing || inHero;

    return (
        <button
            type="button"
            data-deck-next
            {...trackAttrs(AnalyticsEvent.DeckNext, { to: atEnd ? "top" : target.index })}
            onClick={() => glideTo(target.y)}
            tabIndex={hidden ? -1 : undefined}
            aria-hidden={hidden || undefined}
            aria-label={atEnd ? t.backToTopAria : t.nextAria(target.label, target.index, target.total)}
            className={cn(
                "glass group fixed bottom-6 left-1/2 z-40 hidden h-11 -translate-x-1/2 items-center gap-3 rounded-full pl-5 pr-3 font-mono text-xs tracking-wide text-foreground/70 shadow-[0_18px_40px_-16px_rgb(0_0_0/0.8)] transition-[opacity,transform,color,border-color] duration-500 ease-out-expo hover:border-foreground/25 hover:text-foreground lg:inline-flex",
                hidden && "pointer-events-none translate-y-3 opacity-0",
            )}
        >
            <span aria-hidden="true" className="text-foreground/45">
                {atEnd ? "" : `${t.next} ·`}
            </span>
            <span aria-hidden="true" className="max-w-[16rem] truncate text-foreground/90">
                {target.label}
            </span>
            {!atEnd && (
                <span aria-hidden="true" className="tabular-nums text-foreground/40">
                    {target.index} / {target.total}
                </span>
            )}
            <span aria-hidden="true" className="grid size-7 place-items-center rounded-full bg-foreground/[0.08] transition-colors group-hover:bg-brand group-hover:text-white">
                <ChevronDown className={cn("size-4 transition-transform duration-500", atEnd ? "rotate-180" : "motion-safe:animate-[nudge_2.4s_var(--ease)_infinite] group-hover:animate-none")} />
            </span>
        </button>
    );
}
