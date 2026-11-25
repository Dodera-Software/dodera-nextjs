export enum Theme {
    Light = "light",
    Dark = "dark",
}

export enum MotionMode {
    Full = "motion",
    Calm = "calm",
}

export const MOTION_QUERY = "(min-width: 1024px) and (prefers-reduced-motion: no-preference) and (hover: hover)";

export const WEBGL_CLASS = "webgl";

export const LITE_CLASS = "lite";

export const PERF = {
    liteCores: 4,
    liteMemoryGb: 4,
    probeFrames: 60,
    probeDelayMs: 1200,
    slowFrameMs: 24,
} as const;

export const MOTION = {
    ease: "cubic-bezier(0.65, 0, 0.35, 1)",
    easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
    glide: { baseS: 0.5, perScreenS: 0.28, minS: 0.65, maxS: 1.5 },
    follow: { durationS: 0.7 },
    cover: { scale: 0.93, dim: 0.55, radiusPx: 28 },
    stage: { screensPerStep: 1, leadScreens: 0.35 },
} as const;
