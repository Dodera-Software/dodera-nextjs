"use client";

import { Shield, ShieldOff, Clock, Globe } from "lucide-react";
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
];

export default function ApiDocsPage() {
    const protectedEndpoints = API_ENDPOINTS.filter(
        (e) => e.auth === "api-token"
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
            title: "Cron Jobs",
            description:
                "Scheduled endpoints authenticated via Vercel CRON_SECRET.",
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
                        label: "Public",
                        value: publicEndpoints.length,
                        icon: Globe,
                        color: "text-emerald-400",
                        bg: "bg-emerald-400/10",
                    },
                    {
                        label: "Cron / Webhook",
                        value: cronEndpoints.length + webhookEndpoints.length,
                        icon: Clock,
                        color: "text-violet-400",
                        bg: "bg-violet-400/10",
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
