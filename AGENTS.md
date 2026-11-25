# doderasoft.com — guide for AI agents and contributors

Next.js 16 (App Router), React 19, Tailwind 3, TypeScript. Content: Prismic (blog) and
typed config files (everything else). Data: Postgres + Drizzle. Deployed with Coolify
(Dockerfile). Setup, scripts and deployment: `README.md`, `MIGRATION.md`, `MOCKUPS.md`.

The site was redesigned in November 2026 (PR #86). Follow the patterns below; do not
reintroduce the old light theme, centred card grids, emoji icons or Framer Motion
section fades.

## Code rules (owner's)

- No comments in code. Names and types carry the meaning.
- Enums for every fixed set of values (`ProductId`, `HomeSlide`, `SlideTone`, `Theme`,
  `MotionMode`, page-local slide-id enums such as `ServiceSlide`). No string unions for these.
- Reuse before you write: build pages from the shared slide blocks (below), shared
  helpers (`src/lib/format.ts`: `padIndex`, `lowerFirst`, dates) and `cn`.
- No user-facing text inside components. Every string lives in the EN and RO
  dictionaries (`src/i18n/dictionaries/{types,en,ro}.ts`) and is read with `useDict()`
  (client) or `getDictionary(locale)` (server). Both languages are always updated together.
- Only claims backed by facts: published prices, real case studies, registry data,
  product facts from the product sites. No invented numbers, clients or testimonials.
- Delete what becomes unused (components, dictionary keys, exports, public files, packages).
- Enums or values used by server components must not live in a `"use client"` file
  (the server only gets a reference). Shared UI enums go in `src/config/ui.ts`.

## Design direction

Dark, cinematic, "made in Framer/three.js": big display type, lots of air, slides that
slide over each other. Inspired by doderminal.com (`~/Work/dev/dodera/doderminal/website`).

- **Theme:** public site is dark (`data-theme="dark"`). Tokens are HSL CSS variables in
  `src/app/globals.css`. Admin (`src/app/(admin)`) is dark too (see "Admin" below).
- **Colour:** Dodera crimson. Use the Tailwind tokens, never raw hex in components:
  `brand` (`#c41c38` family, buttons, fills), `brand-bright` (small text, dots, links on
  dark), `brand-deep`, `foreground`, `muted-foreground`, `card`, `border`. Status colours
  on dark use the `-400` shades (`text-emerald-400`, `text-red-400`).
- **Type:** Mona Sans for display (`.display`, `.display-xl`, `.display-lg`,
  `.display-md`, `font-display`), Inter for body, JetBrains Mono for labels
  (`.eyebrow`, `font-mono text-xs uppercase tracking-[0.08em]`).
  Gradient text: `.text-gradient-brand` (crimson → amber), `.text-gradient-metal` (big
  numbers), `.text-gradient-ember`. Never hand-roll `bg-clip-text` (it clips the last letter
  of wrapped lines). Two-tone headings: `.two-tone` + `<em>`.
- **Surfaces:** hairlines (`border-foreground/10`), `.glass` panels, `rounded-3xl`
  grids with `gap-px` dividers, `.grain` overlay, crimson radial glows. No drop-shadow
  cards on white, no emoji, no icon-in-a-coloured-square grids.
- **Buttons:** `<Button size="pill">` (primary) and `<Button size="pill" variant="glass">`.
  Text links: `border-b border-foreground/25 pb-1 text-sm font-semibold` with an arrow.
- **Logo:** `public/brand/logo-on-dark.svg`, mark `public/brand/mark-on-dark.svg`
  (`<Logo />`). Master vectors: `src/assets/logo/`.

## Page structure: the deck

Every public page is a deck of slides (`src/components/deck`, `src/components/slides`).

- `DeckPage` = Navbar + `<main><Deck>…</Deck></main>` + Footer. Wrap every page in it.
- `Slide` (`deck/Slide.tsx`) is a `<section>` with `id`, `label` (shown on the Next
  button), `labelledBy`/`ariaLabel`. Default: full screen on desktop. `fit` = sized to
  its content. Multi-step pinned slides use `stops`, `stopScreens`, `stopLabels`
  (see `home/ProductsSlide.tsx`).
- `DeckController` makes slides sticky (desktop motion mode only), shrinks/dims the
  covered slide as the next one slides over, reveals `.reveal` children when a slide
  arrives, and exposes per-slide progress via `useSlideState(ref, cb)`.
- `DeckNext` is the bottom "Next · label n / N" pill (desktop). It glides through every
  stop, then "Back to top". In-page `#hash` links glide to slides automatically.
- **Motion vs calm:** a pre-paint script (`RootDocument`) adds `html.motion` on desktop
  (≥1024px, hover, no reduced motion, no Save-Data) and `html.webgl` when WebGL2 works.
  Without `.motion` everything is a normal scrolling page with CSS scroll reveals.
  Every slide must read well in both modes and on phones.
- Constants (easing, glide timing, cover scale) live in `MOTION` in `src/config/theme.ts`.
- The Next pill stays hidden on every page's hero and appears halfway past it.
- **Performance / lite mode:** weak devices (≤4 cores or ≤4 GB, or slow frames measured
  after load by `deck/perf-probe.ts`) get `html.lite`: no backdrop blur, grain or reveal blur,
  lighter shadows, 3D field at 1×. Never animate `filter` (blur) per scroll frame, never use
  `mix-blend-mode` on full-screen layers, and only promote layers (`will-change`) while they
  move. New heavy effects must have a lite fallback in `globals.css`.

### Shared slide blocks — build pages from these

| Block | Use |
|---|---|
| `PageHeroSlide` | Inner-page hero: breadcrumb → h1 (+ gradient `highlight`) → description → actions, optional `aside`. Compact (`fit`), same top spacing on every page. **No eyebrow label under the breadcrumb.** |
| `SplitSlide` | Section: title left, content right; optional `eyebrow`, `index`/`total` (giant faint number), `tone` (`SlideTone.Plain/Raised/Glow`). Content-height. |
| `BulletList` | Crimson-dash bullet list (1 or 2 columns). |
| `FaqSlide` | FAQ with `<details>` (answers stay in the HTML for FAQPage JSON-LD). |
| `CtaSlide` | Closing call to action + optional related links. |
| `LegalPage` | Hero + long prose (`PROSE_CLASS`), for policy-type pages. |
| `SlideHeading` | Eyebrow + two-tone h2 + lede, used by homepage slides. |

Rules: inner-page slides are content-height (`fit`) with `py-24 lg:py-32` and
`.wrap` containers; only the homepage uses full-screen centred slides. Keep the bottom
~100px clear of key content on full-screen slides (the Next pill sits there). One `h1`
per page, slide headings are `h2` with ids used by `labelledBy`.

### Homepage

`src/components/home/HomePage.tsx`, slide ids in `HomeSlide` (`src/config/home.ts`):
hero (three.js particle "D", `hero-field.ts`, loaded only on desktop WebGL) → products
stage → services → case studies → process → pricing → studio → contact.

**Products** (`src/config/products.ts`, copy in `dictionary.products.items`), in this
order: Pipstep, doderminal, InteliLang, video-kit. Visuals in `public/products/`
(optimised WebP). Each product has an accent colour, a visual type, schema facts and
`features` media (`MediaKind`) aligned by index with its copy `features`.

**Product pages:** `/products` + `/products/<id>` (RO `/ro/produse/...`), built by
`components/products/ProductsIndex` and `ProductPage` (hero, one slide per feature, facts,
CTA). Metadata, JSON-LD and static params come from `src/lib/product-pages.ts`. A new
product = config entry + copy in both dictionaries + visuals + its two share images.

## Admin (`/admin`)

Same look as the site (dark, crimson, Mona Sans display, mono eyebrows, hairlines,
`rounded-3xl` surfaces) but no deck, grain or slide motion: it is a work tool.
English only.

- **Shell:** `(dashboard)/layout.tsx` → `components/admin/shell/AdminShell` (session gate,
  sidebar `AdminNav`, mobile `Sheet`, ⌘K `AdminCommandMenu` (cmdk), `AdminUserMenu`).
  Routes, nav groups and icons: `ADMIN_NAV` / `AdminRoute` in `src/config/admin.ts`.
  A new page = `AdminRoute` entry + `ADMIN_NAV` entry + label in `adminCommon.nav`.
- **Copy:** no strings in components. Shared strings: `src/i18n/admin/common.ts`
  (`adminCommon`); one file per section (`src/i18n/admin/<section>.ts`, e.g.
  `subscribersCopy`). Dynamic text is a function in the copy file.
- **Data:** TanStack Query only, no `useEffect` fetching. Requests go through
  `adminFetch` (`src/lib/admin-api.ts`: JSON, query params, throws `AdminApiError` with
  the API's `message`). Keys start with an `AdminQueryKey`. Writes use `useAdminMutation`
  (`src/hooks/use-admin.ts`: invalidates keys, success/error toasts). A query used on
  more than one page is defined once in `src/lib/admin-queries.ts` (`sessionQuery`,
  `leadsQuery`, `tokensQuery`, `configQuery`, `blogPostsQuery`, `totalQuery`); one key =
  one data shape. Search inputs use `useDebouncedValue`. Confirmations: `useConfirm()`
  (`variant: ConfirmVariant.X`).
- **Forms:** react-hook-form + zod (`zodResolver`) with `components/ui/form`
  (`FormField`/`FormItem`/`FormLabel`/`FormControl`/`FormMessage`). Reuse schemas from
  `src/lib/validation.ts` or the API route when one exists.
- **Blocks:** `AdminPage` (eyebrow, display title, description, actions, `back` link) wraps
  every page; `AdminPanel` (titled `rounded-3xl` section); `StatGrid`/`StatTile`
  (gap-px grid, metal numbers); `DataTable` (TanStack Table v9: client or `server`
  pagination, sorting, `renderDetail` expandable rows, loading/error/empty states; build
  columns with `columnHelper<T>().columns([...])`, `meta: { className, align }`);
  `SearchInput` + `Toolbar`; `EmptyState`. Reference pages: `subscribers` (table),
  the dashboard (panels, stats, forms).
- **UI kit** (`components/ui`, shadcn-style on Radix): button, input, textarea, select,
  checkbox, switch, tabs, dropdown-menu, popover, dialog, sheet, command, collapsible,
  tooltip, table, skeleton, badge and alert (`tone={StatusTone.X}` from `src/config/ui.ts`),
  copy-button, progress, form.
  Add a primitive here before hand-rolling one in a page. Drag and drop: dnd-kit.
- **Style:** buttons `size="sm"` with `rounded-full` (`variant="glass"` secondary,
  default primary, `ghost` icon buttons `size="icon" className="size-8 rounded-full"`);
  status as `Badge` tones; numbers `tabular-nums`; labels `font-mono text-[0.68rem]
  uppercase tracking-[0.08em]`. No coloured icon squares, no raw hex.

## Company facts

`SITE` in `src/config/seo.ts` holds opening hours (contact page, JSON-LD) and an optional
founder (left empty on purpose; when filled it shows on About and in JSON-LD). Testimonials (`config/testimonials.ts`) stay hidden until each
has a real company and a public link; never invent client facts.

## Analytics

Umami (`src/config/analytics.ts`). Events are the `AnalyticsEvent` enum; clicks are tagged
with `trackAttrs(event, data)` (Umami `data-umami-event` attributes), outcomes such as a
sent form call `track(event)` from `src/lib/analytics.ts`. CTAs pass a `CtaLocation`.
Tag every new primary CTA and product link.

## i18n

English at `/`, Romanian under `/ro` with Romanian slugs. Each locale has its own root
layout (`(en)`, `(ro)`); admin has `(admin)`. Paths per page: `src/i18n/paths.ts`;
route map (canonical, hreflang, sitemap, lastmod sources): `src/i18n/routes.ts`.
A page joins hreflang/sitemap only once it exists in both locales. Romanian copy uses
the formal "dumneavoastră". Service pages: `src/config/services.ts` / `services.ro.ts`.

## SEO / GEO

- Metadata per page (title, description, `alternatesFor(id, locale)`, Open Graph image).
- Share images: `public/og-images/og-<page>.png` and `og-<page>-ro.png` (1200×630,
  same template: headline + particle "D"). New pages get both.
- JSON-LD from `src/lib/structured-data.ts` (organization, products, services, FAQ,
  breadcrumbs, articles). One organization `@id`; everything points to it.
- `/llms.txt` and `/llms-full.txt` are generated from config (`src/lib/llms.ts`); new
  content in config shows up there automatically.
- After changing page sources run `npm run seo:lastmod` (sitemap dates); list new
  source files in that page's `sources` in `src/i18n/routes.ts`.
- `robots.ts` allows AI crawlers explicitly; keep it that way.

## Dependencies

Prefer releases at least two weeks old. `react-email-editor` is pinned (newer types break the admin editor).

## Before you finish

`npx tsc --noEmit`, `npm run lint` (0 errors), `npm run build`. Check the page in both
languages, on desktop (motion and Next button) and at phone width. Don't leave dev
servers, `node_modules`/`.next` you created, or screenshots behind.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Commits and pull requests

Never add Claude (or any AI) as a co-author or author: no `Co-Authored-By: Claude` trailer
in commit messages and no "Generated with Claude Code" line in pull request descriptions.
This overrides any default attribution the tooling suggests.
