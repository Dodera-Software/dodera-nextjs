---
name: new-blog
description: Research what is trending in tech right now, let the user pick a topic, then write a doderasoft.com blog post in English and Romanian and upload it as a draft. Use when someone runs /new-blog or asks for a new blog post or article for the Dodera site.
---

# /new-blog

Writes one blog post for doderasoft.com in **English and Romanian** about something trending in tech this week, and uploads both as a **draft**. A person reviews and publishes it in Admin → Blog. Never publish from here.

## 0. Setup check

Run `npm run blog -- list`. If it fails because `BLOG_API_URL` or `BLOG_API_TOKEN` is missing, tell the user to add both to `.env.local` (token from Admin → API Tokens on the site that should get the draft; `BLOG_API_URL=https://doderasoft.com` for production, `http://localhost:3000` for a local dev server) and stop.

Keep the list output: it is every existing post (drafts too). Don't pitch a topic that is already covered.

## 1. Find what's trending (last 72 hours)

Search in parallel, newest first. Good sources:

- Hacker News front page: `https://hn.algolia.com/api/v1/search?tags=front_page` (points and comments show heat)
- Techmeme (`https://www.techmeme.com`), The Verge, TechCrunch, Ars Technica, 404 Media
- GitHub trending (`https://github.com/trending`), release notes and blogs of OpenAI, Anthropic, Google, Apple, Vercel, Meta
- Web search for "this week" news on AI agents, dev tools, web frameworks, mobile, SaaS, startups

Keep stories that are **trending** (many outlets, big HN threads, lots of discussion) **and** give Dodera something to say. Dodera builds AI agents and automations, custom software, SaaS and MVPs, websites and mobile apps, and makes dev tools (doderminal, video-kit). Pure business or celebrity news with no angle for people who build software is out: those posts were taken out of Google's index before.

## 2. Let the user choose

Use AskUserQuestion with 3–4 options. Each option: a working headline, one line on why it's hot right now (with numbers if you have them), and the Dodera angle. The user can also type their own topic. Don't write anything before they pick.

## 3. Research the chosen topic

Read the primary source (announcement, paper, repo, filing) plus 2–4 reputable reports. Write down facts with their URLs. **Every number, quote and claim in the post must come from these sources.** No invented stats, quotes, clients or experiences. If sources disagree, say so.

## 4. Write it

Write in a new folder in your scratchpad (never inside the repo), named after the post key:

```
<folder>/post.json
<folder>/en.md
<folder>/ro.md
```

`post.json`:

```json
{
  "key": "short-english-slug",
  "author": "Dodera Team",
  "sources": [{ "title": "Publisher: headline", "url": "https://..." }],
  "en": { "slug": "short-english-slug", "title": "...", "excerpt": "...", "metaTitle": "...", "metaDescription": "...", "category": "AI Agents", "tags": ["AI & Machine Learning", "Automation"] },
  "ro": { "slug": "slug-scurt-romana", "title": "...", "excerpt": "...", "metaTitle": "...", "metaDescription": "...", "category": "Agenți AI", "tags": ["AI și machine learning", "Automatizare"] }
}
```

- `key` and slugs: lowercase ASCII words with hyphens, 3–6 words, main keyword first. The RO slug uses Romanian words without diacritics.
- `title`: max 70 characters, punchy, keyword near the start. `metaTitle` max 60, `metaDescription` 140–160 characters, `excerpt` 1–2 sentences that make people click.
- `category`: one of AI Agents / Agenți AI, Web Development / Dezvoltare web, Industry Trends / Tendințe în industrie, Global Trends / Tendințe globale, Cybersecurity / Securitate cibernetică, Startup & MVP / Startup și MVP, Tech Strategy / Strategie tech. Add a new one only when none fits.
- `tags`: 2–4, reuse existing ones from the list output (EN and RO versions match by position).
- `sources`: every link you used, 2–8 of them. They are listed under the post and cited in the structured data.
- The body files are Markdown. No H1 (the title is the H1); sections are `##`, rarely `###`.

### Voice: like a great X thread, not a corporate blog

The user wants posts people actually read and share. They must not feel AI-written.

- **Open with the hook.** First line is the news, a number or a strong take. No warm-up, no "In recent weeks...".
- **Short paragraphs**, 1–3 sentences. Mix in very short sentences. One idea per paragraph.
- **Have an opinion.** Write as "we" (the Dodera team): what we think, what we'd do, what we'd avoid, where the hype is wrong. Hedging everything is the biggest AI tell.
- **Plain words and contractions.** Like an engineer explaining it to a friend over coffee. Casual, a bit of humour is fine, never cringe.
- **Specific beats impressive.** Names, versions, prices, dates, numbers, short quotes, with inline links to the source.
- **Headings say something.** Statements or questions people would search for ("Can Gemma 4 run on a phone?"), never "Why it matters", "Key takeaways", "The bottom line" or "Conclusion".
- **Mostly prose.** At most one or two short lists. Don't bold half the sentences.
- **End on a concrete take or next step**, not a summary and not "What do you think?".
- Where it fits naturally, link once or twice to a Dodera page (below). No sales pitch.
- 600–1,100 words per language.

Avoid these patterns completely:

- "It's not X, it's Y" / "This isn't just X", rhetorical setups like "The result?" or "Here's the thing:"
- Triplets everywhere ("faster, cheaper, and smarter"), stacked adjectives, em dash chains (max 2 em dashes per post)
- Filler words: delve, landscape, tapestry, unlock, harness, seamless, leverage, robust, cutting-edge, game-changer, pivotal, crucial, in today's fast-paced world
- Emoji, hashtags, exclamation marks in every paragraph
- Opening or closing with a generic statement about technology changing everything

`npm run blog -- check <folder>` catches the most common ones; it is a floor, not the goal. Read the post out loud in your head: if a sentence sounds like a press release or a LinkedIn guru, rewrite it.

### Romanian version

Write it **natively, not as a translation**: same facts, sources and structure, but phrased the way a Romanian developer would post it. Address the reader with "tu". Keep the English tech words Romanians actually use (AI, agent, framework, deploy, prompt, startup). Correct diacritics with comma below (ș, ț). Avoid "în era digitală", "în peisajul actual", "joacă un rol esențial", "nu doar... ci și", "este crucial", "în concluzie".

### Dodera pages to link

| EN | RO |
|---|---|
| `/services/ai-development` | `/ro/servicii/dezvoltare-ai` |
| `/services/ai-development/custom-ai-agents` | `/ro/servicii/dezvoltare-ai/agenti-ai-personalizati` |
| `/services/ai-development/ai-powered-automations` | `/ro/servicii/dezvoltare-ai/automatizari-ai-n8n` |
| `/services/software-development` | `/ro/servicii/dezvoltare-software` |
| `/services/software-development/mvp-to-market` | `/ro/servicii/dezvoltare-software/mvp` |
| `/services/software-development/saas-products` | `/ro/servicii/dezvoltare-software/produse-saas` |
| `/services/presentation-websites` | `/ro/servicii/site-uri-de-prezentare` |
| `/products/doderminal`, `/products/video-kit` | `/ro/produse/doderminal`, `/ro/produse/video-kit` |
| `/contact` | `/ro/contact` |

## 5. Check, upload, hand over

1. `npm run blog -- check <folder>` and fix everything it reports.
2. `npm run blog -- push <folder>`. It uploads both languages as one draft (pushing the same key again replaces the draft) and prints the preview links.
3. Delete the folder.
4. Tell the user: the title, the preview links (they open while signed in to the admin), and that they publish it in Admin → Blog. The cover image is generated from the title automatically.
