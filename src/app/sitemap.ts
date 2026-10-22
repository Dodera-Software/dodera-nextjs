import type { MetadataRoute } from "next";
import { SITE } from "@/config/seo";
import { getAllPosts } from "@/lib/cms";
import { LOCALES } from "@/i18n/config";
import { ROUTES, absoluteUrl, hreflangFor, type PageId } from "@/i18n/routes";
import LASTMOD from "@/config/lastmod.json";
import { AUTHORS, authorPath } from "@/config/authors";
import { NOINDEX_POST_SLUGS, blogPostPath } from "@/config/blog-seo";
import type { BlogPost } from "@/types";

/**
 * Programmatic sitemap — served at /sitemap.xml.
 *
 * One entry per page per locale, each listing its hreflang alternates.
 * lastmod is real: the last git commit touching the page's sources
 * (src/config/lastmod.json, `npm run seo:lastmod`) or, for blog posts,
 * the CMS publication dates. Pages without a known date get no lastmod
 * rather than the request time.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const [posts, postsRo] = await Promise.all([getAllPosts("en"), getAllPosts("ro")]);
    const lastmod = LASTMOD as Partial<Record<PageId, string>>;

    /* ── Pages from the route map (static + services) ──────── */
    const pages: MetadataRoute.Sitemap = Object.entries(ROUTES).flatMap(([id, route]) => {
        const languages = hreflangFor(route.paths);
        const date = lastmod[id as PageId];

        return LOCALES.flatMap((locale) => {
            const path = route.paths[locale];
            if (!path) return [];
            return [{
                url: absoluteUrl(path),
                ...(date && { lastModified: new Date(date) }),
                changeFrequency: route.changeFrequency,
                priority: route.priority,
                ...(languages && { alternates: { languages } }),
            }];
        });
    });

    /* ── Blog posts (both languages, paired via Prismic alternate_languages) ── */
    const postEntry = (post: BlogPost, locale: "en" | "ro") => {
        const languages = hreflangFor({
            [locale]: blogPostPath(post.slug, locale),
            ...Object.fromEntries((post.alternates ?? []).map((a) => [a.locale, blogPostPath(a.slug, a.locale)])),
        });
        return {
            url: absoluteUrl(blogPostPath(post.slug, locale)),
            lastModified: new Date(post.updatedAt ?? post.date),
            changeFrequency: "monthly" as const,
            priority: 0.6,
            ...(languages && { alternates: { languages } }),
        };
    };
    const indexable = (p: BlogPost) => !NOINDEX_POST_SLUGS.includes(p.slug);
    const blogPosts: MetadataRoute.Sitemap = [
        ...posts.filter(indexable).map((p) => postEntry(p, "en")),
        ...postsRo.filter(indexable).map((p) => postEntry(p, "ro")),
    ];

    /* ── Romanian blog listing — only once it has posts (it is noindex while empty) ── */
    if (postsRo.length > 0) {
        const languages = hreflangFor({ en: "/blog", ro: "/ro/blog" });
        pages.push({ url: absoluteUrl("/ro/blog"), changeFrequency: "weekly", priority: 0.8, ...(languages && { alternates: { languages } }) });
        const blogEn = pages.find((p) => p.url === absoluteUrl("/blog"));
        if (blogEn && languages) blogEn.alternates = { languages };
    }

    /* ── Author pages ──────────────────────────────────────── */
    const authorPages: MetadataRoute.Sitemap = AUTHORS.map((a) => ({
        url: absoluteUrl(authorPath(a.slug)),
        changeFrequency: "monthly" as const,
        priority: 0.4,
    }));

    // The blog listing changes whenever a post does.
    const newestPost = Math.max(...blogPosts.map((p) => (p.lastModified as Date).getTime()).filter(Number.isFinite));
    if (Number.isFinite(newestPost)) {
        const blog = pages.find((p) => p.url === absoluteUrl("/blog"));
        if (blog) blog.lastModified = new Date(newestPost);
    }

    return [...pages, ...blogPosts, ...authorPages];
}
