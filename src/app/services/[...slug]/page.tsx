import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ServicePageLayout } from "@/components/ServicePageLayout";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { SERVICE_PAGES, SERVICE_PAGE_SLUGS } from "@/config/services";
import { SITE } from "@/config/seo";
import { breadcrumbSchema, faqSchema, serviceSchema } from "@/lib/structured-data";

/* ── Static params for SSG ────────────────────────────────── */
export function generateStaticParams() {
    return SERVICE_PAGE_SLUGS.map((key) => ({
        slug: key.split("/"),
    }));
}

/* ── Dynamic metadata ─────────────────────────────────────── */
type PageProps = { params: Promise<{ slug: string[] }> };

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const key = slug.join("/");
    const data = SERVICE_PAGES[key];
    if (!data) return {};

    const ogImage =
        data.ogImage ??
        (data.parentSlug ? SERVICE_PAGES[data.parentSlug]?.ogImage : undefined);

    return {
        title: data.metaTitle,
        description: data.metaDescription,
        keywords: data.keywords,
        alternates: { canonical: data.canonical },
        openGraph: {
            title: data.metaTitle,
            description: data.metaDescription,
            url: `${SITE.url}${data.canonical}`,
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
export default async function ServicePage({ params }: PageProps) {
    const { slug } = await params;
    const key = slug.join("/");
    const data = SERVICE_PAGES[key];

    if (!data) notFound();

    // Build breadcrumb items
    const breadcrumbItems = [
        { name: "Home", url: SITE.url },
        { name: "Services", url: `${SITE.url}/#services` },
    ];

    // If child service, add parent to breadcrumbs
    if (data.parentSlug) {
        const parentData = SERVICE_PAGES[data.parentSlug];
        if (parentData) {
            breadcrumbItems.push({
                name: parentData.heroLabel,
                url: `${SITE.url}/services/${data.parentSlug}`,
            });
        }
    }

    breadcrumbItems.push({
        name: data.heroLabel,
        url: `${SITE.url}${data.canonical}`,
    });

    const structuredData = [
        breadcrumbSchema(breadcrumbItems),
        serviceSchema({
            name: data.heroLabel,
            description: data.metaDescription,
            url: `${SITE.url}${data.canonical}`,
        }),
        ...(data.faqs.length > 0 ? [faqSchema(data.faqs)] : []),
    ];

    return (
        <div className="min-h-screen bg-background">
            <JsonLd data={structuredData} />
            <ScrollManager />
            <Navbar />
            <main>
                <ServicePageLayout data={data} />
            </main>
            <Footer />
        </div>
    );
}
