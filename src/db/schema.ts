import {
    pgTable,
    text,
    bigint,
    boolean,
    integer,
    timestamp,
    index,
    uniqueIndex,
    check,
    customType,
    type AnyPgColumn,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

/** Postgres `bytea` — drizzle has no built-in type for it. */
const bytea = customType<{ data: Buffer }>({
    dataType() {
        return "bytea";
    },
});

/* ── admin_users — admin dashboard credentials ─────────────── */
export const adminUsers = pgTable(
    "admin_users",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        email: text("email").notNull().unique(),
        passwordHash: text("password_hash").notNull(), // bcrypt hash
        name: text("name"),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
        lastLoginAt: timestamp("last_login_at", { withTimezone: true, mode: "date" }),
    },
    (t) => [uniqueIndex("idx_admin_users_email").on(t.email)],
);

/* ── api_tokens — hashed API bearer tokens ─────────────────── */
export const apiTokens = pgTable(
    "api_tokens",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        tokenHash: text("token_hash").notNull().unique(), // SHA-256 hex — never store plain tokens
        name: text("name").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
        expiresAt: timestamp("expires_at", { withTimezone: true, mode: "date" }), // NULL = never
        revokedAt: timestamp("revoked_at", { withTimezone: true, mode: "date" }), // NULL = active
        lastUsedAt: timestamp("last_used_at", { withTimezone: true, mode: "date" }),
    },
    (t) => [index("idx_api_tokens_created_at").on(t.createdAt.desc())],
);

/* ── app_config — key/value store for runtime settings ─────── */
export const appConfig = pgTable("app_config", {
    key: text("key").primaryKey(),
    value: text("value").notNull(),
    description: text("description"),
    updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
        .notNull()
        .defaultNow(),
});

/* ── contacts — contact form submissions ───────────────────── */
export const contacts = pgTable(
    "contacts",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        name: text("name").notNull(),
        email: text("email").notNull(),
        company: text("company"),
        phone: text("phone"),
        message: text("message").notNull(),
        serviceType: text("service_type"),
        budget: text("budget"),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("idx_contacts_created_at").on(t.createdAt.desc())],
);

/* ── subscribers — newsletter subscriptions ────────────────── */
export const subscribers = pgTable(
    "subscribers",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        email: text("email").notNull().unique(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("idx_subscribers_created_at").on(t.createdAt.desc())],
);

/* ── job_openings — career/job listings ────────────────────── */
export const jobOpenings = pgTable(
    "job_openings",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        title: text("title").notNull(),
        department: text("department"),
        location: text("location").notNull().default("Remote"),
        type: text("type").notNull().default("Full-time"), // Full-time, Part-time, Contract, Internship
        status: text("status").notNull().default("open"), // open, closed, draft
        description: text("description"),
        applyUrl: text("apply_url"),
        sortOrder: integer("sort_order").notNull().default(0),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("idx_job_openings_status").on(t.status),
        index("idx_job_openings_sort_order").on(t.sortOrder.asc(), t.createdAt.desc()),
    ],
);

/* ── job_applications — career applications ────────────────── */
export const jobApplications = pgTable(
    "job_applications",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        jobId: bigint("job_id", { mode: "number" }).references(() => jobOpenings.id, {
            onDelete: "set null",
        }),
        jobTitle: text("job_title").notNull(),
        fullName: text("full_name").notNull(),
        email: text("email").notNull(),
        cvPath: text("cv_path").notNull(), // key into cv_files.path
        gdprConsent: boolean("gdpr_consent").notNull().default(true),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("idx_job_applications_job_id").on(t.jobId),
        index("idx_job_applications_created_at").on(t.createdAt.desc()),
    ],
);

/* ── cv_files — CV uploads (replaces the Supabase "cvs" bucket) ── */
export const cvFiles = pgTable(
    "cv_files",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        path: text("path").notNull().unique(), // same path format the bucket used: "<jobId|general>/<ts>-<name>.<ext>"
        filename: text("filename").notNull(), // original upload filename
        contentType: text("content_type").notNull(),
        data: bytea("data").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
);

/* ── rate_limit_log — request log for public endpoints ─────── */
export const rateLimitLog = pgTable(
    "rate_limit_log",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        key: text("key").notNull(), // e.g. "contact:1.2.3.4"
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("idx_rate_limit_log_key_created").on(t.key, t.createdAt.desc())],
);

/* ── auto_generated_blog_posts — AI post dedup tracking ────── */
export const autoGeneratedBlogPosts = pgTable(
    "auto_generated_blog_posts",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        uid: text("uid").notNull().unique(),
        title: text("title").notNull(),
        category: text("category"),
        tags: text("tags").array(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("idx_auto_generated_blog_posts_created_at").on(t.createdAt.desc())],
);

/* ── blog_post_examples — style references for AI prompts ──── */
export const blogPostExamples = pgTable(
    "blog_post_examples",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        content: text("content").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("idx_blog_post_examples_created_at").on(t.createdAt.asc())],
);

/* ── social_post_examples — per-platform style references ──── */
export const socialPostExamples = pgTable(
    "social_post_examples",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        platform: text("platform").notNull(),
        content: text("content").notNull(),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [
        index("idx_social_post_examples_platform").on(t.platform, t.createdAt.desc()),
        check(
            "social_post_examples_platform_check",
            sql`${t.platform} in ('linkedin', 'facebook', 'instagram')`,
        ),
    ],
);

/* ── mockup_projects — client mockup workspaces (Admin → Mockups) ── */
export const mockupProjects = pgTable(
    "mockup_projects",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        slug: text("slug").notNull().unique(), // subdomain label → <slug>.<MOCKUPS_DOMAIN>
        name: text("name").notNull(),
        clientName: text("client_name"),
        notes: text("notes"),
        // The deployment currently served on the subdomain (NULL = nothing live yet).
        activeDeploymentId: bigint("active_deployment_id", { mode: "number" }).references(
            (): AnyPgColumn => mockupDeployments.id,
            { onDelete: "set null" },
        ),
        createdBy: text("created_by"), // admin email
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
        updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [index("idx_mockup_projects_updated_at").on(t.updatedAt.desc())],
);

/* ── mockup_deployments — one row per upload (versioned, roll-backable) ── */
export const mockupDeployments = pgTable(
    "mockup_deployments",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        projectId: bigint("project_id", { mode: "number" })
            .notNull()
            .references(() => mockupProjects.id, { onDelete: "cascade" }),
        version: integer("version").notNull(), // 1, 2, 3… per project
        entryPath: text("entry_path").notNull().default("index.html"), // file served at "/"
        fileCount: integer("file_count").notNull().default(0),
        totalBytes: bigint("total_bytes", { mode: "number" }).notNull().default(0),
        note: text("note"),
        createdBy: text("created_by"),
        createdAt: timestamp("created_at", { withTimezone: true, mode: "date" })
            .notNull()
            .defaultNow(),
    },
    (t) => [uniqueIndex("idx_mockup_deployments_project_version").on(t.projectId, t.version)],
);

/* ── mockup_files — the static files of a deployment (bytea, like cv_files) ── */
export const mockupFiles = pgTable(
    "mockup_files",
    {
        id: bigint("id", { mode: "number" }).primaryKey().generatedAlwaysAsIdentity(),
        deploymentId: bigint("deployment_id", { mode: "number" })
            .notNull()
            .references(() => mockupDeployments.id, { onDelete: "cascade" }),
        path: text("path").notNull(), // relative, forward slashes, e.g. "css/style.css"
        contentType: text("content_type").notNull(),
        size: integer("size").notNull(),
        data: bytea("data").notNull(),
    },
    (t) => [uniqueIndex("idx_mockup_files_deployment_path").on(t.deploymentId, t.path)],
);
