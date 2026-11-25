/**
 * Dicționarul românesc — textele interfeței și datele site-ului adaptate
 * pentru cititorii din România. Ne adresăm cu „dumneavoastră” peste tot.
 *
 * Doar afirmații susținute de date: prețurile publicate, studiile de caz și
 * datele firmei din registru. Fără cifre despre echipă sau testimoniale
 * neverificate.
 */

import { Cpu, Code2, FileText, Monitor, Search, Layers, Zap, Handshake, Clock, CheckSquare, SquareCheckBig, Briefcase } from "lucide-react";
import { SERVICE_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { SITE } from "@/config/seo";
import type { Dictionary } from "./types";
import { lowerFirst } from "@/lib/format";

const svc = (key: string) => SERVICE_PATHS[key].ro!;

export const ro: Dictionary = {
    links: {
        home: STATIC_PATHS.home.ro,
        contact: STATIC_PATHS.contact.ro,
        services: STATIC_PATHS.services.ro,
        process: "/ro#process",
        privacy: STATIC_PATHS.privacy.ro,
        blog: "/ro/blog",
        about: STATIC_PATHS.about.ro,
        caseStudies: STATIC_PATHS.caseStudies.ro,
    },
    nav: {
        services: "Servicii",
        links: [
            { label: "Produse", href: STATIC_PATHS.products.ro },
            { label: "Despre noi", href: STATIC_PATHS.about.ro },
            { label: "Blog", href: "/ro/blog" },
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
        tagline: "Dezvoltare software și AI personalizată, din România, pentru clienți din toată lumea.",
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
                    { label: "Blog", href: "/ro/blog" },
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
        foundedIn: "Fondată în",
        emailAria: "Trimiteți-ne un email la",
        location: "România · Internațional",
        productsHeading: "Produse",
        cta: "Aveți un proiect în minte? Să discutăm.",
        contactButton: "Contactați-ne",
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
        titleA: "Software care",
        titleB: "aduce rezultate.",
        text: "Proiectăm, construim și întreținem software personalizat, agenți AI și site-uri pentru startupuri și companii moderne. Lansăm și produse proprii, așa că știm ce înseamnă să pui un produs în fața oamenilor reali.",
        primaryCta: "Începeți un proiect",
        secondaryCta: "Vedeți produsele noastre",
        ariaLabel: "Prezentare",
        facts: ["4 produse proprii, lansate", "Clienți în România și în străinătate", "Discuție de arhitectură gratuită, 30 de minute"],
    },
    deck: {
        next: "Următorul",
        backToTop: "Înapoi sus",
        nextAria: (label, index, total) => `Următorul: ${label}, ${index} din ${total}`,
        backToTopAria: "Înapoi la începutul paginii",
        slides: {
            intro: "Început",
            products: "Produsele noastre",
            services: "Servicii",
            work: "Studii de caz",
            process: "Proces",
            pricing: "Prețuri",
            studio: "Studio",
            contact: "Contact",
        },
    },
    products: {
        label: "Făcut de Dodera",
        titleA: "Construim pentru clienți.",
        titleB: "Și lansăm produse proprii.",
        intro: "Patru produse gândite, construite și întreținute de echipa noastră. Aceiași oameni și aceleași standarde, pe proiectul dumneavoastră.",
        railAria: "Produsele noastre",
        items: {
            pipstep: {
                kind: "iPhone și Apple Watch",
                title: "De la o plimbare de cinci minute la alergare.",
                lede: "Un drum de 105 lecții scurte, ghidate, de la ușor la greu. Pip, un porumbel curier antrenor, vă însoțește la fiecare pas, în căști și pe încheietură.",
                points: ["Șapte etape, de la plimbarea zilnică la semimaraton", "Pe Apple Watch sau pe iPhone, cu GPS și AirPods", "Fiecare lecție salvată în Apple Health"],
                cta: "Vizitați pipstep.app",
                metaTitle: "Pipstep: aplicație de la mers la alergare pentru iPhone și Apple Watch",
                metaDescription: "Pipstep transformă o plimbare de cinci minute în alergare, cu 105 lecții ghidate scurte, antrenor vocal pe Apple Watch sau iPhone și Apple Health. Gratuit, fără reclame.",
                features: [
                    {
                        title: "105 lecții scurte, de la ușor la greu.",
                        body: "Șapte etape vă duc de la plimbarea zilnică la primele alergări ușoare, la primii 5 și 10 kilometri și până la semimaraton. Fără plan de scris și fără ritmuri de știut: apăsați Start.",
                    },
                    {
                        title: "Un antrenor în căști și pe încheietură.",
                        body: "Pip vă ghidează la fiecare pas în AirPods și vă atinge încheietura pe Apple Watch, așa că telefonul poate rămâne acasă. Fără ceas? Lecțiile merg pe iPhone, cu GPS și Live Activity.",
                    },
                    {
                        title: "Pip crește odată cu dumneavoastră.",
                        body: "Stele, o serie de zile cu focuri de tabără, pene de cheltuit și haine pentru Pip. Cu fiecare unitate terminată, Micul Pip devine Pip Alergătorul, apoi Pip Maratonistul.",
                    },
                    {
                        title: "Școala obiceiurilor, câte un minut.",
                        body: "Teste scurte, mici încercări și lecții de ascultat în timpul mersului despre somn, apă, încălzire și siguranță.",
                    },
                    {
                        title: "Cursa de livrări a lui Pip.",
                        body: "Un mic joc pentru canapea și zilele de pauză: mutați-l pe Pip între benzi și livrați fiecare scrisoare. Provocați un prieten pe aceeași stradă și urcați în liga săptămânală.",
                    }
                ],
                facts: [
                    {
                        label: "Platforme",
                        value: "iPhone și Apple Watch",
                    },
                    {
                        label: "Preț",
                        value: "Tot drumul este gratuit, fără reclame. Pipstep Plus este opțional.",
                    },
                    {
                        label: "Cont",
                        value: "Nu este necesar. Autentificare doar pentru funcțiile cu prieteni.",
                    },
                    {
                        label: "Sănătate",
                        value: "Fiecare lecție salvată în Apple Health, cu traseu și puls",
                    },
                    {
                        label: "Confidențialitate",
                        value: "Funcționează offline. Datele de sănătate rămân pe dispozitivele dumneavoastră.",
                    }
                ],
            },
            doderminal: {
                kind: "Aplicație Mac · Gratuită",
                title: "Toți agenții Claude Code, în paralel.",
                lede: "O aplicație nativă pentru macOS: o sesiune pentru fiecare proiect, un git worktree pentru fiecare agent, o notificare când unul are nevoie de dumneavoastră, iar diff-ul, pull request-ul și merge-ul în aceeași fereastră.",
                points: ["Gratuită, fără cont și fără înregistrare", "macOS 15 sau mai nou, Apple silicon și Intel", "31 MB la pornire, 0,0% CPU în repaus"],
                cta: "Descărcați de pe doderminal.com",
                metaTitle: "doderminal: toți agenții Claude Code în paralel, pe Mac",
                metaDescription: "doderminal este o aplicație gratuită pentru macOS pentru Claude Code: o sesiune pe proiect, un git worktree pe agent, notificări când un agent are nevoie de dumneavoastră.",
                features: [
                    {
                        title: "Cinci agenți, cinci worktree-uri, o singură listă.",
                        body: "Fiecare sesiune Claude Code stă într-o bară laterală, grupată pe proiecte, cu un punct care arată dacă lucrează, are nevoie de dumneavoastră, a terminat sau a eșuat. Fiecare agent nou primește propriul git worktree, așa că doi agenți nu modifică niciodată aceleași fișiere.",
                    },
                    {
                        title: "Răspundeți agenților din notificare.",
                        body: "Când un agent termină, cere permisiune sau pune o întrebare cât sunteți în altă aplicație, o notificare Mac spune ce vrea. Aprobați, refuzați sau răspundeți chiar acolo.",
                    },
                    {
                        title: "Claude revizuiește. Publicați doar ce rămâne valabil.",
                        body: "Deschideți un pull request, iar propriul Claude Code îl revizuiește într-o copie separată. Bifați observațiile cu care sunteți de acord și trimiteți-le ca o singură revizuire.",
                    },
                    {
                        title: "Citiți fiecare modificare înainte să ajungă în producție.",
                        body: "Vedeți ce a schimbat fiecare agent, acceptați sau renunțați la fiecare bucată în parte și lăsați un comentariu sub o linie, direct agentului care a scris-o.",
                    },
                    {
                        title: "Un panou care se actualizează singur.",
                        body: "Work Board arată fiecare sesiune ca un card în În lucru, Are nevoie de dumneavoastră, În revizuire și Gata, mutat automat după ce raportează agenții și GitHub.",
                    }
                ],
                facts: [
                    {
                        label: "Preț",
                        value: "Gratuit. Fără cont și fără înregistrare.",
                    },
                    {
                        label: "Rulează pe",
                        value: "macOS 15 sau mai nou, Apple silicon și Intel",
                    },
                    {
                        label: "Necesită",
                        value: "Claude Code instalat",
                    },
                    {
                        label: "Memorie",
                        value: "31 MB la pornire, 74 MB cu 22 de terminale",
                    },
                    {
                        label: "Viteză",
                        value: "0,0% CPU în repaus, 3,2 ms de la tastă la ecran",
                    }
                ],
            },
            intelilang: {
                kind: "Aplicație web · Acces timpuriu",
                title: "Întrebați ce s-\u2060a decis. Vedeți fraza din care vine.",
                lede: "O memorie pentru fiecare proiect, din ședințe, Slack, GitHub și Jira. Toată echipa întreabă același chat, iar fiecare răspuns vine cu citatul și sursa lui.",
                points: ["Răspunsuri potrivite celui care întreabă: client, echipă sau conducere", "Funcționează în Slack, Claude, Claude Code, Cursor și VS Code", "Gratuit în acces timpuriu, în română și engleză"],
                cta: "Încercați intelilang.com",
                metaTitle: "InteliLang: memorie AI de proiect pentru ședințe, Slack, GitHub și Jira",
                metaDescription: "InteliLang păstrează o memorie pentru fiecare proiect din ședințe, Slack, GitHub și Jira. Întrebați ce s-a decis și vedeți fraza din care vine. Gratuit în acces timpuriu.",
                features: [
                    {
                        title: "Tot ce spune deja proiectul, păstrat.",
                        body: "Conectați o singură dată Slack, GitHub, Google Meet, Jira, înregistrări de ședințe și documente. Ce s-a spus acolo devine memorie pe care oricine din proiect o poate întreba, fiecare intrare cu fraza din care vine.",
                    },
                    {
                        title: "O întrebare, răspunsul potrivit pentru fiecare rol.",
                        body: "Clientul, programatorul și directorul întreabă același chat și primesc răspunsuri construite doar din ce au voie să vadă, verificat de baza de date la fiecare interogare.",
                    },
                    {
                        title: "Răspunsuri pe care le puteți verifica.",
                        body: "Întrebați în cuvinte simple, în limba dumneavoastră. Fiecare răspuns își numește sursele: decizii cu fraza din care vin, sarcini, întrebări deschise și riscuri.",
                    },
                    {
                        title: "Întrebați din instrumentele pe care le folosiți deja.",
                        body: "Pe web, ca conector Claude, în Claude Code, Cursor și VS Code, sau menționați @InteliLang în Slack și răspunsul apare în fir.",
                    },
                    {
                        title: "Construit ca să i se poată încredința memoria unui proiect.",
                        body: "Securitate la nivel de rând, nefolosit niciodată la antrenarea AI, chei criptate, jurnal de activitate și conținut vechi care se șterge singur, după regulile dumneavoastră.",
                    }
                ],
                facts: [
                    {
                        label: "Preț",
                        value: "Gratuit în acces timpuriu. Planuri plătite mai târziu, pe firmă, niciodată pe persoană.",
                    },
                    {
                        label: "AI",
                        value: "Rulează pe propria cheie Anthropic, fără adaos",
                    },
                    {
                        label: "Limbi",
                        value: "Română și engleză",
                    },
                    {
                        label: "Pentru",
                        value: "Studiouri, agenții și echipe de produs",
                    },
                    {
                        label: "Învață din",
                        value: "Slack, GitHub, Google Meet, Jira, înregistrări și documente",
                    }
                ],
            },
            "video-kit": {
                kind: "Plugin Claude Code · Open source",
                title: "Videoclipuri de produs, făcute din cod.",
                lede: "Filme de lansare, teasere și clipuri cu noutăți pentru produsul dumneavoastră, din codul sau site-ul lui, randate cu Remotion. Fără experiență video.",
                points: ["/video-kit:make, /video-kit:website și /video-kit:changelog", "Mac, Windows sau Linux cu Docker", "Filmul de aici a fost făcut chiar de video-kit"],
                cta: "Pe GitHub",
                metaTitle: "video-kit: videoclipuri de produs din cod, plugin Claude Code",
                metaDescription: "video-kit este un plugin Claude Code gratuit și open source care face filme de lansare, teasere și clipuri cu noutăți din codul sau site-ul produsului dumneavoastră.",
                features: [
                    {
                        title: "Filme de lansare din codul produsului.",
                        body: "/video-kit:make vă întreabă ce fel de video vă trebuie și cum să arate, citește cum funcționează produsul, vă arată un plan și cadre de aprobat, apoi randează filmul.",
                    },
                    {
                        title: "Nu aveți cod? Ajunge un site.",
                        body: "/video-kit:website citește culorile, logoul, fonturile și textele unui site, face capturi curate și creează videoclipul. Filmul acesta a fost făcut doar din doderasoft.com.",
                    },
                    {
                        title: "Un narator, înregistrat pe calculatorul dumneavoastră.",
                        body: "/video-kit:voiceover scrie câte o replică pentru fiecare scenă, vă lasă să alegeți o voce și potrivește videoclipul pe ea. Voci gratuite și deschise: fără cont, nimic încărcat online.",
                    },
                    {
                        title: "Noutățile, în 15–30 de secunde.",
                        body: "/video-kit:changelog găsește modificările pe care le vor observa utilizatorii, verifică fiecare în cod și le transformă într-un clip scurt de lansare.",
                    }
                ],
                facts: [
                    {
                        label: "Preț",
                        value: "Gratuit și open source (MIT)",
                    },
                    {
                        label: "Rulează pe",
                        value: "Mac, Windows sau Linux cu Docker",
                    },
                    {
                        label: "Primiți",
                        value: "Video 4K și 1080p, imagine de copertă și thumbnail YouTube",
                    },
                    {
                        label: "Randat cu",
                        value: "Remotion",
                    },
                    {
                        label: "Instalare",
                        value: "/plugin install video-kit@dodera",
                    }
                ],
            },
        },
    },
    productPage: {
        products: "Produse",
        featuresLabel: "Ce face",
        factsTitle: "Pe scurt",
        talk: "Construiți ceva asemănător",
        learnMore: "Vedeți produsul",
        builtTitle: (name) => `Vreți un produs ca ${name}?`,
        builtText: (name) => `${name} a fost gândit, construit și este întreținut de echipa noastră. Aduceți-ne ideea dumneavoastră și o construim cu aceeași grijă, de la prima schiță până la lansare.`,
        builtCta: "Vorbiți cu echipa din spatele lui",
        moreTitle: "Mai multe de la Dodera",
        indexTitle: "Produse pe care le construim",
        indexHighlight: "și le întreținem noi.",
        indexMetaTitle: "Produsele noastre: Pipstep, doderminal, InteliLang și video-kit",
        indexMetaDescription: "Produse gândite, construite și întreținute de Dodera Software: Pipstep, doderminal pentru Claude Code, memoria de proiect InteliLang și pluginul video-kit.",
        indexLead: "Patru produse gândite, construite și întreținute de echipa noastră: un antrenor de alergare pentru iPhone și Apple Watch, o aplicație Mac pentru Claude Code, o memorie AI pentru echipe de proiect și un plugin care face videoclipuri de produs.",
    },
    studio: {
        label: "Studioul",
        titleA: "Construit de oameni cărora",
        titleB: "le pasă cu adevărat.",
        text: "Am pornit în 2023 ca o echipă mică de ingineri software, iar energia aceea nu a dispărut. Astăzi acoperim fiecare strat al unui produs: inginerie, design, QA, AI și infrastructura cloud pe care rulează, alături de colaboratori de încredere atunci când un proiect are nevoie de mai multe mâini.",
        foundedLabel: "Înființată",
        disciplinesLabel: "Ce acoperim",
        disciplines: ["Dezvoltare backend", "Dezvoltare frontend", "Design UI / UX", "Testare și QA", "AI și automatizări", "Cloud și DevOps"],
        industriesLabel: "Domenii în care lucrăm",
        industries: ["Sănătate", "Servicii juridice", "Drone și aerospațial", "Fitness și wellness", "Companii de software"],
        stackLabel: "Tehnologii",
        aboutCta: "Mai multe despre noi",
    },
    caseStudies: {
        label: "Studii de caz",
        titleA: "Probleme reale.",
        titleB: "Rezultate măsurabile.",
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
        titleA: "Tehnologie care",
        titleB: "funcționează",
        intro: "Dacă e digital, îl putem construi. Aducem expertiza potrivită în fiecare proiect, iar când o provocare iese din aria noastră tehnică, ne asumăm găsirea și coordonarea oamenilor potriviți pentru a o livra.",
        exploreAria: (title) => `Aflați mai multe despre ${title}`,
        cta: "Să discutăm",
        items: [
            {
                icon: Code2,
                title: "Dezvoltare software",
                subtitle: "De la idee la lansare",
                description:
                    "Aplicații web personalizate, construite pe tehnologii moderne (Laravel, Next.js, Node.js și altele). De la MVP-uri în fază incipientă la platforme complete, ne ocupăm de întreaga livrare.",
                tags: ["Laravel", "Nuxt", "Vue.js", "React"],
                image: "/software-development.jpg",
                highlights: [
                    { label: "De la MVP la lansare", href: svc("software-development/mvp-to-market") },
                    { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
                    { label: "Produse SaaS", href: svc("software-development/saas-products") },
                ],
                href: svc("software-development"),
            },
            {
                icon: Monitor,
                title: "Site-uri de prezentare",
                subtitle: "Site-uri care impresionează și aduc clienți",
                description:
                    "Site-uri rapide, personalizate și responsive, construite să apară bine în Google și să aducă clienți. Ne ocupăm de tot, de la design și performanță până la SEO tehnic, ca site-ul să lucreze pentru dumneavoastră.",
                tags: ["Design de brand", "Landing page-uri", "Conversie"],
                image: "/presentation-website.webp",
                highlights: [
                    { label: "Site-uri de prezentare pentru firme", href: svc("presentation-websites/business-showcase-sites") },
                ],
                href: svc("presentation-websites"),
            },
            {
                icon: Cpu,
                title: "Dezvoltare AI",
                subtitle: "Fluxuri inteligente și agenți",
                description:
                    "Agenți AI și fluxuri automatizate care folosesc modele LLM de la OpenAI, Anthropic și alții. Îi conectăm la instrumentele și datele dumneavoastră existente, ca să ruleze operațiuni complexe fără intervenție manuală.",
                tags: ["Automatizarea fluxurilor", "Agenți AI", "Optimizarea proceselor"],
                image: "/ai-development.jpg",
                highlights: [
                    { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
                    { label: "Automatizări cu AI", href: svc("ai-development/ai-powered-automations") },
                ],
                href: svc("ai-development"),
            },
            {
                icon: FileText,
                title: "Documentație tehnică",
                subtitle: "Sisteme de cunoștințe și indexare",
                description:
                    "Codul, procesele și cunoștințele interne transformate în documentație structurată, pregătită pentru AI: ușor de găsit și de folosit, atât de echipa dumneavoastră, cât și de instrumentele pe care le folosiți.",
                tags: ["Indexarea cunoștințelor", "Context pentru AI", "Documentație"],
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
                title: "Înțelegem viziunea dumneavoastră",
                description:
                    "Sesiuni structurate de analiză leagă obiectivele dumneavoastră de rezultate măsurabile, astfel încât scopul este stabilit înainte să planificăm prima linie de cod.",
            },
            {
                icon: Layers,
                title: "Stabilim arhitectura",
                description:
                    "Tehnologiile sunt alese pentru dimensiunea dumneavoastră, nu a noastră. API-urile, modelele de date și interfețele dintre componente sunt documentate și aprobate înainte de primul commit.",
            },
            {
                icon: Zap,
                title: "Construim și iterăm",
                description:
                    "Publicăm săptămânal pe mediul de test, ca să testați versiuni reale, nu machete. Blocajele sunt semnalate din timp, fără surprize la termen.",
            },
            {
                icon: Handshake,
                title: "Lansăm și oferim suport",
                description:
                    "Lansarea vine cu proceduri de operare, dashboard-uri de monitorizare și o perioadă de stabilizare. Nu doar o arhivă cu cod predată în ultima zi.",
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
                tagline: "Responsabilitate completă",
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
        getStarted: "Începeți",
        notSure: "Nu știți ce model vi se potrivește?",
        tellUs: "Spuneți-ne despre proiect",
        suggest: "și vă recomandăm abordarea potrivită.",
    },
    cta: {
        label: "Gata să construim?",
        titleA: "Nu mai căutați programatori.",
        titleB: "Începeți să construiți.",
        textBefore: "Programați o discuție",
        free: "gratuită",
        textAfter: "de 30 de minute despre arhitectură. Analizăm proiectul și vă spunem exact ce este nevoie ca să-l lansați.",
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
    blogIndex: {
        eyebrow: "Blog",
        title: "Blog despre software, AI și",
        highlight: "site-uri.",
        lead: "Articole în română despre dezvoltare software, agenți AI, automatizări și site-uri de prezentare, scrise de echipa Dodera Software, cu prețuri reale și exemple din proiectele noastre.",
        latest: "Cele mai noi articole",
        tagged: (tag) => `Articole cu eticheta „${tag}”`,
        all: "Toate",
        more: "Mai multe",
        filterAria: "Filtrați după etichetă",
        noneForTag: "Nu am găsit articole cu această etichetă.",
        emptyTitle: "Primele articole în română apar în curând.",
        emptyText: "Până atunci, puteți citi articolele noastre în engleză.",
        emptyLink: { label: "Blogul în engleză", href: "/blog" },
        readMore: "Citiți articolul",
        pinnedTags: [],
    },
    blogPost: {
        dateLocale: "ro-RO",
        back: "Înapoi la blog",
        updated: "Actualizat",
        article: "Articolul",
        comingSoon: "Conținutul complet al articolului apare în curând.",
        ctaTitle: "Vreți să construim următorul dumneavoastră proiect?",
        ctaText: "Scriem despre dezvoltare software pentru că o facem în fiecare zi. Dacă vă place cum gândim, o să vă placă și cum construim.",
        ctaButton: "Începeți un proiect",
        moreBy: "Mai multe articole de",
    },
    careers: {
        eyebrow: "Cariere",
        title: "Alăturați-vă echipei",
        highlight: "Dodera Software.",
        lead: "Suntem o echipă mică și concentrată de ingineri și designeri cărora le pasă cu adevărat de calitate și de responsabilitate. Lucrăm repede, comunicăm deschis și construim lucruri care contează pentru clienți din întreaga lume. Dacă sunteți pasionat de tehnologie, locul dumneavoastră este aici.",
        openTitle: "Posturi disponibile",
        noneTitle: "Momentan nu avem posturi deschise",
        noneText: "Nu avem posturi deschise în acest moment. Dacă aveți o abilitate care vă diferențiază și credeți că vă potriviți în echipă, scrieți-ne. Ne-ar face plăcere să vă cunoaștem.",
        contact: "Scrieți-ne",
        apply: "Aplicați pentru acest post",
        whyLabel: "De ce Dodera",
        whyTitle: "De ce Dodera?",
        why: [
            { title: "Responsabilitate reală", body: "Fiecare inginer își duce munca de la cap la coadă: proiectează, construiește și publică funcționalități folosite de utilizatori reali." },
            { title: "Lucru de la distanță", body: "Lucrați de unde sunteți cel mai productiv. Suntem obișnuiți să colaborăm la distanță, în fusuri orare diferite." },
            { title: "Proiecte care contează", body: "Clienții noștri sunt atât startupuri, cât și companii consacrate. Veți lucra la probleme reale, cu rezultate pe care le vedeți." },
            { title: "Tehnologii moderne", body: "Next.js, TypeScript, Laravel, instrumente AI. Folosim cele mai potrivite instrumente pentru fiecare proiect și ținem pasul cu ele." },
            { title: "Cultură transparentă", body: "Feedback sincer, așteptări clare și inițiativă. Comunicăm deschis și rezolvăm problemele înainte să devină probleme mari." },
            { title: "Plată corectă", body: "Apreciem munca bună și o plătim pe măsură, cu forme de colaborare potrivite atât pentru colaboratori, cât și pentru angajați." },
        ],
    },
    about: {
        eyebrow: "Despre noi",
        title: "Firmă de software din România,",
        highlight: "din 2023.",
        lead: "Dodera Software este o firmă de dezvoltare software din România, fondată în 2023, care construiește aplicații web, site-uri de prezentare, agenți AI și automatizări pentru clienți din țară și din străinătate. Lucrăm pe oră, pe sarcină sau pe proiect, cu preț fix stabilit de la început.",
        stats: [
            { value: "2023", label: "Înființată" },
            { value: "300 €", label: "Proiecte de la" },
            { value: "România", label: "Sediul" },
        ],
        founderLabel: "Fondator",
        storyLabel: "Cine suntem",
        storyTitle: "Oameni care construiesc cu grijă.",
        story: [
            "Am pornit Dodera Software ca ingineri care au văzut prea multe idei bune eșuând din cauza unei execuții tehnice slabe. Am construit firma pe o convingere simplă: software-ul trebuie să fie de încredere, ușor de înțeles și cu adevărat util pentru cei care îl folosesc.",
            "Acoperim tot drumul unui produs: arhitectură, backend, frontend, design, AI și infrastructură. Ne asumăm proiectul de la prima schiță de arhitectură până la ultima publicare și rămânem alături de el și după lansare, dacă doriți.",
            "Fie că aveți nevoie de un partener tehnic pe termen lung, fie de o echipă care să livreze o singură funcționalitate importantă, ne adaptăm la ritmul și la obiectivele dumneavoastră.",
        ],
        valuesLabel: "Cum lucrăm",
        valuesTitle: "Pe ce vă puteți baza.",
        values: [
            { title: "Calitate, fără compromisuri", body: "Scriem cod testat, revizuit și documentat. Fiecare modificare trece prin code review înainte să ajungă în producție." },
            { title: "Progres vizibil în fiecare săptămână", body: "Publicăm săptămânal pe un mediu de test, așa că vedeți aplicația reală pe tot parcursul proiectului, nu doar la final." },
            { title: "Transparență", body: "Comunicare clară, actualizări săptămânale și acces direct la oamenii care lucrează la produsul dumneavoastră." },
            { title: "Preț stabilit de la început", body: "Pentru proiecte lucrăm cu preț fix, convenit înainte de începere. Fără facturi surpriză." },
        ],
        capabilitiesLabel: "Ce construim",
        capabilitiesTitle: "Construim orice produs digital.",
        capabilities: [
            { title: "Aplicații web", description: "Platforme SaaS, panouri de administrare, magazine online și tot ce e între ele, gândite să crească odată cu afacerea.", tags: ["React", "Next.js", "Nuxt", "Laravel"], service: "software-development" },
            { title: "Site-uri de prezentare", description: "Site-uri rapide, optimizate pentru Google, care transformă vizitatorii în cereri de ofertă.", tags: ["Next.js", "SEO", "Performanță"], service: "presentation-websites" },
            { title: "Sisteme AI", description: "Integrăm modele OpenAI și Claude în produsele dumneavoastră: agenți personalizați, interfețe de chat și fluxuri care automatizează decizii reale.", tags: ["OpenAI", "Claude"], service: "ai-development/custom-ai-agents" },
            { title: "Automatizări", description: "Fluxuri automate care elimină munca repetitivă și conectează instrumentele pe care le folosiți deja.", tags: ["n8n", "Fluxuri personalizate"], service: "ai-development/ai-powered-automations" },
            { title: "API-uri și backend", description: "Proiectăm și construim API-uri REST, scheme de baze de date și logică de server rapide, sigure și ușor de întreținut.", tags: ["Node.js", "PostgreSQL"] },
            { title: "Documentație tehnică", description: "Sisteme de documentare și baze de cunoștințe pregătite pentru AI, pentru cod și procese interne.", tags: ["Baze de cunoștințe", "Context AI"], service: "technical-documentation" },
            { title: "DevOps și CI/CD", description: "Containere, pipeline-uri de publicare automată și infrastructură cloud, de la zero până în producție.", tags: ["Docker", "Kubernetes", "GitHub Actions", "AWS"] },
        ],
        faqLabel: "Întrebări și răspunsuri",
        faqTitle: "Întrebări frecvente.",
        faq: [
            { question: "Unde își are sediul Dodera Software?", answer: "Suntem o firmă din România și lucrăm cu clienți din țară și din străinătate. Toată colaborarea se desfășoară de la distanță, prin apeluri video, comunicare clară și demo-uri săptămânale." },
            { question: "Ce dimensiune au proiectele pe care le preluați?", answer: "De la sarcini punctuale, facturate pe oră sau cu preț fix de la 50 EUR, până la produse complete livrate ca proiecte, de la 300 EUR la peste 30.000 EUR. Fie că aveți nevoie de o singură integrare, fie de o platformă SaaS completă, vă putem ajuta." },
            { question: "Puteți lucra împreună cu programatorii noștri?", answer: "Da. Ne putem integra ca o extensie a echipei dumneavoastră, adaptându-ne la tehnologiile, la fluxul Git și la ritmul de lucru pe care îl folosiți deja." },
            { question: "Cum vă asigurați de calitatea codului?", answer: "Fiecare proiect trece prin code review, teste automate și o etapă de verificare înainte de livrare. Configurăm pipeline-uri CI/CD care aplică aceleași reguli la fiecare modificare." },
            { question: "Lucrați cu startupuri aflate la început?", answer: "Da. Oferim sfaturi de arhitectură și de alegere a tehnologiilor și putem construi un MVP în 4–8 săptămâni, ca să ajungeți la primii utilizatori sau la investitori cât mai repede." },
            { question: "În ce limbă comunicați?", answer: "În română sau în engleză, cum preferați. Documentația și aplicațiile le putem livra în ambele limbi." },
        ],
    },
    caseStudyPage: {
        hub: "Studii de caz",
        hubTitle: "Studii",
        hubHighlight: "de caz.",
        hubLead: "Probleme reale pe care le-am rezolvat pentru clienți, cu tehnologiile folosite, durata și rezultatul măsurabil.",
        readCase: "Citiți studiul de caz",
        client: "Client",
        stack: "Tehnologii",
        timeline: "Durată",
        result: "Rezultat",
        problem: "Problema",
        solution: "Ce am construit",
        outcome: "Rezultatul",
        services: "Servicii folosite",
        cta: "Aveți o problemă asemănătoare?",
        ctaText: "Spuneți-ne despre ea. Prima discuție, în care stabilim scopul împreună, este gratuită.",
        ctaButton: "Începeți un proiect",
        lead: (cs) =>
            `Studiu de caz Dodera Software, ${cs.industry.toLowerCase()}. Client: ${lowerFirst(cs.client)}${cs.timeline ? `; proiect livrat în ${cs.timeline}` : ""}. Rezultat: ${cs.metric} ${cs.metricLabel}.`,
        description: (cs) => `Studiu de caz: ${lowerFirst(cs.client)}. Rezultat: ${cs.metric} ${cs.metricLabel}.`,
    },
    contactPage: {
        eyebrow: "Contact",
        title: "Contact",
        highlight: "Dodera Software.",
        lead: "Dodera Software este o firmă de dezvoltare software din România, care lucrează cu clienți din țară și din străinătate. Ne puteți suna la 0748 650 469 sau ne puteți scrie la office@doderasoft.com; prima discuție, în care stabilim scopul proiectului, este gratuită.",
        detailsTitle: "Date de contact",
        address: "Adresă",
        phone: "Telefon",
        email: "Email",
        hours: "Program",
        weekdays: "Luni–Vineri",
        maps: "Deschideți în Google Maps",
        registration: "Nr. Reg. Com.",
        taxId: "CUI",
        country: "România",
        howTitle: "Cum lucrăm cu dumneavoastră",
        how: [
            "Lucrăm de la distanță cu clienți din România și din străinătate: apeluri video, un board de proiect comun și demo săptămânal.",
            "Răspundem la fiecare mesaj în cel mult 24 de ore, în zilele lucrătoare.",
        ],
        formTitle: "Spuneți-ne despre proiect",
    },
    servicesIndex: {
        eyebrow: "Servicii",
        title: "Dezvoltare software, site-uri și",
        highlight: "AI.",
        intro: "Dodera Software este o firmă de dezvoltare software din România care construiește aplicații web, site-uri de prezentare, agenți AI și automatizări pentru clienți din țară și din străinătate. Lucrăm cu preț fix pe proiect, de la 300 EUR, pe sarcină, de la 50 EUR, sau pe oră, între 20 și 80 EUR.",
        subServices: "Include",
        learnMore: "Aflați mai multe",
        ctaTitle: "Nu știți exact de ce aveți nevoie?",
        ctaText: "Spuneți-ne ce problemă vreți să rezolvați. Stabilim scopul împreună, gratuit, și vă trimitem o ofertă cu preț fix.",
        ctaButton: "Începeți un proiect",
    },
    servicePage: {
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
        readCaseStudy: "Citiți studiul de caz complet",
    },
    notFound: {
        title: "Pagina nu a fost găsită",
        text: "Pagina pe care o căutați nu există sau a fost mutată.",
        back: "Înapoi la pagina principală",
    },
};
