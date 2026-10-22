import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ServicesIndex } from "@/components/ServicesIndex";
import { getDictionary } from "@/i18n/dictionaries";
import { SITE } from "@/config/seo";
import { alternatesFor, absoluteUrl } from "@/i18n/routes";
import { STATIC_PATHS } from "@/i18n/paths";
import { breadcrumbSchema } from "@/lib/structured-data";
import { RO_META } from "../seo";

const dict = getDictionary("ro");

export const metadata: Metadata = {
    title: RO_META.services.title,
    description: RO_META.services.description,
    alternates: alternatesFor("services", "ro"),
    openGraph: {
        title: RO_META.services.title,
        description: RO_META.services.description,
        url: absoluteUrl(STATIC_PATHS.services.ro),
        type: "website",
        siteName: SITE.name,
        images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
};

export default function ServicesPageRo() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Acasă", url: absoluteUrl("/ro") },
                    { name: "Servicii", url: absoluteUrl(STATIC_PATHS.services.ro) },
                ])}
            />
            <Navbar />
            <main>
                <ServicesIndex
                    services={dict.services.items}
                    homeHref="/ro"
                    contactHref={dict.links.contact}
                    labels={{
                        home: "Acasă",
                        breadcrumb: "Servicii",
                        eyebrow: "Servicii",
                        title: "Servicii de dezvoltare software, site-uri și AI",
                        intro:
                            "Dodera Software este o firmă de dezvoltare software din Satu Mare care construiește aplicații web, site-uri de prezentare, agenți AI și automatizări pentru companii din toată România. Lucrăm cu preț fix pe proiect, de la 300 EUR, pe sarcină, de la 50 EUR, sau pe oră, între 20 și 80 EUR.",
                        subServices: "Include",
                        learnMore: "Aflați mai multe",
                        ctaTitle: "Nu știți exact de ce aveți nevoie?",
                        ctaText:
                            "Spuneți-ne ce problemă vreți să rezolvați. Stabilim scopul împreună, gratuit, și vă trimitem o ofertă cu preț fix.",
                        ctaButton: "Începeți un proiect",
                    }}
                />
            </main>
            <Footer />
        </div>
    );
}
