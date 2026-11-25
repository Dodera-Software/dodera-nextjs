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

export enum AnalyticsEvent {
    DeckNext = "deck-next",
    CtaClick = "cta-click",
    ProductOpen = "product-open",
    ProductVisit = "product-visit",
    ContactSent = "contact-sent",
    NewsletterSubscribed = "newsletter-subscribed",
    ApplicationSent = "application-sent",
}

export enum CtaLocation {
    Nav = "nav",
    HomeHero = "home-hero",
    HomeServices = "home-services",
    HomePricing = "home-pricing",
    ServiceHero = "service-hero",
    ProductHero = "product-hero",
    PageEnd = "page-end",
    Footer = "footer",
    HomeProducts = "home-products",
    ProductsIndex = "products-index",
}
