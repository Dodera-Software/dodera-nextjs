import "server-only";
import { revalidateTag } from "next/cache";
import { and, asc, desc, eq, inArray, ne } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { blogPosts } from "@/db/schema";
import { BLOG_CACHE_TAG, BlogStatus, DEFAULT_BLOG_AUTHOR } from "@/config/blog";
import { LOCALES, type Locale } from "@/i18n/config";

const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const localizedSchema = z.object({
    slug: z.string().regex(SLUG).max(90),
    title: z.string().trim().min(10).max(140),
    excerpt: z.string().trim().min(40).max(320),
    body: z.string().trim().min(600),
    metaTitle: z.string().trim().max(70).optional(),
    metaDescription: z.string().trim().max(170).optional(),
    category: z.string().trim().min(2).max(60),
    tags: z.array(z.string().trim().min(2).max(40)).min(1).max(8),
});

export const draftSchema = z.object({
    key: z.string().regex(SLUG).max(90),
    author: z.string().trim().max(80).default(DEFAULT_BLOG_AUTHOR),
    sources: z.array(z.object({ title: z.string().trim().min(2).max(200), url: z.url() })).min(1).max(20),
    en: localizedSchema,
    ro: localizedSchema,
});

export const editSchema = localizedSchema.omit({ slug: true, category: true, tags: true }).partial().extend({ indexed: z.boolean().optional() });

export type DraftInput = z.infer<typeof draftSchema>;
export type BlogRow = typeof blogPosts.$inferSelect;

export class BlogConflict extends Error {}

const refresh = () => revalidateTag(BLOG_CACHE_TAG, { expire: 0 });

export const listAllPosts = () => db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt), asc(blogPosts.locale));

export async function saveDraft(input: DraftInput) {
    return db.transaction(async (tx) => {
        const existing = await tx.select().from(blogPosts).where(eq(blogPosts.translationKey, input.key));
        if (existing.some((row) => row.status === BlogStatus.Published)) {
            throw new BlogConflict(`"${input.key}" is already published. Edit it in Admin → Blog instead.`);
        }

        const slugs = LOCALES.map((locale) => input[locale].slug);
        const taken = await tx
            .select({ slug: blogPosts.slug, locale: blogPosts.locale })
            .from(blogPosts)
            .where(and(inArray(blogPosts.slug, slugs), ne(blogPosts.translationKey, input.key)));
        const clash = taken.find((row) => input[row.locale as Locale].slug === row.slug);
        if (clash) throw new BlogConflict(`The ${clash.locale} slug "${clash.slug}" belongs to another post.`);

        const now = new Date();
        const rows = LOCALES.map((locale) => ({
            translationKey: input.key,
            locale,
            status: BlogStatus.Draft,
            author: input.author,
            sources: input.sources,
            ...input[locale],
            metaTitle: input[locale].metaTitle ?? null,
            metaDescription: input[locale].metaDescription ?? null,
            updatedAt: now,
        }));

        await tx.delete(blogPosts).where(eq(blogPosts.translationKey, input.key));
        return tx.insert(blogPosts).values(rows).returning();
    });
}

export async function setStatus(key: string, status: BlogStatus) {
    const now = new Date();
    const rows = await db.select().from(blogPosts).where(eq(blogPosts.translationKey, key));
    if (rows.length === 0) return false;
    for (const row of rows) {
        await db
            .update(blogPosts)
            .set({ status, publishedAt: status === BlogStatus.Published ? (row.publishedAt ?? now) : row.publishedAt, updatedAt: now })
            .where(eq(blogPosts.id, row.id));
    }
    refresh();
    return true;
}

export async function editPost(id: number, fields: z.infer<typeof editSchema>) {
    const [row] = await db.update(blogPosts).set({ ...fields, updatedAt: new Date() }).where(eq(blogPosts.id, id)).returning();
    if (row) refresh();
    return row;
}

export async function deletePosts(key: string) {
    const rows = await db.delete(blogPosts).where(eq(blogPosts.translationKey, key)).returning({ id: blogPosts.id });
    refresh();
    return rows.length > 0;
}
