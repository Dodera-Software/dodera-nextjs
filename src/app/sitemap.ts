import type { MetadataRoute } from "next";
import { SITE } from "@/config/seo";
import { SERVICE_PAGE_SLUGS } from "@/config/services";
import { BLOG_POSTS } from "@/config/blog";

/**
 * Programmatic sitemap — served at /sitemap.xml.
 *
 * Includes every indexable page: home, blog listing, individual blog posts
 * (future CMS), all parent & child service pages.
 */
export default function sitemap(): MetadataRoute.Sitemap {
    const now = new Date();

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
    ];

    /* ── Blog post pages (ready for CMS / individual posts) ── */
    const blogPages: MetadataRoute.Sitemap = BLOG_POSTS.map((post) => ({
        url: `${SITE.url}/blog/${post.slug}`,
        lastModified: new Date(post.date),
        changeFrequency: "monthly" as const,
        priority: 0.6,
    }));

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

    return [...staticPages, ...blogPages, ...servicePages];
}
