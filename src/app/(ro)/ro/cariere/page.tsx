import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { SITE } from "@/config/seo";
import { STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema } from "@/lib/structured-data";
import { CareersPageContent } from "@/components/CareersPageContent";
import { RO_META } from "../seo";

export const metadata: Metadata = {
    title: RO_META.careers.title,
    description: RO_META.careers.description,
    alternates: alternatesFor("careers", "ro"),
    openGraph: {
        title: RO_META.careers.title,
        description: RO_META.careers.description,
        url: absoluteUrl(STATIC_PATHS.careers.ro),
        type: "website",
        siteName: SITE.name,
        images: [{ url: "/og-images/og-careers.png", width: 1200, height: 630, alt: "Dodera Software — Cariere" }],
    },
};

/* Same component as /careers; it picks the Romanian copy from the locale. */
export default function CareersPageRo() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Acasă", url: absoluteUrl("/ro") },
                    { name: "Cariere", url: absoluteUrl(STATIC_PATHS.careers.ro) },
                ])}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <CareersPageContent />
            </main>
            <Footer />
        </div>
    );
}
