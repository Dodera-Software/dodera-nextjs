import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { HeroSection } from "@/components/HeroSection";
import { TrustedBy } from "@/components/TrustedBy";
import { CaseStudiesSection } from "@/components/CaseStudiesSection";
import { ServicesSection } from "@/components/ServicesSection";
import { ProcessSection } from "@/components/ProcessSection";
import { PricingSection } from "@/components/PricingSection";
import { TeamSection } from "@/components/TeamSection";
import { CTASection } from "@/components/CTASection";
import { NotableClients } from "@/components/NotableClients";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { businessSchema, webSiteSchema } from "@/lib/structured-data";
import { SITE } from "@/config/seo";
import { alternatesFor } from "@/i18n/routes";
import { RO_META } from "./seo";

export const metadata: Metadata = {
    title: { absolute: RO_META.home.title },
    description: RO_META.home.description,
    alternates: alternatesFor("home", "ro"),
    openGraph: {
        title: RO_META.home.title,
        description: RO_META.home.description,
        url: `${SITE.url}/ro`,
        type: "website",
        siteName: SITE.name,
        images: [{ url: "/og-images/og-homepage.png", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
        card: "summary_large_image",
        title: RO_META.home.title,
        description: RO_META.home.description,
        images: ["/og-images/og-homepage.png"],
    },
};

/*
 * Pagina principală în română. Aceleași secțiuni ca varianta engleză,
 * cu o excepție: secțiunea de testimoniale lipsește până când avem
 * recenzii verificabile (nume, rol, companie, link) — la fel ca pe varianta
 * engleză, unde secțiunea se ascunde singură cât timp nu există.
 */
export default function HomePageRo() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    businessSchema({ description: RO_META.home.description }),
                    webSiteSchema({ languages: ["ro", "en"] }),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <HeroSection />
                <TrustedBy />
                <NotableClients />
                <CaseStudiesSection />
                <ServicesSection />
                <ProcessSection />
                <PricingSection />
                <TeamSection />
                <CTASection />
            </main>
            <Footer />
        </div>
    );
}
