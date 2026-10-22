import type { MetadataRoute } from "next";
import { SITE } from "@/config/seo";

/** Internal paths no crawler needs. */
const DISALLOW = ["/api/", "/_next/", "/404", "/admin/", "/slice-simulator", "/unsubscribe"];

/*
 * AI search & assistant crawlers. The "*" group already allows them; they
 * are listed explicitly so the intent is clear and nobody blocks them by
 * accident. A named group replaces "*" for that bot, so each one repeats
 * the same disallow list.
 */
const AI_CRAWLERS = [
    "GPTBot",           // OpenAI training
    "OAI-SearchBot",    // ChatGPT search
    "ChatGPT-User",     // ChatGPT browsing on a user's request
    "ClaudeBot",        // Anthropic
    "Claude-SearchBot",
    "Claude-User",
    "PerplexityBot",
    "Perplexity-User",
    "Google-Extended",  // Gemini / AI Overviews grounding
    "Applebot-Extended",
    "CCBot",            // Common Crawl, used by many LLMs
];

/**
 * Programmatic robots.txt — served at /robots.txt.
 *
 * - Allow everything except internal API and Next.js build artifacts
 * - Explicitly allow AI crawlers (same rules as everyone else)
 * - Declare the sitemap for all crawlers
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: DISALLOW,
            },
            {
                userAgent: "Googlebot",
                allow: "/",
            },
            {
                userAgent: "Bingbot",
                allow: "/",
            },
            {
                userAgent: AI_CRAWLERS,
                allow: "/",
                disallow: DISALLOW,
            },
        ],
        sitemap: `${SITE.url}/sitemap.xml`,
        host: SITE.url,
    };
}
