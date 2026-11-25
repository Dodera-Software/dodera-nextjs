CREATE TABLE "rate_limits" (
	"key" text PRIMARY KEY NOT NULL,
	"points" integer NOT NULL,
	"expire" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "admin_users" ADD COLUMN "session_version" integer DEFAULT 1 NOT NULL;