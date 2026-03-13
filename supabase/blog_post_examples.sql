-- ╔══════════════════════════════════════════════════════════════╗
-- ║  blog_post_examples — reference posts injected into AI     ║
-- ║  prompts at auto-post generation time.                     ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table if not exists public.blog_post_examples (
  id          bigint      primary key generated always as identity,
  content     text        not null,
  created_at  timestamptz not null default now()
);

-- Enable Row Level Security (no public policies — only the service key can access)
alter table public.blog_post_examples enable row level security;

-- Index for chronological listing
create index idx_blog_post_examples_created_at
    on public.blog_post_examples (created_at asc);
