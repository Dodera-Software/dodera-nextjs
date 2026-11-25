import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ContactPage } from "@/components/ContactPage";
import { SITE } from "@/config/seo";
import { STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, businessSchema } from "@/lib/structured-data";
import { RO_META } from "../seo";

export const metadata: Metadata = {
    title: RO_META.contact.title,
    description: RO_META.contact.description,
    alternates: alternatesFor("contact", "ro"),
    openGraph: {
        title: RO_META.contact.title,
        description: RO_META.contact.description,
        url: absoluteUrl(STATIC_PATHS.contact.ro),
        type: "website",
        siteName: SITE.name,
        images: [{ url: "/og-images/og-contact-ro.png", width: 1200, height: 630, alt: SITE.name }],
    },
};

export default function ContactPageRo() {
    return (
        <>
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Contact", url: absoluteUrl(STATIC_PATHS.contact.ro) },
                    ]),
                    businessSchema({ description: RO_META.home.description }),
                ]}
            />
            <ContactPage />
        </>
    );
}
