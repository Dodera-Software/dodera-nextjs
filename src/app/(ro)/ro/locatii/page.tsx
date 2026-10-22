import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero, ProseSection } from "@/components/PageHero";
import { LOCATIONS_RO } from "@/config/locations.ro";
import { SITE } from "@/config/seo";
import { STATIC_PATHS, locationPath } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, businessSchema } from "@/lib/structured-data";

const TITLE = "Firmă IT Satu Mare și nord-vestul României";
const DESCRIPTION =
    "Dodera Software lucrează din Satu Mare cu firme din Carei, Baia Mare, Zalău, Oradea, Cluj-Napoca și din toată România. Față în față sau de la distanță.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: alternatesFor("locations", "ro"),
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: absoluteUrl(STATIC_PATHS.locations.ro),
        type: "website",
        siteName: SITE.name,
        images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
};

export default function LocationsHubRo() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Locații", url: absoluteUrl(STATIC_PATHS.locations.ro) },
                    ]),
                    businessSchema({ description: DESCRIPTION }),
                ]}
            />
            <Navbar />
            <main>
                <Breadcrumb items={[{ label: "Acasă", href: "/ro" }, { label: "Locații" }]} />
                <PageHero
                    eyebrow="Locații"
                    id="locations-heading"
                    title="Unde lucrăm"
                    lead="Dodera Software este o firmă de dezvoltare software cu sediul în Satu Mare, care lucrează cu firme din tot nord-vestul României și din restul țării. Clienții din Satu Mare ne întâlnesc față în față; cu cei din Carei, Baia Mare, Zalău, Oradea și Cluj-Napoca lucrăm de la distanță, cu același preț fix și același demo săptămânal."
                />

                <section aria-labelledby="orase" className="pb-8">
                    <div className="mx-auto max-w-5xl px-6">
                        <h2 id="orase" className="sr-only">Orașe</h2>
                        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {LOCATIONS_RO.map((l) => (
                                <li key={l.slug}>
                                    <Link href={locationPath(l.slug)} className="group flex h-full flex-col rounded-xl border border-border bg-card p-6 transition-colors hover:border-primary/30">
                                        <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                                            {l.inPerson ? "Față în față" : "De la distanță"}
                                        </p>
                                        <h3 className="mb-2 text-lg font-semibold group-hover:text-primary">{l.city}</h3>
                                        <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{l.metaDescription}</p>
                                        <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                                            {l.city} <ArrowRight className="size-4" aria-hidden="true" />
                                        </span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <ProseSection id="model" title="Același mod de lucru, oriunde ați fi">
                    <p>
                        Indiferent de oraș, primiți o ofertă scrisă cu preț fix înainte de a începe, vedeți în fiecare săptămână versiunea nouă pe mediul de test și primiți la final codul sursă și documentația. Diferența ține doar de întâlniri: în Satu Mare ne vedem la birou, pe {SITE.address.street}, iar în rest lucrăm prin apeluri video.
                    </p>
                    <p>
                        Pentru firmele din Satu Mare avem și o pagină dedicată soluțiilor web:{" "}
                        <Link href={STATIC_PATHS.webSatuMare.ro}>dezvoltare soluții web în Satu Mare</Link>. Lista completă a serviciilor este pe pagina{" "}
                        <Link href={STATIC_PATHS.services.ro}>servicii</Link>, iar datele de contact pe pagina{" "}
                        <Link href={STATIC_PATHS.contact.ro}>contact</Link>.
                    </p>
                </ProseSection>
            </main>
            <Footer />
        </div>
    );
}
