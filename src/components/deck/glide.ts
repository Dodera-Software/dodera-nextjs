import { gsap } from "gsap";
import { MOTION } from "@/config/theme";

const INTERRUPTS = ["wheel", "touchstart", "keydown"] as const;

let active: gsap.core.Tween | null = null;
let target: number | null = null;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function listen(on: boolean, stop: (event: Event) => void) {
    for (const type of INTERRUPTS) {
        if (on) window.addEventListener(type, stop, { passive: true });
        else window.removeEventListener(type, stop);
    }
}

export function glidingTo(): number | null {
    return target;
}

export function glideTo(y: number, onDone?: () => void) {
    const top = Math.max(0, Math.min(y, document.documentElement.scrollHeight - window.innerHeight));
    const moving = active !== null;
    active?.kill();
    if (reducedMotion()) {
        window.scrollTo(0, top);
        onDone?.();
        return;
    }
    const state = { y: window.scrollY };
    const screens = Math.abs(top - state.y) / window.innerHeight;
    const { baseS, perScreenS, minS, maxS } = MOTION.glide;
    const finish = () => {
        listen(false, interrupt);
        active = null;
        target = null;
    };
    const interrupt = (event: Event) => {
        if (event instanceof KeyboardEvent && (event.target as HTMLElement | null)?.closest("[data-deck-next]")) return;
        active?.kill();
        finish();
    };
    target = top;
    if (!moving) listen(true, interrupt);
    active = gsap.to(state, {
        y: top,
        duration: Math.min(maxS, Math.max(minS, baseS + perScreenS * screens)),
        ease: moving ? "power2.out" : "power2.inOut",
        onUpdate: () => window.scrollTo(0, state.y),
        onComplete: () => {
            finish();
            onDone?.();
        },
    });
}
