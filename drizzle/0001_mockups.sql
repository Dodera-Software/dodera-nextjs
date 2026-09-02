CREATE TABLE "mockup_deployments" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mockup_deployments_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"project_id" bigint NOT NULL,
	"version" integer NOT NULL,
	"entry_path" text DEFAULT 'index.html' NOT NULL,
	"file_count" integer DEFAULT 0 NOT NULL,
	"total_bytes" bigint DEFAULT 0 NOT NULL,
	"note" text,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mockup_files" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mockup_files_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"deployment_id" bigint NOT NULL,
	"path" text NOT NULL,
	"content_type" text NOT NULL,
	"size" integer NOT NULL,
	"data" "bytea" NOT NULL
);
--> statement-breakpoint
CREATE TABLE "mockup_projects" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "mockup_projects_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"client_name" text,
	"notes" text,
	"active_deployment_id" bigint,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "mockup_projects_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "mockup_deployments" ADD CONSTRAINT "mockup_deployments_project_id_mockup_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."mockup_projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mockup_files" ADD CONSTRAINT "mockup_files_deployment_id_mockup_deployments_id_fk" FOREIGN KEY ("deployment_id") REFERENCES "public"."mockup_deployments"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "mockup_projects" ADD CONSTRAINT "mockup_projects_active_deployment_id_mockup_deployments_id_fk" FOREIGN KEY ("active_deployment_id") REFERENCES "public"."mockup_deployments"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "idx_mockup_deployments_project_version" ON "mockup_deployments" USING btree ("project_id","version");--> statement-breakpoint
CREATE UNIQUE INDEX "idx_mockup_files_deployment_path" ON "mockup_files" USING btree ("deployment_id","path");--> statement-breakpoint
CREATE INDEX "idx_mockup_projects_updated_at" ON "mockup_projects" USING btree ("updated_at" DESC NULLS LAST);