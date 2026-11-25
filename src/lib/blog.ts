import "server-only";
import { unstable_cache } from "next/cache";
import { connection } from "next/server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { BLOG_CACHE_TAG, BlogStatus, WORDS_PER_MINUTE, blogCoverPath } from "@/config/blog";
import { getAuthorByName } from "@/config/authors";
import type { Locale } from "@/i18n/config";
import type { BlogPost } from "@/types";
import { countWords, renderMarkdown } from "@/lib/markdown";
import { verifyAdminSession } from "@/lib/admin-auth";

type BlogRow = typeof blogPosts.$inferSelect;

const toPost = (row: BlogRow, siblings: BlogRow[], body: string): BlogPost => ({
    key: row.translationKey,
    slug: row.slug,
    locale: row.locale as Locale,
    title: row.title,
    excerpt: row.excerpt,
    date: (row.publishedAt ?? row.createdAt).toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    readMinutes: Math.max(1, Math.round(countWords(row.body) / WORDS_PER_MINUTE)),
    category: row.category,
    tags: row.tags,
    author: { name: row.author, slug: getAuthorByName(row.author)?.slug },
    image: blogCoverPath(row.slug, row.locale as Locale, row.updatedAt.getTime()),
    body,
    seo: { metaTitle: row.metaTitle ?? undefined, metaDescription: row.metaDescription ?? undefined },
    sources: row.sources,
    indexed: row.indexed,
    draft: row.status !== BlogStatus.Published,
    alternates: siblings
        .filter((s) => s.translationKey === row.translationKey && s.locale !== row.locale && s.status === BlogStatus.Published)
        .map((s) => ({ locale: s.locale as Locale, slug: s.slug })),
});

const publishedRows = unstable_cache(
    () => db.select().from(blogPosts).where(eq(blogPosts.status, BlogStatus.Published)).orderBy(desc(blogPosts.publishedAt)),
    ["blog-published-rows"],
    { tags: [BLOG_CACHE_TAG] },
);

const loadPublished = async (): Promise<BlogRow[]> =>
    (await publishedRows()).map((row) => ({
        ...row,
        publishedAt: row.publishedAt && new Date(row.publishedAt),
        createdAt: new Date(row.createdAt),
        updatedAt: new Date(row.updatedAt),
    }));

export async function getAllPosts(locale: Locale): Promise<BlogPost[]> {
    const rows = await loadPublished();
    return rows.filter((row) => row.locale === locale).map((row) => toPost(row, rows, ""));
}

export async function getPostBySlug(slug: string, locale: Locale): Promise<BlogPost | null> {
    const rows = await loadPublished();
    const row = rows.find((r) => r.locale === locale && r.slug === slug);
    return row ? toPost(row, rows, renderMarkdown(row.body)) : null;
}

export async function getDraftPost(slug: string, locale: Locale): Promise<BlogPost | null> {
    const [row] = await db.select().from(blogPosts).where(and(eq(blogPosts.locale, locale), eq(blogPosts.slug, slug))).limit(1);
    if (!row) return null;
    const siblings = await db.select().from(blogPosts).where(eq(blogPosts.translationKey, row.translationKey));
    return toPost(row, siblings, renderMarkdown(row.body));
}

export async function loadBlogPost(slug: string, locale: Locale): Promise<BlogPost | null> {
    await connection();
    const post = await getPostBySlug(slug, locale);
    if (post) return post;
    return (await verifyAdminSession()) ? getDraftPost(slug, locale) : null;
}
