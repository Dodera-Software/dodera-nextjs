import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { BlogPostContent } from "@/components/BlogPostContent";
import { getPostBySlug, getAllPostSlugs } from "@/lib/cms";
import { SITE } from "@/config/seo";
import { breadcrumbSchema, articleSchema } from "@/lib/structured-data";
import { NOINDEX_POST_SLUGS, blogPostPath } from "@/config/blog-seo";
import { authorPath } from "@/config/authors";
import { absoluteUrl, hreflangFor } from "@/i18n/routes";

/* ── Static params for SSG ────────────────────────────────── */
export async function generateStaticParams() {
    const slugs = await getAllPostSlugs();
    return slugs.map((slug) => ({ slug }));
}

/* ── Dynamic metadata ─────────────────────────────────────── */
type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({
    params,
}: PageProps): Promise<Metadata> {
    const { slug } = await params;
    const post = await getPostBySlug(slug);
    if (!post) return {};

    const title = post.seo?.metaTitle ?? post.title;
    const description = post.seo?.metaDescription ?? post.excerpt;
    const image = post.seo?.ogImage ?? post.image ?? SITE.ogImage;

    return {
        title,
        description,
        keywords: post.tags,
        alternates: {
            canonical: absoluteUrl(blogPostPath(post.slug)),
            ...(() => {
                const languages = hreflangFor({
                    en: blogPostPath(post.slug),
                    ...Object.fromEntries((post.alternates ?? []).map((a) => [a.locale, blogPostPath(a.slug, a.locale)])),
                });
                return languages ? { languages } : {};
            })(),
        },
        ...(NOINDEX_POST_SLUGS.includes(post.slug) && { robots: { index: false, follow: true } }),
        openGraph: {
            title,
            description,
            url: `${SITE.url}/blog/${post.slug}`,
            type: "article",
            siteName: SITE.name,
            publishedTime: post.date,
            modifiedTime: post.updatedAt ?? post.date,
            authors: [post.author?.name ?? SITE.name],
            tags: post.tags,
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
        twitter: {
            card: "summary_large_image",
            title,
            description,
            images: [image],
        },
    };
}

/* ── Page Component ───────────────────────────────────────── */
export default async function BlogPostPage({ params }: PageProps) {
    const { slug } = await params;
    const post = await getPostBySlug(slug);

    if (!post) notFound();

    const postUrl = `${SITE.url}/blog/${post.slug}`;

    const structuredData = [
        breadcrumbSchema([
            { name: "Home", url: SITE.url },
            { name: "Blog", url: `${SITE.url}/blog` },
            { name: post.title, url: postUrl },
        ]),
        articleSchema({
            title: post.title,
            description: post.excerpt,
            url: postUrl,
            datePublished: post.date,
            dateModified: post.updatedAt,
            image: post.image,
            authorName: post.author?.name,
            authorUrl: post.author?.slug ? absoluteUrl(authorPath(post.author.slug)) : undefined,
            locale: "en",
        }),
    ];

    return (
        <div className="min-h-screen bg-background">
            <JsonLd data={structuredData} />
            <ScrollManager />
            <Navbar />
            <main>
                <BlogPostContent post={post} />
            </main>
            <Footer />
        </div>
    );
}
