import type { ElementType } from "react";

export interface AdminNavItem {
    href: string;
    label: string;
    icon: ElementType;
}

export interface AdminSession {
    id: number;
    email: string;
    name: string;
}

export interface Pagination {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

export interface Contact {
    id: number;
    name: string;
    email: string;
    company: string | null;
    phone: string | null;
    message: string;
    created_at: string;
}

export interface Subscriber {
    id: number;
    email: string;
    created_at: string;
}

export interface ApiToken {
    id: number;
    name: string;
    created_at: string;
    expires_at: string | null;
    revoked_at: string | null;
    last_used_at: string | null;
}

// ── Dashboard ───────────────────────────────────────────────

export interface DashboardStats {
    subscribers: number;
    tokens: number;
    activeTokens: number;
}

export interface AutoPostResult {
    status: "success" | "error";
    message: string;
    uid?: string;
    generated_post?: { title: string; excerpt: string; category: string };
}

// ── Generate Image ──────────────────────────────────────────

export interface ImageHistoryItem {
    id: number;
    prompt: string;
    size: string;
    model: string;
    url?: string;
    error?: string;
    loading: boolean;
}

// ── Generate Social Post ────────────────────────────────────

/** Blog post data returned by the admin blog listing API (richer than public BlogPost). */
export interface SocialBlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string | null;
    read_time: string;
    tags: string[];
    url: string;
    image: string | null;
    body_plain: string;
}

// ── Send Email ──────────────────────────────────────────────

export interface BlogPostSummary {
    slug: string;
    title: string;
    excerpt: string;
    date: string;
    category: string;
    image: string | null;
}

// ── Careers ─────────────────────────────────────────────────

export interface JobOpening {
    id: number;
    title: string;
    department: string | null;
    location: string;
    type: string;
    status: "open" | "closed" | "draft";
    description: string | null;
    apply_url: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface AttachedFile {
    file: File;
    id: string;
}

export interface BulkSendResult {
    totalRecipients: number;
    accepted: number;
    rejected: number;
    errors: string[];
}

// ── Settings ────────────────────────────────────────────────

export interface ConfigRow {
    key: string;
    value: string;
    description: string | null;
    updated_at: string;
}

// ── API Docs ────────────────────────────────────────────────

export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface ApiEndpoint {
    path: string;
    methods: HttpMethod[];
    auth: "api-token" | "admin-session" | "webhook-secret" | "none";
    description: string;
    details: string;
    params?: {
        name: string;
        type: string;
        required: boolean;
        description: string;
    }[];
    response?: string;
}

// ── Mockups ─────────────────────────────────────────────────

export interface MockupDeployment {
    id: number;
    version: number;
    entry_path: string;
    file_count: number;
    total_bytes: number;
    note: string | null;
    created_by: string | null;
    created_at: string;
    is_active: boolean;
    /** Whether this version was sent to InteliLang: null when it wasn't asked for. */
    intelilang_status: "sent" | "failed" | null;
}

export interface MockupProject {
    id: number;
    slug: string;
    name: string;
    client_name: string | null;
    notes: string | null;
    /** Public preview URL, or null when MOCKUPS_DOMAIN is not configured. */
    url: string | null;
    active_deployment: MockupDeployment | null;
    deployments_count: number;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface MockupProjectDetail extends MockupProject {
    deployments: MockupDeployment[];
}

export interface MockupFileInfo {
    path: string;
    content_type: string;
    size: number;
}

/** GET /api/admin/intelilang — never includes the secret itself. */
export interface IntelilangSettings {
    url: string;
    secret_set: boolean;
    secret_tail: string | null;
    configured: boolean;
    can_store_secret: boolean;
}
