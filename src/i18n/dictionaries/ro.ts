/**
 * Dicționarul românesc — textele interfeței și datele site-ului adaptate
 * pentru cititorii din România. Ne adresăm cu „dumneavoastră” peste tot.
 *
 * Nu preluăm aici afirmațiile din varianta engleză care nu sunt încă
 * susținute de date (echipă „35+”, „7–10+ ani”, testimoniale fără companie);
 * vezi TODO-urile din componente și raportul final.
 */

import { Cpu, Code2, FileText, Monitor, Search, Layers, Zap, Handshake, Clock, CheckSquare, SquareCheckBig, Briefcase } from "lucide-react";
import { SERVICE_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { SITE } from "@/config/seo";
import type { Dictionary } from "./types";

const svc = (key: string) => SERVICE_PATHS[key].ro!;

export const ro: Dictionary = {
    links: {
        home: STATIC_PATHS.home.ro,
        contact: STATIC_PATHS.contact.ro,
        services: STATIC_PATHS.services.ro,
        process: "/ro#process",
        privacy: STATIC_PATHS.privacy.ro,
    },
    nav: {
        services: "Servicii",
        links: [
            { label: "Despre noi", href: STATIC_PATHS.about.ro },
            // TODO(phase 5): /ro/blog once Romanian posts exist; until then the English blog.
            { label: "Blog", href: "/blog" },
            { label: "Cariere", href: STATIC_PATHS.careers.ro },
            { label: "Contact", href: STATIC_PATHS.contact.ro },
        ],
        getStarted: "Începeți",
        openMenu: "Deschide meniul",
        closeMenu: "Închide meniul",
        expandSub: "Arată subserviciile",
        collapseSub: "Ascunde subserviciile",
        mainNavigation: "Navigare principală",
    },
    languageSwitch: {
        label: "EN",
        ariaLabel: "Read in English",
    },
    footer: {
        tagline: "Dezvoltare software și AI din Satu Mare, pentru companii din România și din străinătate.",
        groups: [
            {
                heading: "Servicii",
                links: [
                    { label: "Dezvoltare software", href: svc("software-development") },
                    { label: "Site-uri de prezentare", href: svc("presentation-websites") },
                    { label: "Dezvoltare AI", href: svc("ai-development") },
                    { label: "Documentație tehnică", href: svc("technical-documentation") },
                ],
            },
            {
                heading: "Companie",
                links: [
                    { label: "Despre noi", href: STATIC_PATHS.about.ro },
                    { label: "Cum lucrăm", href: "/ro#process" },
                    { label: "Studii de caz", href: STATIC_PATHS.caseStudies.ro },
                    { label: "Orașe în care lucrăm", href: STATIC_PATHS.locations.ro },
                    { label: "Soluții web Satu Mare", href: STATIC_PATHS.webSatuMare.ro },
                    { label: "Blog", href: "/blog" },
                    { label: "Cariere", href: STATIC_PATHS.careers.ro },
                    { label: "Contact", href: STATIC_PATHS.contact.ro },
                ],
            },
            {
                heading: "Legal",
                links: [
                    { label: "Politica de confidențialitate", href: STATIC_PATHS.privacy.ro },
                ],
            },
        ],
        newsletterHeading: "Newsletter",
        newsletterText: "Noutăți și idei utile, fără spam.",
        rights: "Toate drepturile rezervate.",
        madeWith: "Realizat cu",
        love: "drag",
        by: "de",
        foundedIn: "Fondată în",
        emailAria: "Trimiteți-ne un email la",
        visitAria: "Vizitați",
        location: "Satu Mare, România",
        country: "România",
        openInMaps: "Deschideți în Google Maps",
        phoneLabel: "Sunați-ne",
        phoneDisplay: SITE.phone,
    },
    newsletter: {
        placeholder: "Adresa de email",
        aria: "Adresa de email pentru newsletter",
        subscribe: "Abonare",
        subscribing: "Se abonează…",
        invalidEmail: "Introduceți o adresă de email validă.",
        genericError: "A apărut o eroare. Vă rugăm să încercați din nou.",
        networkError: "Eroare de rețea. Vă rugăm să încercați din nou.",
        success: "Abonare reușită!",
    },
    hero: {
        titleA: "Dezvoltare software, site-uri și agenți AI",
        titleB: "din Satu Mare, pentru toată România.",
        text: "Dodera Software este o firmă de dezvoltare software din Satu Mare care construiește aplicații web, site-uri de prezentare și agenți AI pentru companii din toată România. Lucrăm cu preț fix pe proiect, de la 300 EUR, sau pe oră, între 20 și 80 EUR, și vă arătăm în fiecare săptămână o versiune funcțională.",
        primaryCta: "Începeți un proiect",
        secondaryCta: "Vedeți serviciile",
        ariaLabel: "Prezentare",
    },
    trustedBy: {
        label: "Lucrăm cu tehnologii folosite în toată lumea, precum",
        findUs: "Ne găsiți pe:",
        ariaLabel: "Tehnologii",
    },
    industries: {
        label: "Domenii în care am lucrat",
        items: [
            { emoji: "🏥", sector: "Sănătate" },
            { emoji: "⚖️", sector: "Servicii juridice" },
            { emoji: "🚁", sector: "Drone și aerospațial" },
            { emoji: "💪", sector: "Fitness și wellness" },
            { emoji: "🏢", sector: "Companii de software" },
        ],
    },
    caseStudies: {
        label: "Studii de caz",
        titleA: "Probleme reale.",
        titleB: "Rezultate măsurabile.",
        problem: "Problema",
        solution: "Cum am rezolvat",
        readMore: "Citiți studiul de caz",
        items: [
            {
                id: "freight-automation",
                industry: "Logistică și operațiuni",
                client: "Companie de expediții de mărfuri de talie medie",
                headline: "400 de comenzi pe zi, procesate manual",
                seoTitle: "Automatizarea a 400 de comenzi pe zi",
                problem:
                    "Echipa de operațiuni copia zilnic datele despre transporturi între trei sisteme: peste 400 de comenzi, de mână. Erorile scăpau în fiecare săptămână, penalitățile de la clienți se adunau, iar doi angajați seniori plecaseră deja. Furnizorul existent estimase 18 luni pentru rezolvare.",
                solution:
                    "În prima săptămână am analizat tot fluxul de date, apoi am construit în n8n o automatizare care leagă API-ul transportatorului, ERP-ul și sistemul de facturare. Am identificat și tratat cazurile-limită înainte de lansare. Durata totală: 7 săptămâni.",
                metric: "94%",
                metricLabel: "reducere a timpului de procesare manuală",
                tags: ["Automatizare", "n8n", "Integrare API", "ERP"],
                timeline: "7 săptămâni",
            },
            {
                id: "saas-reporting",
                industry: "SaaS / Instrumente interne",
                client: "Companie de software B2B, 80 de angajați",
                headline: "3 zile pe săptămână pierdute pentru un singur raport",
                seoTitle: "Dashboard de raportare pentru SaaS B2B",
                problem:
                    "În fiecare luni, echipa comercială extrăgea date din Salesforce, dintr-un spreadsheet și din două dashboard-uri interne și le asambla manual într-un raport gata abia miercuri. Conducerea lua decizii pe cifre vechi de patru zile.",
                solution:
                    "Am construit un dashboard intern unificat, cu sincronizare live din Salesforce, calcule automate și acces pe roluri. Raportul care dura trei zile se regenerează acum la fiecare 30 de minute, fără intervenție.",
                metric: "97%",
                metricLabel: "mai puțin timp pentru raportarea săptămânală",
                tags: ["Aplicație web", "Salesforce", "Dashboard", "React"],
            },
            {
                id: "clinic-booking",
                industry: "Servicii medicale",
                client: "Grup de clinici cu mai multe locații",
                headline: "Un sistem de programări care cădea din două în două săptămâni",
                seoTitle: "Platformă de programări pentru clinici",
                problem:
                    "Platforma de programări cumpărată „la cheie” cădea în medie de două ori pe lună. Fiecare întrerupere însemna programări pierdute, pacienți nemulțumiți și personal care răspundea ore întregi la telefon, fără să știe ce anume se strică și când.",
                solution:
                    "Am înlocuit platforma furnizorului cu un sistem de programări dezvoltat pe Next.js și PostgreSQL, construit pe tipurile lor de consultații, regulile de calendar ale medicilor și fluxul real al pacienților. Monitorizarea automată, cu alerte instantanee, a funcționat din prima zi.",
                metric: "0",
                metricLabel: "întreruperi în cele 14 luni de la lansare",
                tags: ["Platformă personalizată", "Next.js", "PostgreSQL", "Sănătate"],
            },
        ],
    },
    services: {
        label: "Ce construim",
        titleA: "Software care",
        titleB: "ajunge în producție",
        intro: "Dacă este digital, îl putem construi. Aducem expertiza potrivită în fiecare proiect, iar când o cerință iese din aria noastră tehnică, ne ocupăm noi de găsirea și coordonarea oamenilor potriviți.",
        core: "Serviciu principal",
        learnMore: "Aflați mai multe",
        exploreAria: (title) => `Aflați mai multe despre ${title}`,
        cta: "Să discutăm",
        items: [
            {
                icon: Code2,
                title: "Dezvoltare software",
                subtitle: "De la idee la lansare",
                description:
                    "Aplicații web personalizate, construite pe tehnologii moderne (Laravel, Next.js, Node.js și altele). De la MVP-uri pentru startupuri până la platforme complete și magazine online, ne ocupăm de tot procesul de livrare.",
                tags: ["Laravel", "Nuxt", "Vue.js", "React"],
                image: "/software-development.jpg",
                highlights: [
                    { label: "MVP – produs minim viabil", href: svc("software-development/mvp-to-market") },
                    { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
                    { label: "Produse SaaS", href: svc("software-development/saas-products") },
                ],
                href: svc("software-development"),
            },
            {
                icon: Monitor,
                title: "Site-uri de prezentare",
                subtitle: "Site-uri care aduc clienți",
                description:
                    "Site-uri rapide, personalizate și adaptate pentru mobil, construite să apară în Google și să transforme vizitatorii în clienți. Ne ocupăm de design, viteză și SEO tehnic.",
                tags: ["Design de brand", "Landing page", "Conversii"],
                image: "/presentation-website.webp",
                highlights: [
                    { label: "Site de prezentare pentru firme", href: svc("presentation-websites/business-showcase-sites") },
                ],
                href: svc("presentation-websites"),
            },
            {
                icon: Cpu,
                title: "Dezvoltare AI",
                subtitle: "Agenți AI și automatizări",
                description:
                    "Agenți AI și fluxuri automatizate care folosesc modele de la OpenAI, Anthropic și alții. Le conectăm la instrumentele și datele pe care le folosiți deja, ca să preia operațiuni complexe fără muncă manuală.",
                tags: ["Automatizări", "Agenți AI", "Optimizarea proceselor"],
                image: "/ai-development.jpg",
                highlights: [
                    { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
                    { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations") },
                ],
                href: svc("ai-development"),
            },
            {
                icon: FileText,
                title: "Documentație tehnică",
                subtitle: "Sisteme de cunoștințe",
                description:
                    "Codul, procesele și cunoștințele interne transformate în documentație structurată, pregătită pentru AI: ușor de găsit și de folosit, atât de echipa dumneavoastră, cât și de instrumentele pe care le folosiți.",
                tags: ["Indexare", "Context pentru AI", "Documentație"],
                image: "/technical-documentation.webp",
                highlights: [
                    { label: "Sisteme de documentare", href: svc("technical-documentation/documentation-systems") },
                ],
                href: svc("technical-documentation"),
            },
        ],
    },
    process: {
        label: "Cum lucrăm",
        titleA: "De la zero la",
        titleB: "producție",
        steps: [
            {
                icon: Search,
                title: "Înțelegem ce vreți să obțineți",
                description:
                    "Prin câteva sesiuni structurate legăm obiectivele dumneavoastră de rezultate măsurabile, astfel încât scopul proiectului este clar înainte să planificăm prima linie de cod.",
            },
            {
                icon: Layers,
                title: "Proiectăm soluția",
                description:
                    "Alegem tehnologiile după dimensiunea proiectului dumneavoastră, nu după preferințele noastre. API-urile, modelele de date și interfețele dintre componente sunt documentate și aprobate înainte de primul commit.",
            },
            {
                icon: Zap,
                title: "Construim și iterăm",
                description:
                    "Publicăm săptămânal pe un mediu de test, ca să verificați versiuni reale, nu machete. Blocajele sunt semnalate din timp, deci fără surprize la termen.",
            },
            {
                icon: Handshake,
                title: "Lansăm și oferim suport",
                description:
                    "Lansarea vine cu proceduri de operare, monitorizare și o perioadă de stabilizare. Nu doar o arhivă cu cod predată în ultima zi.",
            },
        ],
    },
    pricing: {
        label: "Prețuri",
        titleA: "Alegeți modelul care",
        titleB: "vi se potrivește.",
        tiers: [
            {
                icon: Clock,
                name: "Pe oră",
                tagline: "Flexibil, la cerere",
                rate: "20 - 80 EUR",
                rateSub: "pe oră",
                description: "Sarcini mici, remedieri rapide sau consultanță atunci când scopul nu este încă clar.",
                includes: [
                    "Ore pontate, facturate săptămânal",
                    "Code review și depanare",
                    "Fără angajament minim",
                ],
            },
            {
                icon: CheckSquare,
                name: "Pe sarcină",
                tagline: "Scop definit, preț fix",
                rate: "de la 50 EUR",
                rateSub: "pe sarcină",
                description: "Ne spuneți de ce aveți nevoie, iar noi vă dăm o estimare clară. Fără surprize și fără extinderi necontrolate ale scopului.",
                includes: [
                    "Funcționalități sau componente individuale",
                    "Integrări API și cu servicii terțe",
                    "Automatizări sau fluxuri AI punctuale",
                ],
            },
            {
                icon: SquareCheckBig,
                name: "Pe proiect",
                tagline: "Scop clar, buget predictibil",
                rate: "300 - 30.000+ EUR",
                rateSub: "pe proiect",
                description: "Prețul se stabilește de la început. Proiectele pornesc de la 300 EUR și pot depăși 30.000 EUR; scopul stabilește prețul. Lucrările mai mici intră la modelul pe sarcină.",
                includes: [
                    "Discuție inițială și stabilirea scopului",
                    "Preț fix, fără facturi surpriză",
                    "Predarea codului sursă și a documentației",
                ],
                note: "Stabilim scopul împreună, gratuit.",
            },
            {
                icon: Briefcase,
                name: "Abonament lunar",
                tagline: "Implicare pe termen lung",
                rate: "de la 150 EUR",
                rateSub: "pe lună",
                description: "Dezvoltare continuă, la cerere: lucru pe produs, funcționalități noi sau mentenanță.",
                includes: [
                    "Inginer(i) dedicat(i) în fiecare lună",
                    "Scop flexibil, ajustabil lunar",
                    "Puteți anula oricând",
                ],
            },
        ],
        forFree: "gratuit.",
        getStarted: "Începeți",
        notSure: "Nu știți ce model vi se potrivește?",
        tellUs: "Spuneți-ne despre proiect",
        suggest: "și vă recomandăm abordarea potrivită.",
    },
    team: {
        label: "Echipa",
        titleA: "Construit de oameni cărora",
        titleB: "le pasă",
        disciplines: [
            { emoji: "⚙️", label: "Dezvoltare backend" },
            { emoji: "🖥️", label: "Dezvoltare frontend" },
            { emoji: "🎨", label: "Design UI / UX" },
            { emoji: "🧪", label: "Testare și QA" },
            { emoji: "🤖", label: "AI și automatizări" },
            { emoji: "☁️", label: "Cloud și DevOps" },
        ],
    },
    cta: {
        label: "Aveți un proiect?",
        titleA: "Spuneți-ne ce vreți să construiți.",
        titleB: "Restul e treaba noastră.",
        textBefore: "Programați o discuție",
        free: "gratuită",
        textAfter: "de 30 de minute. Analizăm proiectul și vă spunem exact ce este nevoie ca să ajungă în producție.",
    },
    contactForm: {
        formAria: "Formular de contact pentru solicitări de proiect către Dodera Software",
        name: "Nume",
        namePlaceholder: "Numele dumneavoastră",
        email: "Email",
        emailPlaceholder: "nume@firma.ro",
        company: "Companie",
        companyPlaceholder: "Numele companiei",
        phone: "Telefon",
        phonePlaceholder: "07xx xxx xxx",
        optional: "(opțional)",
        serviceType: "Tip de serviciu",
        servicePlaceholder: "Alegeți un serviciu…",
        serviceOptions: [
            { value: "AI Development", label: "Agent AI sau automatizare" },
            { value: "Web Application", label: "Aplicație web" },
            { value: "MVP to Market", label: "MVP (produs minim viabil)" },
            { value: "Presentation Website", label: "Site de prezentare" },
            { value: "Technical Documentation", label: "Documentație tehnică" },
            { value: "Other", label: "Altceva" },
        ],
        details: "Detalii despre proiect",
        detailsPlaceholder: "Descrieți pe scurt ce vă doriți…",
        consentBefore: "Am citit și sunt de acord cu",
        privacyPolicy: "Politica de confidențialitate",
        consentAfter: ". Sunt de acord ca Dodera Software S.R.L. să prelucreze datele personale trimise prin acest formular pentru a-mi răspunde la solicitare.",
        send: "Trimiteți mesajul",
        sending: "Se trimite…",
        sentTitle: "Mesaj trimis",
        sentText: "Vă mulțumim! Vă răspundem în cel mult 24 de ore.",
        errors: {
            nameRequired: "Numele este obligatoriu.",
            minChars: (n) => `Cel puțin ${n} caractere.`,
            maxChars: (n) => `Maximum ${n} caractere.`,
            nameChars: "Sunt permise doar litere, spații, cratime și apostrofuri.",
            emailRequired: "Adresa de email este obligatorie.",
            emailInvalid: "Introduceți o adresă de email validă.",
            invalidChars: "Textul conține caractere nepermise.",
            phoneInvalid: "Introduceți un număr de telefon valid.",
            messageRequired: "Descrierea proiectului este obligatorie.",
            consent: "Pentru a trimite mesajul, trebuie să fiți de acord cu politica de confidențialitate.",
            generic: "A apărut o eroare. Vă rugăm să încercați din nou.",
            network: "Eroare de rețea. Verificați conexiunea și încercați din nou.",
        },
    },
    breadcrumb: {
        home: "Acasă",
        services: "Servicii",
        ariaLabel: "Navigare",
    },
    servicePage: {
        overviewAria: "Prezentarea serviciului",
        discuss: "Să discutăm",
        ourProcess: "Cum lucrăm",
        subServicesTitle: (label) => `Ce include: ${label}`,
        learnMore: "Aflați mai multe",
        faqLabel: "Întrebări și răspunsuri",
        faqTitle: "Întrebări frecvente",
        relatedTitle: "Servicii conexe",
        ctaTitle: "Sunteți gata să începem?",
        ctaBefore: "Programați o discuție",
        ctaFree: "gratuită",
        ctaAfter: "de 30 de minute. Analizăm proiectul și vă spunem exact ce este nevoie ca să ajungă în producție.",
        startProject: "Începeți un proiect",
        pricingTitle: "Prețuri",
        caseStudyTitle: "Studiu de caz",
        caseStudyProblem: "Problema",
        caseStudySolution: "Ce am construit",
        caseStudyResult: "Rezultat",
        readCaseStudy: "Citiți studiul de caz complet",
    },
    notFound: {
        title: "Pagina nu a fost găsită",
        text: "Pagina pe care o căutați nu există sau a fost mutată.",
        back: "Înapoi la pagina principală",
    },
};
