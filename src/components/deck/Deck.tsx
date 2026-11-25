"use client";

import { createContext, useContext, useEffect, useRef, useState } from "react";
import { DeckController, type SlideState } from "./deck-controller";
import { DeckNext } from "./DeckNext";
import { glideTo } from "./glide";
import { startPerfProbe } from "./perf-probe";

const DeckContext = createContext<DeckController | null>(null);

export function useDeck(): DeckController | null {
    return useContext(DeckContext);
}

export function useSlideState(ref: React.RefObject<HTMLElement | null>, listener: (state: SlideState) => void) {
    const deck = useDeck();
    const latest = useRef(listener);
    useEffect(() => {
        latest.current = listener;
    });
    useEffect(() => {
        const slide = ref.current?.closest<HTMLElement>("[data-slide]");
        if (!deck || !slide) return;
        return deck.observeSlide(slide, (state) => latest.current(state));
    }, [deck, ref]);
}

function focusSlide(el: HTMLElement) {
    if (!el.hasAttribute("tabindex")) el.tabIndex = -1;
    el.focus({ preventScroll: true });
}

export function Deck({ children }: { children: React.ReactNode }) {
    const rootRef = useRef<HTMLDivElement>(null);
    const [deck, setDeck] = useState<DeckController | null>(null);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const controller = new DeckController(root);
        setDeck(controller);
        startPerfProbe();

        const goToHash = (hash: string, smooth: boolean) => {
            const id = decodeURIComponent(hash.replace(/^#/, ""));
            const top = id ? controller.slideTop(id) : null;
            const el = id ? document.getElementById(id) : null;
            if (top === null || !el) return false;
            if (smooth) glideTo(top, () => focusSlide(el));
            else window.scrollTo(0, top);
            return true;
        };

        const onClick = (event: MouseEvent) => {
            if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
            const link = (event.target as HTMLElement | null)?.closest<HTMLAnchorElement>("a[href*='#']");
            if (!link) return;
            const url = new URL(link.href, window.location.href);
            if (url.origin !== window.location.origin || url.pathname !== window.location.pathname || !url.hash) return;
            if (!goToHash(url.hash, true)) return;
            event.preventDefault();
            history.replaceState(history.state, "", url.hash);
        };

        if (window.location.hash) requestAnimationFrame(() => goToHash(window.location.hash, false));
        document.addEventListener("click", onClick, true);
        return () => {
            document.removeEventListener("click", onClick, true);
            controller.destroy();
            setDeck(null);
        };
    }, []);

    return (
        <DeckContext.Provider value={deck}>
            <div ref={rootRef} data-deck>
                {children}
            </div>
            <DeckNext />
        </DeckContext.Provider>
    );
}
