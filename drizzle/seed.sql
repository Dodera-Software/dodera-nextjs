-- ╔══════════════════════════════════════════════════════════════╗
-- ║  Seed data for a fresh database (idempotent).               ║
-- ║  NOT needed when migrating — the Supabase data dump         ║
-- ║  already contains these rows.                               ║
-- ║  Run: psql "$DATABASE_URL" -f drizzle/seed.sql              ║
-- ╚══════════════════════════════════════════════════════════════╝

-- ── App config defaults ───────────────────────────────────────
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
  ),
  (
    'social_post_model',
    'gpt-4o',
    'OpenAI model used for social post generation. E.g. gpt-4o, gpt-4o-mini, gpt-4-turbo.'
  ),
  (
    'application_retention_days',
    '365',
    'Days to keep job applications and CV files before automatic deletion (GDPR). Must match the privacy policy. 0 disables cleanup.'
  )
on conflict (key) do nothing;

-- ── Welcome-email template ────────────────────────────────────
insert into public.app_config (key, value, description) values
  (
    'welcome_email_subject',
    'Welcome to the Dodera newsletter! 🎉',
    'Subject line for the automated welcome email sent to new subscribers.'
  ),
  (
    'welcome_email_html',
    '<h2 style="margin:0 0 16px;font-size:24px;font-weight:700;color:#111827;">Welcome aboard! 🎉</h2>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Thank you for subscribing to the <strong>Dodera Software</strong> newsletter. We''re excited to have you!</p>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">Here''s what you can expect from us:</p>
<ul style="margin:0 0 16px;padding-left:20px;font-size:16px;line-height:1.8;color:#374151;">
  <li>Insightful articles and practical tips on software development</li>
  <li>Updates on our latest projects and services</li>
  <li>Tutorials, best practices, and industry insights</li>
</ul>
<p style="margin:0 0 16px;font-size:16px;line-height:1.6;color:#374151;">We''ll be in touch soon. In the meantime, feel free to explore our <a href="https://doderasoft.com/blog" style="color:#2563eb;text-decoration:underline;">blog</a>.</p>
<p style="margin:0;font-size:16px;line-height:1.6;color:#374151;">— The Dodera Team</p>',
    'HTML body for the welcome email (the part inside the email wrapper). Editable from Admin → Welcome Email.'
  )
on conflict (key) do nothing;
