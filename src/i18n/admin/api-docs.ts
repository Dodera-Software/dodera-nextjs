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
        methods: [HttpMethod.Get, HttpMethod.Post],
        auth: ApiAuth.ApiToken,
        description: "Blog drafts (used by /new-blog in Claude Code)",
        details:
            "GET lists every post in both languages, drafts included, so a new topic is not a repeat. POST saves an English + Romanian pair as a draft (the same key again replaces the draft; a published key is refused with 409). Publishing happens only in Admin → Blog.",
        params: [
            { name: "key", type: "string", required: true, description: "Shared id of the EN/RO pair (lowercase-hyphenated)" },
            { name: "author", type: "string", required: false, description: "Byline (default: Dodera Team)" },
            { name: "sources", type: "{ title, url }[]", required: true, description: "Sources cited by the post (1–20)" },
            { name: "en / ro", type: "object", required: true, description: "slug, title, excerpt, body (Markdown), category, tags, metaTitle?, metaDescription?" },
        ],
        response: '{ "status": "success", "key": "...", "preview": { "en": "...", "ro": "..." } }',
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
        description: "Published blog posts for the newsletter picker",
        details:
            "Returns the published English posts (title, excerpt, category, date, link, cover). Used by the Send Email blog picker.",
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
        path: "/api/admin/blog",
        methods: [HttpMethod.Get, HttpMethod.Patch, HttpMethod.Delete],
        auth: ApiAuth.AdminSession,
        description: "Manage blog posts (Admin → Blog)",
        details:
            "GET /api/admin/blog lists all posts. PATCH /api/admin/blog/<key> with { status: \"published\" | \"draft\" } publishes or unpublishes both languages. DELETE /api/admin/blog/<key> deletes both. PATCH /api/admin/blog/post/<id> edits one language (title, excerpt, body, metaTitle, metaDescription, indexed).",
        response: '{ "status": "success" }',
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
