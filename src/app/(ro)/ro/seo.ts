/**
 * Metadate SEO pentru paginile românești.
 *
 * Titluri: maximum 60 de caractere, cuvântul-cheie primul, apoi
 * „ | Dodera Software” (adăugat automat de layout, cu excepția paginii
 * principale, care își scrie titlul complet). Descrieri: maximum 155 de
 * caractere.
 */

export const RO_DEFAULT_META = {
    title: "Firmă de dezvoltare software România | Dodera Software",
    description:
        "Firmă de dezvoltare software din România: aplicații web, site-uri de prezentare, agenți AI și automatizări n8n, pentru clienți din țară și din străinătate.",
} as const;

export const RO_META = {
    home: RO_DEFAULT_META,
    services: {
        title: "Servicii de dezvoltare software și AI",
        description:
            "Aplicații web, MVP și SaaS, site-uri de prezentare, agenți AI, automatizări n8n și documentație tehnică, de la o firmă de software din România.",
    },
    about: {
        title: "Despre noi – firmă de software din România",
        description:
            "Dodera Software, firmă de software din România fondată în 2023: aplicații web, site-uri și agenți AI pentru clienți din țară și din străinătate.",
    },
    contact: {
        title: "Contact – firmă de software din România",
        description:
            "Contactați Dodera Software: 0748 650 469, office@doderasoft.com. Lucrăm cu clienți din România și din străinătate; prima discuție e gratuită.",
    },
    careers: {
        title: "Cariere în IT, de la distanță",
        description:
            "Locuri de muncă în IT la Dodera Software, de la distanță: programatori, designeri și ingineri AI. Trimiteți-ne CV-ul și vă contactăm.",
    },
    privacy: {
        title: "Politica de confidențialitate",
        description:
            "Cum colectează, folosește și protejează Dodera Software S.R.L. datele dumneavoastră personale, conform GDPR și legislației din România.",
    },
} as const;
