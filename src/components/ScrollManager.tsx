"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Handles scroll-to-hash navigation (e.g. /#contact, /#process).
 * On pathname change with no hash, scrolls to top.
 * On hash change, smoothly scrolls to the target element.
 */
export function ScrollManager() {
    const pathname = usePathname();

    useEffect(() => {
        const hash = window.location.hash;

        if (hash) {
            const timer = setTimeout(() => {
                const el = document.getElementById(hash.slice(1));
                if (el) {
                    el.scrollIntoView({ behavior: "smooth" });
                }
            }, 80);
            return () => clearTimeout(timer);
        }

        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
    }, [pathname]);

    return null;
}
