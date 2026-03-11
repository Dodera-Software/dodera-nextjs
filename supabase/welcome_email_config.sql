-- ╔══════════════════════════════════════════════════════════════════╗
-- ║  Welcome-email template — stored in the app_config key/value   ║
-- ║  table so it can be edited live from the admin dashboard.      ║
-- ║  Run this once in the Supabase SQL Editor.                     ║
-- ╚══════════════════════════════════════════════════════════════════╝

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
