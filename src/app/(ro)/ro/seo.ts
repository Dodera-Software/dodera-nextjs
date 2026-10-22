/**
 * Metadate SEO pentru paginile românești.
 *
 * Titluri: maximum 60 de caractere, cuvântul-cheie primul, apoi
 * „ | Dodera Software” (adăugat automat de layout, cu excepția paginii
 * principale, care își scrie titlul complet). Descrieri: maximum 155 de
 * caractere.
 */

export const RO_DEFAULT_META = {
    title: "Dezvoltare software Satu Mare | Dodera Software",
    description:
        "Firmă de dezvoltare software din Satu Mare: aplicații web, site-uri de prezentare, agenți AI și automatizări n8n. Preț fix de la 300 EUR.",
} as const;

export const RO_META = {
    home: RO_DEFAULT_META,
    services: {
        title: "Servicii de dezvoltare software și AI",
        description:
            "Aplicații web, MVP și SaaS, site-uri de prezentare, agenți AI, automatizări n8n și documentație tehnică, de la o firmă IT din Satu Mare.",
    },
    about: {
        title: "Despre noi – firmă IT din Satu Mare",
        description:
            "Dodera Software este o firmă IT din Satu Mare, fondată în 2023, care construiește aplicații web, site-uri și agenți AI pentru companii din România.",
    },
    contact: {
        title: "Contact – firmă IT Satu Mare",
        description:
            "Contactați Dodera Software: Strada Banat 1, Satu Mare, telefon 0748 650 469, office@doderasoft.com. Discuția inițială este gratuită.",
    },
    careers: {
        title: "Cariere IT în Satu Mare",
        description:
            "Locuri de muncă în IT la Dodera Software, Satu Mare: programatori, designeri și ingineri AI. Trimiteți-ne CV-ul și vă contactăm.",
    },
    privacy: {
        title: "Politica de confidențialitate",
        description:
            "Cum colectează, folosește și protejează Dodera Software S.R.L. datele dumneavoastră personale, conform GDPR și legislației din România.",
    },
} as const;
