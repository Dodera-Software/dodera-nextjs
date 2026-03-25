import type { MetadataRoute } from "next";
import { SITE } from "@/config/seo";

/**
 * Programmatic robots.txt - served at /robots.txt.
 *
 * Crawl directives:
 * - Allow everything except internal API and Next.js build artifacts
 * - Declare sitemap location for all crawlers
 * - Throttl aggressive bots with crawl-delay
 */
export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: "*",
                allow: "/",
                disallow: ["/api/", "/_next/", "/404", "/admin/", "/slice-simulator", "/unsubscribe"],
            },
            {
                userAgent: "Googlebot",
                allow: "/",
            },
            {
                userAgent: "Bingbot",
                allow: "/",
            },
        ],
        sitemap: `${SITE.url}/sitemap.xml`,
        host: SITE.url,
    };
}
