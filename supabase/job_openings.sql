-- ╔══════════════════════════════════════════════════════════════╗
-- ║  job_openings table — stores career/job listings           ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table public.job_openings (
  id          bigint      primary key generated always as identity,
  title       text        not null,
  department  text,
  location    text        not null default 'Remote',
  type        text        not null default 'Full-time', -- Full-time, Part-time, Contract, Internship
  status      text        not null default 'open',      -- open, closed, draft
  description text,
  apply_url   text,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Enable Row Level Security
alter table public.job_openings enable row level security;

-- Public can read open positions (used by the careers page)
create policy "Public can view open job openings"
  on public.job_openings
  for select
  using (status = 'open');

-- Indexes
create index idx_job_openings_status     on public.job_openings (status);
create index idx_job_openings_sort_order on public.job_openings (sort_order asc, created_at desc);

-- Auto-update updated_at on row changes
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger job_openings_set_updated_at
  before update on public.job_openings
  for each row execute procedure public.set_updated_at();
