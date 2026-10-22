/**
 * Paginile locale (/ro/locatii/[oras]).
 *
 * Fiecare oraș are conținut propriu: cum lucrăm cu firmele de acolo (față în
 * față în Satu Mare, de la distanță în rest), economia locală și ce tip de
 * proiecte se potrivesc, plus întrebări frecvente specifice. Nu este același
 * text cu numele orașului schimbat.
 *
 * Fapte despre orașe: doar informații generale, publice (reședință de județ,
 * granița cu Ungaria, tipuri de industrie). Fără distanțe sau cifre pe care
 * nu le-am verificat.
 *
 * TODO(owner): un studiu de caz cu un client din fiecare oraș, când există.
 * Până atunci, fiecare pagină arată un studiu de caz relevant ca domeniu.
 */

import { SERVICE_PATHS } from "@/i18n/paths";

const svc = (key: string) => SERVICE_PATHS[key].ro!;

export interface LocationPage {
    slug: string;
    city: string;
    /** County name (for schema.org containedInPlace). */
    county: string;
    metaTitle: string;
    metaDescription: string;
    eyebrow: string;
    h1: string;
    /** Opening paragraph: who, what, where, price — quotable on its own. */
    lead: string;
    inPerson: boolean;
    howWeWork: { title: string; paragraphs: string[] };
    localContext: { title: string; paragraphs: string[] };
    services: { label: string; href: string; why: string }[];
    /** Index into the Romanian case studies; relevant by industry, not by city. Omitted when none fits. */
    caseStudy?: number;
    faqs: { question: string; answer: string }[];
}

export const LOCATIONS_RO: LocationPage[] = [
    {
        slug: "satu-mare",
        city: "Satu Mare",
        county: "Satu Mare",
        metaTitle: "Firmă IT Satu Mare: software, site-uri, AI",
        metaDescription:
            "Firmă IT cu sediul în Satu Mare, pe Strada Banat 1: aplicații web, site-uri de prezentare, agenți AI și automatizări. Întâlniri față în față.",
        eyebrow: "Satu Mare",
        h1: "Firmă IT în Satu Mare, cu birou pe Strada Banat",
        lead:
            "Dodera Software este o firmă IT cu sediul în Satu Mare, pe Strada Banat 1, care construiește aplicații web, site-uri de prezentare, agenți AI și automatizări pentru firmele din oraș și din județ. Lucrăm cu preț fix pe proiect, de la 300 EUR, și ne întâlnim cu clienții din Satu Mare față în față.",
        inPerson: true,
        howWeWork: {
            title: "Cum lucrăm cu firmele din Satu Mare",
            paragraphs: [
                "Fiind în același oraș, discuția inițială o putem face la biroul nostru de pe Strada Banat sau la sediul dumneavoastră. Pentru proiectele de automatizare sau pentru aplicațiile interne ne ajută mult să vedem pe loc cum lucrează echipa, înainte să propunem o soluție, și asta în Satu Mare este ușor de organizat.",
                "Între întâlniri, proiectul merge ca oricare altul: aveți acces la board-ul proiectului, vedeți în fiecare săptămână versiunea nouă pe mediul de test și comunicăm în română. Momentele importante, precum prezentarea designului sau predarea aplicației, le putem face în persoană.",
            ],
        },
        localContext: {
            title: "Ce construim pentru firmele din Satu Mare",
            paragraphs: [
                "Economia orașului se sprijină pe industria prelucrătoare, pe producția pentru export, pe comerț și pe servicii, iar apropierea de granița cu Ungaria face ca multe firme să lucreze zilnic cu parteneri din străinătate. De aici vin cele mai frecvente nevoi: site-uri în mai multe limbi, portaluri prin care clienții își plasează comenzile și automatizări care leagă ERP-ul, facturarea și emailul.",
                "Pentru firmele de servicii din oraș, de la cabinete și clinici la firme de construcții sau consultanță, cea mai bună investiție este de obicei un site de prezentare rapid, care apare în Google la căutările locale și aduce cereri de ofertă. Pentru cele care cresc, urmează aplicațiile interne și automatizările care preiau munca repetitivă.",
            ],
        },
        services: [
            { label: "Dezvoltare soluții web în Satu Mare", href: "/ro/dezvoltare-solutii-web-satu-mare", why: "Site-uri, magazine online și aplicații web pentru firmele din Satu Mare, cu preț fix." },
            { label: "Site-uri de prezentare", href: svc("presentation-websites"), why: "Pentru firmele de servicii care vor să fie găsite în Google de clienții din zonă." },
            { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations"), why: "Pentru producție și comerț: comenzi, facturi și rapoarte fără copiere manuală." },
        ],
        caseStudy: 0,
        faqs: [
            {
                question: "Unde este biroul Dodera Software în Satu Mare?",
                answer: "Pe Strada Banat 1, cod poștal 440043. Ne puteți suna la 0748 650 469 sau ne puteți scrie la office@doderasoft.com ca să stabilim o întâlnire.",
            },
            {
                question: "Lucrați și cu firme mici din Satu Mare?",
                answer: "Da. Sarcinile mici pornesc de la 50 EUR, iar proiectele cu preț fix de la 300 EUR, deci putem lucra atât cu o afacere de familie care are nevoie de un site, cât și cu o fabrică ce vrea să-și automatizeze comenzile.",
            },
            {
                question: "Puteți face un site în mai multe limbi, de exemplu română, maghiară și engleză?",
                answer: "Da. Tehnic, site-ul poate avea oricâte limbi, fiecare cu adrese și titluri proprii, ca să apară corect în Google în fiecare limbă. Textele traduse le stabilim împreună cu dumneavoastră.",
            },
            {
                question: "Putem veni la birou pentru prima discuție?",
                answer: "Da, cu plăcere. Prima discuție este gratuită; sunați-ne sau scrieți-ne înainte, ca să stabilim ora.",
            },
        ],
    },
    {
        slug: "carei",
        city: "Carei",
        county: "Satu Mare",
        metaTitle: "Dezvoltare software și site-uri în Carei",
        metaDescription:
            "Site-uri de prezentare, aplicații web și automatizări pentru firme din Carei, de la o firmă IT din județul Satu Mare. Preț fix de la 300 EUR.",
        eyebrow: "Carei",
        h1: "Site-uri, aplicații și automatizări pentru firmele din Carei",
        lead:
            "Dodera Software este o firmă IT din Satu Mare, în același județ cu Careiul, care construiește site-uri de prezentare, aplicații web și automatizări pentru afacerile din Carei și din împrejurimi. Lucrăm de la distanță, cu preț fix pe proiect de la 300 EUR și cu demo în fiecare săptămână.",
        inPerson: false,
        howWeWork: {
            title: "Cum lucrăm cu firmele din Carei",
            paragraphs: [
                "Proiectele cu firmele din Carei se desfășoară de la distanță: un apel video pentru discuția inițială, un board de proiect la care aveți acces și o versiune nouă pe mediul de test în fiecare săptămână. Nu trebuie să instalați nimic; totul se vede din browser.",
                "Pentru că suntem în același județ, dacă preferați să discutați față în față, ne puteți vizita oricând la biroul din Satu Mare, pe Strada Banat 1.",
            ],
        },
        localContext: {
            title: "Ce se potrivește afacerilor din Carei",
            paragraphs: [
                "Careiul are o tradiție puternică în agricultură și în activitățile legate de ea, de la procesare la transport și comerț, iar apropierea de granița cu Ungaria aduce mulți parteneri și clienți de peste graniță. Pentru astfel de firme, problemele tipice sunt evidența comenzilor și a stocurilor ținută în tabele, facturarea făcută manual și lipsa unei prezențe online care să aducă clienți noi.",
                "De obicei recomandăm să începeți cu pasul care aduce cel mai repede rezultate: un site de prezentare care apare în Google când cineva caută serviciile dumneavoastră în zonă sau o automatizare care elimină o sarcină repetată zilnic. Abia apoi are sens o aplicație mai mare, construită pe procesele dumneavoastră.",
            ],
        },
        services: [
            { label: "Site-uri de prezentare", href: svc("presentation-websites"), why: "Pentru a fi găsiți în Google de clienții din Carei și din zona de graniță." },
            { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations"), why: "Pentru comenzi, facturi și evidențe ținute azi în tabele." },
            { label: "Dezvoltare software", href: svc("software-development"), why: "Pentru o aplicație de comenzi, stocuri sau programări, construită pe procesele firmei." },
        ],
        caseStudy: 0,
        faqs: [
            {
                question: "Trebuie să ne întâlnim la Carei pentru proiect?",
                answer: "Nu este necesar. Lucrăm de la distanță prin apeluri video și demo-uri săptămânale. Dacă preferați o întâlnire față în față, vă așteptăm la biroul nostru din Satu Mare.",
            },
            {
                question: "Cât costă un site de prezentare pentru o firmă din Carei?",
                answer: "Proiectele pornesc de la 300 EUR, cu preț fix. Prețul depinde de numărul de pagini, de design și de integrări; primiți oferta scrisă după o discuție gratuită.",
            },
            {
                question: "Putem automatiza comenzile pe care le primim pe email?",
                answer: "Da. Cu n8n și AI putem prelua comenzile din email sau din formulare, extrage datele importante și le putem trimite în sistemul de evidență sau de facturare, fără copiere manuală. O automatizare simplă poate fi gata în 2–4 săptămâni.",
            },
        ],
    },
    {
        slug: "baia-mare",
        city: "Baia Mare",
        county: "Maramureș",
        metaTitle: "Dezvoltare software și site-uri Baia Mare",
        metaDescription:
            "Site-uri de prezentare, magazine online și aplicații web pentru firme din Baia Mare și Maramureș, de la o firmă IT din Satu Mare. Preț fix.",
        eyebrow: "Baia Mare · Maramureș",
        h1: "Site-uri și aplicații web pentru firmele din Baia Mare",
        lead:
            "Dodera Software este o firmă IT din Satu Mare care construiește site-uri de prezentare, magazine online, aplicații web și automatizări pentru firme din Baia Mare și din tot județul Maramureș. Lucrăm de la distanță, cu preț fix pe proiect de la 300 EUR și cu o versiune funcțională de văzut în fiecare săptămână.",
        inPerson: false,
        howWeWork: {
            title: "Cum lucrăm cu firmele din Baia Mare",
            paragraphs: [
                "Colaborarea cu clienții din Baia Mare se face de la distanță: discuția inițială și prezentările au loc prin apel video, iar progresul îl urmăriți pe un board comun și pe mediul de test, unde publicăm o versiune nouă în fiecare săptămână.",
                "Pentru că lucrăm din Satu Mare, suntem în aceeași regiune și în același ritm cu dumneavoastră: aceleași zile lucrătoare, aceeași limbă și, la nevoie, o întâlnire față în față la biroul nostru.",
            ],
        },
        localContext: {
            title: "Ce se potrivește afacerilor din Baia Mare și Maramureș",
            paragraphs: [
                "Baia Mare a trecut de la o economie construită în jurul mineritului la una bazată pe comerț, servicii și producție, iar Maramureșul este cunoscut pentru turism și pentru industria mobilei. Fiecare dintre aceste domenii are nevoi digitale diferite.",
                "Pensiunile și firmele de turism au nevoie de site-uri care se încarcă repede pe telefon și care primesc cereri de rezervare direct, fără comisioane. Producătorii, de exemplu cei de mobilă, au nevoie de cataloage online sau de magazine online cu configuratoare și prețuri proprii. Firmele de comerț și servicii câștigă cel mai mult din automatizarea comenzilor și a facturării.",
            ],
        },
        services: [
            { label: "Site-uri de prezentare", href: svc("presentation-websites"), why: "Pentru turism, servicii și firme locale care vor rezervări și cereri de ofertă directe." },
            { label: "Magazine online și aplicații web", href: svc("software-development"), why: "Pentru producători care vând online, cu reguli proprii de preț și livrare." },
            { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations"), why: "Pentru comenzi, facturi și rapoarte care azi se fac manual." },
        ],
        // TODO(owner): a tourism, furniture or retail case study from Maramureș — none of the current ones fits.
        faqs: [
            {
                question: "Puteți construi un site cu cereri de rezervare pentru o pensiune din Maramureș?",
                answer: "Da. Putem construi un site rapid, cu galerie, prezentarea camerelor și un formular de rezervare care vă trimite cererea pe email sau într-un calendar. Dacă folosiți deja un sistem de rezervări, îl putem integra în site.",
            },
            {
                question: "Cum decurge colaborarea dacă nu suntem în Satu Mare?",
                answer: "Totul se face de la distanță: apel video la început, acces la board-ul proiectului, demo săptămânal pe mediul de test și predarea finală tot prin apel video, cu instruire pentru echipa dumneavoastră.",
            },
            {
                question: "Cât costă un magazin online?",
                answer: "Un magazin online personalizat este un proiect cu preț fix, de la 300 EUR în sus, în funcție de numărul de produse, de plăți, de livrare și de integrările cu stocul sau cu facturarea. Primiți o ofertă exactă după discuția inițială.",
            },
        ],
    },
    {
        slug: "zalau",
        city: "Zalău",
        county: "Sălaj",
        metaTitle: "Dezvoltare software și site-uri în Zalău",
        metaDescription:
            "Aplicații web, automatizări și documentație tehnică pentru firme din Zalău și Sălaj, de la o firmă IT din Satu Mare. Preț fix de la 300 EUR.",
        eyebrow: "Zalău · Sălaj",
        h1: "Aplicații, automatizări și documentație pentru firmele din Zalău",
        lead:
            "Dodera Software este o firmă IT din Satu Mare care dezvoltă aplicații web, automatizări, documentație tehnică și site-uri de prezentare pentru firme din Zalău și din județul Sălaj. Lucrăm de la distanță, cu preț fix pe proiect de la 300 EUR și cu demo săptămânal.",
        inPerson: false,
        howWeWork: {
            title: "Cum lucrăm cu firmele din Zalău",
            paragraphs: [
                "Cu firmele din Zalău lucrăm de la distanță. Pentru proiectele legate de producție sau de logistică începem cu un apel video în care ne arătați pas cu pas procesul actual, de la comandă la livrare, ca să înțelegem unde se pierde timpul.",
                "Urmează propunerea cu preț fix și dezvoltarea în iterații scurte, cu o versiune nouă pe mediul de test în fiecare săptămână. Puteți testa aplicația cu oamenii care o vor folosi efectiv, înainte de lansare.",
            ],
        },
        localContext: {
            title: "Ce se potrivește firmelor din Zalău și Sălaj",
            paragraphs: [
                "Zalăul este un oraș industrial, cu fabrici mari și cu o rețea de firme mici și mijlocii care lucrează ca furnizori, transportatori sau prestatori de servicii pentru ele. Pentru aceste firme, relația cu clienții industriali înseamnă comenzi, livrări și rapoarte care trebuie să fie corecte și la timp.",
                "Aici se potrivesc cel mai bine automatizările care leagă comenzile de facturare și de raportare, portalurile prin care partenerii își văd comenzile și documentele, precum și documentația tehnică a proceselor, astfel încât cunoștințele să nu depindă de una-două persoane din firmă.",
            ],
        },
        services: [
            { label: "Automatizări AI cu n8n", href: svc("ai-development/ai-powered-automations"), why: "Pentru comenzi, livrări și rapoarte către clienții industriali." },
            { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms"), why: "Pentru portaluri de furnizori și aplicații interne integrate cu ERP-ul." },
            { label: "Documentație tehnică", href: svc("technical-documentation"), why: "Pentru procese și sisteme documentate, ușor de preluat de colegii noi." },
        ],
        caseStudy: 0,
        faqs: [
            {
                question: "Puteți construi un portal prin care clienții sau furnizorii își văd comenzile?",
                answer: "Da. Construim portaluri web cu acces pe roluri, în care fiecare partener vede doar comenzile, livrările și documentele lui, integrate cu ERP-ul sau cu sistemul de facturare pe care îl folosiți.",
            },
            {
                question: "Ne puteți ajuta să documentăm procesele interne?",
                answer: "Da. Discutăm cu oamenii care cunosc procesele, le structurăm într-o bază de cunoștințe ușor de căutat și o publicăm astfel încât să rămână actualizată. Așa, un coleg nou găsește singur răspunsurile.",
            },
            {
                question: "Lucrați de la distanță pentru firme din Zalău?",
                answer: "Da, toate proiectele cu firmele din Zalău se desfășoară de la distanță, prin apeluri video, board de proiect comun și demo săptămânal. Pentru o întâlnire față în față vă așteptăm la biroul din Satu Mare.",
            },
        ],
    },
    {
        slug: "oradea",
        city: "Oradea",
        county: "Bihor",
        metaTitle: "Dezvoltare software și agenți AI Oradea",
        metaDescription:
            "Aplicații web, agenți AI, automatizări și site-uri pentru firme din Oradea și Bihor, de la o firmă IT din Satu Mare. Preț fix, demo săptămânal.",
        eyebrow: "Oradea · Bihor",
        h1: "Dezvoltare software și agenți AI pentru firmele din Oradea",
        lead:
            "Dodera Software este o firmă IT din Satu Mare care construiește aplicații web, agenți AI, automatizări și site-uri de prezentare pentru firme din Oradea și din județul Bihor. Lucrăm de la distanță, cu preț fix pe proiect de la 300 EUR, pe oră între 20 și 80 EUR și cu demo în fiecare săptămână.",
        inPerson: false,
        howWeWork: {
            title: "Cum lucrăm cu firmele din Oradea",
            paragraphs: [
                "Cu clienții din Oradea lucrăm de la distanță: apel video pentru discuția inițială, ofertă scrisă cu preț fix, board de proiect comun și o versiune nouă pe mediul de test în fiecare săptămână.",
                "Dacă aveți deja o echipă tehnică, ne putem integra în fluxul ei de lucru, în Git și în ritmul ei, pentru o funcționalitate anume sau pentru o perioadă în care aveți nevoie de capacitate în plus.",
            ],
        },
        localContext: {
            title: "Ce se potrivește firmelor din Oradea și Bihor",
            paragraphs: [
                "Oradea este unul dintre cele mai dinamice orașe din vestul țării, cu parcuri industriale care au atras multe companii de producție, cu o comunitate IT în creștere și cu turism, inclusiv stațiunile balneare din apropiere. Companiile din parcurile industriale au nevoie de aplicații interne și de integrări cu sistemele grupului din care fac parte.",
                "Firmele de turism și de servicii medicale au nevoie de site-uri rapide și de sisteme de programări fiabile, iar firmele de servicii care primesc multe întrebări repetitive pot câștiga timp cu un agent AI care răspunde clienților în română, cu escaladare către un om pentru cazurile complicate.",
            ],
        },
        services: [
            { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents"), why: "Pentru firme care primesc multe întrebări și cereri repetitive." },
            { label: "Platforme enterprise", href: svc("software-development/enterprise-platforms"), why: "Pentru companiile din parcurile industriale care au nevoie de aplicații interne integrate." },
            { label: "Site-uri de prezentare", href: svc("presentation-websites"), why: "Pentru turism, clinici și servicii care vor să fie găsite în Google." },
        ],
        caseStudy: 2,
        faqs: [
            {
                question: "Puteți construi un sistem de programări pentru o clinică din Oradea?",
                answer: "Da. Am construit deja un sistem de programări personalizat pentru un grup de clinici, pe Next.js și PostgreSQL, cu monitorizare automată. Îl adaptăm la tipurile dumneavoastră de consultații, la calendarul medicilor și la fluxul pacienților.",
            },
            {
                question: "Ne puteți ajuta ca extensie a echipei noastre de dezvoltare?",
                answer: "Da. Putem lucra pe oră, între 20 și 80 EUR, sau pe sarcini cu preț fix, în depozitul și cu procesele echipei dumneavoastră.",
            },
            {
                question: "Un agent AI poate răspunde clienților noștri în română?",
                answer: "Da. Modelele actuale lucrează foarte bine în română. Testăm agentul pe întrebări reale ale clienților dumneavoastră și stabilim când trebuie să predea conversația unui om.",
            },
        ],
    },
    {
        slug: "cluj-napoca",
        city: "Cluj-Napoca",
        county: "Cluj",
        metaTitle: "Dezvoltare software Cluj-Napoca: MVP și AI",
        metaDescription:
            "MVP-uri, produse SaaS, agenți AI și capacitate de dezvoltare pentru startupuri și firme din Cluj-Napoca. Preț fix sau pe oră, de la 20 EUR.",
        eyebrow: "Cluj-Napoca",
        h1: "MVP-uri, SaaS și agenți AI pentru startupurile din Cluj-Napoca",
        lead:
            "Dodera Software este o firmă de dezvoltare software din Satu Mare care construiește MVP-uri, produse SaaS și agenți AI pentru startupuri și companii din Cluj-Napoca. Lucrăm de la distanță, cu preț fix pe proiect de la 300 EUR sau pe oră între 20 și 80 EUR, iar un MVP ajunge la primii utilizatori în 4–8 săptămâni.",
        inPerson: false,
        howWeWork: {
            title: "Cum lucrăm cu startupurile și firmele din Cluj",
            paragraphs: [
                "Lucrăm de la distanță, în ritmul unei echipe de produs: o primă săptămână în care stabilim scopul și lista minimă de funcționalități, apoi iterații scurte cu demo săptămânal, până la lansare.",
                "Pentru firmele de software care au deja o echipă, putem prelua o funcționalitate întreagă cu preț fix sau putem lucra pe oră, în depozitul și cu procesele lor, ca o extensie a echipei.",
            ],
        },
        localContext: {
            title: "Ce se potrivește în Cluj-Napoca",
            paragraphs: [
                "Cluj-Napoca este unul dintre cele mai mari centre IT din România, cu multe companii de software, startupuri și universități. Într-un astfel de oraș, întrebarea nu este dacă găsiți programatori, ci dacă găsiți rapid o echipă care poate livra un produs complet, cu preț fix și fără să vă blocheze echipa internă.",
                "De aceea, în Cluj lucrăm cel mai des pe trei tipuri de proiecte: MVP-uri pentru startupuri care vor să testeze o idee înainte de o rundă de finanțare, produse SaaS construite pe o arhitectură care poate crește, și agenți AI sau automatizări care preiau munca repetitivă din echipele de operațiuni.",
            ],
        },
        services: [
            { label: "MVP – produs minim viabil", href: svc("software-development/mvp-to-market"), why: "Prima versiune a produsului, la primii utilizatori în 4–8 săptămâni." },
            { label: "Produse SaaS", href: svc("software-development/saas-products"), why: "Multi-tenant, abonamente cu Stripe, roluri și panou de administrare." },
            { label: "Agenți AI personalizați", href: svc("ai-development/custom-ai-agents"), why: "Pentru echipe de operațiuni și suport care pierd timp cu sarcini repetitive." },
        ],
        caseStudy: 1,
        faqs: [
            {
                question: "De ce să lucrăm cu o firmă din Satu Mare dacă suntem în Cluj?",
                answer: "Pentru că modelul de lucru nu depinde de oraș: preț fix stabilit de la început, demo săptămânal și cod care vă aparține. Lucrul de la distanță este oricum norma pentru majoritatea echipelor de produs.",
            },
            {
                question: "Cât costă și cât durează un MVP?",
                answer: "Majoritatea MVP-urilor durează 4–8 săptămâni. Proiectele cu preț fix pornesc de la 300 EUR, iar prețul exact îl primiți în scris după prima săptămână, în care stabilim scopul.",
            },
            {
                question: "Putem continua dezvoltarea cu echipa noastră după lansare?",
                answer: "Da. Codul sursă și documentația vă aparțin, iar noi putem ajuta la predarea proiectului către echipa internă. Sau putem continua cu noi pe abonament lunar, de la 150 EUR.",
            },
        ],
    },
];

export function getLocation(slug: string): LocationPage | undefined {
    return LOCATIONS_RO.find((l) => l.slug === slug);
}
