import type { Metadata } from "next";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { AboutPageContent } from "./AboutPageContent";
import { FounderSection } from "@/components/FounderSection";
import { SITE } from "@/config/seo";
import { ABOUT_META } from "./seo";
import { FAQ } from "./faq";
import { alternatesFor } from "@/i18n/routes";
import {
    aboutPageSchema,
    breadcrumbSchema,
    faqSchema,
} from "@/lib/structured-data";

/* ── SEO Metadata ────────────────────────────────────────────────────────── */

export const metadata: Metadata = {
    title: ABOUT_META.title,
    description: ABOUT_META.description,
    keywords: [...ABOUT_META.keywords],
    alternates: alternatesFor("about", "en"),
    openGraph: {
        title: ABOUT_META.openGraph.title,
        description: ABOUT_META.openGraph.description,
        url: `${SITE.url}/about`,
        type: "website",
        siteName: SITE.name,
        images: [
            {
                url: "/og-images/og-about.png",
                width: 1200,
                height: 630,
                alt: "Dodera Software — About Us",
            },
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: ABOUT_META.twitter.title,
        description: ABOUT_META.twitter.description,
        images: ["/og-images/og-about.png"],
    },
};

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    aboutPageSchema({
                        name: `About Us - ${SITE.name}`,
                        description: ABOUT_META.description,
                        url: `${SITE.url}/about`,
                        locale: "en",
                    }),
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "About Us", url: `${SITE.url}/about` },
                    ]),
                    faqSchema(FAQ.map((f) => ({ question: f.q, answer: f.a }))),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <AboutPageContent founderSlot={<FounderSection locale="en" />} />
            </main>
            <Footer />
        </div>
    );
}
