import type { Metadata } from "next";
import { BlogPageContent } from "./BlogPageContent";
import { SITE } from "@/config/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/structured-data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollManager } from "@/components/ScrollManager";

export const metadata: Metadata = {
    title: "Blog - Engineering Insights & AI Development",
    description:
        "Technical articles on AI development, software engineering, SaaS architecture, and documentation best practices from the Dodera Software team.",
    keywords: [
        "software engineering blog",
        "AI development articles",
        "SaaS development insights",
        "technical documentation blog",
        "Dodera Software blog",
    ],
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: "Blog - Engineering Insights & AI Development",
        description:
            "Technical articles on AI development, software engineering, SaaS architecture, and documentation best practices from the Dodera Software team.",
        url: `${SITE.url}/blog`,
    },
};

export default function BlogPage() {
    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "Blog", url: `${SITE.url}/blog` },
                    ]),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <BlogPageContent />
            </main>
            <Footer />
        </div>
    );
}
