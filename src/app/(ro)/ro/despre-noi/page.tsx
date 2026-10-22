import type { Metadata } from "next";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumb } from "@/components/Breadcrumb";
import { PageHero, ProseSection, FaqList } from "@/components/PageHero";
import { PricingSection } from "@/components/PricingSection";
import { SITE } from "@/config/seo";
import { SERVICE_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { aboutPageSchema, breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { RO_META } from "../seo";

export const metadata: Metadata = {
    title: RO_META.about.title,
    description: RO_META.about.description,
    alternates: alternatesFor("about", "ro"),
    openGraph: {
        title: RO_META.about.title,
        description: RO_META.about.description,
        url: absoluteUrl(STATIC_PATHS.about.ro),
        type: "website",
        siteName: SITE.name,
        images: [{ url: "/og-images/og-about.png", width: 1200, height: 630, alt: "Dodera Software — Despre noi" }],
    },
};

const svc = (key: string) => SERVICE_PATHS[key].ro!;

const VALUES = [
    {
        title: "Calitate, fără compromisuri",
        body: "Scriem cod testat, revizuit și documentat. Fiecare modificare trece prin code review înainte să ajungă în producție.",
    },
    {
        title: "Progres vizibil în fiecare săptămână",
        body: "Publicăm săptămânal pe un mediu de test, așa că vedeți aplicația reală pe tot parcursul proiectului, nu doar la final.",
    },
    {
        title: "Transparență",
        body: "Comunicare clară, actualizări săptămânale și acces direct la oamenii care lucrează la produsul dumneavoastră.",
    },
    {
        title: "Preț stabilit de la început",
        body: "Pentru proiecte lucrăm cu preț fix, convenit înainte de începere. Fără facturi surpriză.",
    },
];

const FAQ = [
    {
        question: "Unde își are sediul Dodera Software?",
        answer: "Sediul nostru este în Satu Mare, pe Strada Banat 1. Lucrăm cu clienți din Satu Mare și din împrejurimi și față în față, iar cu firmele din restul României și din străinătate lucrăm de la distanță, prin apeluri video și demo-uri săptămânale.",
    },
    {
        question: "Ce dimensiune au proiectele pe care le preluați?",
        answer: "De la sarcini punctuale, facturate pe oră sau cu preț fix de la 50 EUR, până la produse complete livrate ca proiecte, de la 300 EUR la peste 30.000 EUR. Fie că aveți nevoie de o singură integrare, fie de o platformă SaaS completă, vă putem ajuta.",
    },
    {
        question: "Puteți lucra împreună cu programatorii noștri?",
        answer: "Da. Ne putem integra ca o extensie a echipei dumneavoastră, adaptându-ne la tehnologiile, la fluxul Git și la ritmul de lucru pe care îl folosiți deja.",
    },
    {
        question: "Cum vă asigurați de calitatea codului?",
        answer: "Fiecare proiect trece prin code review, teste automate și o etapă de verificare înainte de livrare. Configurăm pipeline-uri CI/CD care aplică aceleași reguli la fiecare modificare.",
    },
    {
        question: "Lucrați cu startupuri aflate la început?",
        answer: "Da. Oferim sfaturi de arhitectură și de alegere a tehnologiilor și putem construi un MVP în 4–8 săptămâni, ca să ajungeți la primii utilizatori sau la investitori cât mai repede.",
    },
    {
        question: "În ce limbă comunicați?",
        answer: "În română sau în engleză, cum preferați. Documentația și aplicațiile le putem livra în ambele limbi.",
    },
];

export default function AboutPageRo() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    aboutPageSchema({
                        name: `Despre noi - ${SITE.name}`,
                        description: RO_META.about.description,
                        url: absoluteUrl(STATIC_PATHS.about.ro),
                        locale: "ro",
                    }),
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Despre noi", url: absoluteUrl(STATIC_PATHS.about.ro) },
                    ]),
                    faqSchema(FAQ),
                ]}
            />
            <Navbar />
            <main>
                <Breadcrumb items={[{ label: "Acasă", href: "/ro" }, { label: "Despre noi" }]} />
                <PageHero
                    eyebrow="Despre noi"
                    id="about-ro-heading"
                    title={<>Firmă IT din Satu Mare, <span className="text-primary">din 2023.</span></>}
                    lead="Dodera Software este o firmă de dezvoltare software din Satu Mare, fondată în 2023, care construiește aplicații web, site-uri de prezentare, agenți AI și automatizări pentru companii din toată România. Lucrăm pe oră, pe sarcină sau pe proiect, cu preț fix stabilit de la început."
                />

                <ProseSection id="cine-suntem" title="Cine suntem">
                    <p>
                        Am pornit Dodera Software ca ingineri care au văzut prea multe idei bune eșuând din cauza unei execuții tehnice slabe. Am construit firma pe o convingere simplă: software-ul trebuie să fie de încredere, ușor de înțeles și cu adevărat util pentru cei care îl folosesc.
                    </p>
                    <p>
                        Acoperim tot drumul unui produs: arhitectură, backend, frontend, design, AI și infrastructură. Ne asumăm proiectul de la prima schiță de arhitectură până la ultima publicare și rămânem alături de el și după lansare, dacă doriți.
                    </p>
                    <p>
                        Fie că aveți nevoie de un partener tehnic pe termen lung, fie de o echipă care să livreze o singură funcționalitate importantă, ne adaptăm la ritmul și la obiectivele dumneavoastră.
                    </p>
                    {/* TODO(phase 4 / owner): founder bio, photo and LinkedIn — needs the founder's real details. */}
                </ProseSection>

                <section aria-labelledby="valori" className="bg-card/30 py-16">
                    <div className="mx-auto max-w-5xl px-6">
                        <h2 id="valori" className="mb-10 text-center text-2xl font-bold tracking-tight sm:text-3xl">Cum lucrăm</h2>
                        <ul className="grid gap-5 sm:grid-cols-2">
                            {VALUES.map((v, i) => (
                                <li key={v.title} className="flex gap-4 rounded-xl border border-border bg-card p-6">
                                    <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary" aria-hidden="true">
                                        {i + 1}
                                    </span>
                                    <div>
                                        <h3 className="mb-1 font-semibold">{v.title}</h3>
                                        <p className="text-sm leading-relaxed text-muted-foreground">{v.body}</p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <ProseSection id="ce-construim" title="Ce construim">
                    <p>
                        <Link href={svc("software-development")}>Aplicații web și software personalizat</Link>, de la{" "}
                        <Link href={svc("software-development/mvp-to-market")}>MVP-uri</Link> la{" "}
                        <Link href={svc("software-development/saas-products")}>produse SaaS</Link> și{" "}
                        <Link href={svc("software-development/enterprise-platforms")}>platforme enterprise</Link>.
                    </p>
                    <p>
                        <Link href={svc("presentation-websites")}>Site-uri de prezentare</Link> rapide, optimizate pentru Google, pentru firme din Satu Mare și din toată țara.
                    </p>
                    <p>
                        <Link href={svc("ai-development/custom-ai-agents")}>Agenți AI personalizați</Link> și{" "}
                        <Link href={svc("ai-development/ai-powered-automations")}>automatizări cu n8n</Link>, conectate la instrumentele pe care le folosiți deja.
                    </p>
                    <p>
                        <Link href={svc("technical-documentation")}>Documentație tehnică</Link> și baze de cunoștințe pregătite pentru AI.
                    </p>
                </ProseSection>

                <ProseSection id="unde-suntem" title="Unde ne găsiți" muted>
                    <p>
                        <strong>{SITE.legalName}</strong>, {SITE.address.street}, {SITE.address.postalCode} {SITE.address.city}, România.
                        Telefon <a href={`tel:${SITE.phoneE164}`}>{SITE.phone}</a>, email <a href={`mailto:${SITE.email}`}>{SITE.email}</a>.
                    </p>
                    <p>
                        Nr. Reg. Com. {SITE.registrationNumber}, CUI {SITE.taxId}. Pentru clienții din Satu Mare și din împrejurimi ne întâlnim și față în față; cu cei din Baia Mare, Oradea, Zalău, Cluj-Napoca, Carei și din restul țării lucrăm de la distanță.
                    </p>
                    <p>
                        <Link href={STATIC_PATHS.contact.ro}>Scrieți-ne sau sunați-ne</Link>; prima discuție este gratuită.
                    </p>
                </ProseSection>

                <PricingSection />

                <FaqList label="Întrebări și răspunsuri" title="Întrebări frecvente" items={FAQ} />
            </main>
            <Footer />
        </div>
    );
}
