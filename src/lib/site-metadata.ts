import type { Metadata, Viewport } from "next";
import { SITE, DEFAULT_META } from "@/config/seo";
import { OG_LOCALE, type Locale } from "@/i18n/config";

/**
 * Root-layout metadata for a locale. Pages override title, description,
 * alternates and images; no canonical is set here so a page that forgets
 * its own never inherits the homepage canonical.
 */
export function baseMetadata(locale: Locale, meta: { title: string; description: string }): Metadata {
    return {
        metadataBase: new URL(SITE.url),
        title: {
            default: meta.title,
            template: `%s | ${SITE.name}`,
        },
        description: meta.description,
        authors: [{ name: SITE.name, url: SITE.url }],
        creator: SITE.name,
        publisher: SITE.name,
        openGraph: {
            type: "website",
            locale: OG_LOCALE[locale],
            url: SITE.url,
            siteName: SITE.name,
            title: meta.title,
            description: meta.description,
            images: [{ url: SITE.ogImage, width: 1200, height: 630, alt: SITE.name }],
        },
        twitter: {
            card: "summary_large_image",
            site: SITE.social.twitter,
            creator: SITE.social.twitter,
            title: meta.title,
            description: meta.description,
            images: [SITE.ogImage],
        },
        manifest: "/manifest.webmanifest",
        category: "technology",
        // TODO(owner): add the Google Search Console verification token here
        // (verification: { google: "..." }) or verify via DNS.
    };
}

export const siteViewport: Viewport = {
    themeColor: SITE.themeColor,
    width: "device-width",
    initialScale: 1,
};

export { DEFAULT_META };
