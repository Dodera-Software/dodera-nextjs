import { ApiAuth, HttpMethod } from "@/config/api-docs";
import type { ApiEndpoint } from "@/types/admin";

const endpoints: ApiEndpoint[] = [
    {
        path: "/api/ping",
        methods: [HttpMethod.Get],
        auth: ApiAuth.ApiToken,
        description: "Health check endpoint",
        details:
            "Simple health check to verify API connectivity and token validity. Returns a pong response if the token is valid.",
        response: '{ "status": "success", "message": "pong" }',
    },
    {
        path: "/api/blog",
        methods: [HttpMethod.Post],
        auth: ApiAuth.ApiToken,
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
        methods: [HttpMethod.Get],
        auth: ApiAuth.ApiToken,
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.ApiToken,
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.None,
        description: "Public contact form submission",
        details:
            "Handles contact form submissions from the website. Validates name, email, and message (plus optional company and phone) with Zod, then inserts the submission into the contacts table.",
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.None,
        description: "Newsletter subscription",
        details:
            "Handles newsletter subscription requests. Validates the email, checks for duplicates in the subscribers table, and inserts new subscribers. Returns success even if already subscribed to prevent email enumeration.",
        params: [
            { name: "email", type: "string", required: true, description: "Subscriber's email address" },
        ],
        response: '{ "success": true, "message": "..." }',
    },
    {
        path: "/api/revalidate",
        methods: [HttpMethod.Post],
        auth: ApiAuth.WebhookSecret,
        description: "Prismic webhook revalidation",
        details:
            "Handles Prismic webhook calls for on-demand ISR revalidation. Validates the secret query parameter against PRISMIC_WEBHOOK_SECRET, then calls revalidateTag('prismic') to bust cached Prismic content. Triggered automatically when content is published in Prismic.",
        params: [
            { name: "secret", type: "string (query)", required: true, description: "Webhook secret for authentication" },
        ],
        response: '{ "revalidated": true }',
    },
    {
        path: "/api/preview",
        methods: [HttpMethod.Get],
        auth: ApiAuth.None,
        description: "Prismic preview resolver",
        details:
            "When an editor clicks 'Preview' in the Prismic dashboard, this endpoint receives the preview token and redirects the browser to the correct page URL for live previewing unpublished content.",
    },
    {
        path: "/api/exit-preview",
        methods: [HttpMethod.Get],
        auth: ApiAuth.None,
        description: "Exit Prismic preview mode",
        details:
            "Clears the Prismic preview cookie and redirects the user back to the page they were viewing, ending the preview session.",
    },
    {
        path: "/api/admin/login",
        methods: [HttpMethod.Post],
        auth: ApiAuth.None,
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.AdminSession,
        description: "Admin logout",
        details: "Destroys the active admin session cookie, logging the user out.",
        response: '{ "status": "success" }',
    },
    {
        path: "/api/admin/session",
        methods: [HttpMethod.Get],
        auth: ApiAuth.AdminSession,
        description: "Get current admin session",
        details: "Returns the currently authenticated admin user's session data (id, email, name).",
        response: '{ "status": "success", "user": { "id": 1, "email": "...", "name": "..." } }',
    },
    {
        path: "/api/admin/config",
        methods: [HttpMethod.Get, HttpMethod.Patch],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Get],
        auth: ApiAuth.AdminSession,
        description: "List published blog posts (admin)",
        details:
            "Returns all published Prismic blog posts with plain-text body (HTML stripped, limited to 4000 chars). Used internally by the Generate Social Post and Send Email admin tools.",
        response: '{ "status": "success", "posts": [...] }',
    },
    {
        path: "/api/admin/contacts",
        methods: [HttpMethod.Get, HttpMethod.Delete],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Get, HttpMethod.Delete],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Get, HttpMethod.Post],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Get, HttpMethod.Post],
        auth: ApiAuth.AdminSession,
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
        methods: [HttpMethod.Post],
        auth: ApiAuth.AdminSession,
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

export const apiDocsCopy = {
    eyebrow: "System",
    title: "API docs",
    description: (total: number) => `Every backend endpoint, ${total} in total.`,
    search: "Search path or description…",
    stats: {
        total: "Endpoints",
        [ApiAuth.ApiToken]: "Token protected",
        [ApiAuth.AdminSession]: "Admin session",
        [ApiAuth.None]: "Public",
    },
    auth: {
        [ApiAuth.ApiToken]: {
            label: "API token",
            section: "API token protected",
            description: "Requires an Authorization: Bearer <token> header.",
        },
        [ApiAuth.AdminSession]: {
            label: "Admin session",
            section: "Admin panel",
            description: "Internal endpoints used by the admin. Require an active admin session cookie (sign in at /admin/login).",
        },
        [ApiAuth.WebhookSecret]: {
            label: "Webhook secret",
            section: "Webhooks",
            description: "Called by external services with a shared ?secret= query parameter.",
        },
        [ApiAuth.None]: {
            label: "Public",
            section: "Public",
            description: "Open endpoints, no authentication required.",
        },
    } satisfies Record<ApiAuth, { label: string; section: string; description: string }>,
    endpoint: {
        details: "Details",
        authentication: "Authentication",
        parameters: "Parameters",
        response: "Example response",
        copyPath: "Copy path",
        columns: { name: "Name", type: "Type", required: "Required", description: "Description" },
        required: "Yes",
        optional: "No",
    },
    empty: { title: "No endpoints match", description: "Try another path or word." },
    endpoints,
} as const;
