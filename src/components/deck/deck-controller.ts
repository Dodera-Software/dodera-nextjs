import { MOTION, MotionMode } from "@/config/theme";

export interface SlideState {
    progress: number;
    enter: number;
    exit: number;
    viewport: number;
}

export interface DeckStop {
    y: number;
    label: string;
    slideIndex: number;
}

type SlideListener = (state: SlideState) => void;
type DeckListener = () => void;

interface SlideBox {
    el: HTMLElement;
    inner: HTMLElement | null;
    veil: HTMLElement | null;
    top: number;
    height: number;
    stickyTop: number;
}

const clamp01 = (x: number) => Math.min(1, Math.max(0, x));

const REVEAL = { in: 0.5, out: 0.15, stepMs: 70, maxSteps: 8 } as const;

export const SLIDE_SELECTOR = "[data-slide]";

export function isMotionMode(): boolean {
    return document.documentElement.classList.contains(MotionMode.Full);
}

export class DeckController {
    private boxes: SlideBox[] = [];
    private stops: DeckStop[] = [];
    private slideListeners = new Map<HTMLElement, Set<SlideListener>>();
    private deckListeners = new Set<DeckListener>();
    private frame = 0;
    private viewport = 0;
    private motion = false;
    private needsMeasure = false;
    private resizeObserver: ResizeObserver;

    constructor(private readonly root: HTMLElement) {
        this.resizeObserver = new ResizeObserver(() => this.schedule(true));
        this.collect();
        window.addEventListener("scroll", this.onScroll, { passive: true });
        window.addEventListener("resize", this.onResize);
        this.measure();
        this.update();
    }

    destroy() {
        cancelAnimationFrame(this.frame);
        window.removeEventListener("scroll", this.onScroll);
        window.removeEventListener("resize", this.onResize);
        this.resizeObserver.disconnect();
        for (const box of this.boxes) {
            box.el.style.removeProperty("--slide-top");
            box.el.style.removeProperty("border-radius");
            box.el.removeAttribute("data-in");
            box.inner?.style.removeProperty("transform");
            box.inner?.style.removeProperty("transform-origin");
            box.veil?.style.removeProperty("opacity");
        }
        this.slideListeners.clear();
        this.deckListeners.clear();
    }

    observeSlide(el: HTMLElement, listener: SlideListener): () => void {
        const set = this.slideListeners.get(el) ?? new Set<SlideListener>();
        set.add(listener);
        this.slideListeners.set(el, set);
        this.schedule(false);
        return () => set.delete(listener);
    }

    observeDeck(listener: DeckListener): () => void {
        this.deckListeners.add(listener);
        return () => this.deckListeners.delete(listener);
    }

    getStops(): readonly DeckStop[] {
        return this.stops;
    }

    slideTop(id: string): number | null {
        const box = this.boxes.find((b) => b.el.id === id);
        return box ? box.top : null;
    }

    currentStopIndex(y = window.scrollY): number {
        let index = -1;
        for (let i = 0; i < this.stops.length; i++) {
            if (this.stops[i].y <= y + 8) index = i;
        }
        return index;
    }

    private collect() {
        this.resizeObserver.disconnect();
        this.boxes = [...this.root.querySelectorAll<HTMLElement>(SLIDE_SELECTOR)].map((el) => {
            this.resizeObserver.observe(el);
            el.querySelectorAll<HTMLElement>(".reveal").forEach((item, i) => {
                item.style.setProperty("--reveal-delay", `${Math.min(i, REVEAL.maxSteps) * REVEAL.stepMs}ms`);
            });
            return {
                el,
                inner: el.querySelector<HTMLElement>(":scope > [data-slide-inner]"),
                veil: el.querySelector<HTMLElement>(":scope > [data-slide-veil]"),
                top: 0,
                height: 0,
                stickyTop: 0,
            };
        });
    }

    private onScroll = () => this.schedule(false);

    private onResize = () => this.schedule(true);

    private schedule(remeasure: boolean) {
        if (remeasure) this.needsMeasure = true;
        if (this.frame) return;
        this.frame = requestAnimationFrame(() => {
            this.frame = 0;
            if (this.needsMeasure) {
                this.needsMeasure = false;
                this.measure();
            }
            this.update();
        });
    }

    private measure() {
        this.motion = isMotionMode();
        this.viewport = window.innerHeight;
        if (!this.boxes.length) return;
        let top = this.root.getBoundingClientRect().top + window.scrollY;
        for (const box of this.boxes) {
            box.height = box.el.offsetHeight;
            box.top = top;
            box.stickyTop = Math.min(0, this.viewport - box.height);
            if (this.motion) box.el.style.setProperty("--slide-top", `${box.stickyTop}px`);
            else box.el.style.removeProperty("--slide-top");
            top += box.height;
        }
        this.stops = this.boxes.flatMap((box, slideIndex) => {
            const label = box.el.dataset.label ?? "";
            const count = this.motion ? Number(box.el.dataset.stops ?? 1) : 1;
            const screens = Number(box.el.dataset.stopScreens ?? 1);
            const labels = box.el.dataset.stopLabels?.split("|") ?? [];
            return Array.from({ length: count }, (_, k) => ({
                y: Math.round(box.top + k * screens * this.viewport),
                label: labels[k] ?? label,
                slideIndex,
            }));
        });
        for (const listener of this.deckListeners) listener();
    }

    private update() {
        const y = window.scrollY;
        const vh = this.viewport || window.innerHeight;
        this.boxes.forEach((box, i) => {
            const scrollable = Math.max(1, box.height - vh);
            const state: SlideState = {
                progress: clamp01((y - box.top) / scrollable),
                enter: clamp01((y - (box.top - vh)) / vh),
                exit: clamp01((y - (box.top + box.height - Math.min(box.height, vh))) / Math.min(box.height, vh)),
                viewport: vh,
            };
            if (this.motion) {
                this.applyCover(box, this.boxes[i + 1], state.exit, vh);
                if (state.enter >= REVEAL.in) box.el.toggleAttribute("data-in", true);
                else if (state.enter <= REVEAL.out) box.el.toggleAttribute("data-in", false);
            }
            this.slideListeners.get(box.el)?.forEach((listener) => listener(state));
        });
        for (const listener of this.deckListeners) listener();
    }

    private applyCover(box: SlideBox, next: SlideBox | undefined, exit: number, vh: number) {
        if (!next) return;
        const t = exit * exit * (3 - 2 * exit);
        if (box.inner) {
            box.inner.style.transformOrigin = `50% ${-box.stickyTop + vh / 2}px`;
            box.inner.style.transform = t > 0 ? `scale(${1 - (1 - MOTION.cover.scale) * t})` : "";
        }
        if (box.veil) box.veil.style.opacity = (MOTION.cover.dim * t).toFixed(3);
        const radius = MOTION.cover.radiusPx * (1 - t);
        next.el.style.borderRadius = `${radius.toFixed(1)}px ${radius.toFixed(1)}px 0 0`;
    }
}
