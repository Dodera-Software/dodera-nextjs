"use client";

import { motion } from "framer-motion";
import { fadeInUp, viewportOnce } from "@/lib/animations";

interface SectionHeadingProps {
    /** Small uppercase label above the heading. */
    label: string;
    /** Main heading content - can include JSX (e.g. a <span> for colour). */
    children: React.ReactNode;
    /** Optional `id` placed on the <h2> (used by aria-labelledby). */
    id?: string;
    /** Extra wrapper className. */
    className?: string;
}

/**
 * Reusable animated section header.
 * Renders the label + h2 pattern used by Services, Process, CTA, etc.
 */
export function SectionHeading({
    label,
    children,
    id,
    className = "",
}: SectionHeadingProps) {
    return (
        <motion.div
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewportOnce}
            transition={{ duration: 0.5 }}
            className={`mb-16 text-center ${className}`}
        >
            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                {label}
            </p>
            <h2
                id={id}
                className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl"
            >
                {children}
            </h2>
        </motion.div>
    );
}
