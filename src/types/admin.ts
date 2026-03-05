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
    auth: "api-token" | "cron-secret" | "webhook-secret" | "none";
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
