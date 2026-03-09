import type { Metadata } from "next";
import { BlogPageContent } from "./BlogPageContent";
import { SITE, BLOG_META } from "@/config/seo";
import { JsonLd } from "@/components/JsonLd";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/structured-data";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ScrollManager } from "@/components/ScrollManager";
import { getAllPosts } from "@/lib/cms";

export const metadata: Metadata = {
    title: BLOG_META.title,
    description: BLOG_META.description,
    keywords: [...BLOG_META.keywords],
    alternates: {
        canonical: "/blog",
    },
    openGraph: {
        title: BLOG_META.title,
        description: BLOG_META.description,
        url: `${SITE.url}/blog`,
        type: "website",
        siteName: SITE.name,
    },
    twitter: {
        card: "summary_large_image",
        title: BLOG_META.title,
        description: BLOG_META.description,
    },
};

export default async function BlogPage() {
    const posts = await getAllPosts();

    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Home", url: SITE.url },
                        { name: "Blog", url: `${SITE.url}/blog` },
                    ]),
                    collectionPageSchema({
                        name: "Blog - Engineering Insights & AI Development",
                        description:
                            "Technical articles on AI development, software engineering, SaaS architecture, and documentation best practices.",
                        url: `${SITE.url}/blog`,
                    }),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <BlogPageContent posts={posts} />
            </main>
            <Footer />
        </div>
    );
}
