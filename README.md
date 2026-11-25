# Dodera — doderasoft.com

Next.js 16 app for [doderasoft.com](https://doderasoft.com). Page copy lives in
typed config files; blog posts and application data (contacts, newsletter,
careers, admin, API tokens) live in Postgres, accessed via
[Drizzle ORM](https://orm.drizzle.team).
Deployed on a Hetzner server with [Coolify](https://coolify.io) (Dockerfile
build, see `MIGRATION.md` for the full setup/runbook).

Design system, page patterns and code rules (for people and AI agents): [`AGENTS.md`](AGENTS.md).

## Getting Started

```bash
cp .env.example .env      # fill in DATABASE_URL and the rest
npm install
npm run db:migrate        # apply drizzle/ migrations to the database
psql "$DATABASE_URL" -f drizzle/seed.sql   # fresh installs only: default app_config
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Database

- Schema: `src/db/schema.ts` (Drizzle). Server client: `src/db/index.ts`.
- Change the schema → `npm run db:generate` (writes SQL to `drizzle/`) → `npm run db:migrate`.
- In production, pending migrations are applied automatically when the server starts (`src/instrumentation.ts`); if one fails, the new container doesn't start and the old one keeps serving.
- `npm run db:studio` opens Drizzle Studio.
- CV uploads are stored in the `cv_files` table (bytea), so a DB backup covers all data.

## Useful scripts

```bash
npm run admin:seed        # create/update the admin dashboard user
npm run token:generate -- --name "CI pipeline" [--expires 90]
npm run token:list
npm run token:revoke -- --name "CI pipeline"
```

## Blog

Posts live in the `blog_posts` table, one row per language, paired by
`translation_key`. Bodies are Markdown; cover images are generated from the
title (`/blog/<slug>/cover`).

New posts are written with the `/new-blog` skill in Claude Code
(`.claude/skills/new-blog`): it finds what is trending, lets you pick a topic,
writes the post in English and Romanian and uploads it as a draft through
`POST /api/blog`. Each contributor puts `BLOG_API_URL` and `BLOG_API_TOKEN`
(Admin → API Tokens) in their own `.env.local`. Review, edit and publish in
Admin → **Blog**; drafts are visible on their normal URL only to signed-in admins.

```bash
npm run blog -- list            # every post, drafts too
npm run blog -- check <folder>  # style and length checks
npm run blog -- push <folder>   # upload as a draft
```

## Mockup previews

Admin → **Mockups** deploys plain HTML/CSS/JS mockups to
`https://<slug>.demo.doderasoft.com/` for leads (versioned, roll-backable,
embedded preview). Files live in Postgres. Needs `MOCKUPS_DOMAIN` plus a
one-time wildcard DNS + DNS-01 certificate setup on the Coolify proxy — see
`MOCKUPS.md`.

Deployments can also be sent to InteliLang (Admin → Settings → InteliLang, needs
`APP_ENCRYPTION_KEY`) — see `MOCKUPS.md` → "Telling InteliLang what went live".

## Deployment

Coolify builds the `Dockerfile` (Next.js standalone output) and health-checks
`GET /api/health`. Required env vars are listed in `.env.example` — mark
`NEXT_PUBLIC_*` ones as build-time variables in Coolify.
