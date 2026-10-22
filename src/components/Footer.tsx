"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Globe, Mail, MapPin, Heart, Clock } from "lucide-react";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SocialIconList } from "@/components/SocialIconList";
import { COMPANY } from "@/config/site";
import { useDict } from "@/i18n/LocaleProvider";

export function Footer() {
    const { footer: t, links, breadcrumb } = useDict();
    const FOOTER_LINK_GROUPS = t.groups;
    return (
        <footer role="contentinfo">
            <Separator />

            <div className="mx-auto max-w-7xl px-6 py-16">
                <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-5">
                    {/* Brand */}
                    <div>
                        <div className="mb-4">
                            <Logo href={links.home} label={`Dodera Software - ${breadcrumb.home}`} />
                        </div>
                        <p className="mb-6 max-w-xs text-sm leading-relaxed text-muted-foreground">
                            {t.tagline}
                        </p>

                        <SocialIconList className="mb-6" />

                        <div className="space-y-3 text-sm">
                            <a
                                href={`mailto:${COMPANY.email}`}
                                aria-label={`${t.emailAria} ${COMPANY.email}`}
                                className="flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground"
                            >
                                <Mail className="size-4" />
                                {COMPANY.email}
                            </a>
                            <a
                                href={COMPANY.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label={`${t.visitAria} ${COMPANY.url}`}
                                className="flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground"
                            >
                                <Globe className="size-4" />
                                {COMPANY.url.replace("https://", "")}
                            </a>
                            <div className="flex items-center gap-2 text-foreground/70">
                                <MapPin className="size-4 shrink-0" />
                                {t.location}
                            </div>
                            {COMPANY.hours && (
                                <div className="flex items-center gap-2 text-foreground/70">
                                    <Clock className="size-4" />
                                    {COMPANY.hours}
                                </div>
                            )}
                            <div className="flex items-center gap-2 text-foreground/70">
                                <span>🏛️</span>
                                {t.foundedIn} {COMPANY.foundedYear}
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
                            {t.newsletterHeading}
                        </p>
                        <p className="mb-4 text-sm text-foreground/60">
                            {t.newsletterText}
                        </p>
                        <NewsletterForm />
                    </div>
                </div>
            </div>

            <Separator />

            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-6 py-6 sm:flex-row">
                <p className="text-xs text-muted-foreground">
                    &copy; {new Date().getFullYear()} {COMPANY.name}. {t.rights}
                </p>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                    {t.madeWith} <Heart className="size-3 animate-pulse fill-primary text-primary" aria-hidden="true" />
                    <span className="sr-only">{t.love}</span> {t.by}
                    {" "}<a href={COMPANY.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-foreground">{COMPANY.name}</a>
                </p>
            </div>
        </footer>
    );
}
