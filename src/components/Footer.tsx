"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, MapPin, Heart, Clock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SocialIconList } from "@/components/SocialIconList";
import { COMPANY, FOOTER_LINK_GROUPS } from "@/config/site";

export function Footer() {
    return (
        <footer role="contentinfo">
            <Separator />

            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div>
                        <div className="mb-4">
                            <Logo />
                        </div>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            {COMPANY.tagline}
                        </p>

                        <SocialIconList className="mb-6" />

                        <div className="space-y-3 text-sm">
                            <a
                                href={`mailto:${COMPANY.email}`}
                                aria-label={`Send us an email at ${COMPANY.email}`}
                                className="flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground"
                            >
                                <Mail className="size-4" />
                                {COMPANY.email}
                            </a>
                            <a
                                href={COMPANY.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`Visit ${COMPANY.url}`}
                                className="flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground"
                            >
                                <Globe className="size-4" />
                                {COMPANY.url.replace("https://", "")}
                            </a>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <MapPin className="size-4 shrink-0" />
                                {COMPANY.location}
                            </div>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <Clock className="size-4" />
                                {COMPANY.hours}
                            </div>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <span>🏛️</span>
                                Founded in {COMPANY.foundedYear}
                            </div>
                        </div>
                    </div>

                    {/* Link groups */}
                    {FOOTER_LINK_GROUPS.map((group) => (
                        <div key={group.heading}>
                            <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                {group.heading}
                            </p>
                            <ul className="space-y-2.5">
                                {group.links.map((l) => (
                                    <li key={l.label}>
                                        {l.href.startsWith("/") || l.href.startsWith("/#") ? (
                                            <Link
                                                href={l.href}
                                                className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                                            >
                                                {l.label}
                                            </Link>
                                        ) : (
                                            <a
                                                href={l.href}
                                                className="text-sm text-foreground/60 transition-colors hover:text-foreground"
                                            >
                                                {l.label}
                                            </a>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}

                    {/* Newsletter */}
                    <div>
                        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                            Newsletter
                        </p>
                        <p className="mb-4 text-sm text-foreground/60">
                            Updates &amp; insights, no spam.
                        </p>
                        <NewsletterForm />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    Made with <Heart className="size-3 animate-pulse fill-primary text-primary" /> by
                    {" "}<a href={COMPANY.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">{COMPANY.name}</a>
                </p>
            </div>
        </footer>
    );
}
