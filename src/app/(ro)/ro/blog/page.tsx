import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { BlogIndex } from "@/components/BlogIndex";
import { SITE } from "@/config/seo";
import { getAllPosts } from "@/lib/cms";
import { absoluteUrl, hreflangFor } from "@/i18n/routes";
import { breadcrumbSchema, collectionPageSchema } from "@/lib/structured-data";

const TITLE = "Blog: software, AI și site-uri";
const DESCRIPTION =
    "Articole în română despre dezvoltare software, agenți AI, automatizări n8n și site-uri de prezentare, cu prețuri reale și exemple din proiectele noastre.";

/*
 * Romanian blog listing. Posts come from Prismic's "ro-ro" locale.
 * While there are none, the page says so, links to the English blog and is
 * noindex (an empty listing shouldn't be in Google), and it stays out of the
 * sitemap and hreflang.
 */
export async function generateMetadata(): Promise<Metadata> {
    const posts = await getAllPosts("ro");
    const languages = posts.length > 0 ? hreflangFor({ en: "/blog", ro: "/ro/blog" }) : undefined;
    return {
        title: TITLE,
        description: DESCRIPTION,
        alternates: { canonical: absoluteUrl("/ro/blog"), ...(languages && { languages }) },
        ...(posts.length === 0 && { robots: { index: false, follow: true } }),
        openGraph: { title: TITLE, description: DESCRIPTION, url: absoluteUrl("/ro/blog"), type: "website", siteName: SITE.name, images: [{ url: "/og-images/og-blog-ro.png", width: 1200, height: 630, alt: SITE.name }] },
    };
}

type PageProps = { searchParams: Promise<{ tag?: string | string[] }> };

export default async function BlogPageRo({ searchParams }: PageProps) {
    const posts = await getAllPosts("ro");
    const { tag } = await searchParams;
    const activeTag = (Array.isArray(tag) ? tag[0] : tag) ?? "";

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Blog", url: absoluteUrl("/ro/blog") },
                    ]),
                    collectionPageSchema({ name: TITLE, description: DESCRIPTION, url: absoluteUrl("/ro/blog"), locale: "ro" }),
                ]}
            />
            <BlogIndex posts={posts} activeTag={activeTag} />
        </>
    );
}
