import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { SITE } from "@/config/seo";
import { CAREERS_META } from "./seo";
import { breadcrumbSchema } from "@/lib/structured-data";
import { CareersPageContent } from "./CareersPageContent";

/* ── SEO Metadata ────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
    title: CAREERS_META.title,
    description: CAREERS_META.description,
    keywords: [...CAREERS_META.keywords],
    alternates: {
        canonical: "/careers",
    },
    openGraph: {
        title: CAREERS_META.openGraph.title,
        description: CAREERS_META.openGraph.description,
        url: `${SITE.url}/careers`,
        type: "website",
        siteName: SITE.name,
        images: [
            {
                url: SITE.ogImage,
                width: 1200,
                height: 630,
                alt: "Dodera Software — Careers",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: CAREERS_META.twitter.title,
        description: CAREERS_META.twitter.description,
        images: [SITE.ogImage],
    },
};

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function CareersPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "Careers", url: `${SITE.url}/careers` },
                    ]),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <CareersPageContent />
            </main>
            <Footer />
        </div>
    );
}


