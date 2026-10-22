# Blog audit: keep, merge or noindex

There are 15 posts on doderasoft.com/blog, all in English (Prismic `en-us`). **Nothing has been deleted or noindexed.** Each action below is a proposal for you to decide.

**Why it matters:** a services company's blog helps rankings when its posts support what the company sells, so they earn links and answer buyer questions. Time-bound tech-news posts can't rank against news sites, go stale fast, and dilute what search engines and AI assistants think the site is about.

**How to apply a decision:**
- **Noindex:** add the slug to `NOINDEX_POST_SLUGS` in `src/config/blog-seo.ts`. The post stays online and linked, but gets `noindex, follow` and is dropped from the sitemap.
- **Merge:** update the surviving post in Prismic, then add a 301 from the old slug in `next.config.ts` `redirects()`.

| Post (slug) | Topic | Proposal | Why |
|---|---|---|---|
| tesla-2026-product-ramp-semi-cybercab-megapack-3 | Tesla news | **Noindex** | Pure news, unrelated to Dodera's services, already dated. |
| meta-cuts-10-percent-workforce-ai-costs-efficiency-push | Meta layoffs | **Noindex** | Layoff news; no buyer intent. Also has 2 H1s (fixed in code). |
| apple-ai-era-constraints-ceo-transition-john-ternus | Apple CEO change | **Noindex** | Corporate news; the angle ("businesses should stop waiting") is too thin to rank. |
| apple-ios-26-5-rc-encrypted-rcs-update | iOS RCS update | **Noindex** | Consumer news, unrelated to services. |
| amazon-anthropic-investment-ai-race | Amazon–Anthropic deal | **Noindex** | Funding news; dated. |
| anthropic-mythos-model-security-fears-regulators-monitoring | AI model security | **Noindex** (or rewrite) | News angle. Could be rewritten as "AI security checklist for companies" and linked to AI services. |
| claude-code-source-code-leak-impact | AI dev-tool leak | **Keep, refresh** | Security for AI tooling fits the AI services. Add a "what this means for your team" section and links to /services/ai-development. |
| ai-job-panic-stop-hiring-humans-workforce-displacement | AI and jobs | **Keep, refresh** | Supports the "agents augment, don't replace" message on the AI agents page; add that link. |
| google-gemma-4-on-device-agentic-workflows | On-device agents | **Keep** | Relevant to custom AI agents. Link to /services/ai-development/custom-ai-agents. |
| agentic-ai-physical-automation-shift | Agentic AI | **Keep** | Core topic. Link to agents and automations. |
| low-code-high-impact-startup | Low-code for startups | **Keep** | Supports MVP. Link to /services/software-development/mvp-to-market. |
| why-javascript-still-leads-frontend-development | JavaScript | **Keep** | Evergreen engineering post; shows expertise. |
| nuxt-next-changed-industry-benefits | Nuxt and Next.js | **Keep (merge target)** | Evergreen; overlaps with the post below. |
| next-js-enhancing-user-experience | Next.js UX | **Merge into the post above** | Short and overlapping. Move anything unique into the Nuxt/Next post, then 301 this slug to it. |
| top-10-tech-careers-2026 | Tech careers | **Keep** | Useful for recruiting. Link to /careers. Signed "Dodera Team", so the schema credits the organization. |

## Proposed `NOINDEX_POST_SLUGS` (once you agree)

```ts
export const NOINDEX_POST_SLUGS: string[] = [
    "tesla-2026-product-ramp-semi-cybercab-megapack-3",
    "meta-cuts-10-percent-workforce-ai-costs-efficiency-push",
    "apple-ai-era-constraints-ceo-transition-john-ternus",
    "apple-ios-26-5-rc-encrypted-rcs-update",
    "amazon-anthropic-investment-ai-race",
    "anthropic-mythos-model-security-fears-regulators-monitoring",
];
```

## Already fixed in code (no decision needed)
- Six posts rendered more than one H1. Headings marked "Heading 1" in the post body are now shown as H2.
- The blog listing used to render client-side only. Its H1 and post list are now in the server HTML.
- Posts by a person get a `Person` author linked to their author page (`/blog/authors/amalia-s`). "Dodera Team" posts are credited to the organization.
