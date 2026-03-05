import type { MetadataRoute } from "next";
import { SITE } from "@/config/seo";
import { SERVICE_PAGE_SLUGS } from "@/config/services";
import { getAllPosts } from "@/lib/cms";

/**
 * Programmatic sitemap — served at /sitemap.xml.
 *
 * Includes every indexable page: home, blog listing,
 * all parent & child service pages, and blog posts.
 *
 * Blog posts are sourced via the CMS abstraction layer
 * (lib/cms.ts). When you switch to Prismic/Sanity the
 * sitemap will automatically include all CMS posts.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const now = new Date();
    const posts = await getAllPosts();

    /* ── Static pages ──────────────────────────────────────── */
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: SITE.url,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 1.0,
        },
        {
            url: `${SITE.url}/blog`,
            lastModified: now,
            changeFrequency: "weekly",
            priority: 0.8,
        },
        {
            url: `${SITE.url}/privacy-policy`,
            lastModified: now,
            changeFrequency: "yearly",
            priority: 0.3,
        },
    ];

    /* ── Service pages ─────────────────────────────────────── */
    const servicePages: MetadataRoute.Sitemap = SERVICE_PAGE_SLUGS.map((key) => {
        const isParent = !key.includes("/");
        return {
            url: `${SITE.url}/services/${key}`,
            lastModified: now,
            changeFrequency: "monthly" as const,
            priority: isParent ? 0.9 : 0.7,
        };
    });

    /* ── Blog posts ────────────────────────────────────────── */
    const blogPosts: MetadataRoute.Sitemap = posts.map((post) => ({
        url: `${SITE.url}/blog/${post.slug}`,
        lastModified: post.updatedAt ? new Date(post.updatedAt) : new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

    return [...staticPages, ...servicePages, ...blogPosts];
}
