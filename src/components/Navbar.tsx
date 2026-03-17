"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Menu, X } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { SocialIconList } from "@/components/SocialIconList";
import { SERVICES, NAV_LINKS } from "@/config/site";

export function Navbar() {
    const [megaOpen, setMegaOpen] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);
    const [mobileServiceOpen, setMobileServiceOpen] = useState<number | null>(null);
    const navRef = useRef<HTMLElement>(null);
    const megaCloseTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const openMega = useCallback(() => {
        if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
        setMegaOpen(true);
    }, []);

    const closeMega = useCallback(() => {
        megaCloseTimer.current = setTimeout(() => setMegaOpen(false), 120);
    }, []);

    useEffect(() => () => {
        if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current);
    }, []);

    useEffect(() => {
        if (!mobileOpen) return;
        function handleOutsideTouch(e: TouchEvent | MouseEvent) {
            if (navRef.current && !navRef.current.contains(e.target as Node)) {
                setMobileOpen(false);
            }
        }
        document.addEventListener("touchstart", handleOutsideTouch);
        document.addEventListener("mousedown", handleOutsideTouch);
        return () => {
            document.removeEventListener("touchstart", handleOutsideTouch);
            document.removeEventListener("mousedown", handleOutsideTouch);
        };
    }, [mobileOpen]);

    useEffect(() => {
        document.body.style.overflow = mobileOpen ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [mobileOpen]);

    return (
        <nav ref={navRef} aria-label="Main navigation" className="fixed inset-x-0 top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
            <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
                {/* Logo */}
                <Logo />

                {/* Desktop Nav */}
                <div className="hidden items-center gap-8 md:flex">
                    <div onMouseEnter={openMega} onMouseLeave={closeMega}>
                        <button className="flex items-center gap-1 text-sm font-medium text-foreground/70 transition-colors hover:text-foreground">
                            Services
                            <ChevronDown
                                className={`size-3.5 transition-transform ${megaOpen ? "rotate-180" : ""}`}
                            />
                        </button>
                    </div>

                    {NAV_LINKS.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-foreground/70 transition-colors hover:text-foreground"
                        >
                            {link.label}
                        </Link>
                    ))}

                    <SocialIconList size="sm" />

                    <Button size="sm" asChild>
                        <Link href="/#contact">Get Started</Link>
                    </Button>
                </div>

                {/* Mobile toggle */}
                <Button
                    variant="ghost"
                    size="icon"
                    className="md:hidden"
                    onClick={() => { setMobileOpen(!mobileOpen); setMobileServiceOpen(null); }}
                    aria-label={mobileOpen ? "Close menu" : "Open menu"}
                    aria-expanded={mobileOpen}
                >
                    {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
                </Button>
            </div>

            {/* Mega menu — full-width, anchored to bottom of nav bar */}
            <AnimatePresence>
                {megaOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -4 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -4 }}
                        transition={{ duration: 0.15 }}
                        onMouseEnter={openMega}
                        onMouseLeave={closeMega}
                        className="absolute inset-x-0 top-full z-40 hidden border-b border-border bg-background/95 shadow-xl backdrop-blur-xl md:block"
                    >
                        <div className="mx-auto max-w-7xl px-6 py-6">
                            <div className="grid grid-cols-2 items-start gap-x-8 gap-y-6 lg:grid-cols-4">
                                {SERVICES.map((s) => (
                                    <div key={s.title} className="flex flex-col items-start">
                                        <Link
                                            href={s.href}
                                            className="mb-3 flex items-start gap-2.5 group"
                                            onClick={() => setMegaOpen(false)}
                                        >
                                            <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                                                <s.icon className="size-4 text-primary" />
                                            </div>
                                            <div className="text-left">
                                                <p className="text-sm font-semibold group-hover:text-primary transition-colors">{s.title}</p>
                                                <p className="text-[11px] text-muted-foreground">{s.subtitle}</p>
                                            </div>
                                        </Link>
                                        <ul className="w-full space-y-1.5 pl-[42px]">
                                            {s.highlights.map((item) => (
                                                <li key={item.label}>
                                                    <Link
                                                        href={item.href}
                                                        onClick={() => setMegaOpen(false)}
                                                        className="text-xs text-muted-foreground transition-colors hover:text-foreground"
                                                    >
                                                        {item.label}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Mobile menu */}
            <AnimatePresence>
                {mobileOpen && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden border-t border-border/50 bg-card/95 backdrop-blur-xl md:hidden"
                    >
                        <div className="space-y-1 px-6 py-5">
                            <p className="mb-3 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
                                Services
                            </p>
                            {SERVICES.map((s, i) => (
                                <div key={s.title}>
                                    <div className="flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-accent">
                                        <Link
                                            href={s.href}
                                            onClick={() => setMobileOpen(false)}
                                            className="flex flex-1 items-center gap-3 text-sm text-muted-foreground hover:text-foreground"
                                        >
                                            <div className="flex size-8 items-center justify-center rounded-md bg-primary/10">
                                                <s.icon className="size-4 text-primary" />
                                            </div>
                                            <div>
                                                <span className="font-medium text-foreground">{s.title}</span>
                                                <p className="text-xs text-muted-foreground">{s.subtitle}</p>
                                            </div>
                                        </Link>
                                        <button
                                            onClick={() => setMobileServiceOpen(mobileServiceOpen === i ? null : i)}
                                            aria-label={mobileServiceOpen === i ? "Collapse subservices" : "Expand subservices"}
                                            className="ml-auto shrink-0 p-1 text-muted-foreground transition-colors hover:text-foreground"
                                        >
                                            <ChevronDown
                                                className={`size-4 transition-transform duration-200 ${mobileServiceOpen === i ? "rotate-180" : ""}`}
                                            />
                                        </button>
                                    </div>
                                    <AnimatePresence initial={false}>
                                        {mobileServiceOpen === i && (
                                            <motion.ul
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                                className="overflow-hidden pl-14"
                                            >
                                                {s.highlights.map((item) => (
                                                    <li key={item.label}>
                                                        <Link
                                                            href={item.href}
                                                            onClick={() => setMobileOpen(false)}
                                                            className="block rounded-lg px-3 py-2 text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                                        >
                                                            {item.label}
                                                        </Link>
                                                    </li>
                                                ))}
                                            </motion.ul>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}

                            <div className="my-3 h-px bg-border" />

                            {NAV_LINKS.map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href}
                                    onClick={() => setMobileOpen(false)}
                                    className="block rounded-lg px-3 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                                >
                                    {link.label}
                                </Link>
                            ))}

                            <div className="pt-3">
                                <Button className="w-full" size="sm" asChild>
                                    <Link href="/#contact" onClick={() => setMobileOpen(false)}>Get Started</Link>
                                </Button>
                            </div>

                            {/* Social Media Icons - Mobile */}
                            <div className="flex justify-center pt-4">
                                <SocialIconList />
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </nav>
    );
}
