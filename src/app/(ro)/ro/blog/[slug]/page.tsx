import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { JsonLd } from "@/components/JsonLd";
import { ScrollManager } from "@/components/ScrollManager";
import { BlogPostContent } from "@/components/BlogPostContent";
import { getAllPostSlugs, getPostBySlug } from "@/lib/cms";
import { authorPath } from "@/config/authors";
import { NOINDEX_POST_SLUGS, blogPostPath } from "@/config/blog-seo";
import { SITE } from "@/config/seo";
import { absoluteUrl, hreflangFor } from "@/i18n/routes";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";

/* Romanian posts (Prismic locale "ro-ro"). None exist yet — see docs/seo/content-plan-ro.md. */

export async function generateStaticParams() {
    const slugs = await getAllPostSlugs("ro");
    return slugs.map((slug) => ({ slug }));
}

type PageProps = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const post = await getPostBySlug((await params).slug, "ro");
    if (!post) return {};

    const title = post.seo?.metaTitle ?? post.title;
    const description = post.seo?.metaDescription ?? post.excerpt;
    const image = post.seo?.ogImage ?? post.image ?? SITE.ogImage;
    const languages = hreflangFor({
        ro: blogPostPath(post.slug, "ro"),
        ...Object.fromEntries((post.alternates ?? []).map((a) => [a.locale, blogPostPath(a.slug, a.locale)])),
    });

    return {
        title,
        description,
        keywords: post.tags,
        alternates: { canonical: absoluteUrl(blogPostPath(post.slug, "ro")), ...(languages && { languages }) },
        ...(NOINDEX_POST_SLUGS.includes(post.slug) && { robots: { index: false, follow: true } }),
        openGraph: {
            title,
            description,
            url: absoluteUrl(blogPostPath(post.slug, "ro")),
            type: "article",
            locale: "ro_RO",
            siteName: SITE.name,
            publishedTime: post.date,
            modifiedTime: post.updatedAt ?? post.date,
            authors: [post.author?.name ?? SITE.name],
            images: [{ url: image, width: 1200, height: 630, alt: title }],
        },
    };
}

export default async function BlogPostPageRo({ params }: PageProps) {
    const post = await getPostBySlug((await params).slug, "ro");
    if (!post) notFound();

    const url = absoluteUrl(blogPostPath(post.slug, "ro"));

    return (
        <div className="min-h-screen bg-background">
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: "Acasă", url: absoluteUrl("/ro") },
                        { name: "Blog", url: absoluteUrl("/ro/blog") },
                        { name: post.title, url },
                    ]),
                    articleSchema({
                        title: post.title,
                        description: post.excerpt,
                        url,
                        datePublished: post.date,
                        dateModified: post.updatedAt,
                        image: post.image,
                        authorName: post.author?.name,
                        authorUrl: post.author?.slug ? absoluteUrl(authorPath(post.author.slug)) : undefined,
                        locale: "ro",
                    }),
                ]}
            />
            <ScrollManager />
            <Navbar />
            <main>
                <BlogPostContent post={post} />
            </main>
            <Footer />
        </div>
    );
}
