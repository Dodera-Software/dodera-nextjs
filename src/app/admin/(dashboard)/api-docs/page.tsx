"use client";

import { Shield, ShieldOff, Clock, Globe, Lock } from "lucide-react";
import type { ApiEndpoint } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { EndpointCard } from "./EndpointCard";

const API_ENDPOINTS: ApiEndpoint[] = [
    {
        path: "/api/ping",
        methods: ["GET"],
        auth: "api-token",
        description: "Health check endpoint",
        details:
            "Simple health check to verify API connectivity and token validity. Returns a pong response if the token is valid.",
        response: '{ "status": "success", "message": "pong" }',
    },
    {
        path: "/api/blog",
        methods: ["POST"],
        auth: "api-token",
        description: "Create a new blog post in Prismic CMS",
        details:
            "Creates a new blog post document in Prismic. Accepts full blog content including title, body (plain text, markdown, or Prismic RichText), excerpt, tags, category, image URLs, and SEO fields. Automatically downloads external images, uploads them as Prismic assets, creates the document, and optionally publishes it.",
        params: [
            { name: "uid", type: "string", required: true, description: "URL slug for the blog post" },
            { name: "title", type: "string", required: true, description: "Blog post title" },
            { name: "body", type: "string | RichText[]", required: true, description: "Post content - plain text, markdown, or Prismic RichText" },
            { name: "excerpt", type: "string", required: false, description: "Short summary / excerpt" },
            { name: "tags", type: "string[]", required: false, description: "Array of tags" },
            { name: "category", type: "string", required: false, description: "Post category" },
            { name: "featured_image_url", type: "string", required: false, description: "URL for the featured image" },
            { name: "publish", type: "boolean", required: false, description: "Whether to publish immediately (default: false)" },
        ],
        response: '{ "status": "success", "id": "...", "uid": "..." }',
    },
    {
        path: "/api/auto-post",
        methods: ["GET"],
        auth: "api-token",
        description: "AI-powered blog post generator",
        details:
            "Uses OpenAI GPT to pick a trending IT topic and generate a complete blog post as structured JSON. Then calls /api/generate-image for a featured image and /api/blog to save it to Prismic CMS. Fully automated end-to-end content creation.",
        params: [
            { name: "save_to_prismic", type: "boolean (query)", required: false, description: "Whether to save to Prismic (default: true)" },
            { name: "author_name", type: "string (query)", required: false, description: "Author name for the post" },
            { name: "lang", type: "string (query)", required: false, description: "Language code (e.g. en-us)" },
            { name: "publish", type: "boolean (query)", required: false, description: "Whether to publish immediately" },
        ],
        response: '{ "status": "success", "post": { ... }, "prismic": { ... } }',
    },
    {
        path: "/api/generate-image",
        methods: ["POST"],
        auth: "api-token",
        description: "Generate images via OpenAI DALL-E 3",
        details:
            "Generates an image using DALL-E 3. Accepts either a direct prompt string or blog post fields (title, excerpt, category, tags) from which a prompt is derived. Returns the image as binary PNG by default, or as a JSON URL if the return_url query parameter is set.",
        params: [
            { name: "prompt", type: "string", required: false, description: "Direct image generation prompt" },
            { name: "title", type: "string", required: false, description: "Blog title (used to derive prompt)" },
            { name: "excerpt", type: "string", required: false, description: "Blog excerpt (used to derive prompt)" },
            { name: "return_url", type: "boolean (query)", required: false, description: "Return URL instead of binary image" },
        ],
        response: "Binary PNG image or { \"url\": \"...\" }",
    },
    {
        path: "/api/contact",
        methods: ["POST"],
        auth: "none",
        description: "Public contact form submission",
        details:
            "Handles contact form submissions from the website. Validates name, email, and message (plus optional company and phone) with Zod, then inserts the submission into the Supabase contacts table.",
        params: [
            { name: "name", type: "string", required: true, description: "Sender's name" },
            { name: "email", type: "string", required: true, description: "Sender's email address" },
            { name: "message", type: "string", required: true, description: "Message content" },
            { name: "company", type: "string", required: false, description: "Company name" },
            { name: "phone", type: "string", required: false, description: "Phone number" },
        ],
        response: '{ "success": true, "message": "..." }',
    },
    {
        path: "/api/newsletter",
        methods: ["POST"],
        auth: "none",
        description: "Newsletter subscription",
        details:
            "Handles newsletter subscription requests. Validates the email, checks for duplicates in the Supabase subscribers table, and inserts new subscribers. Returns success even if already subscribed to prevent email enumeration.",
        params: [
            { name: "email", type: "string", required: true, description: "Subscriber's email address" },
        ],
        response: '{ "success": true, "message": "..." }',
    },
    {
        path: "/api/revalidate",
        methods: ["POST"],
        auth: "webhook-secret",
        description: "Prismic webhook revalidation",
        details:
            "Handles Prismic webhook calls for on-demand ISR revalidation. Validates the secret query parameter against PRISMIC_WEBHOOK_SECRET, then calls revalidateTag('prismic') to bust cached Prismic content. Triggered automatically when content is published in Prismic.",
        params: [
            { name: "secret", type: "string (query)", required: true, description: "Webhook secret for authentication" },
        ],
        response: '{ "revalidated": true }',
    },
    {
        path: "/api/cron/auto-post",
        methods: ["GET"],
        auth: "cron-secret",
        description: "Scheduled auto-post cron job",
        details:
            "Cron job handler that runs daily at 09:00 UTC. On Netlify, triggered by the scheduled function in netlify/functions/cron-auto-post.mts. Verifies the request via CRON_SECRET, picks a random author, then forwards the request to /api/auto-post using the AUTO_POST_API_TOKEN environment variable.",
        response: '{ "status": "success", "post": { ... } }',
    },
    {
        path: "/api/preview",
        methods: ["GET"],
        auth: "none",
        description: "Prismic preview resolver",
        details:
            "When an editor clicks 'Preview' in the Prismic dashboard, this endpoint receives the preview token and redirects the browser to the correct page URL for live previewing unpublished content.",
    },
    {
        path: "/api/exit-preview",
        methods: ["GET"],
        auth: "none",
        description: "Exit Prismic preview mode",
        details:
            "Clears the Prismic preview cookie and redirects the user back to the page they were viewing, ending the preview session.",
    },
    // ── Admin Panel Endpoints ──────────────────────────────────
    {
        path: "/api/admin/login",
        methods: ["POST"],
        auth: "none",
        description: "Admin login",
        details:
            "Authenticates an admin user with email and password. Creates a server-side session cookie on success. Includes IP-based rate limiting (429 on too many attempts).",
        params: [
            { name: "email", type: "string", required: true, description: "Admin email address" },
            { name: "password", type: "string", required: true, description: "Admin password" },
        ],
        response: '{ "status": "success" }',
    },
    {
        path: "/api/admin/logout",
        methods: ["POST"],
        auth: "admin-session",
        description: "Admin logout",
        details: "Destroys the active admin session cookie, logging the user out.",
        response: '{ "status": "success" }',
    },
    {
        path: "/api/admin/session",
        methods: ["GET"],
        auth: "admin-session",
        description: "Get current admin session",
        details: "Returns the currently authenticated admin user's session data (id, email, name).",
        response: '{ "status": "success", "user": { "id": 1, "email": "...", "name": "..." } }',
    },
    {
        path: "/api/admin/config",
        methods: ["GET", "PATCH"],
        auth: "admin-session",
        description: "Runtime configuration (app settings)",
        details:
            "GET: Returns all key/value config rows from the database. PATCH: Updates a single config key's value. Used by the Settings page to read and write runtime flags like feature toggles, rate limits, and model selections.",
        params: [
            { name: "key", type: "string", required: true, description: "Config key to update (PATCH only)" },
            { name: "value", type: "string", required: true, description: "New value to store (PATCH only)" },
        ],
        response: 'GET: { "status": "success", "data": [...] } | PATCH: { "status": "success" }',
    },
    {
        path: "/api/admin/blog-posts",
        methods: ["GET"],
        auth: "admin-session",
        description: "List published blog posts (admin)",
        details:
            "Returns all published Prismic blog posts with plain-text body (HTML stripped, limited to 4000 chars). Used internally by the Generate Social Post and Send Email admin tools.",
        response: '{ "status": "success", "posts": [...] }',
    },
    {
        path: "/api/admin/contacts",
        methods: ["GET", "DELETE"],
        auth: "admin-session",
        description: "Manage contact form submissions",
        details:
            "GET: Returns a paginated, searchable list of contact submissions. DELETE: Removes a contact by ID.",
        params: [
            { name: "page", type: "number (query)", required: false, description: "Page number (GET)" },
            { name: "limit", type: "number (query)", required: false, description: "Results per page, max 200 (GET)" },
            { name: "search", type: "string (query)", required: false, description: "Full-text search across name, email, company, message (GET)" },
            { name: "id", type: "number (query)", required: true, description: "Contact ID to delete (DELETE)" },
        ],
        response: '{ "status": "success", "data": [...], "pagination": { ... } }',
    },
    {
        path: "/api/admin/subscribers",
        methods: ["GET", "DELETE"],
        auth: "admin-session",
        description: "Manage newsletter subscribers",
        details:
            "GET: Returns a paginated, searchable list of newsletter subscribers. DELETE: Removes a subscriber by ID.",
        params: [
            { name: "page", type: "number (query)", required: false, description: "Page number (GET)" },
            { name: "limit", type: "number (query)", required: false, description: "Results per page, max 200 (GET)" },
            { name: "search", type: "string (query)", required: false, description: "Email search filter (GET)" },
            { name: "id", type: "number (query)", required: true, description: "Subscriber ID to delete (DELETE)" },
        ],
        response: '{ "status": "success", "data": [...], "pagination": { ... } }',
    },
    {
        path: "/api/admin/tokens",
        methods: ["GET", "POST"],
        auth: "admin-session",
        description: "Manage API tokens",
        details:
            "GET: Returns a paginated list of all API tokens. POST: Creates a new API token with an optional name and expiry date.",
        params: [
            { name: "page", type: "number (query)", required: false, description: "Page number (GET)" },
            { name: "limit", type: "number (query)", required: false, description: "Results per page, max 200 (GET)" },
            { name: "name", type: "string", required: false, description: "Token name/label (POST)" },
            { name: "expires_at", type: "string (ISO date)", required: false, description: "Optional expiry date (POST)" },
        ],
        response: '{ "status": "success", "data": [...] } | { "status": "success", "token": "..." }',
    },
    {
        path: "/api/admin/generate-image",
        methods: ["POST"],
        auth: "admin-session",
        description: "Generate AI image (admin panel)",
        details:
            "Generates an image via OpenAI. Accepts a URL (re-generates from existing image URL), a direct prompt, or size/model overrides. Returns a binary PNG or a JSON object with the URL.",
        params: [
            { name: "url", type: "string", required: false, description: "Existing image URL to re-generate from" },
            { name: "prompt", type: "string", required: false, description: "Direct generation prompt" },
            { name: "size", type: "string", required: false, description: "Image size (e.g. 1792x1024)" },
            { name: "model", type: "string", required: false, description: "Model override (e.g. dall-e-3, gpt-image-1)" },
        ],
        response: 'Binary PNG or { "url": "..." }',
    },
    {
        path: "/api/admin/send-email",
        methods: ["POST"],
        auth: "admin-session",
        description: "Send bulk email to subscribers",
        details:
            'Sends an HTML email to either all active subscribers ("all") or a comma-separated list of addresses. Accepts multipart/form-data with optional file attachments.',
        params: [
            { name: "to", type: "string", required: true, description: '"all" or comma-separated email addresses' },
            { name: "subject", type: "string", required: true, description: "Email subject line" },
            { name: "html", type: "string", required: true, description: "HTML email body" },
            { name: "files[]", type: "File[]", required: false, description: "Optional file attachments (multipart)" },
        ],
        response: '{ "status": "success", "result": { "totalRecipients": 0, "accepted": 0, "rejected": 0, "errors": [] } }',
    },
    {
        path: "/api/admin/social-post",
        methods: ["POST"],
        auth: "admin-session",
        description: "Generate AI social media post",
        details:
            "Uses OpenAI to generate a platform-specific social media post for a given blog post. Supports LinkedIn, Facebook, and Instagram.",
        params: [
            { name: "platform", type: "\"linkedin\" | \"facebook\" | \"instagram\"", required: true, description: "Target social platform" },
            { name: "blog.title", type: "string", required: true, description: "Blog post title" },
            { name: "blog.url", type: "string", required: true, description: "Blog post URL" },
        ],
        response: '{ "status": "success", "post": "..." }',
    },
    {
        path: "/api/admin/social-post-examples",
        methods: ["GET", "POST"],
        auth: "admin-session",
        description: "Manage social post style examples",
        details:
            "GET: Returns saved examples for a given platform (used to guide AI tone). POST: Saves a new example for a platform.",
        params: [
            { name: "platform", type: "string (query)", required: true, description: "Platform to fetch examples for (GET)" },
            { name: "platform", type: "string", required: true, description: "Platform (POST)" },
            { name: "content", type: "string (min 10)", required: true, description: "Example post content (POST)" },
        ],
        response: '{ "status": "success", "data": [...] }',
    },
    {
        path: "/api/admin/trigger-autopost",
        methods: ["POST"],
        auth: "admin-session",
        description: "Manually trigger AI blog post generation",
        details:
            "Manually kicks off the auto-post pipeline from the admin panel. Picks a trending IT topic, generates a full blog post with GPT, creates a featured image with DALL-E, and saves it to Prismic. Optionally publishes immediately.",
        params: [
            { name: "publish", type: "boolean", required: false, description: "Publish the post immediately after creation" },
            { name: "author_name", type: "string", required: false, description: "Author name to attribute the post to" },
            { name: "lang", type: "string", required: false, description: "Language code (e.g. en-us)" },
            { name: "save_to_prismic", type: "boolean", required: false, description: "Whether to save to Prismic (default: true)" },
        ],
        response: '{ "status": "success", "post": { ... } }',
    },
];

export default function ApiDocsPage() {
    const protectedEndpoints = API_ENDPOINTS.filter(
        (e) => e.auth === "api-token"
    );
    const adminEndpoints = API_ENDPOINTS.filter(
        (e) => e.auth === "admin-session"
    );
    const cronEndpoints = API_ENDPOINTS.filter(
        (e) => e.auth === "cron-secret"
    );
    const webhookEndpoints = API_ENDPOINTS.filter(
        (e) => e.auth === "webhook-secret"
    );
    const publicEndpoints = API_ENDPOINTS.filter((e) => e.auth === "none");

    const sections = [
        {
            title: "API Token Protected",
            description:
                "These endpoints require a valid API token passed via Authorization: Bearer <token> header.",
            endpoints: protectedEndpoints,
        },
        {
            title: "Admin Panel",
            description:
                "Internal endpoints used by the admin dashboard. Require an active admin session cookie.",
            endpoints: adminEndpoints,
        },
        {
            title: "Cron Jobs",
            description:
                "Scheduled endpoints authenticated via CRON_SECRET.",
            endpoints: cronEndpoints,
        },
        {
            title: "Webhook Endpoints",
            description:
                "Endpoints triggered by external services using shared secrets.",
            endpoints: webhookEndpoints,
        },
        {
            title: "Public Endpoints",
            description:
                "Open endpoints accessible without authentication.",
            endpoints: publicEndpoints,
        },
    ].filter((s) => s.endpoints.length > 0);

    return (
        <div className="space-y-8">
            <AdminPageHeader
                title="API Documentation"
                subtitle={`Overview of all backend API endpoints — ${API_ENDPOINTS.length} total`}
            />

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                    {
                        label: "Total Endpoints",
                        value: API_ENDPOINTS.length,
                        icon: ShieldOff,
                        color: "text-foreground",
                        bg: "bg-muted/50",
                    },
                    {
                        label: "Token Protected",
                        value: protectedEndpoints.length,
                        icon: Shield,
                        color: "text-amber-400",
                        bg: "bg-amber-400/10",
                    },
                    {
                        label: "Admin Session",
                        value: adminEndpoints.length,
                        icon: Lock,
                        color: "text-blue-400",
                        bg: "bg-blue-400/10",
                    },
                    {
                        label: "Public",
                        value: publicEndpoints.length,
                        icon: Globe,
                        color: "text-emerald-400",
                        bg: "bg-emerald-400/10",
                    },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        className="border border-border rounded-xl p-4 bg-card"
                    >
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}
                            >
                                <stat.icon className={`w-4 h-4 ${stat.color}`} />
                            </div>
                        </div>
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                    </div>
                ))}
            </div>

            {/* Sections */}
            {sections.map((section) => (
                <div key={section.title} className="space-y-3">
                    <div>
                        <h2 className="text-lg font-semibold">{section.title}</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            {section.description}
                        </p>
                    </div>
                    <div className="space-y-2">
                        {section.endpoints.map((endpoint) => (
                            <EndpointCard
                                key={endpoint.path}
                                endpoint={endpoint}
                            />
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
