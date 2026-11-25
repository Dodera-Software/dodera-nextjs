import { LITE_CLASS, PERF } from "@/config/theme";

let started = false;

export function isLite(): boolean {
    return document.documentElement.classList.contains(LITE_CLASS);
}

export function startPerfProbe() {
    if (started || isLite()) return;
    started = true;
    window.setTimeout(() => {
        const frames: number[] = [];
        let last = performance.now();
        const tick = (now: number) => {
            frames.push(now - last);
            last = now;
            if (frames.length < PERF.probeFrames) {
                requestAnimationFrame(tick);
                return;
            }
            if (document.hidden) return;
            const median = [...frames].sort((a, b) => a - b)[Math.floor(frames.length / 2)];
            if (median > PERF.slowFrameMs) document.documentElement.classList.add(LITE_CLASS);
        };
        requestAnimationFrame(tick);
    }, PERF.probeDelayMs);
}
