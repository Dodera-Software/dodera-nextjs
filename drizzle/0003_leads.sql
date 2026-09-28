CREATE TABLE "lead_activities" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "lead_activities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"lead_id" bigint NOT NULL,
	"kind" text NOT NULL,
	"body" text NOT NULL,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "lead_activities_kind_check" CHECK ("lead_activities"."kind" in ('note', 'created', 'stage', 'deploy'))
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "leads_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 9223372036854775807 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"contact_name" text,
	"email" text,
	"phone" text,
	"website" text,
	"source" text,
	"stage" text DEFAULT 'new' NOT NULL,
	"position" integer DEFAULT 0 NOT NULL,
	"value_eur" integer,
	"next_step" text,
	"follow_up_on" date,
	"notes" text,
	"mockup_project_id" bigint,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "lead_activities" ADD CONSTRAINT "lead_activities_lead_id_leads_id_fk" FOREIGN KEY ("lead_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "leads" ADD CONSTRAINT "leads_mockup_project_id_mockup_projects_id_fk" FOREIGN KEY ("mockup_project_id") REFERENCES "public"."mockup_projects"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "idx_lead_activities_lead_created" ON "lead_activities" USING btree ("lead_id","created_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "idx_leads_stage_position" ON "leads" USING btree ("stage","position");--> statement-breakpoint
CREATE INDEX "idx_leads_mockup_project_id" ON "leads" USING btree ("mockup_project_id");