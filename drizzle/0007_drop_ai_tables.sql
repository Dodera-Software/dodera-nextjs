DROP TABLE "auto_generated_blog_posts" CASCADE;--> statement-breakpoint
DROP TABLE "blog_post_examples" CASCADE;--> statement-breakpoint
DROP TABLE "social_post_examples" CASCADE;--> statement-breakpoint
DELETE FROM "app_config" WHERE "key" IN ('contact_followup_model', 'contact_followup_daily_limit', 'contact_followup_enabled', 'image_generation_model', 'social_post_model');
