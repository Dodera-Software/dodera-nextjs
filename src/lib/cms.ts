/**
 * CMS abstraction layer — powered by Prismic.
 *
 * This module fetches blog content from the Prismic headless CMS
 * and maps it into the app's internal BlogPost type so the rest of
 * the codebase stays decoupled from any specific CMS API.
 *
 * Fallback: if no Prismic repository is configured (env var missing)
 * or the fetch fails, the placeholder data from config/blog.ts is
 * returned so the site still builds during local development.
 */

import * as prismic from "@prismicio/client";
import { createClient } from "@/lib/prismic";
import type { BlogPost } from "@/types";
import type { BlogPostDocument } from "@/types/prismic";
import { BLOG_POSTS, TAG_NORMALIZER } from "@/config/blog";
import { getAuthorByName } from "@/config/authors";
import type { Locale } from "@/i18n/config";

/*
 * Prismic locale per site locale. Romanian posts live in the "ro-ro" locale,
 * which has to be added in the Prismic repository settings
 * (TODO(owner)); translations are linked to their English original there,
 * which gives each post its hreflang pair.
 */
const PRISMIC_LANG: Record<Locale, string> = { en: "en-us", ro: "ro-ro" };

function siteLocale(prismicLang: string): Locale | undefined {
    return (Object.keys(PRISMIC_LANG) as Locale[]).find((l) => PRISMIC_LANG[l] === prismicLang);
}

/* ── Helpers ───────────────────────────────────────────── */

/** Check whether Prismic is configured via environment variable. */
function isPrismicConfigured(): boolean {
    return (
        !!process.env.PRISMIC_REPOSITORY_NAME &&
        process.env.PRISMIC_REPOSITORY_NAME !== "your-repo-name"
    );
}

/**
 * Convert a Prismic blog_post document into the internal BlogPost shape.
 */
function mapPrismicPost(doc: BlogPostDocument): BlogPost {
    const d = doc.data;

    return {
        slug: doc.uid ?? doc.id,
        title: d.title ?? "Untitled",
        excerpt: d.excerpt ?? "",
        date: d.date ?? doc.first_publication_date ?? "",
        updatedAt: d.updated_at ?? doc.last_publication_date ?? undefined,
        readTime: d.read_time ?? "5 min read",
        category: d.category ?? "Uncategorized",
        tags: Array.from(new Set(
            (d.tags ?? [])
                .map((t) => t.tag ?? "")
                .filter(Boolean)
                .map((tag) => {
                    // Case-insensitive lookup so "ai", "AI", "Ai" all resolve correctly
                    const key = Object.keys(TAG_NORMALIZER).find(
                        (k) => k.toLowerCase() === tag.toLowerCase()
                    );
                    return key ? TAG_NORMALIZER[key] : tag;
                })
        )),
        author: d.author_name
            ? {
                name: d.author_name,
                slug: getAuthorByName(d.author_name)?.slug,
                avatar: d.author_avatar?.url ?? undefined,
            }
            : undefined,
        locale: siteLocale(doc.lang),
        alternates: (doc.alternate_languages ?? [])
            .map((a) => ({ locale: siteLocale(a.lang), slug: a.uid }))
            .filter((a): a is { locale: Locale; slug: string } => !!a.locale && !!a.slug),
        image: d.featured_image?.url ?? undefined,
        body: (() => {
            const html = prismic.asHTML(d.body);
            if (!html) return undefined;
            // Remove stray "undefined" fragments produced by empty embed blocks
            const cleaned = html.replace(/(?:<[^>]*>)?\s*undefined\s*(?:<\/[^>]*>)?/g, "").trim();
            // The post title is the page's only <h1>; headings authored as
            // "Heading 1" in the body become <h2> so there is exactly one.
            const singleH1 = cleaned.replace(/<(\/?)h1(\s|>)/gi, "<$1h2$2");
            return singleH1 || undefined;
        })(),
        seo: {
            metaTitle: d.meta_title ?? undefined,
            metaDescription: d.meta_description ?? undefined,
            ogImage: d.og_image?.url ?? undefined,
        },
    };
}

/* ── All posts (listing page) ──────────────────────────── */
export async function getAllPosts(locale: Locale = "en"): Promise<BlogPost[]> {
    // The placeholder posts are English; there is no Romanian fallback content.
    const fallback = locale === "en" ? BLOG_POSTS : [];
    if (!isPrismicConfigured()) return fallback;

    try {
        const client = createClient();
        const docs = await client.getAllByType<BlogPostDocument>("blog_post", {
            lang: PRISMIC_LANG[locale],
            orderings: [
                { field: "my.blog_post.date", direction: "desc" },
            ],
        });

        if (docs.length === 0) return fallback;

        const mapped = docs.map(mapPrismicPost);

        // Sort by the most recent activity: updatedAt takes priority over date
        mapped.sort((a, b) => {
            const aTime = new Date(a.updatedAt ?? a.date).getTime();
            const bTime = new Date(b.updatedAt ?? b.date).getTime();
            return bTime - aTime;
        });

        return mapped;
    } catch (err) {
        console.error("[cms] Failed to fetch posts from Prismic:", err);
        return fallback;
    }
}

/* ── Single post by slug ───────────────────────────────── */
export async function getPostBySlug(slug: string, locale: Locale = "en"): Promise<BlogPost | null> {
    if (locale === "ro" && !isPrismicConfigured()) return null;
    if (!isPrismicConfigured()) {
        return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    }

    try {
        const client = createClient();
        const doc = await client.getByUID<BlogPostDocument>("blog_post", slug, { lang: PRISMIC_LANG[locale] });
        return mapPrismicPost(doc);
    } catch (err) {
        if (locale === "ro") return null;
        // Document not found — fall back to static data
        if (
            err instanceof prismic.NotFoundError ||
            (err instanceof prismic.PrismicError && err.message.includes("not found"))
        ) {
            return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
        }
        console.error("[cms] Failed to fetch post by slug:", err);
        return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
    }
}

/* ── All slugs (for generateStaticParams) ──────────────── */
export async function getAllPostSlugs(locale: Locale = "en"): Promise<string[]> {
    const fallback = locale === "en" ? BLOG_POSTS.map((p) => p.slug) : [];
    if (!isPrismicConfigured()) return fallback;

    try {
        const client = createClient();
        const docs = await client.getAllByType<BlogPostDocument>("blog_post", { lang: PRISMIC_LANG[locale] });
        const prismicSlugs = docs.map((d) => d.uid).filter(Boolean) as string[];
        return prismicSlugs.length > 0 ? prismicSlugs : fallback;
    } catch (err) {
        console.error("[cms] Failed to fetch slugs from Prismic:", err);
        return fallback;
    }
}

/* ── Posts by category ─────────────────────────────────── */
export async function getPostsByCategory(category: string): Promise<BlogPost[]> {
    const posts = await getAllPosts();
    return posts.filter(
        (p) => p.category.toLowerCase() === category.toLowerCase(),
    );
}

/* ── Posts by tag ──────────────────────────────────────── */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
    const posts = await getAllPosts();
    return posts.filter((p) =>
        p.tags.some((t) => t.toLowerCase() === tag.toLowerCase()),
    );
}
