import type { Metadata } from "next";
import { Suspense } from "react";
import { BlogPageContent } from "./BlogPageContent";
import { SITE } from "@/config/seo";
import { BLOG_META } from "./seo";
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
        images: [{ url: "/og-images/og-blog.png", width: 1200, height: 630, alt: BLOG_META.title }],
    },
    twitter: {
        card: "summary_large_image",
        title: BLOG_META.title,
        description: BLOG_META.description,
        images: ["/og-images/og-blog.png"],
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
                        name: "Blog - Tech, AI & Beyond",
                        description:
                            "Industry trends, engineering insights, AI developments, and lessons from the field — written by the Dodera Software team.",
                        url: `${SITE.url}/blog`,
                    }),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <Suspense>
                    <BlogPageContent posts={posts} />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
