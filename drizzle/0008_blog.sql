CREATE TABLE "blog_posts" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "blog_posts_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"translation_key" text NOT NULL,
	"locale" text NOT NULL,
	"slug" text NOT NULL,
	"status" text DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"excerpt" text NOT NULL,
	"body" text NOT NULL,
	"category" text DEFAULT '' NOT NULL,
	"tags" text[] DEFAULT '{}'::text[] NOT NULL,
	"author" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"sources" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"indexed" boolean DEFAULT true NOT NULL,
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "blog_posts_locale_check" CHECK ("blog_posts"."locale" in ('en', 'ro')),
	CONSTRAINT "blog_posts_status_check" CHECK ("blog_posts"."status" in ('draft', 'published'))
);
--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_posts_locale_slug" ON "blog_posts" USING btree ("locale","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_blog_posts_translation_locale" ON "blog_posts" USING btree ("translation_key","locale");--> statement-breakpoint
CREATE INDEX "idx_blog_posts_published" ON "blog_posts" USING btree ("locale","status","published_at" DESC NULLS LAST);