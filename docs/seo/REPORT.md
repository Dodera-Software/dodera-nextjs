# SEO & GEO for Romania: final report

**Goal:** make doderasoft.com discoverable for searches in Satu Mare and across Romania, in Google search, Google's AI summaries and AI assistants, while keeping the English site and its rankings.

**Where it is:**
- PR #81: phases 1–2, technical SEO and the Romanian site.
- PR #82: phases 3–6, local pages, case studies, blog, verification.

Merge #81 first. Nothing has been merged.

---

## 1. What changed

### Phase 1: technical SEO
- **One root layout per locale** (`(en)` and `(ro)` route groups), so `<html lang>` is right on every page. No English URL changed.
- **Canonical and hreflang** (ro / en / x-default) come from a single route map (`src/i18n/routes.ts`, `paths.ts`). hreflang is only emitted once a page exists in both languages.
- **`sitemap.xml`:** one entry per page per language, with hreflang alternates. `lastmod` is real: git history of each page's source files (`npm run seo:lastmod` → `src/config/lastmod.json`) or Prismic dates for posts. The request time is no longer used.
- **`robots.txt`:** same rules as before. GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, Claude-SearchBot, Claude-User, PerplexityBot, Perplexity-User, Google-Extended, Applebot-Extended and CCBot are now listed explicitly as allowed, with the same disallow list. They were already allowed through `*`. The sitemap line is still there.
- **`/llms.txt`:** company, services, prices, location, contact and key pages, in English with a Romanian section. It's generated from config, so it can't drift from the site.
- **JSON-LD, validated against the schema.org vocabulary with 0 errors:**
  - One `ProfessionalService` entity with a stable `@id`: real NAP, E.164 phone, geo, `areaServed` (Satu Mare, Carei, Baia Mare, Zalău, Oradea, Cluj-Napoca and Romania), `priceRange` from the published prices, `foundingDate` 2023, `taxID`, `sameAs`.
  - `Service` with `offers` on every service page; `BreadcrumbList` on every non-home page.
  - `FAQPage` only where the answers are visible on the page.
  - `BlogPosting` with a `Person` author; `ProfilePage` for authors; `Article` for case studies.
- **Removed from the JSON-LD:**
  - "Open 24/7" hours
  - 6 employee names that look invented
  - a 20 km circle around **Bucharest** as the service area
  - a `SearchAction` for a site search that doesn't exist
  - an invalid `phone` property
  - foundingDate 2024 (the registration number says 2023)
- **Your bug list:** all fixed.
  - "How We Work" rendered twice.
  - `94%reduction` / `0outages` / H1 `thatMeans` / "Made with by".
  - The Services nav item has no link: it now goes to a new `/services` page.
  - The pricing contradiction.
  - Service FAQs showed questions without answers: the answers existed, but the accordion removed them from the HTML.
  - "Open 24 hours".
- **Extra fixes:**
  - The privacy page title said "Dodera Software" twice.
  - The blog listing rendered client-side only, so there was no H1 or post list in the HTML.
  - 6 posts had several H1s.
  - The default OG image was a 1×1 pixel.
  - Two service images were 1.9 MB and 0.8 MB; they're now about 30–40 KB WebP, with 301s from the old URLs.
  - The hero H1 was invisible until JavaScript ran (it is the LCP element).

### Phase 2: Romanian site
- `/ro`, `/ro/servicii`, `/ro/despre-noi`, `/ro/contact`, `/ro/cariere`, `/ro/politica-de-confidentialitate`.
- 11 service pages under `/ro/servicii/...`. Each has 800–1,200 words, 6–8 FAQs with full answers, prices, process and timeline, a case study where one fits, and internal links.
- Every Romanian page has a unique title (≤60 characters, keyword first, then "| Dodera Software"), a description ≤155 characters, one H1, and an opening paragraph that answers who / what / where / price.
- "Dumneavoastră" is used throughout, with correct diacritics.
- An EN/RO switcher opens the same page in the other language.
- A new English `/contact` page pairs with `/ro/contact`.
- The English page text is unchanged apart from the fixes above. I diffed it line by line against production.

### Phase 3: local pages
- `/ro/locatii` plus 6 city pages: Satu Mare, Carei, Baia Mare, Zalău, Oradea and Cluj-Napoca. Each one has its own intro, how we work there (in person in Satu Mare, remote elsewhere), the local economy and services that fit it, a relevant case study or a TODO, a local FAQ, and `Service` JSON-LD with `areaServed` set to that city. Measured text similarity between city pages is 0.23–0.49, so they are not swapped-name copies.
- `/ro/dezvoltare-solutii-web-satu-mare` is the main local money page: solutions, why a local firm, process, prices, a case study, 7 FAQs and a quote form.
- The footer shows the NAP in both languages, with a Google Maps / Business Profile link, from the same config as the contact page and the JSON-LD.

### Phase 4: proof and E-E-A-T
- `/case-studies` and `/ro/studii-de-caz`, plus a full page per case (freight automation, B2B SaaS reporting, clinic booking) in both languages: client, stack, timeline where known, problem, solution, result. They're linked from the relevant service pages, the homepage and the footer.
- A founder section on both About pages, plus `founder` in the JSON-LD. **It appears only once real details are entered.**
- **Testimonials:** a testimonial now needs a company, a link and `verified: true` to be shown. None of the 5 qualifies, so the section is hidden. The text is kept in `config/testimonials.ts` with the reasons.

### Phase 5: blog
- Romanian blog support: posts per locale from Prismic (`ro-ro`), hreflang between translations via Prismic's linked translations, `/ro/blog` and `/ro/blog/[slug]`. `/ro/blog` stays noindex and out of the sitemap until the first Romanian post exists.
- An author page `/blog/authors/amalia-s` (ProfilePage + Person schema). Posts link to the author, and "Dodera Team" posts are credited to the organization.
- `NOINDEX_POST_SLUGS` in `src/config/blog-seo.ts` is empty; you decide what goes in it.
- `docs/seo/content-plan-ro.md`: 15 Romanian buyer-question articles, each with a target query, an outline and a quotable "Răspuns rapid".
- `docs/seo/blog-audit.md`: keep / merge / noindex proposals for the 15 existing posts.

### Phase 6: verification
- Lint: the 4 errors that were already there are fixed; 0 errors remain. 12 warnings remain, also already there, in files outside this work.
- Build: the Windows build failed at the last step on a `node:path` chunk filename. Fixed by importing `"path"` in `instrumentation.ts`, and the build now passes.

---

## 2. Verification results

**Build:** `next build` exits 0 and generates 128 pages. `tsc` is clean. ESLint has 0 errors.

**Crawl of every sitemap URL (67: 38 English, 29 Romanian) on the production build:** 0 problems. For every URL:
- HTTP 200 and the correct `<html lang>`
- exactly one H1
- a self-referencing canonical
- not noindex
- Romanian titles ≤60 and descriptions ≤155 characters
- page hreflang equal to the sitemap hreflang, and reciprocal (42 URLs have pairs)
- every JSON-LD block parses and validates against the schema.org vocabulary

`/robots.txt` and `/llms.txt` return 200.

**Lighthouse, mobile, median of 3 runs:**

| Page | Perf. | A11y | Best pr. | SEO | LCP |
|---|---|---|---|---|---|
| EN home `/` | 83 | 96 | 77 | 100 | 4.5 s |
| RO home `/ro` | 75 | 96 | 77 | 100 | 4.8 s |
| EN service `/services/software-development` | 83 | 96 | 77 | 100 | 4.4 s |
| RO service `/ro/servicii/dezvoltare-software` | 80 | 97 | 77 | 100 | 4.7 s |
| EN contact `/contact` | 93 | 96 | 77 | 100 | 3.1 s |
| RO city `/ro/locatii/oradea` | 90 | 97 | 77 | 100 | 3.5 s |
| *Live today: home* | *85* | *89* | *77* | *100* | *4.2 s* |
| *Live today: service page* | *84* | *96* | *77* | *100* | *4.5 s* |

How to read this:
- The branch was measured on `next start` on a Windows laptop; the live site runs behind Coolify/Traefik. English pages are on par with live, within run-to-run noise.
- Accessibility on the home page went from 89 to 96.
- City pages exist only in Romanian, so the English "city" row is the contact page, which carries the local NAP.
- Best Practices is 77 on both live and branch. The failing audits (third-party cookies, browser console issues) are not caused by this work.
- The Romanian pages also download Inter's latin-ext file (about 86 KB) because their text uses ș/ț/ă. The Romanian home also loads the terminal's monospace font. Options to recover those points:
  - self-host an Inter subset limited to the Romanian glyphs
  - show the hero terminal without a web font
  - lazy-load framer-motion below the fold

**Correction to Phase 1.** Two claims in the Phase 1 commit and in PR #81 were wrong:
- "ș/ț weren't covered": `subsets` only controls which font files are preloaded, and the latin-ext range was always in the CSS.
- "Inter was preloaded but never applied": Next 16 registers the family as "Inter", so Tailwind's literal `"Inter"` already matched.

Phase 6 restores the original font setup (`subsets: ["latin"]`), which avoids preloading or double-downloading latin-ext. The Tailwind change to `var(--font-inter)` is kept; it's equivalent and adds the metric-matched fallback.

---

## 3. New URLs

**English:**
- `/services`
- `/contact`
- `/case-studies`
- `/case-studies/freight-forwarding-automation`
- `/case-studies/b2b-saas-reporting-dashboard`
- `/case-studies/clinic-booking-platform`
- `/blog/authors/amalia-s`
- `/llms.txt`

**Romanian:**
- `/ro`, `/ro/servicii`, `/ro/despre-noi`, `/ro/contact`, `/ro/cariere`, `/ro/politica-de-confidentialitate`
- `/ro/servicii/dezvoltare-software` and `/mvp`, `/platforme-enterprise`, `/produse-saas`
- `/ro/servicii/site-uri-de-prezentare` and `/site-de-prezentare-firma`
- `/ro/servicii/dezvoltare-ai` and `/agenti-ai-personalizati`, `/automatizari-ai-n8n`
- `/ro/servicii/documentatie-tehnica` and `/sisteme-de-documentare`
- `/ro/locatii` and `/satu-mare`, `/carei`, `/baia-mare`, `/zalau`, `/oradea`, `/cluj-napoca`
- `/ro/dezvoltare-solutii-web-satu-mare`
- `/ro/studii-de-caz` and `/automatizare-expeditii-marfuri`, `/dashboard-raportare-saas-b2b`, `/platforma-programari-clinici`
- `/ro/blog`, which goes live in search once there are Romanian posts

**Redirects (301):** `/technical-documentation.png` and `/presentation-website.png` now point to their `.webp` versions. No page URLs changed.

---

## 4. TODOs you need to fill in

Anything missing is hidden on the site, not shown as placeholder text. Search the code for `TODO(owner)`.

| What | Where |
|---|---|
| Real opening hours (footer, contact page, JSON-LD) | `src/config/seo.ts` `openingHours`, `src/config/site.ts` `COMPANY.hours` |
| Founder: name, role, LinkedIn, 2–4 sentence bio, photo | `src/config/seo.ts` `founder` (+ photo in `/public`) |
| Google Business Profile link | `src/config/seo.ts` `googleBusinessProfile` |
| Exact map pin (currently street-level, from OpenStreetMap) | `src/config/seo.ts` `geo` |
| Typical price ranges per project type (site, shop, web app, AI agent) | `src/config/services.ro.ts` (header), content plan articles 1 and 6 |
| Client quotes, build time for the SaaS and clinic projects, client names/links if allowed | `src/config/case-studies.ts`, `src/i18n/dictionaries/ro.ts` |
| Case studies for websites, AI agents, documentation, MVP, and Maramureș | `src/config/services.ro.ts`, `src/config/locations.ro.ts` |
| Verified testimonials (name, role, company, link) | `src/config/testimonials.ts` |
| Author role, bio, LinkedIn, photo | `src/config/authors.ts` |
| Google Search Console verification token (or verify by DNS) | `src/lib/site-metadata.ts` |
| Social profiles: confirm LinkedIn `/company/dodera-software/`, Instagram `@doderasoft`, X `@doderasoft`, and whether there is a Facebook page | `src/config/seo.ts` `social` |
| Legal review of the Romanian privacy policy translation | `/ro/politica-de-confidentialitate` |
| Which posts to noindex or merge | `docs/seo/blog-audit.md` → `src/config/blog-seo.ts` |

---

## 5. Claims flagged

These are claims the site makes that nothing supports. They are **still on the English pages**, left out of the Romanian ones, and I have not removed them from English. Tell me which are true, and I'll remove or replace the rest.

| Claim | Where | Proposed replacement |
|---|---|---|
| "35+ member workflow team" | home `NotableClients` and `TeamSection` | "A core team of N engineers, plus trusted specialists we bring in when a project needs them." (real N) |
| "Most members carry 7–10+ years" | home `TeamSection` | Real experience, e.g. "Our senior engineers have X+ years each." |
| About stats "20+ AI applications, 50+ web applications, 99% client satisfaction" | `/about` | Real counts, or remove the counter row |
| "Every engineer on our roster is senior level" | `/about` | "Senior engineers lead every project." |
| Stats "5.0 client satisfaction, 0 post-launch incidents, 100% on-time" | `config/stats.ts` (not rendered) | Delete, or source them |
| 5 testimonials with first name + role only, two contradicting the case studies | `config/testimonials.ts` (now hidden) | Real reviews with company and link |
| "From startups in Western Europe to enterprises in North America" | `/about` FAQ | Where your clients actually are |
| "Experience building to SOC 2 Type II, GDPR, HIPAA, PCI-DSS" | `/services/software-development/enterprise-platforms` | "We design for GDPR from the architecture up and implement the controls other standards require." |
| "99.9%+ uptime multi-region", "Sub-200ms API response times" | enterprise page | Describe the approach (load tests, monitoring) without numbers |
| "Handle millions of transactions" | enterprise meta + card | "Built to scale with your load." |
| "Reduce manual workload by up to 80%", "60–80% of routine queries" | AI pages | Cite the real case: "94% less manual processing for a freight forwarder." |
| "Professional design increases conversion by 38%", "first impressions in 50 ms", "onboarding 50–70% faster" | websites and documentation pages | Remove the numbers, or cite a source |
| "Lighthouse 95+ on every site" | business sites page | "We aim for 90+." (the Romanian page already says this) |
| Terminal "247 tests / 99.99% uptime / 3 regions" | home hero (decorative) | Fine as decoration, or tone down |

---

## 6. What you need to do outside the code

1. **Merge in order:** PR #81, then #82. After deploying, open `/ro`, `/sitemap.xml`, `/robots.txt` and `/llms.txt` on production.
2. **Google Business Profile:** create and verify it at Strada Banat 1, 440043 Satu Mare, with exactly the same name, address and phone: "Dodera Software", "Strada Banat 1, 440043 Satu Mare", "0748 650 469".
   - Category: Software company; also add Website designer.
   - Add the service area cities, your hours and photos.
   - Put the profile link in `googleBusinessProfile`.
3. **Google Search Console** (domain property) and **Bing Webmaster Tools:** submit `https://doderasoft.com/sitemap.xml`. Use URL Inspection to request indexing for `/ro`, `/ro/servicii`, `/ro/dezvoltare-solutii-web-satu-mare` and `/ro/locatii/satu-mare`. Watch the hreflang report.
4. **Directory profiles with identical company details:** Clutch, GoodFirms, DesignRush, and the LinkedIn company page. Use the same name, address, phone, website, founding year 2023, services and price model everywhere.
5. **Reviews:** ask 5–10 real clients for a Google review. With their permission, add them as verified testimonials.
6. **Prismic:** add the `ro-ro` locale (Settings → Translations & locales). Publish the first articles from the content plan in Romanian, linking each to its English original where one exists.
7. **Content:** about one article a week from `docs/seo/content-plan-ro.md`, starting with 1, 5, 4, 2, 3.

---

## 7. Known limitations

- Unknown URLs under `/services/...`, `/ro/...` and similar return a correct 404 (noindex), but the page body renders client-side. Production does the same today.
- The city pages give no road distances. The routing services weren't reachable to verify them, and I didn't want to guess.
- All three case studies are anonymous, as they already were on the site. Named clients with links (with their permission) would carry much more weight.
