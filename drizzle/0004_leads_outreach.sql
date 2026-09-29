ALTER TABLE "lead_activities" DROP CONSTRAINT "lead_activities_kind_check";--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "country" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "city" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "category" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "facebook_url" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "instagram_url" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "google_maps_url" text;--> statement-breakpoint
ALTER TABLE "leads" ADD COLUMN "mockup_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_kind_check" CHECK ("lead_activities"."kind" in ('note', 'created', 'stage', 'deploy', 'mock'));--> statement-breakpoint
-- "Proposal sent" is no longer a stage; those cards continue in Negotiation (at the bottom of the column).
UPDATE "leads" SET "stage" = 'negotiation', "position" = "position" + 1000000 WHERE "stage" = 'proposal';
