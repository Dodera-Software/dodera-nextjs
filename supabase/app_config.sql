-- ╔══════════════════════════════════════════════════════════════╗
-- ║  app_config table — key/value store for runtime settings   ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table if not exists public.app_config (
  key          text        primary key,
  value        text        not null,
  description  text,
  updated_at   timestamptz not null default now()
);

-- Enable Row Level Security (no public policies — only the secret key can access)
alter table public.app_config enable row level security;

-- ── Seed: contact follow-up AI settings ───────────────────────
insert into public.app_config (key, value, description) values
  (
    'contact_followup_model',
    'gpt-4o-mini',
    'OpenAI model used to generate follow-up suggestions for new leads. Set to empty string to disable.'
  ),
  (
    'contact_followup_daily_limit',
    '10',
    'Max number of AI follow-up generations per calendar day (UTC). Set to 0 for unlimited.'
  ),
  (
    'contact_followup_enabled',
    'true',
    'Whether to generate AI follow-up suggestions for new leads. Set to false to disable.'
  ),
  (
    'contact_rate_limit_max',
    '5',
    'Max contact form submissions allowed per IP within the time window.'
  ),
  (
    'contact_rate_limit_window_minutes',
    '60',
    'Rolling time window in minutes for the contact form rate limit.'
  ),
  (
    'image_generation_model',
    'dall-e-3',
    'OpenAI model used for image generation. Valid values: dall-e-3, dall-e-2, gpt-image-1.'
  )
on conflict (key) do nothing;
