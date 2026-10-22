/**
 * Paginile de servicii în limba română (/ro/servicii/...).
 *
 * Cheile sunt aceleași ca în config/services.ts (varianta engleză), astfel
 * încât fiecare pagină își cunoaște perechea pentru hreflang. Căile românești
 * sunt definite în src/i18n/paths.ts.
 *
 * Reguli pentru conținut:
 * - prețurile vin din modelul publicat (config/pricing.ts PRICE_FACTS);
 * - duratele sunt cele deja afirmate pe site-ul în engleză;
 * - fără cifre sau afirmații pe care nu le putem susține (vezi raportul SEO).
 *
 * TODO(owner): intervale de preț tipice pe fiecare tip de proiect (ex. „site de
 * prezentare: X–Y EUR”). Până atunci, paginile folosesc modelul general de preț.
 */

import type { ServicePageData, ServicePagePricing } from "@/types";
import { SERVICE_PATHS } from "@/i18n/paths";

const svc = (key: string) => SERVICE_PATHS[key].ro!;

/** Case study indexes in the dictionary (i18n/dictionaries/*.ts caseStudies.items). */
const CASE = { freightAutomation: 0, saasDashboard: 1, clinicBooking: 2 } as const;

const STANDARD_FOOTNOTE =
    "Discuția inițială și stabilirea scopului sunt gratuite. Înainte de a începe lucrul primiți o ofertă scrisă, cu preț fix și calendar.";

function standardPricing(intro: string, projectNote: string): ServicePagePricing {
    return {
        intro,
        items: [
            { label: "Proiect cu preț fix", price: "de la 300 EUR", note: projectNote },
            { label: "Sarcini punctuale", price: "de la 50 EUR", note: "O funcționalitate, o integrare sau o remediere, cu preț fix." },
            { label: "Lucru pe oră", price: "20–80 EUR / oră", note: "Consultanță, audit sau lucru când scopul nu este încă clar." },
            { label: "Mentenanță și dezvoltare continuă", price: "de la 150 EUR / lună", note: "Abonament lunar, cu scop ajustabil; puteți renunța oricând." },
        ],
        footnote: STANDARD_FOOTNOTE,
    };
}

export const SERVICE_PAGES_RO: Record<string, ServicePageData> = {
    /* ──────────────────────────────────────────────────────
     * Dezvoltare software (hub)
     * ────────────────────────────────────────────────────── */
    "software-development": {
        slug: "dezvoltare-software",
        ogImage: "/og-images/og-software-development.png",
        metaTitle: "Dezvoltare software Satu Mare și România",
        metaDescription:
            "Firmă de dezvoltare software din Satu Mare: aplicații web, MVP-uri, SaaS și magazine online pentru firme din România. Preț fix de la 300 EUR.",
        keywords: [
            "dezvoltare software Satu Mare",
            "firmă IT Satu Mare",
            "dezvoltare aplicații web",
            "firmă dezvoltare software România",
            "software personalizat",
            "aplicații web la comandă",
        ],
        canonical: svc("software-development"),
        heroLabel: "Dezvoltare software",
        heroTitle: "Dezvoltare software și aplicații web",
        heroHighlight: "pentru companii din România.",
        heroDescription:
            "Dodera Software este o firmă de dezvoltare software din Satu Mare care construiește aplicații web personalizate, MVP-uri, produse SaaS și platforme interne pentru companii din toată România. Lucrăm cu preț fix pe proiect, de la 300 EUR, sau pe oră, între 20 și 80 EUR, iar în fiecare săptămână vedeți o versiune funcțională.",
        sections: [
            {
                title: "Ce înseamnă software personalizat",
                content:
                    "Software personalizat înseamnă o aplicație construită în jurul felului în care lucrează firma dumneavoastră, nu invers. În loc să vă adaptați procesele la un program cumpărat la cheie, primiți un sistem care face exact ce aveți nevoie: un portal pentru clienți, un sistem de comenzi, o aplicație de programări, un dashboard intern sau un magazin online cu reguli proprii. Ne ocupăm de tot ciclul: analiză, arhitectură, dezvoltare, testare, lansare și mentenanță.",
                highlights: ["Software personalizat"],
                bullets: [
                    "Aplicații web și portaluri pentru clienți sau parteneri",
                    "Sisteme interne: comenzi, stocuri, programări, raportare",
                    "Magazine online cu logică personalizată, B2B sau B2C",
                    "Integrări cu ERP, CRM, facturare și API-uri externe",
                    "Preluarea și modernizarea aplicațiilor existente",
                ],
            },
            {
                title: "Tehnologiile cu care lucrăm",
                content:
                    "Alegem tehnologia după proiect, nu după obișnuință. Pentru majoritatea aplicațiilor web folosim un backend în Laravel sau Node.js și un frontend în React, Next.js, Vue sau Nuxt, cu TypeScript acolo unde contează siguranța tipurilor. Datele stau în PostgreSQL sau MySQL, cu Redis pentru cache și cozi de procesare. Aplicațiile rulează în containere Docker, pe infrastructura potrivită bugetului: de la un server dedicat până la AWS sau Azure.",
                bullets: [
                    "Backend: Laravel (PHP) și Node.js",
                    "Frontend: React, Next.js, Vue.js și Nuxt",
                    "Baze de date: PostgreSQL, MySQL, MongoDB, Redis",
                    "Infrastructură: Docker, CI/CD, AWS, Azure",
                    "Teste automate: unitare, de integrare și end-to-end",
                ],
            },
            {
                title: "Cum decurge un proiect",
                content:
                    "Începem cu o discuție gratuită în care înțelegem problema și stabilim împreună scopul. Urmează o etapă scurtă de analiză, în care documentăm funcționalitățile, modelul de date și integrările; la final primiți un preț fix și un calendar. Dezvoltarea are loc în iterații scurte și publicăm săptămânal pe un mediu de test, ca să verificați aplicația reală, nu machete. După lansare urmează o perioadă de stabilizare, apoi, dacă doriți, mentenanță lunară.",
                bullets: [
                    "Discuție inițială și stabilirea scopului, fără cost",
                    "Ofertă cu preț fix și calendar înainte de primul rând de cod",
                    "Demo săptămânal pe mediul de test",
                    "Lansare cu monitorizare și perioadă de stabilizare",
                    "Codul sursă și documentația vă aparțin",
                ],
            },
            {
                title: "Cât durează",
                content:
                    "Durata depinde de complexitate. Un MVP concentrat pe o singură problemă durează de obicei 4–8 săptămâni. Un produs SaaS cu autentificare, abonamente și panou de administrare durează în jur de 8–14 săptămâni. Platformele mari, cu multe integrări, se construiesc etapizat, astfel încât prima parte utilă ajunge la utilizatori cât mai devreme, iar restul se adaugă pe măsură ce primiți feedback.",
                links: [
                    { label: "MVP în 4–8 săptămâni", href: svc("software-development/mvp-to-market") },
                    { label: "Produse SaaS", href: svc("software-development/saas-products") },
                    { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
                ],
            },
            {
                title: "În Satu Mare sau de la distanță",
                content:
                    "Biroul nostru este în Satu Mare, pe Strada Banat 1, așa că pentru clienții din oraș și din împrejurimi ne putem întâlni față în față la începutul proiectului și la momentele importante. Cu firmele din Baia Mare, Oradea, Zalău, Cluj-Napoca sau din restul țării lucrăm de la distanță: apeluri video, un board de proiect la care aveți acces și demo-uri săptămânale. Comunicăm în română sau în engleză, cum preferați.",
            },
        ],
        childServices: [
            {
                iconName: "Rocket",
                label: "MVP – produs minim viabil",
                description: "Prima versiune funcțională a produsului, gata de testat cu utilizatori reali în 4–8 săptămâni, pe cod care rămâne baza produsului final.",
                href: svc("software-development/mvp-to-market"),
            },
            {
                iconName: "Building2",
                label: "Platforme enterprise",
                description: "Sisteme interne pentru companii medii și mari, integrate cu ERP-ul și CRM-ul, cu acces pe roluri, audit și livrare etapizată.",
                href: svc("software-development/enterprise-platforms"),
            },
            {
                iconName: "Cloud",
                label: "Produse SaaS",
                description: "Aplicații vândute pe abonament: arhitectură multi-tenant, plăți recurente cu Stripe, roluri și panou de administrare.",
                href: svc("software-development/saas-products"),
            },
        ],
        pricing: standardPricing(
            "Lucrăm pe patru modele de preț. Pentru aplicațiile noi recomandăm prețul fix, stabilit după discuția inițială.",
            "Aplicații complete; prețul exact rezultă din scopul stabilit împreună. Proiectele mari pot depăși 30.000 EUR.",
        ),
        caseStudy: CASE.clinicBooking,
        faqs: [
            {
                question: "Cât costă dezvoltarea unei aplicații web?",
                answer: "Proiectele cu preț fix pornesc de la 300 EUR, iar aplicațiile complexe pot depăși 30.000 EUR. Prețul depinde de numărul de funcționalități, de integrări și de cerințele de securitate. După o discuție gratuită și o scurtă analiză vă trimitem o ofertă scrisă, cu preț fix și calendar, înainte să începem lucrul.",
            },
            {
                question: "Cât durează să construiți o aplicație?",
                answer: "Un MVP durează de obicei 4–8 săptămâni, un produs SaaS cu abonamente și panou de administrare în jur de 8–14 săptămâni, iar platformele mari se livrează etapizat. Primiți un calendar concret după etapa de analiză și vedeți progresul în fiecare săptămână, pe mediul de test.",
            },
            {
                question: "Lucrați și cu aplicații existente?",
                answer: "Da. Multe proiecte înseamnă preluarea, refactorizarea sau extinderea unei aplicații existente. Începem cu un audit al codului, ca să înțelegem starea lui reală, apoi vă propunem un plan de îmbunătățire pas cu pas, fără să oprim aplicația pe care o folosesc clienții dumneavoastră.",
            },
            {
                question: "Ale cui sunt codul sursă și datele?",
                answer: "Ale dumneavoastră. La finalul proiectului primiți codul sursă complet, documentația și accesul la infrastructură. Nu vă legăm de noi: orice altă echipă poate continua dezvoltarea pornind de la ce am predat.",
            },
            {
                question: "Puteți mări sau micșora echipa în funcție de proiect?",
                answer: "Da. Putem aduce ingineri în plus pentru etapele cu termene strânse și putem reduce echipa în perioadele de mentenanță, astfel încât plătiți doar capacitatea de care aveți nevoie.",
            },
            {
                question: "Lucrați doar cu firme din Satu Mare?",
                answer: "Nu. Avem biroul în Satu Mare, unde ne putem întâlni față în față, dar lucrăm cu companii din toată România și din străinătate. Pentru clienții din alte orașe totul se desfășoară de la distanță: apeluri video, acces la board-ul proiectului și demo săptămânal.",
            },
        ],
        relatedServices: [
            { label: "MVP – produs minim viabil", href: svc("software-development/mvp-to-market") },
            { label: "Produse SaaS", href: svc("software-development/saas-products") },
            { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations") },
        ],
    },

    "software-development/mvp-to-market": {
        slug: "mvp",
        parentSlug: "software-development",
        metaTitle: "Dezvoltare MVP pentru startupuri",
        metaDescription:
            "Construim MVP-uri funcționale în 4–8 săptămâni, cu cod gata de producție, pentru startupuri și firme din România. Preț fix și demo săptămânal.",
        keywords: [
            "dezvoltare MVP",
            "produs minim viabil",
            "MVP aplicație web",
            "cost MVP aplicație web",
            "dezvoltare aplicație startup",
        ],
        canonical: svc("software-development/mvp-to-market"),
        heroLabel: "MVP – produs minim viabil",
        heroTitle: "Dezvoltare MVP:",
        heroHighlight: "de la idee la primii utilizatori.",
        heroDescription:
            "Dodera Software construiește MVP-uri pentru startupuri și companii din Satu Mare și din toată România: prima versiune funcțională a produsului, gata de testat cu utilizatori reali în 4–8 săptămâni. Lucrăm cu preț fix stabilit după o discuție gratuită, iar codul rămâne baza produsului final.",
        sections: [
            {
                title: "Ce este un MVP",
                content:
                    "Un MVP (minimum viable product, adică produs minim viabil) este prima versiune reală a produsului dumneavoastră: suficient de restrânsă încât să fie construită repede, dar suficient de completă încât oamenii să o poată folosi. Scopul este să aflați dacă produsul rezolvă o problemă reală înainte să investiți luni de zile în versiunea completă. Nu este o machetă și nici un demo de aruncat, ci o aplicație care rulează în producție.",
                highlights: ["MVP", "produs minim viabil"],
                bullets: [
                    "Funcționalitățile de bază, construite în jurul unei singure probleme",
                    "Utilizatori reali și feedback real, înainte de investiția mare",
                    "Cod gata de producție, care crește în produsul complet",
                    "Lansare în săptămâni, nu în luni",
                ],
            },
            {
                title: "De ce să începeți cu un MVP",
                content:
                    "Cel mai mare risc pentru un produs nou nu este cel tehnic, ci să construiți ceva de care nu are nimeni nevoie. Un MVP vă permite să testați ipoteza principală cu utilizatori reali, cu un buget limitat. Vă ajutăm să alegeți cel mai mic set de funcționalități care aduce valoare, îl construim repede și îl punem în mâinile primilor clienți.",
                bullets: [
                    "Validați cererea înainte de investiția majoră",
                    "Folosiți feedbackul real ca să decideți ce urmează",
                    "Prezentați investitorilor un produs care funcționează",
                    "Reduceți riscul testând presupunerile devreme",
                ],
            },
            {
                title: "Ce primiți",
                content:
                    "MVP-ul nu este cod de aruncat. Îl construim pe fundații solide, ca să puteți crește fără rescriere: infrastructură de producție, teste automate, publicare automată (CI/CD) și documentație.",
                bullets: [
                    "Cod gata de producție, nu un prototip",
                    "Aplicație web adaptată pentru mobil sau API",
                    "Autentificare și gestionarea utilizatorilor",
                    "Panou de administrare",
                    "Analytics și urmărirea evenimentelor importante",
                    "Codul sursă complet, în proprietatea dumneavoastră",
                ],
            },
            {
                title: "Cum construim un MVP în 4–8 săptămâni",
                content:
                    "Prima săptămână este dedicată scopului: stabilim împreună problema principală, cine sunt utilizatorii și setul minim de funcționalități, și tăiem tot ce nu este necesar pentru primul test. Urmează între trei și șase săptămâni de dezvoltare, cu demo săptămânal pe mediul de test, apoi lansarea și o perioadă scurtă de suport, în care rezolvăm ce apare la primii utilizatori. Un instrument SaaS simplu se încadrează de obicei în 4–5 săptămâni; o platformă cu mai multe tipuri de utilizatori, în 6–8.",
                bullets: [
                    "Săptămâna 1: scop, utilizatori, lista minimă de funcționalități",
                    "Săptămânile 2–7: dezvoltare, cu demo în fiecare săptămână",
                    "Lansare, apoi suport pentru primii utilizatori",
                ],
            },
            {
                title: "Pe ce tehnologii construim",
                content:
                    "Folosim aceleași tehnologii ca la proiectele mari, ca să nu fie nevoie de rescriere când produsul crește: Laravel sau Node.js pe backend, React, Next.js, Vue sau Nuxt pe frontend și PostgreSQL pentru date. Pentru produsele vândute pe abonament integrăm plăți online cu Stripe încă din prima versiune.",
                links: [
                    { label: "Produse SaaS", href: svc("software-development/saas-products") },
                    { label: "Toate serviciile de dezvoltare software", href: svc("software-development") },
                ],
            },
        ],
        pricing: standardPricing(
            "Un MVP se construiește cu preț fix. Prețul depinde de numărul de tipuri de utilizatori, de integrări și de plăți.",
            "MVP complet, de la scop la lansare; prețul exact rezultă din prima săptămână de analiză.",
        ),
        // TODO(owner): a real MVP case study (client, timeline, result) — none of the three current ones is an MVP.
        faqs: [
            {
                question: "Cât costă un MVP pentru o aplicație web?",
                answer: "Proiectele cu preț fix pornesc de la 300 EUR. Un MVP cu un singur tip de utilizator și puține integrări este la capătul de jos al intervalului; o platformă cu mai multe roluri, plăți și integrări costă mai mult. Prețul exact îl primiți în scris după prima săptămână, în care stabilim împreună scopul.",
            },
            {
                question: "Cât durează să construiți un MVP?",
                answer: "Majoritatea MVP-urilor durează 4–8 săptămâni de la start până la lansare. Un instrument SaaS simplu poate fi gata în 4–5 săptămâni, iar o platformă cu mai multe tipuri de utilizatori în 6–8 săptămâni.",
            },
            {
                question: "Ce include procesul de dezvoltare a unui MVP?",
                answer: "Analiza și stabilirea scopului, arhitectura tehnică, dezvoltarea în iterații scurte, testarea, lansarea în producție și suportul după lansare. Primiți cod gata de producție, documentație și analytics configurat, ca să măsurați interesul utilizatorilor din prima zi.",
            },
            {
                question: "Codul MVP-ului poate deveni produsul complet?",
                answer: "Da. Construim MVP-urile pe aceleași arhitecturi și tehnologii pe care le folosim la proiectele mari. Codul este curat, testat și gândit să crească, nu un prototip care trebuie aruncat.",
            },
            {
                question: "Mă ajutați să decid ce funcționalități intră în MVP?",
                answer: "Da, aceasta este chiar prima etapă. Identificăm împreună problema principală pe care o rezolvă produsul, cine sunt primii utilizatori și ce trebuie să existe neapărat în prima versiune. Restul trece pe lista pentru după lansare.",
            },
            {
                question: "Pot continua dezvoltarea cu altă echipă?",
                answer: "Da. Codul sursă și documentația vă aparțin. Puteți continua cu noi, pe abonament lunar sau pe proiect, ori cu orice altă echipă.",
            },
        ],
        relatedServices: [
            { label: "Dezvoltare software", href: svc("software-development") },
            { label: "Produse SaaS", href: svc("software-development/saas-products") },
            { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
        ],
    },

    "software-development/enterprise-platforms": {
        slug: "platforme-enterprise",
        parentSlug: "software-development",
        metaTitle: "Dezvoltare platforme enterprise",
        metaDescription:
            "Platforme software pentru companii medii și mari: integrare ERP și CRM, acces pe roluri, jurnal de audit și GDPR. Livrare etapizată, preț fix pe etapă.",
        keywords: [
            "platforme enterprise",
            "software pentru companii",
            "integrare ERP",
            "aplicații interne companii",
            "modernizare aplicații vechi",
        ],
        canonical: svc("software-development/enterprise-platforms"),
        heroLabel: "Platforme enterprise",
        heroTitle: "Platforme enterprise",
        heroHighlight: "construite pentru operațiunile dumneavoastră.",
        heroDescription:
            "Dodera Software proiectează și dezvoltă platforme enterprise pentru companii medii și mari din România: sisteme interne care leagă departamentele, se integrează cu ERP-ul și CRM-ul și înlocuiesc procesele manuale. Lucrăm din Satu Mare, livrăm etapizat și stabilim un preț fix pentru fiecare etapă.",
        sections: [
            {
                title: "Ce este o platformă enterprise",
                content:
                    "O platformă enterprise este un sistem software care susține operațiunile de bază ale unei organizații: leagă departamentele, procesează volume mari de date și tranzacții și se integrează cu instrumentele existente, precum ERP-ul sau CRM-ul. Spre deosebire de o aplicație mică, trebuie să respecte cerințe stricte de securitate, de disponibilitate și de protecție a datelor și să servească în același timp sute de utilizatori, fiecare cu drepturile lui.",
                highlights: ["platformă enterprise", "ERP-ul sau CRM-ul"],
                bullets: [
                    "Procesarea unor volume mari de date și tranzacții",
                    "Integrări cu ERP, CRM, salarizare și sisteme vechi",
                    "Acces pe roluri și jurnal de audit complet",
                    "Protecția datelor conform GDPR, gândită din arhitectură",
                ],
            },
            {
                title: "Integrarea cu sistemele existente",
                content:
                    "O platformă enterprise nu stă niciodată singură. Construim straturi de API și cozi de mesaje care leagă noua platformă de CRM, ERP, salarizare, facturare și de sistemele vechi, astfel încât datele circulă fără copiere manuală. Tratăm migrarea datelor ca pe o etapă separată, cu verificări înainte și după, ca să nu se piardă nimic și ca echipele să lucreze fără întreruperi.",
            },
            {
                title: "Securitate, roluri și audit",
                content:
                    "Fiecare utilizator vede și modifică doar ce îi permite rolul. Fiecare acțiune importantă rămâne înregistrată în jurnalul de audit, ca să puteți răspunde oricând la întrebarea „cine a modificat asta și când”. Datele sunt criptate în tranzit și la stocare, iar cerințele GDPR (acces la date, ștergere, păstrare limitată) sunt incluse din faza de arhitectură, nu adăugate la final.",
                bullets: [
                    "Acces pe roluri și pe departamente",
                    "Jurnal de audit pentru acțiunile importante",
                    "Criptarea datelor în tranzit și la stocare",
                    "Autentificare cu SSO și autentificare în doi pași",
                ],
            },
            {
                title: "Performanță și monitorizare",
                content:
                    "Gândim performanța din prima zi. Platformele sunt testate la încărcare înainte de lansare, iar în producție rulează cu monitorizare și alerte (Prometheus, Grafana, Sentry), ca problemele să fie observate înainte să le observe utilizatorii. Arhitectura se alege după volumul real: un sistem modular bine construit este adesea mai potrivit decât zeci de microservicii.",
            },
            {
                title: "Modernizarea sistemelor vechi",
                content:
                    "Dacă firma rulează pe o aplicație veche, o putem moderniza treptat, fără o rescriere „peste noapte”. Folosim tiparul strangler fig: înlocuim pe rând componentele vechi cu unele noi, în timp ce sistemul existent continuă să funcționeze. Riscul este mai mic, iar beneficiile apar mai repede.",
                links: [
                    { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations") },
                    { label: "Documentație tehnică", href: svc("technical-documentation") },
                ],
            },
        ],
        pricing: standardPricing(
            "Platformele mari se livrează etapizat. Fiecare etapă are scopul și prețul ei fix, stabilite înainte de începere.",
            "Pe etapă; scopul și prețul fiecărei etape se stabilesc după analiză. Platformele complete depășesc adesea 30.000 EUR.",
        ),
        caseStudy: CASE.saasDashboard,
        faqs: [
            {
                question: "Cum migrați un sistem vechi fără să opriți activitatea?",
                answer: "Folosim tiparul strangler fig: înlocuim progresiv componentele vechi cu unele moderne, în timp ce sistemul existent rămâne funcțional. Astfel riscul este minim, nu există perioade lungi de nefuncționare, iar valoarea apare încă din primele etape.",
            },
            {
                question: "Cum tratați GDPR și alte cerințe de conformitate?",
                answer: "Includem cerințele de conformitate în arhitectură, nu le adăugăm la final: acces pe roluri, jurnal de audit, criptare, reguli de păstrare și ștergere a datelor. Dacă firma dumneavoastră trebuie să respecte și alte standarde, le discutăm în etapa de analiză și stabilim împreună controalele necesare.",
            },
            {
                question: "Puteți prelua o platformă existentă dezvoltată de altă firmă?",
                answer: "Da. Începem cu un audit al codului și al arhitecturii, ca să înțelegem starea reală a sistemului și datoria tehnică. Pe baza lui vă propunem un plan de îmbunătățire, etapizat și cu priorități clare.",
            },
            {
                question: "Cum se face predarea cunoștințelor către echipa noastră?",
                answer: "Producem documentație tehnică, referințe API, înregistrări ale deciziilor de arhitectură și proceduri de operare. La predare organizăm sesiuni practice cu echipa dumneavoastră internă.",
            },
            {
                question: "Cât costă o platformă enterprise?",
                answer: "Depinde de numărul de module, de integrări și de cerințele de securitate. Pentru că livrăm etapizat, primiți un preț fix pentru fiecare etapă, nu un buget unic greu de estimat. Prima etapă, analiza, este scurtă și vă oferă o estimare realistă pentru întreg proiectul.",
            },
            {
                question: "Lucrați cu echipa noastră internă de IT?",
                answer: "Da. Ne adaptăm la tehnologiile, la fluxul Git și la ritmul echipei dumneavoastră și putem lucra ca o extensie a ei, nu în paralel.",
            },
        ],
        relatedServices: [
            { label: "Dezvoltare software", href: svc("software-development") },
            { label: "Produse SaaS", href: svc("software-development/saas-products") },
            { label: "Dezvoltare AI", href: svc("ai-development") },
        ],
    },

    "software-development/saas-products": {
        slug: "produse-saas",
        parentSlug: "software-development",
        metaTitle: "Dezvoltare aplicații SaaS",
        metaDescription:
            "Construim produse SaaS: arhitectură multi-tenant, abonamente cu Stripe, roluri și panou de administrare. Un MVP SaaS durează în jur de 8–14 săptămâni.",
        keywords: [
            "dezvoltare SaaS",
            "aplicație SaaS",
            "software pe abonament",
            "arhitectură multi-tenant",
            "integrare Stripe",
        ],
        canonical: svc("software-development/saas-products"),
        heroLabel: "Produse SaaS",
        heroTitle: "Dezvoltare SaaS:",
        heroHighlight: "lansați-vă produsul pe abonament.",
        heroDescription:
            "Dodera Software construiește produse SaaS pentru fondatori și companii din România: aplicații vândute pe abonament, cu arhitectură multi-tenant, plăți recurente și panou de administrare. Un MVP SaaS complet durează de obicei 8–14 săptămâni și se construiește cu preț fix, de la 300 EUR.",
        sections: [
            {
                title: "Ce este un produs SaaS",
                content:
                    "Un produs SaaS (software as a service) este o aplicație livrată prin internet și plătită pe abonament, fără instalare. Utilizatorii o deschid din browser, de pe orice dispozitiv, iar furnizorul se ocupă de infrastructură, actualizări și securitate. Este modelul dominant pentru software-ul modern, pentru că este ușor de adoptat de clienți, ușor de scalat și aduce venituri recurente previzibile.",
                highlights: ["SaaS", "software as a service"],
                bullets: [
                    "Arhitectură multi-tenant, cu datele fiecărui client izolate",
                    "Abonamente cu perioadă de probă și mai multe planuri",
                    "Înregistrare și administrare a utilizatorilor fără intervenția dumneavoastră",
                    "Acces din orice browser, de pe orice dispozitiv",
                ],
            },
            {
                title: "Arhitectura corectă de la început",
                content:
                    "Un produs SaaS este diferit de o aplicație construită pentru un singur client. Are nevoie de multi-tenancy, gestionarea abonamentelor, măsurarea utilizării, roluri și un strat operațional pentru înregistrare, facturare și suport. Dacă aceste lucruri lipsesc la început, se adaugă greu mai târziu, așa că le proiectăm din prima versiune.",
                bullets: [
                    "Multi-tenancy cu izolarea datelor",
                    "Abonamente cu Stripe sau Paddle",
                    "Funcționalități activate în funcție de plan",
                    "Organizații, echipe și invitații",
                    "Flux de înregistrare și primii pași pentru clienți noi",
                ],
            },
            {
                title: "Funcționalitățile de bază pe care le construim",
                content:
                    "Toate produsele SaaS au nevoie de aceeași infrastructură comună. Folosim tipare și componente pe care le-am mai construit, ca să ajungem mai repede la funcționalitățile care vă diferențiază produsul.",
                bullets: [
                    "Autentificare: OAuth, SSO, autentificare în doi pași",
                    "Utilizatori și permisiuni pe roluri",
                    "Abonamente și facturi",
                    "Panou de administrare și statistici",
                    "API pentru integrări cu alte aplicații",
                    "Emailuri automate pe parcursul abonamentului",
                    "Jurnal de audit",
                ],
            },
            {
                title: "Infrastructură pregătită pentru creștere",
                content:
                    "Publicăm produsele SaaS pe infrastructură cloud gândită să crească odată cu numărul de clienți. Fie că aveți primii 10 utilizatori, fie primii 10.000, aplicația trebuie să suporte încărcarea fără schimbări de arhitectură. De aceea alegem de la început baza de date, cache-ul și cozile de procesare potrivite.",
            },
            {
                title: "De la lansare la creștere",
                content:
                    "Lansarea este doar primul pas. După ea puteți continua cu noi pe abonament lunar: funcționalități noi, optimizări de performanță, scalarea infrastructurii și remedieri, cu un scop pe care îl ajustați în fiecare lună. Dacă preferați să construiți o echipă internă, vă predăm codul și documentația și îi ajutăm pe noii colegi să preia proiectul.",
                links: [
                    { label: "Începeți cu un MVP", href: svc("software-development/mvp-to-market") },
                    { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
                ],
            },
        ],
        pricing: standardPricing(
            "Produsul inițial se construiește cu preț fix, iar dezvoltarea de după lansare se face de obicei pe abonament lunar.",
            "MVP SaaS cu autentificare, abonamente și panou de administrare; prețul exact rezultă din analiză.",
        ),
        caseStudy: CASE.saasDashboard,
        faqs: [
            {
                question: "Cât durează să construiți un produs SaaS?",
                answer: "Un MVP SaaS complet durează de obicei 8–14 săptămâni: autentificare, abonamente, funcționalitățile principale, panou de administrare și lansare. Produsele mai complexe, cu multe integrări, pot dura 4–6 luni.",
            },
            {
                question: "Vă ocupați și de plăți și abonamente?",
                answer: "Da. Integrăm Stripe sau Paddle pentru abonamente, facturi, schimbarea planului, perioade de probă și facturare în funcție de utilizare. Fluxul de plată este complet funcțional de la lansare.",
            },
            {
                question: "Construiți SaaS atât pentru firme (B2B), cât și pentru consumatori (B2C)?",
                answer: "Da. Pentru B2B construim administrarea organizațiilor, SSO și funcții de conformitate; pentru B2C, înregistrare simplă, planuri gratuite și mecanisme de invitare. Arhitectura se alege după tipul de clienți.",
            },
            {
                question: "Ce se întâmplă după lansare?",
                answer: "Puteți continua cu noi pe abonament lunar, de la 150 EUR, pentru funcționalități noi, remedieri, optimizări și administrarea infrastructurii. Puteți renunța oricând, iar codul rămâne al dumneavoastră.",
            },
            {
                question: "Cât costă un produs SaaS?",
                answer: "Proiectele cu preț fix pornesc de la 300 EUR, dar un SaaS cu abonamente și mai multe roluri se află de obicei mult peste acest prag. Primiți prețul exact după analiză, în scris, înainte să începem.",
            },
            {
                question: "Pot începe cu o versiune mai mică?",
                answer: "Da, și de obicei vă recomandăm asta. Un MVP cu o singură funcționalitate principală și plăți vă arată repede dacă oamenii sunt dispuși să plătească, înainte să investiți în produsul complet.",
            },
        ],
        relatedServices: [
            { label: "Dezvoltare software", href: svc("software-development") },
            { label: "MVP – produs minim viabil", href: svc("software-development/mvp-to-market") },
            { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
        ],
    },

    /* ──────────────────────────────────────────────────────
     * Site-uri de prezentare (hub)
     * ────────────────────────────────────────────────────── */
    "presentation-websites": {
        slug: "site-uri-de-prezentare",
        ogImage: "/og-images/og-presentation-websites.png",
        metaTitle: "Creare site-uri de prezentare Satu Mare",
        metaDescription:
            "Web design și creare site-uri de prezentare în Satu Mare: rapide, optimizate SEO, ușor de actualizat. Livrare în 2–6 săptămâni, cu preț fix.",
        keywords: [
            "creare site Satu Mare",
            "web design Satu Mare",
            "site de prezentare",
            "creare site-uri de prezentare",
            "magazin online",
            "site firmă",
        ],
        canonical: svc("presentation-websites"),
        heroLabel: "Site-uri de prezentare",
        heroTitle: "Creare site-uri de prezentare",
        heroHighlight: "și web design în Satu Mare.",
        heroDescription:
            "Dodera Software creează site-uri de prezentare pentru firme din Satu Mare și din toată România: design personalizat, încărcare rapidă și SEO tehnic inclus. Un site de prezentare se livrează de obicei în 2–6 săptămâni, cu preț fix stabilit după o discuție gratuită; proiectele pornesc de la 300 EUR.",
        sections: [
            {
                title: "De ce contează site-ul de prezentare",
                content:
                    "Pentru mulți clienți, site-ul este primul contact cu firma dumneavoastră și adesea locul unde decid dacă vă sună sau nu. Un șablon generic transmite că firma este ca oricare alta; un site gândit pentru clienții dumneavoastră transmite seriozitate și atenție la detalii. Construim site-uri care spun clar ce faceți, pentru cine și de ce să vă aleagă pe dumneavoastră, apoi îl conduc pe vizitator spre acțiunea care contează: un telefon, un formular, o programare.",
                bullets: [
                    "Mesaj clar despre ce faceți și pentru cine",
                    "Experiență gândită întâi pentru telefon",
                    "Structură optimizată pentru căutările din Google",
                    "Formulare și apeluri la acțiune care aduc cereri reale",
                ],
            },
            {
                title: "Cum lucrăm",
                content:
                    "Fiecare site începe cu o discuție despre firmă și despre clienții dumneavoastră: cui vă adresați, ce trebuie să afle și ce vreți să facă după ce vă găsesc. Pe baza ei stabilim structura paginilor și direcția vizuală, apoi trecem la design și la dezvoltare. Vedeți site-ul pe un mediu de test pe tot parcursul, iar lansarea se face după aprobarea dumneavoastră.",
                bullets: [
                    "Discuție despre firmă, clienți și mesaj",
                    "Structura paginilor și machete de design",
                    "Dezvoltare atentă, cu animații discrete",
                    "Optimizare pentru Core Web Vitals",
                    "Configurare analytics și urmărirea conversiilor",
                ],
            },
            {
                title: "Rapid și construit să dureze",
                content:
                    "Un design frumos nu ajută dacă site-ul se încarcă greu sau arată prost pe telefon. Construim site-urile pe tehnologii moderne, precum Next.js sau Nuxt, cu imagini optimizate, HTML semantic și certificate SSL, iar conținutul îl puteți actualiza singuri dintr-un CMS: Prismic, Sanity sau WordPress.",
                bullets: [
                    "Next.js sau Nuxt pentru viteză",
                    "Imagini optimizate și încărcate doar când este nevoie",
                    "HTML semantic, bun pentru accesibilitate și SEO",
                    "SSL, antete de securitate și bune practici incluse",
                    "CMS pentru actualizări fără programator",
                ],
            },
            {
                title: "SEO și cereri de ofertă, incluse de la început",
                content:
                    "Nu construim doar site-uri arătoase, ci site-uri care apar în căutări și aduc clienți. SEO tehnic face parte din fiecare proiect: date structurate, ierarhie corectă a titlurilor, viteză mare de încărcare și o structură a conținutului gândită pe căutările reale ale clienților din zona dumneavoastră. Integrăm formulare de contact, programări și statistici, ca să vedeți câte cereri aduce site-ul.",
            },
            {
                title: "Site de prezentare sau magazin online?",
                content:
                    "Un site de prezentare vă face cunoscute serviciile și aduce cereri de ofertă. Dacă aveți nevoie să vindeți direct pe site, cu coș de cumpărături, plăți online și gestiunea stocurilor, aveți nevoie de un magazin online. Pe acestea le construim ca aplicații web personalizate, cu regulile dumneavoastră de prețuri și livrare, în cadrul serviciului de dezvoltare software.",
                links: [
                    { label: "Site de prezentare pentru firme", href: svc("presentation-websites/business-showcase-sites") },
                    { label: "Magazine online și aplicații web", href: svc("software-development") },
                    { label: "Soluții web pentru firme din Satu Mare", href: "/ro/dezvoltare-solutii-web-satu-mare" },
                ],
            },
        ],
        childServices: [
            {
                iconName: "Globe",
                label: "Site de prezentare pentru firme",
                description: "Site-uri de mai multe pagini care prezintă serviciile, echipa și proiectele firmei, construite să inspire încredere și să aducă cereri de ofertă.",
                href: svc("presentation-websites/business-showcase-sites"),
            },
        ],
        pricing: standardPricing(
            "Site-urile de prezentare se construiesc cu preț fix. Prețul depinde de numărul de pagini, de design și de integrări.",
            "Site complet, de la structură la lansare; prețul exact rezultă din discuția inițială.",
        ),
        // TODO(owner): a presentation-website case study (client, link, result).
        faqs: [
            {
                question: "Cât durează crearea unui site de prezentare?",
                answer: "Majoritatea site-urilor de prezentare se livrează în 3–6 săptămâni. Un site de o pagină sau unul simplu, de tip broșură, durează de obicei 2–3 săptămâni, iar un site cu mai multe pagini, animații și CMS durează 4–6 săptămâni. Calendarul exact îl primiți după discuția inițială.",
            },
            {
                question: "Cât costă un site de prezentare?",
                answer: "Proiectele pornesc de la 300 EUR, cu preț fix. Prețul depinde de numărul de pagini, de cât de personalizat este designul, de integrări (programări, CRM, newsletter) și de cine scrie textele. Primiți oferta în scris înainte să începem.",
            },
            {
                question: "Scrieți și textele pentru site?",
                answer: "Da. Putem scrie textele împreună cu dumneavoastră, pornind de la cum vorbesc clienții despre serviciile pe care le oferiți. Mesajul clar contează la fel de mult ca designul.",
            },
            {
                question: "Pot actualiza singur site-ul?",
                answer: "Da. Integrăm un CMS ușor de folosit, precum Prismic, Sanity sau WordPress, prin care modificați texte, imagini și pagini fără să atingeți codul. La predare facem o sesiune de instruire și vă lăsăm un ghid scurt.",
            },
            {
                question: "Este inclus SEO?",
                answer: "Da. SEO tehnic este inclus în fiecare proiect: HTML semantic, date structurate, titluri și descrieri optimizate, texte alternative pentru imagini și viteză bună de încărcare. Pentru conținut SEO pe termen lung oferim colaborare lunară separată.",
            },
            {
                question: "Prin ce diferă de un site făcut pe un șablon?",
                answer: "Un site pe șablon arată ca alte sute de site-uri, iar vizitatorii observă asta. Noi pornim de la firma, clienții și obiectivele dumneavoastră și construim designul și structura în jurul lor, cu viteză și SEO tehnic incluse.",
            },
            {
                question: "Ne putem întâlni în Satu Mare?",
                answer: "Da. Pentru clienții din Satu Mare și din împrejurimi putem face discuția inițială și prezentarea designului la birou, pe Strada Banat 1, sau la sediul dumneavoastră. Cu clienții din alte orașe lucrăm la distanță, prin apeluri video.",
            },
        ],
        relatedServices: [
            { label: "Site de prezentare pentru firme", href: svc("presentation-websites/business-showcase-sites") },
            { label: "Dezvoltare software", href: svc("software-development") },
            { label: "Dezvoltare AI", href: svc("ai-development") },
        ],
    },

    "presentation-websites/business-showcase-sites": {
        slug: "site-de-prezentare-firma",
        parentSlug: "presentation-websites",
        metaTitle: "Site de prezentare pentru firme",
        metaDescription:
            "Site de prezentare pentru firme, cu pagini de servicii, echipă, proiecte și formulare de contact. Design personalizat, CMS inclus, preț fix.",
        keywords: [
            "site de prezentare firmă",
            "site corporate",
            "site companie",
            "web design firme",
            "creare site firmă",
        ],
        canonical: svc("presentation-websites/business-showcase-sites"),
        heroLabel: "Site de prezentare pentru firme",
        heroTitle: "Site de prezentare pentru firme",
        heroHighlight: "care vă prezintă exact cum trebuie.",
        heroDescription:
            "Dodera Software creează site-uri de prezentare pentru firme din Satu Mare și din toată România: site-uri de mai multe pagini care prezintă serviciile, echipa și proiectele și transformă vizitatorii în cereri de ofertă. Le construim cu preț fix, de la 300 EUR, de obicei în 4–6 săptămâni.",
        sections: [
            {
                title: "Ce este un site de prezentare pentru firme",
                content:
                    "Un site de prezentare pentru firme este sediul digital al companiei: un site de mai multe pagini care spune cine sunteți, ce faceți, de ce să vă aleagă clienții și cum este să lucreze cu dumneavoastră. Spre deosebire de o simplă pagină de prezentare, include servicii explicate pe larg, proiecte sau studii de caz, prezentarea echipei și dovezi de încredere.",
                highlights: ["site de prezentare pentru firme", "sediul digital"],
                bullets: [
                    "Pagină principală cu un mesaj clar și convingător",
                    "Pagini dedicate fiecărui serviciu sau produs",
                    "Pagină despre firmă, echipă și valori",
                    "Proiecte, studii de caz și recenzii",
                    "Formulare de contact și de cerere de ofertă",
                ],
            },
            {
                title: "Cum construim prezentarea firmei",
                content:
                    "Nu copiem doar ce ne descrieți, ci vă ajutăm să vă poziționați mai clar. În discuțiile de început analizăm cum vă prezentați acum, cum vă prezintă concurența și ce caută de fapt clienții dumneavoastră. Apoi construim designul și textele care închid diferența dintre acestea.",
                bullets: [
                    "Discuții despre poziționare și mesaj",
                    "Analiza publicului și a ierarhiei mesajelor",
                    "Direcție vizuală personalizată",
                    "O privire asupra concurenței",
                ],
            },
            {
                title: "Calitate și performanță",
                content:
                    "Fiecare site trece prin aceleași verificări înainte de lansare: testăm pe telefon, tabletă și desktop, în principalele browsere, și urmărim scoruri Lighthouse de peste 90 pentru performanță, accesibilitate și SEO. Țintim valorile recomandate de Google pentru Core Web Vitals, ca site-ul să se încarce rapid și pe conexiunile mobile.",
                bullets: [
                    "Ținte Core Web Vitals: LCP sub 2,5 s, CLS sub 0,1, INP sub 200 ms",
                    "Teste pe mobil, tabletă și desktop",
                    "HTML semantic și atribute ARIA pentru accesibilitate",
                    "Mediu de test și publicare automată",
                ],
            },
            {
                title: "Integrări utile",
                content:
                    "Conectăm site-ul la instrumentele pe care le folosiți deja: programări online, CRM, chat, newsletter sau notificări automate pe email. Dacă un instrument are API sau cod de integrare, îl putem adăuga fără să încetinim site-ul. Pentru cereri mai complexe, precum un portal pentru clienți, trecem la o aplicație web.",
                links: [
                    { label: "Toate site-urile de prezentare", href: svc("presentation-websites") },
                    { label: "Portaluri și aplicații web", href: svc("software-development") },
                ],
            },
            {
                title: "Suport după lansare",
                content:
                    "Lansarea este începutul, nu finalul. Prin abonamentul de mentenanță vă păstrăm site-ul actualizat, securizat și rapid și adăugăm pagini sau secțiuni noi pe măsură ce firma crește.",
            },
        ],
        pricing: standardPricing(
            "Site-ul se construiește cu preț fix, iar mentenanța de după lansare este opțională, pe abonament lunar.",
            "Site de mai multe pagini, cu design personalizat și CMS; prețul exact depinde de numărul de pagini și de integrări.",
        ),
        // TODO(owner): a business-website case study (client, link, result).
        faqs: [
            {
                question: "Cât de implicat trebuie să fiu în procesul de design?",
                answer: "Cât de mult doriți. Minimul este o discuție la început și feedbackul dumneavoastră în două momente: la macheta de design și la versiunea de pe mediul de test. Dacă vreți să participați mai mult, vă implicăm cu plăcere.",
            },
            {
                question: "Faceți și logo sau identitate vizuală?",
                answer: "Putem propune o direcție vizuală pentru site, dar crearea unui logo sau a unei identități vizuale complete este un proiect separat. Dacă aveți deja elemente de brand, le folosim exact. Dacă aveți nevoie de o identitate nouă, vă recomandăm designeri cu care colaborăm.",
            },
            {
                question: "Puteți integra programări online, CRM sau chat?",
                answer: "Da. Integrăm frecvent instrumente precum HubSpot, Calendly, Crisp, Mailchimp sau webhook-uri proprii. Dacă instrumentul are API sau cod de integrare, îl putem adăuga fără să afectăm viteza site-ului.",
            },
            {
                question: "Ce se întâmplă dacă am nevoie de modificări după lansare?",
                answer: "Modificările mici, precum texte sau imagini, le puteți face singuri din CMS sau le facem noi prin abonamentul de mentenanță. Paginile și funcționalitățile noi le estimăm separat, cu preț fix.",
            },
            {
                question: "Cât costă un site de prezentare pentru o firmă?",
                answer: "Proiectele pornesc de la 300 EUR, cu preț fix. Un site cu mai multe pagini, design personalizat, CMS și integrări costă mai mult; primiți oferta exactă după discuția inițială, în scris.",
            },
            {
                question: "În cât timp este gata site-ul?",
                answer: "Un site de prezentare de mai multe pagini, cu CMS și animații, durează de obicei 4–6 săptămâni. Un site mai simplu poate fi gata în 2–3 săptămâni.",
            },
            {
                question: "Ce pagini ar trebui să aibă site-ul unei firme?",
                answer: "Pentru majoritatea firmelor de servicii recomandăm: o pagină principală clară, câte o pagină pentru fiecare serviciu important, o pagină despre firmă și echipă, proiecte sau studii de caz și o pagină de contact cu adresă, telefon și hartă. Paginile separate pe servicii ajută mult în Google, pentru că fiecare poate apărea la căutarea potrivită.",
            },
        ],
        relatedServices: [
            { label: "Site-uri de prezentare", href: svc("presentation-websites") },
            { label: "Dezvoltare software", href: svc("software-development") },
            { label: "Documentație tehnică", href: svc("technical-documentation") },
        ],
    },

    /* ──────────────────────────────────────────────────────
     * Dezvoltare AI (hub)
     * ────────────────────────────────────────────────────── */
    "ai-development": {
        slug: "dezvoltare-ai",
        ogImage: "/og-images/og-ai-development.png",
        metaTitle: "Agenți AI și automatizări pentru firme",
        metaDescription:
            "Dezvoltăm agenți AI personalizați și automatizări n8n pentru companii din România, conectate la ERP, CRM și email. Proiecte cu preț fix de la 300 EUR.",
        keywords: [
            "agenți AI personalizați",
            "automatizări AI",
            "automatizări n8n",
            "inteligență artificială pentru firme",
            "dezvoltare AI România",
        ],
        canonical: svc("ai-development"),
        heroLabel: "Dezvoltare AI",
        heroTitle: "Agenți AI și automatizări",
        heroHighlight: "care preiau munca repetitivă.",
        heroDescription:
            "Dodera Software dezvoltă agenți AI personalizați și automatizări cu n8n pentru companii din Satu Mare și din toată România. Le conectăm la instrumentele pe care le folosiți deja, de la email și ERP până la CRM, ca să preia munca repetitivă. Proiectele au preț fix, de la 300 EUR, iar o automatizare simplă poate fi gata în 2–4 săptămâni.",
        sections: [
            {
                title: "De ce să folosiți AI în firmă",
                content:
                    "Inteligența artificială nu mai este un experiment, ci un instrument de lucru. Cele mai bune rezultate apar acolo unde oamenii pierd zilnic timp cu sarcini repetitive: copiază date între sisteme, citesc documente ca să extragă câteva informații sau răspund la aceleași întrebări. Într-unul dintre proiectele noastre, o automatizare construită în n8n a redus cu 94% timpul de procesare manuală a 400 de comenzi pe zi.",
                bullets: [
                    "Mai puțină muncă manuală și mai puține erori de copiere",
                    "Decizii mai rapide, pe date actualizate automat",
                    "Mai multe operațiuni fără a crește proporțional echipa",
                    "Răspunsuri pentru clienți și în afara programului",
                ],
            },
            {
                title: "Cum abordăm un proiect AI",
                content:
                    "Fiecare proiect începe cu o analiză a sistemelor, a datelor și a obiectivelor dumneavoastră. Căutăm procesul în care AI-ul aduce cel mai mult, nu proiectul cel mai spectaculos. Apoi construim soluția integrată cu tehnologiile existente, fără să le înlocuim, și o livrăm în iterații scurte, ca să vedeți rezultate devreme și să o ajustăm pe baza feedbackului.",
            },
            {
                title: "Tehnologiile pe care le folosim",
                content:
                    "Lucrăm cu modelele de limbaj de top și cu platforme de orchestrare dovedite, pe care le alegem după cerințele de cost, viteză și confidențialitate ale proiectului.",
                bullets: [
                    "Modele OpenAI GPT, Anthropic Claude și modele open-source (Llama, Mistral)",
                    "Laravel, Node.js și Java pentru orchestrarea pe backend",
                    "n8n pentru automatizări și fluxuri de lucru",
                    "Baze de date: MySQL, PostgreSQL, MongoDB",
                    "Servere MCP (Model Context Protocol) pentru acces controlat la date",
                    "Găzduire pe AWS, Azure sau pe serverele dumneavoastră",
                ],
            },
            {
                title: "Unde se potrivește AI-ul",
                content:
                    "Aplicațiile cele mai utile apar în procesele care combină multe date cu reguli clare și câteva decizii de judecată. Câteva exemple pe domenii:",
                bullets: [
                    "Logistică: preluarea comenzilor, sincronizarea transporturilor, documente de livrare",
                    "Sănătate: programări, reamintiri, indexarea documentelor",
                    "Comerț online: descrieri de produse, răspunsuri la clienți, previziuni de stoc",
                    "Servicii financiare: procesarea documentelor și verificări preliminare",
                ],
            },
            {
                title: "Date, confidențialitate și GDPR",
                content:
                    "Înainte de a trimite date către un model AI, stabilim împreună ce date ies din firmă și unde ajung. Pentru datele sensibile putem folosi modele open-source găzduite pe serverele dumneavoastră sau anonimizarea datelor înainte de procesare. Accesul agenților la sisteme este limitat la strictul necesar, iar acțiunile lor sunt înregistrate.",
                links: [
                    { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
                    { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations") },
                ],
            },
        ],
        childServices: [
            {
                iconName: "Bot",
                label: "Agenți AI personalizați",
                description: "Asistenți care raționează, folosesc instrumentele firmei și execută sarcini în mai mulți pași, cu escaladare către un om acolo unde este nevoie.",
                href: svc("ai-development/custom-ai-agents"),
            },
            {
                iconName: "N8nIcon",
                label: "Automatizări AI cu n8n",
                description: "Fluxuri automate în n8n, completate cu AI, care preiau procesele manuale: comenzi, facturi, emailuri, rapoarte.",
                href: svc("ai-development/ai-powered-automations"),
            },
        ],
        pricing: standardPricing(
            "Proiectele AI se construiesc cu preț fix. Costul modelelor AI (OpenAI, Anthropic) se plătește separat, în funcție de utilizare, și vi-l estimăm de la început.",
            "Agent sau automatizare completă; prețul exact depinde de integrări și de volumul de date.",
        ),
        caseStudy: CASE.freightAutomation,
        faqs: [
            {
                question: "Cât durează un proiect AI?",
                answer: "O automatizare sau un agent cu un singur scop poate fi gata în aproximativ 4 săptămâni. Majoritatea proiectelor AI durează între 6 și 16 săptămâni, în funcție de integrări și de complexitate, iar platformele AI mari se construiesc în 3–6 luni, etapizat.",
            },
            {
                question: "Lucrați cu datele și sistemele pe care le avem deja?",
                answer: "Da. Fiecare soluție este gândită să se integreze cu ce folosiți acum: o bază de date SQL veche, un ERP, un CRM sau API-uri externe. Nu este nevoie să înlocuiți nimic.",
            },
            {
                question: "Care este diferența dintre un agent AI și o automatizare?",
                answer: "O automatizare urmează reguli fixe: dacă se întâmplă X, fă Y. Un agent AI folosește un model de limbaj ca să înțeleagă contextul, să lucreze cu informații incomplete sau formulate diferit și să decidă următorul pas, fără o regulă scrisă pentru fiecare caz. Multe proiecte le combină pe amândouă.",
            },
            {
                question: "Datele noastre ajung la OpenAI sau la alți furnizori?",
                answer: "Doar dacă alegeți acest lucru. Stabilim împreună ce date pot fi trimise către un model extern. Pentru datele sensibile putem folosi modele open-source găzduite pe serverele dumneavoastră sau putem anonimiza datele înainte de procesare.",
            },
            {
                question: "Cât costă un agent AI sau o automatizare?",
                answer: "Proiectele cu preț fix pornesc de la 300 EUR, iar o sarcină punctuală, precum o automatizare simplă, poate porni de la 50 EUR. La acestea se adaugă costul de utilizare al modelelor AI, care depinde de volum și pe care vi-l estimăm înainte de start.",
            },
            {
                question: "Oferiți suport după lansare?",
                answer: "Da. Prin abonamentul lunar monitorizăm soluția, o actualizăm când se schimbă modelele sau sistemele conectate și o îmbunătățim pe baza utilizării reale.",
            },
        ],
        relatedServices: [
            { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
            { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations") },
            { label: "Documentație tehnică", href: svc("technical-documentation") },
        ],
    },

    "ai-development/custom-ai-agents": {
        slug: "agenti-ai-personalizati",
        parentSlug: "ai-development",
        metaTitle: "Agenți AI personalizați pentru companii",
        metaDescription:
            "Agenți AI care răspund clienților, procesează documente și lucrează în CRM sau ERP. Un agent cu un singur scop se construiește în 3–6 săptămâni.",
        keywords: [
            "agenți AI personalizați",
            "agent AI firmă",
            "chatbot AI în română",
            "asistent AI pentru clienți",
            "cost agent AI personalizat",
        ],
        canonical: svc("ai-development/custom-ai-agents"),
        heroLabel: "Agenți AI personalizați",
        heroTitle: "Agenți AI personalizați",
        heroHighlight: "care lucrează pentru dumneavoastră.",
        heroDescription:
            "Dodera Software construiește agenți AI personalizați pentru companii din România: asistenți care răspund clienților, procesează documente și facturi sau pregătesc rapoarte, conectați la sistemele firmei. Un agent cu un singur scop se construiește de obicei în 3–6 săptămâni, cu preț fix stabilit după o discuție gratuită.",
        sections: [
            {
                title: "Ce sunt agenții AI",
                content:
                    "Agenții AI merg mai departe decât un chatbot obișnuit. Sunt sisteme care pot raționa despre o problemă în mai mulți pași, pot folosi instrumente și API-uri, pot căuta informația relevantă în documentele firmei și pot executa acțiuni concrete: creează o comandă, actualizează un client în CRM sau trimit un email. Îi construim pe modelele de limbaj de top și îi adaptăm domeniului și proceselor dumneavoastră.",
                highlights: ["Agenții AI", "acțiuni concrete"],
                bullets: [
                    "Raționament și planificare în mai mulți pași",
                    "Acces la instrumente și API-uri: baze de date, CRM, ERP",
                    "Escaladare către un om pentru cazurile neclare",
                ],
            },
            {
                title: "Unde se folosesc agenții AI",
                content:
                    "Fiecare agent este construit pentru o sarcină anume, cu reguli de siguranță și monitorizare care îi țin sub control comportamentul.",
                bullets: [
                    "Relații cu clienții: răspunsuri la întrebări frecvente, rezolvarea tichetelor, escaladare",
                    "Vânzări: calificarea cererilor, programarea întâlnirilor, pregătirea ofertelor",
                    "Operațiuni: procesarea facturilor, reconcilierea datelor, rapoarte",
                    "Echipe tehnice: code review, asistenți pentru CI/CD, documentație",
                ],
            },
            {
                title: "Cum construim un agent AI",
                content:
                    "Începem cu o analiză a ceea ce trebuie să facă agentul: ce sarcini preia, la ce date are acces și când trebuie să ceară ajutorul unui om. Apoi proiectăm instrumentele lui, memoria și regulile de siguranță. Dezvoltarea are loc în iterații scurte, cu demo săptămânal, iar la lansare primiți un panou de monitorizare, ca să vedeți în orice moment ce face agentul și cât de bine.",
                bullets: [
                    "Săptămâna 1: sarcini, date, limite și criterii de succes",
                    "Construire și testare pe exemple reale din firma dumneavoastră",
                    "Lansare treptată, cu un om care verifică la început",
                    "Monitorizare și îmbunătățire continuă",
                ],
            },
            {
                title: "Agenți AI care lucrează în limba română",
                content:
                    "Modelele de limbaj actuale înțeleg și scriu foarte bine în română, dar un agent bun are nevoie de mai mult: terminologia firmei, tonul potrivit pentru clienți și reguli clare pentru ce nu are voie să spună. Testăm agentul pe întrebări și documente reale, în română, înainte să ajungă la clienți, și îl ajustăm până când răspunsurile sunt corecte și naturale.",
            },
            {
                title: "Securitate și conformitate",
                content:
                    "Fiecare agent pe care îl construim respectă bunele practici de securitate: acces pe roluri, jurnal al acțiunilor, protecție împotriva instrucțiunilor malițioase (prompt injection) și criptarea datelor în tranzit și la stocare. Agentul primește doar permisiunile de care are nevoie, nimic în plus.",
                links: [
                    { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations") },
                    { label: "Toate serviciile AI", href: svc("ai-development") },
                ],
            },
        ],
        pricing: standardPricing(
            "Agentul se construiește cu preț fix. Costul modelului AI se plătește separat, în funcție de utilizare, și vi-l estimăm înainte de start.",
            "Agent cu un singur scop, integrat cu sistemele firmei; prețul exact depinde de integrări.",
        ),
        // TODO(owner): a custom AI agent case study (client, scope, measurable result).
        faqs: [
            {
                question: "Cât costă un agent AI personalizat?",
                answer: "Proiectele cu preț fix pornesc de la 300 EUR. Prețul depinde de câte sisteme trebuie conectate, de volumul de documente și de cât de multe acțiuni execută agentul. La acesta se adaugă costul de utilizare al modelului AI, pe care vi-l estimăm de la început.",
            },
            {
                question: "Cât durează să construiți un agent AI?",
                answer: "Un agent cu un singur scop durează de obicei 3–6 săptămâni de la analiză la lansare. Sistemele cu mai mulți agenți și multe integrări pot dura 8–16 săptămâni. Calendarul exact îl primiți după analiza inițială.",
            },
            {
                question: "Agenții AI înlocuiesc angajații?",
                answer: "Nu este scopul lor. Agenții preiau sarcinile repetitive și consumatoare de timp, ca oamenii din echipă să se ocupe de munca ce cere judecată, creativitate și relații. Cazurile complicate rămân la oameni, cu tot contextul pregătit de agent.",
            },
            {
                question: "Se poate conecta agentul la sistemele noastre?",
                answer: "Da. Conectăm agenții la CRM, la instrumente de comunicare precum Slack sau email, la baze de date, la API-uri și la aplicații interne, astfel încât agentul are acces la datele și instrumentele de care are nevoie.",
            },
            {
                question: "Ce modele de limbaj folosiți?",
                answer: "Lucrăm cu OpenAI GPT, Anthropic Claude și modele open-source precum Llama și Mistral. Alegerea depinde de cerințele de performanță, cost, confidențialitate a datelor și viteză de răspuns.",
            },
            {
                question: "Ce se întâmplă când agentul nu știe răspunsul?",
                answer: "Îl construim să recunoască situațiile în care nu are destule informații sau în care o greșeală ar costa scump. În aceste cazuri nu inventează un răspuns, ci predă conversația unui om din echipa dumneavoastră, împreună cu un rezumat al contextului, ca acesta să poată continua imediat.",
            },
            {
                question: "Poate agentul să vorbească cu clienții în română?",
                answer: "Da. Modelele actuale lucrează foarte bine în limba română. Testăm agentul pe întrebări reale ale clienților dumneavoastră și îi stabilim tonul și limitele, ca răspunsurile să fie corecte și naturale.",
            },
        ],
        relatedServices: [
            { label: "Dezvoltare AI", href: svc("ai-development") },
            { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations") },
            { label: "Dezvoltare software", href: svc("software-development") },
        ],
    },

    "ai-development/ai-powered-automations": {
        slug: "automatizari-ai-n8n",
        parentSlug: "ai-development",
        metaTitle: "Automatizări AI și n8n pentru firme",
        metaDescription:
            "Automatizăm procese repetitive cu n8n și AI: comenzi, facturi, emailuri, rapoarte. Automatizări simple în 2–4 săptămâni, cu preț fix.",
        keywords: [
            "automatizări n8n",
            "automatizări AI",
            "automatizare procese firmă",
            "n8n România",
            "n8n vs automatizare custom",
        ],
        canonical: svc("ai-development/ai-powered-automations"),
        heroLabel: "Automatizări AI cu n8n",
        heroTitle: "Automatizări AI cu n8n",
        heroHighlight: "pentru procesele care vă consumă timpul.",
        heroDescription:
            "Dodera Software automatizează procesele repetitive ale companiilor din România cu n8n și inteligență artificială: preluarea comenzilor, procesarea facturilor, sincronizarea datelor între sisteme și rapoartele. O automatizare simplă este gata în 2–4 săptămâni, iar una care leagă mai multe sisteme în 6–10 săptămâni, cu preț fix.",
        sections: [
            {
                title: "Ce este automatizarea cu AI",
                content:
                    "Automatizarea clasică urmează reguli fixe și se oprește la prima excepție. Combinând un instrument de orchestrare precum n8n cu modele de limbaj, construim fluxuri care înțeleg date nestructurate (emailuri, PDF-uri, imagini), iau decizii în funcție de context și tratează cazurile-limită care ar bloca o automatizare obișnuită.",
                highlights: ["n8n", "date nestructurate"],
                bullets: [
                    "Extragerea datelor din documente, emailuri și imagini",
                    "Rutare și aprobări în funcție de context",
                    "Tratarea excepțiilor fără intervenție manuală",
                    "Îmbunătățire continuă pe baza statisticilor de utilizare",
                ],
            },
            {
                title: "Ce automatizăm de obicei",
                content:
                    "De la back-office până la procesele care ajung la clienți, automatizările elimină munca manuală în aproape fiecare departament.",
                bullets: [
                    "Procesarea facturilor și a plăților către furnizori",
                    "Preluarea comenzilor și sincronizarea cu ERP-ul",
                    "Angajarea și integrarea noilor angajați",
                    "Revizuirea și aprobarea contractelor",
                    "Comunicări și reveniri automate către clienți",
                    "Generarea și distribuirea rapoartelor",
                ],
            },
            {
                title: "De ce n8n",
                content:
                    "n8n este o platformă de automatizare open-source care poate rula pe serverele dumneavoastră, deci datele nu trebuie să treacă printr-un serviciu extern. Are sute de conectori gata făcuți, permite logică complexă și cod propriu acolo unde este nevoie, iar fluxurile rămân vizibile și ușor de înțeles și pentru cei care nu sunt programatori. Combinată cu AI, devine un sistem care se adaptează, nu doar o înșiruire de reguli.",
            },
            {
                title: "n8n sau automatizare scrisă de la zero?",
                content:
                    "Pentru majoritatea proceselor de business, n8n este alegerea mai rapidă și mai ieftină: fluxurile se construiesc repede și se modifică ușor. O automatizare scrisă de la zero are sens când volumul este foarte mare, când logica este critică și trebuie testată ca un produs software sau când automatizarea face parte dintr-o aplicație mai mare. Vă recomandăm varianta potrivită după analiză și putem porni cu n8n, ca apoi să mutăm în cod doar părțile care o cer.",
            },
            {
                title: "Integrare cu instrumentele pe care le folosiți",
                content:
                    "Automatizările se conectează la ce folosiți deja: Slack, Salesforce, HubSpot, Jira, Google Workspace, Microsoft 365, ERP-ul sau aplicațiile interne. Datele circulă între sisteme fără copiere manuală, fără insule de informație și fără schimbat ferestre toată ziua.",
                links: [
                    { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
                    { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
                ],
            },
        ],
        pricing: standardPricing(
            "Automatizările se construiesc cu preț fix. Găzduirea n8n și costul modelelor AI se estimează separat, înainte de start.",
            "Automatizare care leagă mai multe sisteme; o automatizare simplă poate fi o sarcină punctuală, de la 50 EUR.",
        ),
        caseStudy: CASE.freightAutomation,
        faqs: [
            {
                question: "Prin ce diferă automatizarea cu AI de un instrument precum Zapier?",
                answer: "Instrumente precum Zapier sunt foarte bune pentru legături simple de tip „dacă X, atunci Y”. Automatizarea cu AI tratează fluxuri în mai mulți pași, cu date nestructurate, decizii de judecată și context. Diferența seamănă cu cea dintre un filtru de email și un asistent instruit pe procesele firmei.",
            },
            {
                question: "Cât durează implementarea unei automatizări?",
                answer: "Automatizările simple pot fi gata în 2–4 săptămâni. Cele care leagă mai multe sisteme durează de obicei 6–10 săptămâni de la stabilirea cerințelor până la lansarea în producție.",
            },
            {
                question: "Cât costă o automatizare n8n?",
                answer: "O automatizare simplă poate fi tratată ca sarcină punctuală, de la 50 EUR, iar automatizările care leagă mai multe sisteme sunt proiecte cu preț fix, de la 300 EUR. Separat, se adaugă găzduirea n8n și, dacă este cazul, costul de utilizare al modelelor AI.",
            },
            {
                question: "Ce se întâmplă cu excepțiile și erorile?",
                answer: "Spre deosebire de automatizările rigide, cele cu AI pot recunoaște o excepție și o pot trata singure sau o pot trimite către un om, împreună cu tot contextul. Fiecare eroare este înregistrată și semnalată, ca să nu treacă neobservată.",
            },
            {
                question: "Poate rula n8n pe serverele noastre?",
                answer: "Da. n8n este open-source și îl putem instala pe serverele dumneavoastră sau într-un cont cloud al firmei, astfel încât datele rămân sub controlul dumneavoastră.",
            },
            {
                question: "Oferiți suport după lansare?",
                answer: "Da. Prin abonamentul lunar monitorizăm automatizările, le optimizăm și le adaptăm când se schimbă procesele sau aplicațiile conectate.",
            },
        ],
        relatedServices: [
            { label: "Dezvoltare AI", href: svc("ai-development") },
            { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
            { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms") },
        ],
    },

    /* ──────────────────────────────────────────────────────
     * Documentație tehnică (hub)
     * ────────────────────────────────────────────────────── */
    "technical-documentation": {
        slug: "documentatie-tehnica",
        ogImage: "/og-images/og-technical-documentation.png",
        metaTitle: "Documentație tehnică și baze de cunoștințe",
        metaDescription:
            "Transformăm codul și documentele interne în documentație tehnică structurată și baze de cunoștințe pregătite pentru AI. Preț fix, de la 300 EUR.",
        keywords: [
            "documentație tehnică",
            "documentație software",
            "bază de cunoștințe",
            "documentație API",
            "documentație pentru AI",
        ],
        canonical: svc("technical-documentation"),
        heroLabel: "Documentație tehnică",
        heroTitle: "Documentație tehnică",
        heroHighlight: "care chiar este folosită.",
        heroDescription:
            "Dodera Software transformă codul, procesele și documentele interne ale companiilor din România în documentație tehnică structurată și în baze de cunoștințe pregătite pentru AI. Lucrăm din Satu Mare, cu clienți din toată țara, cu preț fix pe proiect, de la 300 EUR.",
        sections: [
            {
                title: "De ce contează documentația",
                content:
                    "Documentația slabă este unul dintre cele mai mari costuri ascunse dintr-o firmă de software. Duce la muncă dublată, la integrarea lentă a noilor colegi, la cunoștințe care există doar în capul câtorva oameni și la o dezvoltare tot mai lentă. Nu scriem doar documente; construim sistemul care le ține actuale și utile.",
                bullets: [
                    "Integrare mai rapidă a noilor programatori",
                    "Fără dependență de una-două persoane care „știu tot”",
                    "Căutare cu AI în toată baza de cunoștințe",
                    "Cod mai bun, datorită arhitecturii documentate",
                ],
            },
            {
                title: "Ce documentăm",
                content:
                    "Acoperim tot spectrul documentației tehnice, de la prezentarea arhitecturii până la referințe API detaliate și proceduri de operare.",
                bullets: [
                    "Referințe API (OpenAPI / Swagger, scheme GraphQL)",
                    "Înregistrări ale deciziilor de arhitectură (ADR)",
                    "Documente de design și diagrame de flux al datelor",
                    "Ghiduri pentru programatorii noi",
                    "Proceduri de operare și de răspuns la incidente",
                    "Documentație de produs pentru utilizatori",
                ],
            },
            {
                title: "Baze de cunoștințe pregătite pentru AI",
                content:
                    "Următorul pas pentru documentație este să poată fi citită și de mașini. Structurăm și indexăm documentația astfel încât să poată fi folosită de asistenții AI de programare, de chatboții interni și de sistemele de suport automat. Documentația devine o bază de cunoștințe pe care o puteți interoga, nu un set de pagini uitate.",
            },
            {
                title: "Documentația tratată ca și codul",
                content:
                    "Tratăm documentația ca pe cod: versionată în Git, revizuită în pull request-uri, verificată automat și publicată automat. Astfel rămâne sincronizată cu aplicația. Folosim instrumente precum Docusaurus, MkDocs, Mintlify sau generatoare proprii, alese după nevoile echipei.",
            },
            {
                title: "Cum decurge un proiect de documentare",
                content:
                    "Începem cu o analiză a ce există deja: codul, documentele interne, wiki-urile și întrebările pe care echipa le pune cel mai des. Stabilim împreună ce trebuie documentat întâi și pentru cine: programatori noi, echipa de suport, clienți sau parteneri. Apoi structurăm conținutul, îl scriem și îl revizuim cu oamenii care cunosc sistemul, îl publicăm într-un format ușor de căutat și configurăm verificările care îl țin actualizat.",
                bullets: [
                    "Inventarul documentației și al întrebărilor frecvente din echipă",
                    "Prioritizare: ce documentăm întâi și pentru cine",
                    "Scriere și revizuire împreună cu echipa dumneavoastră",
                    "Publicare și verificări automate de actualitate",
                ],
            },
            {
                title: "În română, în engleză sau în ambele",
                content:
                    "Documentația o scriem în limba în care lucrează echipa dumneavoastră. Pentru firmele cu echipe mixte sau cu clienți din străinătate, putem păstra documentația în ambele limbi, cu aceeași structură, astfel încât actualizările să ajungă în ambele versiuni.",
                links: [
                    { label: "Sisteme de documentare", href: svc("technical-documentation/documentation-systems") },
                    { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
                ],
            },
        ],
        childServices: [
            {
                iconName: "BookOpen",
                label: "Sisteme de documentare",
                description: "Portaluri pentru programatori, referințe API, wiki-uri interne și baze de cunoștințe indexate pentru AI, care cresc odată cu echipa.",
                href: svc("technical-documentation/documentation-systems"),
            },
        ],
        pricing: standardPricing(
            "Documentația se realizează cu preț fix pe proiect, iar actualizarea ei continuă se poate face pe abonament lunar.",
            "Documentarea unei aplicații sau a unui set de procese; prețul depinde de dimensiunea codului și a documentelor existente.",
        ),
        // TODO(owner): a documentation case study (client, scope, result).
        faqs: [
            {
                question: "Puteți documenta o aplicație existentă?",
                answer: "Da. Analizăm codul existent și producem documentație completă, de la prezentarea arhitecturii până la referințe API. Combinăm analiza automată a codului cu discuții cu programatorii, ca să surprindem atât „ce face”, cât și „de ce așa”.",
            },
            {
                question: "Ce instrumente folosiți?",
                answer: "Alegem instrumentul după proiect: Docusaurus pentru portaluri de programatori, MkDocs pentru wiki-uri interne, Mintlify pentru documentație API sau soluții proprii când nimic gata făcut nu se potrivește. Toate se versionează în Git.",
            },
            {
                question: "Cum evitați ca documentația să se învechească?",
                answer: "Integrăm documentația în pipeline-ul CI/CD, cu verificări automate care semnalează când codul și documentația nu mai corespund. Stabilim și șabloane, reguli de stil și un proces de revizuire, ca echipa să o poată întreține ușor.",
            },
            {
                question: "Ce înseamnă documentație pregătită pentru AI?",
                answer: "Înseamnă documentație structurată, marcată semantic și indexată astfel încât să poată fi folosită de sisteme AI: asistenți de programare, sisteme RAG sau chatboți interni. O optimizăm atât pentru oameni, cât și pentru mașini.",
            },
            {
                question: "Cât costă documentarea unei aplicații?",
                answer: "Proiectele cu preț fix pornesc de la 300 EUR. Prețul depinde de dimensiunea codului, de câtă documentație există deja și de formatul dorit. Vă dăm o estimare după o scurtă analiză a codului.",
            },
            {
                question: "Scrieți documentația în română?",
                answer: "Da, în română, în engleză sau în ambele limbi, în funcție de echipa și de clienții dumneavoastră.",
            },
            {
                question: "Cine din echipa noastră trebuie să fie implicat?",
                answer: "De obicei unul sau doi oameni care cunosc bine sistemul, pentru câteva discuții scurte la început și pentru revizuirea textelor. Restul muncii, de la analiză la publicare, este al nostru.",
            },
        ],
        relatedServices: [
            { label: "Sisteme de documentare", href: svc("technical-documentation/documentation-systems") },
            { label: "Dezvoltare AI", href: svc("ai-development") },
            { label: "Dezvoltare software", href: svc("software-development") },
        ],
    },

    "technical-documentation/documentation-systems": {
        slug: "sisteme-de-documentare",
        parentSlug: "technical-documentation",
        metaTitle: "Sisteme de documentare și portaluri API",
        metaDescription:
            "Construim sisteme de documentare: portaluri pentru programatori, referințe API, wiki-uri interne și căutare cu AI, publicate automat din Git.",
        keywords: [
            "sisteme de documentare",
            "portal pentru programatori",
            "documentație API",
            "wiki intern",
            "căutare semantică documentație",
        ],
        canonical: svc("technical-documentation/documentation-systems"),
        heroLabel: "Sisteme de documentare",
        heroTitle: "Sisteme de documentare",
        heroHighlight: "care cresc odată cu echipa.",
        heroDescription:
            "Dodera Software proiectează și publică sisteme de documentare pentru companii din România: portaluri pentru programatori, referințe API, wiki-uri interne și baze de cunoștințe cu căutare AI, care devin sursa unică de adevăr a firmei. Lucrăm cu preț fix pe proiect, de la 300 EUR.",
        sections: [
            {
                title: "Ce este un sistem de documentare",
                content:
                    "Un sistem de documentare înseamnă mai mult decât o colecție de fișiere. Este infrastructura din jurul lor: instrumentele, fluxul de lucru, căutarea, navigarea și publicarea automată, care fac documentația ușor de găsit, de întreținut și de folosit pe măsură ce echipa și produsul cresc.",
                highlights: ["sistem de documentare"],
                bullets: [
                    "Portaluri și site-uri de documentație personalizate",
                    "Căutare în text și căutare semantică cu AI",
                    "Acces pe roluri: documentație internă și publică",
                    "Publicare automată din depozitele Git",
                    "Versiuni și istoric al modificărilor",
                ],
            },
            {
                title: "Portaluri pentru programatori",
                content:
                    "Pentru companiile care au API-uri publice, SDK-uri sau parteneri tehnici, un portal pentru programatori bine făcut este esențial. Construim portaluri cu zone de testare interactivă a API-ului, exemple de cod în mai multe limbaje, ghiduri de autentificare și referințe complete, pe care programatorii chiar le folosesc cu plăcere.",
            },
            {
                title: "Baze de cunoștințe interne",
                content:
                    "Cunoștințele echipei sunt unul dintre cele mai valoroase active ale firmei. Construim baze de cunoștințe interne care păstrează deciziile de arhitectură, procedurile de operare și contextul pe care altfel îl știu doar câțiva oameni. Cu o căutare bazată pe AI, oricine găsește răspunsul în câteva secunde, fără să întrerupă un coleg.",
                bullets: [
                    "Decizii de arhitectură (ADR), ușor de căutat",
                    "Proceduri de operare și de răspuns la incidente",
                    "Trasee de integrare pentru programatorii noi",
                    "Schimb de cunoștințe între echipe",
                ],
            },
            {
                title: "Indexare AI și căutare semantică",
                content:
                    "Transformăm documentația în reprezentări vectoriale stocate într-o bază de date dedicată, care alimentează căutarea și răspunsurile generate de AI. Astfel echipa și instrumentele AI găsesc răspunsuri precise în mii de pagini, cu întrebări în limbaj natural, chiar dacă nu folosesc exact aceleași cuvinte ca documentul.",
            },
            {
                title: "Cum alegem soluția potrivită",
                content:
                    "Nu pornim de la instrument, ci de la cine citește documentația și cât de des se schimbă. Un portal public pentru programatori are nevoie de referințe API generate automat și de exemple de cod; o bază de cunoștințe internă are nevoie de căutare bună, de control al accesului și de un mod simplu prin care oricine din echipă poate adăuga informații. Pe baza acestor cerințe alegem între instrumente existente și o soluție proprie și vă explicăm de ce.",
            },
            {
                title: "Documentație sincronizată cu codul",
                content:
                    "Configurăm pipeline-uri care extrag automat schemele API, tipurile de date și exemplele de cod din depozit și le publică în documentație. Când se schimbă codul, documentația se actualizează singură. Pentru generarea și structurarea conținutului folosim un flux automatizat propriu, construit pe instrumente MCP și Claude Code.",
                links: [
                    { label: "Documentație tehnică", href: svc("technical-documentation") },
                    { label: "Dezvoltare AI", href: svc("ai-development") },
                ],
            },
        ],
        pricing: standardPricing(
            "Sistemul de documentare se construiește cu preț fix; găzduirea și actualizarea conținutului pot continua pe abonament lunar.",
            "Portal sau bază de cunoștințe completă, cu publicare automată; prețul depinde de volum și de integrări.",
        ),
        // TODO(owner): a documentation-system case study (client, scope, result).
        faqs: [
            {
                question: "Pe ce platforme construiți sistemele de documentare?",
                answer: "Construim soluții proprii, folosind un flux automatizat bazat pe instrumente MCP și Claude Code. Astfel avem control complet asupra generării conținutului, a structurii și a integrării cu codul dumneavoastră, iar documentația rămâne sincronizată cu aplicația reală.",
            },
            {
                question: "Puteți muta documentația pe care o avem deja?",
                answer: "Da. Mutăm documentația din Confluence, Notion, Google Docs, wiki-uri GitHub sau sisteme proprii. În timpul migrării o restructurăm, ca navigarea să fie mai ușoară, fără conținut duplicat și ușor de căutat.",
            },
            {
                question: "Cum funcționează căutarea cu AI?",
                answer: "Conținutul documentației este transformat cu modele AI în reprezentări vectoriale. Când cineva caută, întrebarea este comparată cu acestea, iar sistemul găsește conținutul relevant ca sens, chiar dacă nu conține exact aceleași cuvinte. Este mult mai eficientă decât căutarea clasică după cuvinte-cheie.",
            },
            {
                question: "Se poate integra sistemul cu depozitul nostru de cod?",
                answer: "Da. Configurăm pipeline-uri CI care preiau automat schemele API, definițiile de tipuri și exemplele de cod din depozit și le publică în documentație. Când codul se schimbă, documentația se actualizează automat.",
            },
            {
                question: "Cât costă un sistem de documentare?",
                answer: "Proiectele cu preț fix pornesc de la 300 EUR. Prețul depinde de volumul documentației, de numărul de surse care trebuie integrate și de nevoia de căutare cu AI. Primiți o ofertă după o scurtă analiză.",
            },
            {
                question: "Documentația poate fi parțial publică și parțial internă?",
                answer: "Da. Configurăm acces pe roluri, astfel încât documentația publică pentru clienți și parteneri stă alături de cea internă, fiecare vizibilă doar pentru cine trebuie.",
            },
        ],
        relatedServices: [
            { label: "Documentație tehnică", href: svc("technical-documentation") },
            { label: "Dezvoltare AI", href: svc("ai-development") },
            { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents") },
        ],
    },
};

/** English service key for a Romanian path segment list (e.g. ["dezvoltare-ai", "agenti-ai-personalizati"]). */
export function serviceKeyFromRoSlug(slug: string[]): string | undefined {
    const path = `/ro/servicii/${slug.join("/")}`;
    return Object.keys(SERVICE_PAGES_RO).find((key) => SERVICE_PATHS[key]?.ro === path);
}
