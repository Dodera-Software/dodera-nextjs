/**
 * Blog SEO switches that don't belong in the CMS.
 *
 * NOINDEX_POST_SLUGS: posts that stay online (and linked) but ask search
 * engines not to index them, and are left out of the sitemap. Empty until
 * the owner decides — see docs/seo/blog-audit.md for the proposed list
 * (news-style posts with no link to what Dodera sells).
 */
export const NOINDEX_POST_SLUGS: string[] = [];

export const blogPostPath = (slug: string, locale: "en" | "ro" = "en") =>
    locale === "ro" ? `/ro/blog/${slug}` : `/blog/${slug}`;
