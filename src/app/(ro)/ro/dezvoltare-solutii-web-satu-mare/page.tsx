import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero, ProseSection, FaqList } from "@/components/PageHero";
import { CaseStudyBlock } from "@/components/CaseStudyBlock";
import { ContactForm } from "@/components/ContactForm";
import { SITE } from "@/config/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { SERVICE_PATHS, STATIC_PATHS, locationPath } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";

/*
 * Pagina locală principală: „dezvoltare soluții web Satu Mare”.
 * Se deosebește de /ro/locatii/satu-mare (prezentarea firmei în oraș) prin
 * faptul că este oferta concretă: ce soluții web construim, prețuri, proces,
 * întrebări de cumpărare și formular.
 */

const TITLE = "Dezvoltare soluții web Satu Mare";
const DESCRIPTION =
    "Site-uri de prezentare, magazine online și aplicații web pentru firme din Satu Mare, cu întâlniri față în față. Preț fix de la 300 EUR, demo săptămânal.";
const PATH = STATIC_PATHS.webSatuMare.ro;
const svc = (key: string) => SERVICE_PATHS[key].ro!;

const SOLUTIONS = [
    {
        title: "Site-uri de prezentare",
        body: "Site-uri rapide, adaptate pentru telefon și construite să apară în Google la căutările din Satu Mare, cu formulare care aduc cereri de ofertă. De obicei gata în 2–6 săptămâni.",
        href: svc("presentation-websites"),
    },
    {
        title: "Magazine online",
        body: "Magazine construite pe regulile dumneavoastră de prețuri, stocuri și livrare, cu plăți online și integrare cu facturarea, nu un șablon generic.",
        href: svc("software-development"),
    },
    {
        title: "Aplicații web și portaluri",
        body: "Sisteme de comenzi, programări, evidență sau portaluri pentru clienți și parteneri, construite pe procesele firmei și integrate cu ERP-ul sau CRM-ul.",
        href: svc("software-development"),
    },
    {
        title: "Automatizări și agenți AI",
        body: "Fluxuri în n8n și agenți AI care preiau comenzile din email, procesează facturi și generează rapoarte, ca echipa să nu mai copieze date de mână.",
        href: svc("ai-development"),
    },
];

const STEPS = [
    { title: "Discuție gratuită", body: "Ne întâlnim la biroul de pe Strada Banat sau la sediul dumneavoastră și stabilim ce vreți să obțineți." },
    { title: "Ofertă cu preț fix", body: "După o scurtă analiză primiți în scris scopul, prețul și calendarul, înainte de primul rând de cod." },
    { title: "Dezvoltare cu demo săptămânal", body: "Publicăm în fiecare săptămână pe un mediu de test, ca să vedeți și să testați soluția reală." },
    { title: "Lansare și suport", body: "Lansăm, vă instruim echipa și rămânem alături prin mentenanță lunară, dacă doriți." },
];

const FAQ = [
    {
        question: "Cât costă un site sau o aplicație web pentru o firmă din Satu Mare?",
        answer: "Proiectele cu preț fix pornesc de la 300 EUR, iar aplicațiile complexe pot depăși 30.000 EUR. Lucrările mici, precum o modificare sau o integrare, pornesc de la 50 EUR, iar consultanța pe oră costă între 20 și 80 EUR. Prețul exact îl primiți în scris înainte de a începe.",
    },
    {
        question: "Cât durează realizarea unui site de prezentare?",
        answer: "Un site simplu durează de obicei 2–3 săptămâni, iar unul cu mai multe pagini, CMS și animații 4–6 săptămâni. O aplicație web sau un MVP durează 4–8 săptămâni.",
    },
    {
        question: "Ne putem întâlni față în față?",
        answer: "Da. Biroul nostru este în Satu Mare, pe Strada Banat 1. Discuția inițială, prezentarea designului și predarea le putem face în persoană, la noi sau la sediul dumneavoastră.",
    },
    {
        question: "Pot actualiza singur site-ul după lansare?",
        answer: "Da. Integrăm un CMS ușor de folosit, prin care modificați texte, imagini și pagini fără programator, iar la predare vă arătăm cum se folosește.",
    },
    {
        question: "Site-ul va apărea în Google pentru căutările din Satu Mare?",
        answer: "SEO tehnic este inclus în fiecare proiect: structură corectă a paginilor, date structurate cu adresa firmei, viteză bună și texte scrise pe căutările reale ale clienților din zonă. Pentru rezultate locale vă recomandăm și un profil Google Business completat cu aceleași date.",
    },
    {
        question: "Ale cui sunt codul și site-ul după predare?",
        answer: "Ale dumneavoastră. Primiți codul sursă, documentația și accesul la găzduire și la domeniu. Puteți continua cu noi sau cu oricine altcineva.",
    },
    {
        question: "Lucrați și cu firme din afara orașului Satu Mare?",
        answer: "Da, cu firme din tot județul și din toată țara. Cu cele din afara orașului lucrăm de la distanță, prin apeluri video și demo săptămânal.",
    },
];

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: alternatesFor("webSatuMare", "ro"),
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: absoluteUrl(PATH),
        type: "website",
        siteName: SITE.name,
        images: [{ url: "/og-images/og-presentation-websites.png", width: 1200, height: 630, alt: TITLE }],
    },
};

export default function WebSatuMarePage() {
    const dict = getDictionary("ro");
    const url = absoluteUrl(PATH);

    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Locații", url: absoluteUrl(STATIC_PATHS.locations.ro) },
                        { name: "Soluții web Satu Mare", url },
                    ]),
                    serviceSchema({
                        name: "Dezvoltare soluții web în Satu Mare",
                        description: DESCRIPTION,
                        url,
                        serviceType: "Dezvoltare web",
                        city: { name: "Satu Mare", county: "Satu Mare" },
                    }),
                    faqSchema(FAQ),
                ]}
            />
            <Navbar />
            <main>
                <Breadcrumb
                    items={[
                        { label: "Acasă", href: "/ro" },
                        { label: "Locații", href: STATIC_PATHS.locations.ro },
                        { label: "Soluții web Satu Mare" },
                    ]}
                />
                <PageHero
                    eyebrow="Satu Mare"
                    id="web-satu-mare-heading"
                    title={<>Dezvoltare soluții web <span className="text-primary">în Satu Mare</span></>}
                    lead="Dodera Software este o firmă de dezvoltare software din Satu Mare care construiește site-uri de prezentare, magazine online, aplicații web și automatizări pentru firmele din oraș și din județ. Lucrăm cu preț fix pe proiect, de la 300 EUR, ne întâlnim față în față la biroul de pe Strada Banat 1 și vă arătăm în fiecare săptămână o versiune funcțională."
                >
                    <div className="mt-8 flex flex-wrap justify-center gap-3">
                        <Link href="#formular" className="inline-flex h-11 items-center gap-1 rounded-md bg-primary px-8 text-sm font-medium text-primary-foreground hover:bg-primary/90">
                            Cereți o ofertă <ArrowRight className="ml-1 size-4" aria-hidden="true" />
                        </Link>
                        <a href={`tel:${SITE.phoneE164}`} className="inline-flex h-11 items-center rounded-md border border-border px-8 text-sm font-medium hover:bg-accent">
                            Sunați: {SITE.phone}
                        </a>
                    </div>
                </PageHero>

                <section aria-labelledby="solutii" className="py-16">
                    <div className="mx-auto max-w-5xl px-6">
                        <h2 id="solutii" className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">Ce soluții web construim</h2>
                        <ul className="grid gap-5 sm:grid-cols-2">
                            {SOLUTIONS.map((s) => (
                                <li key={s.title} className="flex flex-col rounded-xl border border-border bg-card p-6">
                                    <h3 className="mb-2 text-lg font-semibold">{s.title}</h3>
                                    <p className="mb-4 flex-1 text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                                    <Link href={s.href} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline">
                                        Detalii <span className="sr-only">despre {s.title.toLowerCase()}</span>
                                        <ArrowRight className="size-4" aria-hidden="true" />
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <ProseSection id="de-ce-local" title="De ce o firmă IT din Satu Mare" muted>
                    <p>
                        Un proiect web merge mai bine când puteți vorbi direct cu oamenii care îl construiesc. Fiind în același oraș, putem veni să vedem cum lucrează echipa dumneavoastră înainte de a propune o soluție, putem prezenta designul la aceeași masă și putem face predarea în persoană.
                    </p>
                    <p>
                        Lucrăm în română, în același program cu dumneavoastră, și cunoaștem piața locală: firme de producție care lucrează cu parteneri din Ungaria și Germania, firme de servicii care au nevoie să fie găsite în Google la căutările din oraș și afaceri care vor să vândă online fără comisioanele marilor platforme.
                    </p>
                    <p>
                        Pentru proiectele mai mari, aceeași echipă construiește și{" "}
                        <Link href={svc("software-development/mvp-to-market")}>MVP-uri</Link>,{" "}
                        <Link href={svc("software-development/saas-products")}>produse SaaS</Link> și{" "}
                        <Link href={svc("ai-development/custom-ai-agents")}>agenți AI personalizați</Link>.
                    </p>
                </ProseSection>

                <section aria-labelledby="proces" className="py-16">
                    <div className="mx-auto max-w-5xl px-6">
                        <h2 id="proces" className="mb-8 text-2xl font-bold tracking-tight sm:text-3xl">Cum decurge un proiect</h2>
                        <ol className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {STEPS.map((s, i) => (
                                <li key={s.title} className="rounded-xl border border-border bg-card p-6">
                                    <span className="mb-3 flex size-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">{i + 1}</span>
                                    <h3 className="mb-2 font-semibold">{s.title}</h3>
                                    <p className="text-sm leading-relaxed text-muted-foreground">{s.body}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </section>

                <ProseSection id="preturi" title="Prețuri" muted>
                    <p>
                        <strong>Proiect cu preț fix: de la 300 EUR.</strong> Site-uri, magazine online și aplicații complete; prețul exact rezultă din scopul stabilit împreună, iar proiectele mari pot depăși 30.000 EUR.
                    </p>
                    <p>
                        <strong>Sarcini punctuale: de la 50 EUR.</strong> O funcționalitate, o integrare sau o remediere, cu preț fix.
                    </p>
                    <p>
                        <strong>Pe oră: 20–80 EUR.</strong> Consultanță, audit sau lucru când scopul nu este încă clar.
                    </p>
                    <p>
                        <strong>Mentenanță: de la 150 EUR pe lună.</strong> Actualizări, securitate și modificări, cu scop ajustabil lunar.
                    </p>
                    <p>Discuția inițială și stabilirea scopului sunt gratuite.</p>
                    {/* TODO(owner): typical price ranges per project type (site de prezentare, magazin online). */}
                </ProseSection>

                <CaseStudyBlock
                    caseStudy={dict.caseStudies.items[2]}
                    labels={{ eyebrow: "Studiu de caz", problem: "Problema", solution: "Ce am construit", result: "Rezultat" }}
                />

                <FaqList label="Întrebări și răspunsuri" title="Întrebări frecvente" items={FAQ} />

                <section id="formular" aria-labelledby="formular-heading" className="scroll-mt-24 pb-24">
                    <div className="mx-auto max-w-3xl px-6">
                        <h2 id="formular-heading" className="mb-3 text-center text-3xl font-bold tracking-tight">Cereți o ofertă</h2>
                        <p className="mb-8 text-center text-muted-foreground">
                            {SITE.legalName}, {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city} ·{" "}
                            <a href={`tel:${SITE.phoneE164}`} className="text-primary hover:underline">{SITE.phone}</a> ·{" "}
                            <a href={`mailto:${SITE.email}`} className="text-primary hover:underline">{SITE.email}</a>
                        </p>
                        <ContactForm />
                        <p className="mt-8 text-center text-sm text-muted-foreground">
                            Mai multe despre noi în <Link href={locationPath("satu-mare")} className="text-primary hover:underline">Satu Mare</Link>{" "}
                            sau despre <Link href={STATIC_PATHS.locations.ro} className="text-primary hover:underline">celelalte orașe în care lucrăm</Link>.
                        </p>
                    </div>
                </section>
            </main>
            <Footer />
        </div>
    );
}
