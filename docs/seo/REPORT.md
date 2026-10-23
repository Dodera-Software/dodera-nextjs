# SEO & GEO for Romania: final report

**Goal:** make doderasoft.com discoverable for searches in Satu Mare and across Romania, in Google search, Google's AI summaries and AI assistants, while keeping the English site and its rankings.

**Where it is:**
- PR #81: phases 1–2, technical SEO and the Romanian site.
- PR #82: phases 3–6, local pages, case studies, blog, verification.

Merge #81 first. Nothing has been merged.

> **Change of focus (22 Oct 2026, owner decision):** the site targets **Romania and international clients**, not Satu Mare. The city pages (`/ro/locatii`, 6 cities) and `/ro/dezvoltare-solutii-web-satu-mare` were removed, with 301 redirects to `/ro/servicii` and `/ro/servicii/site-uri-de-prezentare`. The structured-data service area is now Romania + Worldwide. Titles and intros no longer mention a city. The registered address stays in the footer, contact page and structured data, because it's a legal fact. Sections below that describe the city pages are kept as history.

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

## 4. Facts: what was verified, what stays hidden

Rule: only facts confirmed from a reliable source go on the site; anything else stays hidden (never shown as placeholder text). Checked on 22 Oct 2026:

| Fact | Source | Result |
|---|---|---|
| Legal name, CUI 49004234, J30/958/2023, CAEN 6201, active | registry ([targetare.ro](https://targetare.ro/49004234/dodera-software-srl)) | ✅ on the site |
| Founded **25 October 2023** | registry | ✅ JSON-LD `foundingDate: 2023-10-25` (was "2024") |
| Registered address Str. Banat nr. 1, **ap. 2**, Satu Mare | registry | site shows "Strada Banat 1" — fine for NAP as long as Google Business Profile uses the same form |
| Team size | LinkedIn: **2–10 employees** | "35+" removed → "dedicated team" |
| Founder name / bio | not public (registry masks the administrator; LinkedIn names no founder) | founder section stays hidden |
| Opening hours | not published anywhere | stays hidden (footer, contact page, JSON-LD) |
| Prices | published on the site | ✅ used as-is; no per-service ranges needed |
| Client quotes | — | not needed for now (owner decision) |
| Google Business Profile | in progress (owner) | add the link to `src/config/seo.ts` `googleBusinessProfile` when it exists |

⚠️ **LinkedIn says the headquarters is "Cluj Napoca"**, while the company is registered and presented everywhere else in Satu Mare. For local SEO the name/address must be identical everywhere — update the LinkedIn headquarters to Strada Banat 1, Satu Mare (and use the same on Clutch, GoodFirms, DesignRush and the Business Profile).

## 5. Claims — resolved

Owner decision: replace unsupported numbers with honest wording ("dedicated team" etc.). Done in both languages:

| Was | Now |
|---|---|
| "35+ member workflow team" (home, twice) | "a dedicated team of engineers, long-term collaborators and trusted specialists" |
| "Most members carry 7–10+ years of experience" | removed |
| About counters "20+ AI apps · 50+ web apps · 99% satisfaction" | verified facts: "2023 founded · €300 projects from · Satu Mare based in" |
| "Every engineer on our roster is senior level" | "Experienced engineers lead every project." |
| "From startups in Western Europe to enterprises in North America" | "Based in Satu Mare … clients in Romania and abroad; in person locally, remote otherwise" |
| "We have helped several founders…", "shipped products in fintech, …, media" | "We build MVPs in 4–8 weeks…", "Our published case studies cover logistics, B2B software and healthcare" |
| "Experience building to SOC 2 Type II, GDPR, HIPAA, PCI-DSS" | "We design for GDPR from the architecture up and implement the controls other standards require" |
| "99.9%+ uptime", "Sub-200ms API responses", "millions of transactions" | "High availability…", "Fast API responses, verified with load tests", "high transaction volumes" |
| "up to 80%", "60–80% of routine queries" | the real case study (94%) / no figure |
| "38% conversion", "first impression in 50 ms", "onboarding 50–70% faster" | wording without figures |
| "Lighthouse 95+" | "we aim for 90+" |
| "dedicated project manager, daily standups", "6–18 months post-launch", "we've built both B2B and B2C" | weekly demo + single point of contact, monthly retainer option, "we build both" |
| 5 unverifiable testimonials | hidden (unchanged); not needed for now |

`src/config/stats.ts` still holds old figures but is not rendered anywhere.

## 6. Outside the code — status

1. ✅ PRs #81 and #82 approved and merged.
2. ✅ Sitemap submitted in Google Search Console and Bing Webmaster Tools (owner).
3. ⏳ Google Business Profile — in progress; same NAP as the site; add its link to the config afterwards.
4. ⏳ **LinkedIn headquarters → Satu Mare** (see above); Clutch, GoodFirms, DesignRush with identical details.
5. ⏳ Prismic: add the `ro-ro` locale (Settings → Translations & locales), then publish from `docs/seo/content-plan-ro.md`.
6. Decide the blog noindex/merge list (`docs/seo/blog-audit.md`).

## 7. Known limitations

- Unknown URLs under `/services/...`, `/ro/...` and similar return a correct 404 (noindex), but the page body renders client-side. Production does the same today.
- The city pages give no road distances. The routing services weren't reachable to verify them, and I didn't want to guess.
- All three case studies are anonymous, as they already were on the site. Named clients with links (with their permission) would carry much more weight.

---

## 8. Status at the end of 22 Oct 2026

**Merged and live:** #81 (technical SEO + Romanian site) and #82 (phases 3–6).

**Open, waiting for Denis's approval. Merge in this order:**
1. **#83:** unsupported claims replaced ("dedicated team", verified About facts, no invented figures). Founding date is 25 Oct 2023. Six news posts are set to noindex.
2. **#84:** the Romanian homepage mirrors the English text, in natural Romanian ("Software care aduce rezultate", "Tehnologie care funcționează", "Nu mai căutați programatori. Începeți să construiți.").
3. **#85:** the site targets Romania + international clients. City pages are removed (301 → /ro/servicii), no page title or description mentions Satu Mare, structured data lists Romania + Worldwide, there are no duplicated brand names in titles, and dead code with the old "35+" figures is deleted.

**Settled by the owner, no further action:**
- prices: the published model, with no per-service ranges
- client quotes: not needed for now
- testimonials: stay hidden until verified
- Search Console and Bing: sitemap already submitted

**Still open, outside the code:**
- **Prismic:** add the Romanian locale (Settings → Translations & locales → `ro-ro`). The code is ready, and `/ro/blog` goes live in search with the first post.
- **LinkedIn:** change the headquarters from Cluj-Napoca to the registered address, so the company details match everywhere.
- **Google Business Profile:** in progress. When it exists, put its link in `src/config/seo.ts` `googleBusinessProfile`.
- **Founder and opening hours:** not public anywhere, so they stay hidden. Fill `founder` / `openingHours` in `src/config/seo.ts` if you ever want them shown.
- **Romanian privacy policy:** a legal review of the translation.

**How to measure (from about mid-November):** in Google Search Console, track impressions, clicks and indexed pages for `/ro`, plus the hreflang report. Each month, ask ChatGPT, Perplexity and Gemini questions such as "firmă dezvoltare software România" or "who builds AI agents in Romania" and note whether Dodera is mentioned.
