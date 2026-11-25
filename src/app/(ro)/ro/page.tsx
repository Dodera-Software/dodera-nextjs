import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { HomePage as Home } from "@/components/home/HomePage";
import { businessSchema, productListSchema, productSchemas, webSiteSchema } from "@/lib/structured-data";
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
        images: [{ url: "/og-images/og-homepage-ro.png", width: 1200, height: 630, alt: SITE.name }],
    },
    twitter: {
        card: "summary_large_image",
        title: RO_META.home.title,
        description: RO_META.home.description,
        images: ["/og-images/og-homepage-ro.png"],
    },
};

export default function HomePageRo() {
    return (
        <>
            <JsonLd
                data={[
                    businessSchema({ description: RO_META.home.description }),
                    webSiteSchema({ languages: ["ro", "en"] }),
                    productListSchema("ro"),
                    ...productSchemas("ro"),
                ]}
            />
            <Home />
        </>
    );
}
