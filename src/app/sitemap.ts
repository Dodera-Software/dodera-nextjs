import type { MetadataRoute } from "next";
import { SITE } from "@/config/seo";
import { getAllPosts } from "@/lib/cms";
import { LOCALES } from "@/i18n/config";
import { ROUTES, absoluteUrl, hreflangFor, type PageId } from "@/i18n/routes";
import LASTMOD from "@/config/lastmod.json";

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
    const posts = await getAllPosts();
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

    /* ── Blog posts ────────────────────────────────────────── */
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${SITE.url}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt ?? post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    // The blog listing changes whenever a post does.
    const newestPost = Math.max(...blogPosts.map((p) => (p.lastModified as Date).getTime()).filter(Number.isFinite));
    if (Number.isFinite(newestPost)) {
        const blog = pages.find((p) => p.url === absoluteUrl("/blog"));
        if (blog) blog.lastModified = new Date(newestPost);
    }

    return [...pages, ...blogPosts];
}
