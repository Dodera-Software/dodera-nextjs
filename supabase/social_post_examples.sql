-- ╔══════════════════════════════════════════════════════════════╗
-- ║  social_post_examples — reference posts injected into AI   ║
-- ║  prompts at generation time, per platform.                 ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table if not exists public.social_post_examples (
  id          bigint      primary key generated always as identity,
  platform    text        not null check (platform in ('linkedin', 'facebook', 'instagram')),
  content     text        not null,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (no public policies — only the service key can access)
alter table public.social_post_examples enable row level security;

-- Index for fast per-platform lookups
create index idx_social_post_examples_platform
    on public.social_post_examples (platform, created_at desc);
