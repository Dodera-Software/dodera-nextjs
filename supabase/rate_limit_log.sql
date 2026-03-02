-- ╔══════════════════════════════════════════════════════════════╗
-- ║  rate_limit_log — tracks requests for public endpoints     ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table public.rate_limit_log (
  id          bigint      primary key generated always as identity,
  key         text        not null,   -- e.g. "contact:1.2.3.4"
  created_at  timestamptz not null default now()
);

-- Fast lookup: key + time window check
create index idx_rate_limit_log_key_created on public.rate_limit_log (key, created_at desc);

-- Enable Row Level Security (no public policies — only the secret key can access)
alter table public.rate_limit_log enable row level security;

-- Optional: auto-delete entries older than 24 h to keep the table small
-- (run periodically via a pg_cron job or Supabase scheduled function)
-- delete from public.rate_limit_log where created_at < now() - interval '24 hours';
