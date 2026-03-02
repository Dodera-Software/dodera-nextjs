-- ╔══════════════════════════════════════════════════════════════╗
-- ║  app_config table — key/value store for runtime settings   ║
-- ║  Run this in the Supabase SQL Editor (Dashboard → SQL)     ║
-- ╚══════════════════════════════════════════════════════════════╝

create table public.app_config (
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
  );
