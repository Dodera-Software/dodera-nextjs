import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { AboutPage } from "@/components/about/AboutPage";
import { SITE } from "@/config/seo";
import { getDictionary } from "@/i18n/dictionaries";
import { STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { aboutPageSchema, breadcrumbSchema, faqSchema } from "@/lib/structured-data";
import { RO_META } from "../seo";

export const metadata: Metadata = {
    title: RO_META.about.title,
    description: RO_META.about.description,
    alternates: alternatesFor("about", "ro"),
    openGraph: {
        title: RO_META.about.title,
        description: RO_META.about.description,
        url: absoluteUrl(STATIC_PATHS.about.ro),
        type: "website",
        siteName: SITE.name,
        images: [{ url: "/og-images/og-about-ro.png", width: 1200, height: 630, alt: "Dodera Software — Despre noi" }],
    },
};

export default function AboutPageRo() {
    return (
        <>
            <JsonLd
                data={[
                    aboutPageSchema({ name: `Despre noi - ${SITE.name}`, description: RO_META.about.description, url: absoluteUrl(STATIC_PATHS.about.ro), locale: "ro" }),
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Despre noi", url: absoluteUrl(STATIC_PATHS.about.ro) },
                    ]),
                    faqSchema(getDictionary("ro").about.faq),
                ]}
            />
            <AboutPage />
        </>
    );
}
