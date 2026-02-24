/**
 * CMS abstraction layer.
 *
 * Right now this returns static placeholder data from config/blog.ts.
 * When you integrate Prismic, Sanity, Contentful, etc., swap the
 * implementations in this file — every consumer stays unchanged.
 *
 * ┌─────────────────────────────────────────────────┐
 * │  Pages / Components  →  lib/cms.ts  →  CMS API  │
 * └─────────────────────────────────────────────────┘
 */

import type { BlogPost } from "@/types";
import { BLOG_POSTS } from "@/config/blog";

/* ── All posts (listing page) ──────────────────────────── */
export async function getAllPosts(): Promise<BlogPost[]> {
    // TODO: Replace with CMS client call, e.g.:
    // return prismicClient.getAllByType("blog_post", { orderings: … })
    return BLOG_POSTS;
}

/* ── Single post by slug ───────────────────────────────── */
export async function getPostBySlug(
    slug: string,
): Promise<BlogPost | null> {
    // TODO: Replace with CMS client call, e.g.:
    // return prismicClient.getByUID("blog_post", slug)
    return BLOG_POSTS.find((p) => p.slug === slug) ?? null;
}

/* ── All slugs (for generateStaticParams) ──────────────── */
export async function getAllPostSlugs(): Promise<string[]> {
    // TODO: Replace with CMS client call
    return BLOG_POSTS.map((p) => p.slug);
}

/* ── Posts by category ─────────────────────────────────── */
export async function getPostsByCategory(
    category: string,
): Promise<BlogPost[]> {
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
