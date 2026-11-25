import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { HomePage as Home } from "@/components/home/HomePage";
import { businessSchema, productListSchema, productSchemas, webSiteSchema } from "@/lib/structured-data";
import { SITE } from "@/config/seo";
import { alternatesFor } from "@/i18n/routes";
import { HOME_META } from "./seo";

export const metadata: Metadata = {
  title: {
    absolute: HOME_META.title,
  },
  description: HOME_META.description,
  keywords: [...HOME_META.keywords],
  alternates: alternatesFor("home", "en"),
  openGraph: {
    title: HOME_META.title,
    description: HOME_META.description,
    url: SITE.url,
    type: "website",
    siteName: SITE.name,
    images: [{ url: "/og-images/og-homepage.png", width: 1200, height: 630, alt: SITE.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: HOME_META.title,
    description: HOME_META.description,
    images: ["/og-images/og-homepage.png"],
  },
};

export default function HomePage() {
  return (
    <>
      <JsonLd
        data={[
          businessSchema(),
          webSiteSchema({ languages: ["en", "ro"] }),
          productListSchema("en"),
          ...productSchemas("en"),
        ]}
      />
      <Home />
    </>
  );
}
