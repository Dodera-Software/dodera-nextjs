import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { SERVICE_PAGES_RO, serviceKeyFromRoSlug } from "@/config/services.ro";
import { SERVICE_PATHS, STATIC_PATHS } from "@/i18n/paths";
import { absoluteUrl, alternatesFor } from "@/i18n/routes";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";

/* ── Static params for SSG ────────────────────────────────── */
export function generateStaticParams() {
    return Object.keys(SERVICE_PAGES_RO)
        .map((key) => SERVICE_PATHS[key]?.ro)
        .filter((p): p is string => !!p)
        .map((p) => ({ slug: p.replace("/ro/servicii/", "").split("/") }));
}

export const dynamicParams = false;

type PageProps = { params: Promise<{ slug: string[] }> };

async function resolve(params: PageProps["params"]) {
    const { slug } = await params;
    const key = serviceKeyFromRoSlug(slug);
    const data = key ? SERVICE_PAGES_RO[key] : undefined;
    return key && data ? { key, data } : null;
}

/* ── Dynamic metadata ─────────────────────────────────────── */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const page = await resolve(params);
    if (!page) return {};
    const { key, data } = page;

    const ogImage = data.ogImage ?? (data.parentSlug ? SERVICE_PAGES_RO[data.parentSlug]?.ogImage : undefined);

    return {
        title: data.metaTitle,
        description: data.metaDescription,
        keywords: data.keywords,
        alternates: alternatesFor(`service:${key}`, "ro"),
        openGraph: {
            title: data.metaTitle,
            description: data.metaDescription,
            url: absoluteUrl(data.canonical),
            type: "website",
            ...(ogImage && {
                images: [{ url: ogImage, width: 1200, height: 630, alt: data.metaTitle }],
            }),
        },
        twitter: {
            card: "summary_large_image",
            title: data.metaTitle,
            description: data.metaDescription,
            ...(ogImage && { images: [ogImage] }),
        },
    };
}

/* ── Page Component ───────────────────────────────────────── */
export default async function ServicePageRo({ params }: PageProps) {
    const page = await resolve(params);
    if (!page) notFound();
    const { data } = page;

    const parent = data.parentSlug ? SERVICE_PAGES_RO[data.parentSlug] : undefined;
    const parentHref = data.parentSlug ? SERVICE_PATHS[data.parentSlug]?.ro : undefined;

    const breadcrumbItems = [
        { name: "Acasă", url: absoluteUrl("/ro") },
        { name: "Servicii", url: absoluteUrl(STATIC_PATHS.services.ro) },
        ...(parent && parentHref ? [{ name: parent.heroLabel, url: absoluteUrl(parentHref) }] : []),
        { name: data.heroLabel, url: absoluteUrl(data.canonical) },
    ];

    const structuredData = [
        breadcrumbSchema(breadcrumbItems),
        serviceSchema({
            name: data.heroLabel,
            description: data.metaDescription,
            url: absoluteUrl(data.canonical),
        }),
        ...(data.faqs.length > 0 ? [faqSchema(data.faqs)] : []),
    ];

    return (
        <div className="min-h-screen bg-background">
            <JsonLd data={structuredData} />
            <ScrollManager />
            <Navbar />
            <main>
                <ServicePageLayout
                    data={data}
                    parentLabel={parent?.heroLabel}
                    parentHref={parentHref}
                    servicesHref={STATIC_PATHS.services.ro}
                />
            </main>
            <Footer />
        </div>
    );
}

