import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { ServicesIndex } from "@/components/ServicesIndex";
import { SITE } from "@/config/seo";
import { alternatesFor, absoluteUrl } from "@/i18n/routes";
import { STATIC_PATHS } from "@/i18n/paths";
import { breadcrumbSchema } from "@/lib/structured-data";
import { RO_META } from "../seo";

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
        images: [{ url: "/og-images/og-services-ro.png", width: 1200, height: 630, alt: SITE.name }],
    },
};

export default function ServicesPageRo() {
    return (
        <>
            <JsonLd
                data={breadcrumbSchema([
                    { name: "Acasă", url: absoluteUrl("/ro") },
                    { name: "Servicii", url: absoluteUrl(STATIC_PATHS.services.ro) },
                ])}
            />
            <ServicesIndex />
        </>
    );
}
