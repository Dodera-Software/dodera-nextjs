/**
 * Blog SEO switches that don't belong in the CMS.
 *
 * NOINDEX_POST_SLUGS: posts that stay online (and linked) but ask search
 * engines not to index them, and are left out of the sitemap — news-style
 * posts with no link to what Dodera sells (docs/seo/blog-audit.md).
 * Applied on the owner's go-ahead, 22 Oct 2026. Remove a slug to re-index it.
 */
export const NOINDEX_POST_SLUGS: string[] = [
    "tesla-2026-product-ramp-semi-cybercab-megapack-3",
    "meta-cuts-10-percent-workforce-ai-costs-efficiency-push",
    "apple-ai-era-constraints-ceo-transition-john-ternus",
    "apple-ios-26-5-rc-encrypted-rcs-update",
    "amazon-anthropic-investment-ai-race",
    "anthropic-mythos-model-security-fears-regulators-monitoring",
];

export const blogPostPath = (slug: string, locale: "en" | "ro" = "en") =>
    locale === "ro" ? `/ro/blog/${slug}` : `/blog/${slug}`;
