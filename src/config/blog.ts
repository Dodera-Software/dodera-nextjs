import type { Locale } from "@/i18n/config";

export enum BlogStatus {
    Draft = "draft",
    Published = "published",
}

export const BLOG_CACHE_TAG = "blog";
export const DEFAULT_BLOG_AUTHOR = "Dodera Team";
export const WORDS_PER_MINUTE = 220;

export const blogPostPath = (slug: string, locale: Locale = "en") => (locale === "ro" ? `/ro/blog/${slug}` : `/blog/${slug}`);

export const blogCoverPath = (slug: string, locale: Locale, version: number) => `${blogPostPath(slug, locale)}/cover?v=${version}`;

export const COVER_SIZE = { width: 1200, height: 630 } as const;
