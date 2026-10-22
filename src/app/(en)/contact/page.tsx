import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ContactPage } from "@/components/ContactPage";
import { SITE } from "@/config/seo";
import { alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, businessSchema } from "@/lib/structured-data";

const TITLE = "Contact - Software Company in Satu Mare";
const DESCRIPTION =
    "Contact Dodera Software: Strada Banat 1, Satu Mare, Romania · +40 748 650 469 · office@doderasoft.com. The first call to scope your project is free.";

export const metadata: Metadata = {
    title: TITLE,
    description: DESCRIPTION,
    alternates: alternatesFor("contact", "en"),
    openGraph: {
        title: TITLE,
        description: DESCRIPTION,
        url: `${SITE.url}/contact`,
        type: "website",
        siteName: SITE.name,
        images: [{ url: "/og-images/og-contact.png", width: 1200, height: 630, alt: SITE.name }],
    },
};

export default function ContactPageEn() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "Contact", url: `${SITE.url}/contact` },
                    ]),
                    businessSchema(),
                ]}
            />
            <Navbar />
            <main>
                <ContactPage locale="en" />
            </main>
            <Footer />
        </div>
    );
}
