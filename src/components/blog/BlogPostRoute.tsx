import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { BlogPostContent } from "@/components/BlogPostContent";
import { authorPath } from "@/config/authors";
import { blogPostPath } from "@/config/blog";
import { SITE } from "@/config/seo";
import { OG_LOCALE, type Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { absoluteUrl, hreflangFor } from "@/i18n/routes";
import { loadBlogPost } from "@/lib/blog";
import { articleSchema, breadcrumbSchema } from "@/lib/structured-data";

export async function blogPostMetadata(slug: string, locale: Locale): Promise<Metadata> {
    const post = await loadBlogPost(slug, locale);
    if (!post) return {};

    const title = post.seo.metaTitle ?? post.title;
    const description = post.seo.metaDescription ?? post.excerpt;
    const url = absoluteUrl(blogPostPath(post.slug, locale));
    const languages = hreflangFor({
        [locale]: blogPostPath(post.slug, locale),
        ...Object.fromEntries(post.alternates.map((a) => [a.locale, blogPostPath(a.slug, a.locale)])),
    });

    return {
        title,
        description,
        keywords: post.tags,
        alternates: { canonical: url, ...(languages && { languages }) },
        ...((post.draft || !post.indexed) && { robots: { index: false, follow: !post.draft } }),
        openGraph: {
            title,
            description,
            url,
            type: "article",
            locale: OG_LOCALE[locale],
            siteName: SITE.name,
            publishedTime: post.date,
            modifiedTime: post.updatedAt,
            authors: [post.author.name],
            tags: post.tags,
            images: [{ url: post.image, width: 1200, height: 630, alt: title }],
        },
        twitter: { card: "summary_large_image", title, description, images: [post.image] },
    };
}

export async function BlogPostRoute({ slug, locale }: { slug: string; locale: Locale }) {
    const post = await loadBlogPost(slug, locale);
    if (!post) notFound();

    const { breadcrumb, links } = getDictionary(locale);
    const url = absoluteUrl(blogPostPath(post.slug, locale));

    return (
        <>
            <JsonLd
                data={[
                    breadcrumbSchema([
                        { name: breadcrumb.home, url: absoluteUrl(links.home) },
                        { name: "Blog", url: absoluteUrl(links.blog) },
                        { name: post.title, url },
                    ]),
                    articleSchema({
                        title: post.title,
                        description: post.excerpt,
                        url,
                        datePublished: post.date,
                        dateModified: post.updatedAt,
                        image: absoluteUrl(post.image),
                        authorName: post.author.name,
                        authorUrl: post.author.slug ? absoluteUrl(authorPath(post.author.slug)) : undefined,
                        locale,
                        keywords: post.tags,
                        citations: post.sources,
                    }),
                ]}
            />
            <BlogPostContent post={post} />
        </>
    );
}
