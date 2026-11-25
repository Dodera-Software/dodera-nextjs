import type { Metadata } from "next";
import { SITE } from "@/config/seo";
import { PRODUCTS, ProductId } from "@/config/products";
import { getDictionary } from "@/i18n/dictionaries";
import { OG_LOCALE, type Locale } from "@/i18n/config";
import { PRODUCT_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, collectionPageSchema, productListSchema, productSchemas } from "@/lib/structured-data";

const ogImage = (name: string, locale: Locale) => `/og-images/og-${name}${locale === "ro" ? "-ro" : ""}.png`;

function pageMetadata(locale: Locale, title: string, description: string, url: string, image: string, alternates: Metadata["alternates"]): Metadata {
    const images = [{ url: image, width: 1200, height: 630, alt: title }];
    return {
        title: { absolute: title },
        description,
        alternates,
        openGraph: { title, description, url, type: "website", siteName: SITE.name, locale: OG_LOCALE[locale], images },
        twitter: { card: "summary_large_image", title, description, images: [image] },
    };
}

export function findProductId(slug: string): ProductId | undefined {
    return Object.values(ProductId).find((id) => id === slug);
}

export function productSlugs() {
    return PRODUCTS.map((p) => ({ slug: p.id }));
}

export function productMetadata(id: ProductId, locale: Locale): Metadata {
    const copy = getDictionary(locale).products.items[id];
    return pageMetadata(locale, copy.metaTitle, copy.metaDescription, absoluteUrl(PRODUCT_PATHS[id][locale]!), ogImage(`product-${id}`, locale), alternatesFor(`product:${id}`, locale));
}

export function productsIndexMetadata(locale: Locale): Metadata {
    const t = getDictionary(locale).productPage;
    return pageMetadata(locale, t.indexMetaTitle, t.indexMetaDescription, absoluteUrl(STATIC_PATHS.products[locale]), ogImage("products", locale), alternatesFor("products", locale));
}

export function productJsonLd(id: ProductId, locale: Locale) {
    const { breadcrumb, productPage } = getDictionary(locale);
    const product = PRODUCTS.find((p) => p.id === id)!;
    return [
        breadcrumbSchema([
            { name: breadcrumb.home, url: absoluteUrl(STATIC_PATHS.home[locale]) },
            { name: productPage.products, url: absoluteUrl(STATIC_PATHS.products[locale]) },
            { name: product.name, url: absoluteUrl(PRODUCT_PATHS[id][locale]!) },
        ]),
        ...productSchemas(locale).filter((schema) => schema["@id"].endsWith(`#product-${id}`)),
    ];
}

export function productsIndexJsonLd(locale: Locale) {
    const { breadcrumb, productPage } = getDictionary(locale);
    const url = absoluteUrl(STATIC_PATHS.products[locale]);
    return [
        breadcrumbSchema([
            { name: breadcrumb.home, url: absoluteUrl(STATIC_PATHS.home[locale]) },
            { name: productPage.products, url },
        ]),
        collectionPageSchema({ name: productPage.indexMetaTitle, description: productPage.indexMetaDescription, url, locale }),
        productListSchema(locale),
        ...productSchemas(locale),
    ];
}
