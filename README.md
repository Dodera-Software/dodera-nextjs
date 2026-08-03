# Dodera — doderasoft.com

Next.js 16 app for [doderasoft.com](https://doderasoft.com). Content lives in
Prismic; application data (contacts, newsletter, careers, admin, API tokens)
lives in Postgres, accessed via [Drizzle ORM](https://orm.drizzle.team).
Deployed on a Hetzner server with [Coolify](https://coolify.io) (Dockerfile
build, see `MIGRATION.md` for the full setup/runbook).

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
- `npm run db:studio` opens Drizzle Studio.
- CV uploads are stored in the `cv_files` table (bytea), so a DB backup covers all data.

## Useful scripts

```bash
npm run admin:seed        # create/update the admin dashboard user
npm run token:generate -- --name "CI pipeline" [--expires 90]
npm run token:list
npm run token:revoke -- --name "CI pipeline"
```

## Deployment

Coolify builds the `Dockerfile` (Next.js standalone output) and health-checks
`GET /api/health`. Required env vars are listed in `.env.example` — mark
`NEXT_PUBLIC_*` ones as build-time variables in Coolify.
