/**
 * Shared Framer Motion animation variants.
 *
 * Import these instead of inlining `initial` / `animate` / `whileInView`
 * objects in every component. Keeps animation behaviour consistent and
 * changeable from one place.
 */

import type { Variants } from "framer-motion";

/** Fade-in and slide up - the default entrance animation. */
export const fadeInUp: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
};

/** Slightly larger slide for hero-sized elements. */
export const fadeInUpLg: Variants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0 },
};

/** Simple fade (no vertical translate). */
export const fadeIn: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

/**
 * Default viewport trigger options for `whileInView`.
 * `once: true` so the animation only fires the first time.
 */
export const viewportOnce = { once: true } as const;

/**
 * Helper to stagger children by index.
 * Usage: `transition={{ ...stagger(i) }}`
 */
export function stagger(index: number, base = 0.1) {
    return { delay: index * base, duration: 0.4 };
}
