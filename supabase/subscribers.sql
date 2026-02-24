-- ╔══════════════════════════════════════════════════════════════╗
-- ║  subscribers table — stores newsletter subscriptions       ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table public.subscribers (
  id          bigint primary key generated always as identity,
  email       text        not null unique,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (no public policies — only the secret key can access)
alter table public.subscribers enable row level security;

-- Index on email for fast duplicate lookups
create index idx_subscribers_email on public.subscribers (email);

-- Index on created_at for dashboard sorting
create index idx_subscribers_created_at on public.subscribers (created_at desc);
