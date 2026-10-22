import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import type { Service } from "@/types";

export interface ServicesIndexProps {
    services: Service[];
    labels: {
        home: string;
        breadcrumb: string;
        eyebrow: string;
        title: string;
        intro: string;
        subServices: string;
        learnMore: string;
        ctaTitle: string;
        ctaText: string;
        ctaButton: string;
    };
    homeHref: string;
    contactHref: string;
}

/**
 * Services overview (/services, /ro/servicii): every service hub with its
 * sub-pages, so the "Services" nav item has a real, crawlable destination.
 * Server component — no client JS.
 */
export function ServicesIndex({ services, labels, homeHref, contactHref }: ServicesIndexProps) {
    return (
        <>
            <Breadcrumb items={[{ label: labels.home, href: homeHref }, { label: labels.breadcrumb }]} />

            <section aria-labelledby="services-index-heading" className="relative pb-16 pt-32">
                <div className="absolute inset-0 grid-bg" />
                <div className="relative z-10 mx-auto max-w-4xl px-6 text-center">
                    <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {labels.eyebrow}
                    </p>
                    <h1 id="services-index-heading" className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl">
                        {labels.title}
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg leading-relaxed text-muted-foreground">
                        {labels.intro}
                    </p>
                </div>
            </section>

            <section className="relative pb-24">
                <div className="mx-auto grid max-w-6xl gap-6 px-6 md:grid-cols-2">
                    {services.map((s) => (
                        <article key={s.href} className="flex flex-col rounded-xl border border-border bg-card p-8 shadow-sm">
                            <div className="mb-6 flex size-12 items-center justify-center rounded-lg border border-border bg-primary/10">
                                <s.icon className="size-6 text-primary" aria-hidden="true" />
                            </div>
                            <h2 className="mb-1 text-2xl font-bold tracking-tight">
                                <Link href={s.href} className="transition-colors hover:text-primary">
                                    {s.title}
                                </Link>
                            </h2>
                            <p className="mb-4 text-sm text-muted-foreground">{s.subtitle}</p>
                            <p className="mb-6 flex-1 text-sm leading-relaxed text-muted-foreground">{s.description}</p>

                            {s.highlights.length > 0 && (
                                <>
                                    <h3 className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                        {labels.subServices}
                                    </h3>
                                    <ul className="mb-6 space-y-2">
                                        {s.highlights.map((h) => (
                                            <li key={h.href}>
                                                <Link href={h.href} className="text-sm text-foreground/80 transition-colors hover:text-primary">
                                                    {h.label}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </>
                            )}

                            <Link href={s.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                                {labels.learnMore}
                                <span className="sr-only">: {s.title}</span>
                                <ArrowRight className="size-4" aria-hidden="true" />
                            </Link>
                        </article>
                    ))}
                </div>
            </section>

            <section aria-labelledby="services-cta-heading" className="relative py-24">
                <div className="absolute inset-0 grid-bg" />
                <div className="relative z-10 mx-auto max-w-3xl px-6 text-center">
                    <h2 id="services-cta-heading" className="mb-6 text-3xl font-bold tracking-tight sm:text-4xl">
                        {labels.ctaTitle}
                    </h2>
                    <p className="mx-auto mb-8 max-w-xl text-lg leading-relaxed text-muted-foreground">{labels.ctaText}</p>
                    <Link
                        href={contactHref}
                        className="inline-flex h-11 items-center gap-1 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                    >
                        {labels.ctaButton}
                        <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                    </Link>
                </div>
            </section>
        </>
    );
}
