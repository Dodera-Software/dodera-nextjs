-- ╔══════════════════════════════════════════════════════════════╗
-- ║  job_applications table — stores career applications        ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table public.job_applications (
  id            bigint      primary key generated always as identity,
  job_id        bigint      references public.job_openings(id) on delete set null,
  job_title     text        not null,
  full_name     text        not null,
  email         text        not null,
  cv_path       text        not null,   -- path inside the "cvs" storage bucket
  gdpr_consent  boolean     not null default true,
  created_at    timestamptz not null default now()
);

-- Enable RLS — no public policies; only the service-role key (admin API) can access
alter table public.job_applications enable row level security;

-- Indexes
create index idx_job_applications_job_id     on public.job_applications (job_id);
create index idx_job_applications_created_at on public.job_applications (created_at desc);

-- ──────────────────────────────────────────────────────────────
-- Storage bucket for CVs
-- ──────────────────────────────────────────────────────────────
-- Run these two statements AFTER creating the bucket in:
--   Supabase Dashboard → Storage → New bucket
--   Bucket name : cvs
--   Public      : OFF  (private — no direct URL access)
-- ──────────────────────────────────────────────────────────────

-- Allow the service-role key to upload files (already allowed by default)
-- Allow the service-role key to download files — no extra policy needed

-- If you want admins to generate signed download URLs, use the Supabase JS client:
--   supabase.storage.from('cvs').createSignedUrl(path, 3600)
