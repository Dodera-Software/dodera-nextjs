import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Video } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero, ProseSection, FaqList } from "@/components/PageHero";
import { CaseStudyBlock } from "@/components/CaseStudyBlock";
import { LOCATIONS_RO, getLocation } from "@/config/locations.ro";
import { SITE } from "@/config/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { STATIC_PATHS, locationPath } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";

export function generateStaticParams() {
    return LOCATIONS_RO.map((l) => ({ oras: l.slug }));
}

export const dynamicParams = false;

type PageProps = { params: Promise<{ oras: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const loc = getLocation((await params).oras);
    if (!loc) return {};
    return {
        title: loc.metaTitle,
        description: loc.metaDescription,
        alternates: alternatesFor(`location:${loc.slug}`, "ro"),
        openGraph: {
            title: loc.metaTitle,
            description: loc.metaDescription,
            url: absoluteUrl(locationPath(loc.slug)),
            type: "website",
            siteName: SITE.name,
            images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
        },
    };
}

export default async function LocationPageRo({ params }: PageProps) {
    const loc = getLocation((await params).oras);
    if (!loc) notFound();

    const dict = getDictionary("ro");
    const caseStudy = loc.caseStudy !== undefined ? dict.caseStudies.items[loc.caseStudy] : undefined;
    const url = absoluteUrl(locationPath(loc.slug));
    const others = LOCATIONS_RO.filter((l) => l.slug !== loc.slug);

    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Locații", url: absoluteUrl(STATIC_PATHS.locations.ro) },
                        { name: loc.city, url },
                    ]),
                    serviceSchema({
                        name: `Dezvoltare software și site-uri în ${loc.city}`,
                        description: loc.metaDescription,
                        url,
                        serviceType: "Dezvoltare software",
                        city: { name: loc.city, county: loc.county },
                    }),
                    faqSchema(loc.faqs),
                ]}
            />
            <Navbar />
            <main>
                <Breadcrumb
                    items={[
                        { label: "Acasă", href: "/ro" },
                        { label: "Locații", href: STATIC_PATHS.locations.ro },
                        { label: loc.city },
                    ]}
                />
                <PageHero eyebrow={loc.eyebrow} title={loc.h1} lead={loc.lead} id="location-heading">
                    <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm text-muted-foreground">
                        {loc.inPerson ? (
                            <><MapPin className="size-4 text-primary" aria-hidden="true" /> Întâlniri față în față, la biroul din Satu Mare</>
                        ) : (
                            <><Video className="size-4 text-primary" aria-hidden="true" /> Colaborare de la distanță, cu demo săptămânal</>
                        )}
                    </p>
                </PageHero>

                <ProseSection id="cum-lucram" title={loc.howWeWork.title}>
                    {loc.howWeWork.paragraphs.map((p) => <p key={p}>{p}</p>)}
                </ProseSection>

                <ProseSection id="context-local" title={loc.localContext.title} muted>
                    {loc.localContext.paragraphs.map((p) => <p key={p}>{p}</p>)}
                </ProseSection>

                <section aria-labelledby="servicii-oras" className="py-16">
                    <div className="mx-auto max-w-5xl px-6">
                        <h2 id="servicii-oras" className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">
                            Servicii potrivite pentru firmele din {loc.city}
                        </h2>
                        <ul className="grid gap-5 md:grid-cols-3">
                            {loc.services.map((s) => (
                                <li key={s.href}>
                                    <Link href={s.href} className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                                        <h3 className="mb-2 font-semibold group-hover:text-primary">{s.label}</h3>
                                        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.why}</p>
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                                            Aflați mai multe <ArrowRight className="size-4" aria-hidden="true" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                        <p className="mt-6 text-sm text-muted-foreground">
                            Prețuri: proiecte cu preț fix de la 300 EUR, sarcini punctuale de la 50 EUR, lucru pe oră între 20 și 80 EUR, mentenanță de la 150 EUR pe lună.{" "}
                            <Link href={STATIC_PATHS.services.ro} className="font-medium text-primary hover:underline">Toate serviciile</Link>
                        </p>
                    </div>
                </section>

                {caseStudy && (
                    <div className="bg-card/30">
                        <CaseStudyBlock
                            caseStudy={caseStudy}
                            labels={{ eyebrow: "Studiu de caz", problem: "Problema", solution: "Ce am construit", result: "Rezultat" }}
                        />
                    </div>
                )}

                <FaqList label="Întrebări și răspunsuri" title={`Întrebări frecvente din ${loc.city}`} items={loc.faqs} />

                <section aria-labelledby="alte-orase" className="pb-24">
                    <div className="mx-auto max-w-3xl px-6 text-center">
                        <h2 id="alte-orase" className="mb-4 text-xl font-bold tracking-tight">Lucrăm și cu firme din</h2>
                        <ul className="mb-10 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
                            {others.map((o) => (
                                <li key={o.slug}>
                                    <Link href={locationPath(o.slug)} className="font-medium text-primary hover:underline">{o.city}</Link>
                                </li>
                            ))}
                        </ul>
                        <Link
                            href={STATIC_PATHS.contact.ro}
                            className="inline-flex h-11 items-center gap-1 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
                        >
                            Începeți un proiect <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                        </Link>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
