import { SITE } from "@/config/seo";

/**
 * Website visits: Dodera's shared, self-hosted Umami (cookie-free; privacy policy §1 "Usage data").
 * The website id is doderasoft.com's in Umami › Settings › Websites; it is public in every page anyway.
 * `domains` keeps local and preview builds from being counted.
 */
export const ANALYTICS = {
    src: "https://stats.doderasoft.com/script.js",
    websiteId: "7144126b-d599-4206-816c-e500043f6784",
    domains: new URL(SITE.url).hostname,
} as const;
