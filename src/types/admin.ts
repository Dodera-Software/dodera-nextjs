import type { JobStatus, JobType } from "@/config/careers";
import type { LeadActivityKind, LeadStage } from "@/config/leads";
import type { ApiAuth, HttpMethod } from "@/config/api-docs";

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

// ── Blog ────────────────────────────────────────────────────

export interface AdminBlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string | null;
    tags: string[];
    url: string;
    image: string | null;
}

export interface BlogPostRow {
    id: number;
    translationKey: string;
    locale: "en" | "ro";
    slug: string;
    status: "draft" | "published";
    title: string;
    excerpt: string;
    body: string;
    category: string;
    tags: string[];
    author: string;
    metaTitle: string | null;
    metaDescription: string | null;
    sources: { title: string; url: string }[];
    indexed: boolean;
    publishedAt: string | null;
    createdAt: string;
    updatedAt: string;
}

// ── Email ───────────────────────────────────────────────────

export interface SmtpCheck {
    ok: boolean;
    error?: string;
}

// ── Careers ─────────────────────────────────────────────────

export interface JobOpening {
    id: number;
    title: string;
    department: string | null;
    location: string;
    type: JobType;
    status: JobStatus;
    description: string | null;
    apply_url: string | null;
    sort_order: number;
    created_at: string;
    updated_at: string;
}

export interface JobApplication {
    id: number;
    job_id: number | null;
    job_title: string;
    full_name: string;
    email: string;
    cv_path: string;
    created_at: string;
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

export interface ApiEndpointParam {
    name: string;
    type: string;
    required: boolean;
    description: string;
}

export interface ApiEndpoint {
    path: string;
    methods: HttpMethod[];
    auth: ApiAuth;
    description: string;
    details: string;
    params?: ApiEndpointParam[];
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

/** GET /api/admin/intelilang — never includes the secret itself. */
export interface IntelilangSettings {
    url: string;
    secret_set: boolean;
    secret_tail: string | null;
    configured: boolean;
    can_store_secret: boolean;
}

export interface LeadActivity {
    id: number;
    kind: LeadActivityKind;
    body: string;
    created_by: string | null;
    created_at: string;
}

export interface LeadPreview {
    project_id: number;
    name: string;
    url: string | null;
    live_version: number | null;
}

export interface LinkableMockup extends LeadPreview {
    slug: string;
    client_name: string | null;
    updated_at: string;
    linked_lead: { id: number; name: string } | null;
}

export interface Lead {
    id: number;
    name: string;
    country: string | null;
    city: string | null;
    category: string | null;
    facebook_url: string | null;
    instagram_url: string | null;
    google_maps_url: string | null;
    contact_name: string | null;
    email: string | null;
    phone: string | null;
    website: string | null;
    stage: LeadStage;
    position: number;
    value_eur: number | null;
    next_step: string | null;
    follow_up_on: string | null;
    notes: string | null;
    preview: LeadPreview | null;
    mockup_sent_at: string | null;
    latest_note: string | null;
    suggested_preview: LeadPreview | null;
    created_by: string | null;
    created_at: string;
    updated_at: string;
}

export interface LeadDetail extends Lead {
    activities: LeadActivity[];
}

export interface LeadSuggestions {
    countries: string[];
    categories: string[];
    cities: string[];
}
