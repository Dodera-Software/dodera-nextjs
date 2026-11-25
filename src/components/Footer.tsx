"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/Logo";
import { NewsletterForm } from "@/components/NewsletterForm";
import { SocialIconList } from "@/components/SocialIconList";
import { COMPANY } from "@/config/site";
import { PRODUCTS } from "@/config/products";
import { SITE } from "@/config/seo";
import { useDict } from "@/i18n/LocaleProvider";

const linkClass = "text-sm text-foreground/60 transition-colors hover:text-foreground";
const headingClass = "font-mono text-xs uppercase tracking-[0.1em] text-muted-foreground";

export function Footer() {
    const { footer: t, links, breadcrumb } = useDict();
    return (
        <footer className="relative overflow-hidden border-t border-foreground/[0.08] bg-background">
            <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 bg-[radial-gradient(60%_70%_at_50%_100%,hsl(var(--brand)/0.16),transparent_70%)]" />
            <div className="wrap relative pt-24">
                <div className="flex flex-wrap items-end justify-between gap-8 border-b border-foreground/[0.08] pb-14">
                    <p className="display-md max-w-[18ch]">{t.cta}</p>
                    <Button size="pill" asChild>
                        <Link href={links.contact}>
                            {t.contactButton}
                            <ArrowRight aria-hidden="true" />
                        </Link>
                    </Button>
                </div>

                <div className="grid gap-14 py-16 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)]">
                    <div className="space-y-6">
                        <Logo href={links.home} label={`${SITE.name} - ${breadcrumb.home}`} />
                        <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">{t.tagline}</p>
                        <address className="space-y-3 text-sm not-italic text-foreground/70">
                            <p className="flex items-start gap-3">
                                <MapPin className="mt-0.5 size-4 shrink-0 text-brand-bright" aria-hidden="true" />
                                <span>
                                    {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}, {t.country}
                                    <a href={SITE.googleBusinessProfile ?? SITE.mapsUrl} target="_blank" rel="noopener noreferrer" className="block text-xs text-brand-bright hover:underline">
                                        {t.openInMaps}
                                    </a>
                                </span>
                            </p>
                            <a href={`tel:${SITE.phoneE164}`} aria-label={`${t.phoneLabel}: ${t.phoneDisplay}`} className="flex items-center gap-3 transition-colors hover:text-foreground">
                                <Phone className="size-4 text-brand-bright" aria-hidden="true" />
                                {t.phoneDisplay}
                            </a>
                            <a href={`mailto:${COMPANY.email}`} aria-label={`${t.emailAria} ${COMPANY.email}`} className="flex items-center gap-3 transition-colors hover:text-foreground">
                                <Mail className="size-4 text-brand-bright" aria-hidden="true" />
                                {COMPANY.email}
                            </a>
                        </address>
                        <SocialIconList />
                    </div>

                    <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
                        {t.groups.map((group) => (
                            <nav key={group.heading} aria-label={group.heading}>
                                <p className={headingClass}>{group.heading}</p>
                                <ul className="mt-5 space-y-3">
                                    {group.links.map((l) => (
                                        <li key={l.label}>
                                            <Link href={l.href} className={linkClass}>
                                                {l.label}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </nav>
                        ))}
                        <nav aria-label={t.productsHeading}>
                            <p className={headingClass}>{t.productsHeading}</p>
                            <ul className="mt-5 space-y-3">
                                {PRODUCTS.map((product) => (
                                    <li key={product.id}>
                                        <a href={product.url} target="_blank" rel="noopener" className={`group inline-flex items-center gap-1 ${linkClass}`}>
                                            {product.name}
                                            <ArrowUpRight className="size-3.5 opacity-50 transition-opacity group-hover:opacity-100" aria-hidden="true" />
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                        <div className="sm:col-span-2 lg:col-span-4">
                            <p className={headingClass}>{t.newsletterHeading}</p>
                            <p className="mt-3 text-sm text-foreground/60">{t.newsletterText}</p>
                            <div className="mt-4 max-w-md">
                                <NewsletterForm />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <p aria-hidden="true" className="display pointer-events-none relative -mb-[0.2em] select-none whitespace-nowrap text-center text-[clamp(5rem,21vw,20rem)] leading-[0.8] text-transparent [-webkit-text-stroke:1px_hsl(var(--foreground)/0.08)]">
                DODERA
            </p>

            <div className="relative border-t border-foreground/[0.08]">
                <div className="wrap flex flex-col items-center justify-between gap-3 py-6 font-mono text-[11px] uppercase tracking-[0.08em] text-muted-foreground sm:flex-row">
                    <p>
                        &copy; {new Date().getFullYear()} {COMPANY.legalName} {t.rights}
                    </p>
                    <p>
                        {t.location} · {t.foundedIn} {COMPANY.foundedYear}
                    </p>
                </div>
            </div>
        </footer>
    );
}
