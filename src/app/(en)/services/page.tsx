import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ServicesIndex } from "@/components/ServicesIndex";
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
        images: [{ url: "/og-images/og-services.png", width: 1200, height: 630, alt: SITE.name }],
    },
};

export default function ServicesPage() {
    return (
        <>
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Home", url: SITE.url },
                    { name: "Services", url: `${SITE.url}/services` },
                ])}
            />
            <ServicesIndex />
        </>
    );
}
