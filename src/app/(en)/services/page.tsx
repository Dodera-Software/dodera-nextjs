import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ServicesIndex } from "@/components/ServicesIndex";
import { SERVICES } from "@/config/site";
import { SITE } from "@/config/seo";
import { alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema } from "@/lib/structured-data";

const TITLE = "Software, Website & AI Development Services";
const DESCRIPTION =
    "Custom web apps, MVPs and SaaS, presentation websites, AI agents and n8n automations, and technical documentation. Fixed-price projects from 300 EUR.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: alternatesFor("services", "en"),
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE.url}/services`,
        type: "website",
        siteName: SITE.name,
        images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
    },
};

export default function ServicesPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Home", url: SITE.url },
                    { name: "Services", url: `${SITE.url}/services` },
                ])}
            />
            <Navbar />
            <main>
                <ServicesIndex
                    services={SERVICES}
                    homeHref="/"
                    contactHref="/#contact"
                    labels={{
                        home: "Home",
                        breadcrumb: "Services",
                        eyebrow: "Services",
                        title: "What we build",
                        intro:
                            "Dodera Software is a software development company in Satu Mare, Romania. We build web applications, presentation websites, AI agents and automations for companies in Romania and abroad, priced per hour, per task or as a fixed-price project.",
                        subServices: "Includes",
                        learnMore: "Learn more",
                        ctaTitle: "Not sure which one you need?",
                        ctaText: "Tell us what you are trying to fix. We will scope it with you for free and give you a fixed price.",
                        ctaButton: "Start a Project",
                    }}
                />
            </main>
            <Footer />
        </div>
    );
}
