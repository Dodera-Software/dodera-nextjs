# Migration: Vercel + Supabase → Hetzner + Coolify + Postgres 18

This branch replaces `@supabase/supabase-js` with Drizzle ORM + `pg`
(`DATABASE_URL`), moves CV uploads from the Supabase Storage bucket `cvs`
into the `cv_files` table (bytea), and removes all Vercel/Netlify/cron
infrastructure. This runbook migrates the data with **zero loss** —
Supabase stays untouched until you've verified the new stack.

---

## 0. Prerequisites

- `psql` / `pg_dump` (v16+ client is fine) on your machine.
- The **Supabase Postgres connection string** (Dashboard → Connect →
  Session pooler), looks like:
  `postgresql://postgres.dvtbkseulufglvfdnehw:<PASSWORD>@aws-0-<region>.pooler.supabase.com:5432/postgres`
- The Supabase **service-role/secret key** (for the CV file download step only).

## 1. Create Postgres 18 on Coolify

1. Coolify → your project → **New Resource → Database → PostgreSQL** (choose the `postgres:18` image).
2. Note the internal connection URL (e.g. `postgresql://postgres:<pw>@<service-name>:5432/postgres`).
3. For running the migration from your laptop, temporarily enable the
   database's **public port** in Coolify (or tunnel: `ssh -L 5432:localhost:<port> root@<hetzner-ip>`).
   Disable public access again when done.

## 2. Apply the schema

```bash
# .env → DATABASE_URL=postgresql://... (the NEW database)
npm run db:migrate        # applies drizzle/0000_init.sql
```

Do **not** run `drizzle/seed.sql` when migrating — the Supabase dump
already contains the config rows. (Only use it for a brand-new empty install.)

## 3. Copy the table data from Supabase

```bash
export SUPA_DB="postgresql://postgres.dvtbkseulufglvfdnehw:<PASSWORD>@...pooler.supabase.com:5432/postgres"
export NEW_DB="postgresql://postgres:<pw>@<host>:5432/postgres"

# Data-only dump of exactly our 11 app tables (schema already applied above).
pg_dump "$SUPA_DB" \
  --data-only \
  --schema=public \
  --no-owner --no-privileges \
  --disable-triggers \
  -t public.admin_users \
  -t public.api_tokens \
  -t public.app_config \
  -t public.auto_generated_blog_posts \
  -t public.blog_post_examples \
  -t public.contacts \
  -t public.job_applications \
  -t public.job_openings \
  -t public.rate_limit_log \
  -t public.social_post_examples \
  -t public.subscribers \
  -f supabase-data.sql

# Restore into the new DB (single transaction — all or nothing).
psql "$NEW_DB" --set ON_ERROR_STOP=on --single-transaction -f supabase-data.sql
```

Notes:
- `--disable-triggers` avoids FK ordering issues (`job_applications` →
  `job_openings`); it requires superuser on the target, which the default
  Coolify `postgres` user is.
- `COPY` inserts preserve the original `id` values even for
  `GENERATED ALWAYS AS IDENTITY` columns, and the dump includes the
  `setval(...)` calls that keep the sequences in sync.

## 4. Copy the CV files out of Supabase Storage

```bash
# .env needs: DATABASE_URL (new DB) + SUPABASE_URL + SUPABASE_SECRET_KEY (old project)
npm run migrate:cvs
```

The script reads every `job_applications.cv_path`, downloads the file from
the private `cvs` bucket via the Storage REST API, and inserts it into
`cv_files`. It's idempotent — re-run it if anything fails.

## 5. Verify

```bash
psql "$NEW_DB" -c "
select 'contacts' t, count(*) from contacts union all
select 'subscribers', count(*) from subscribers union all
select 'api_tokens', count(*) from api_tokens union all
select 'admin_users', count(*) from admin_users union all
select 'job_openings', count(*) from job_openings union all
select 'job_applications', count(*) from job_applications union all
select 'cv_files', count(*) from cv_files union all
select 'app_config', count(*) from app_config union all
select 'auto_generated_blog_posts', count(*) from auto_generated_blog_posts union all
select 'blog_post_examples', count(*) from blog_post_examples union all
select 'social_post_examples', count(*) from social_post_examples;"
```

Compare against the same query in the Supabase SQL editor
(`cv_files` count should equal `select count(distinct cv_path) from job_applications`).

## 6. Deploy the app on Coolify

1. **New Resource → Application** → this Git repo, branch `main` (after merge), build pack **Dockerfile**.
2. Environment variables (see `.env.example`): `DATABASE_URL` (use the
   Coolify-internal hostname), `SITE_URL`, `PRISMIC_*`, `OPENAI_API_KEY`,
   `SLACK_LEADS_WEBHOOK_URL`, `ZOHO_SMTP_PASSWORD`, `ADMIN_JWT_SECRET`,
   `UNSUBSCRIBE_TOKEN_SECRET`, `NEXT_PUBLIC_ADMIN_LINK_COOLIFY`,
   `NEXT_PUBLIC_ADMIN_LINK_PRISMIC_MIGRATION`.
   Mark the two `NEXT_PUBLIC_*` vars plus `PRISMIC_REPOSITORY_NAME` and
   `PRISMIC_ACCESS_TOKEN` **Available at Buildtime** — the `NEXT_PUBLIC_*`
   values are inlined during `next build`, and the blog pages are SSG so
   the build needs Prismic access or the fallback posts get baked in.
   Everything else stays runtime-only.
3. Set the app's health check to `GET /api/health` (the Dockerfile also ships a `HEALTHCHECK`).
4. Add the domain, let Coolify provision TLS.

Smoke-test on the Coolify preview URL: homepage, blog, `/api/health`,
contact form, newsletter signup, admin login, admin lists (contacts,
subscribers, tokens, careers), a job application with CV upload, and
`/api/admin/careers/applications/<id>/cv` to download a CV.

## 7. Cut over

1. Point the `doderasoft.com` DNS records at the Hetzner IP.
2. Update the Prismic webhook (`/api/revalidate?secret=...`) if it pointed at the Vercel URL.
3. Keep Supabase and Vercel alive but idle for a week or two as rollback,
   then delete them. Remove `SUPABASE_URL`/`SUPABASE_SECRET_KEY` from `.env`.

Note: the daily auto-post cron was removed on purpose. `/api/auto-post`
still exists (API-token protected) — trigger it manually or from the admin
dashboard. If you ever want it scheduled again, add a Coolify **Scheduled
Task** that curls the endpoint with a Bearer token.

## 8. Backups (don't skip)

Enable Coolify's scheduled database backups for the Postgres service
(S3-compatible target or local + offsite copy). The CVs live inside
Postgres (`cv_files`), so DB backups cover everything.
