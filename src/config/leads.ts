/**
 * Leads pipeline (Admin → Leads) — shared constants (safe for client and server).
 *
 * The outreach flow: find a business (New) → collect its photos and build a
 * mock site (Mockup) → send the first message (Contacted) → they reply
 * (Interested) → Negotiation → Won / Lost.
 *
 * The kanban board renders one column per stage, in this order. Stage ids are
 * stored in `leads.stage`, so renaming a label is free but changing an id
 * needs a data migration.
 */

export const LEAD_STAGES = [
    { id: "new", label: "New", description: "Business found — collect photos, logo and info", dot: "bg-sky-400" },
    { id: "mockup", label: "Mockup", description: "Building the mock site", dot: "bg-amber-400" },
    { id: "contacted", label: "Contacted", description: "First message sent", dot: "bg-violet-400" },
    { id: "interested", label: "Interested", description: "Replied and wants to know more", dot: "bg-orange-400" },
    { id: "negotiation", label: "Negotiation", description: "Discussing scope and price", dot: "bg-pink-400" },
    { id: "won", label: "Won", description: "Signed — hand over to delivery", dot: "bg-emerald-500" },
    { id: "lost", label: "Lost", description: "Not moving forward", dot: "bg-zinc-400" },
] as const;

export type LeadStage = (typeof LEAD_STAGES)[number]["id"];

const STAGE_IDS = new Set<string>(LEAD_STAGES.map((s) => s.id));

export function isLeadStage(value: unknown): value is LeadStage {
    return typeof value === "string" && STAGE_IDS.has(value);
}

export function stageLabel(stage: string): string {
    return LEAD_STAGES.find((s) => s.id === stage)?.label ?? stage;
}

/** Stages where the business has heard from us (the mock may or may not have been sent). */
export const OUTREACH_STAGES = new Set<string>(["contacted", "interested", "negotiation", "won", "lost"]);

/* ── Mock policy per country ───────────────────────────────── */

/**
 * Countries where the first message goes out WITHOUT the mock link; it is
 * sent only once the business is interested and asks to see it. Everywhere
 * else the mock link goes with the first message. Matched case-insensitively,
 * by name or ISO code.
 */
export const MOCK_ON_REQUEST_COUNTRIES: readonly { name: string; code: string }[] = [
    { name: "Romania", code: "RO" },
    { name: "Canada", code: "CA" },
];

export type MockPolicy = "with-message" | "on-request";

export function mockPolicy(country: string | null | undefined): MockPolicy {
    const c = country?.trim().toLowerCase() ?? "";
    return MOCK_ON_REQUEST_COUNTRIES.some((r) => r.name.toLowerCase() === c || r.code.toLowerCase() === c)
        ? "on-request"
        : "with-message";
}

/** Suggestions for the Country field; anything else can be typed. */
export const COMMON_COUNTRIES = [
    "Romania", "Canada", "United States", "United Kingdom", "Ireland", "Australia", "New Zealand",
    "Germany", "Austria", "Switzerland", "France", "Belgium", "Netherlands", "Luxembourg", "Italy",
    "Spain", "Portugal", "Denmark", "Sweden", "Norway", "Finland", "Poland", "Czechia", "Hungary",
    "Greece", "Bulgaria", "Moldova", "United Arab Emirates",
] as const;

/* ── Links ─────────────────────────────────────────────────── */

export type SocialKind = "facebook" | "instagram";

const SOCIAL_BASE: Record<SocialKind, string> = {
    facebook: "https://www.facebook.com/",
    instagram: "https://www.instagram.com/",
};

const HANDLE_RE = /^[A-Za-z0-9._-]{1,100}$/;

function asUrl(raw: string): string | null {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
    try {
        const url = new URL(withScheme);
        return url.hostname.includes(".") ? url.toString() : null;
    } catch {
        return null;
    }
}

/**
 * "@pawsalon", "pawsalon", "instagram.com/pawsalon" or a full URL → a full
 * profile URL. Returns null for empty input and `false` when it can't be read.
 */
export function normalizeSocial(kind: SocialKind, input: string): string | null | false {
    const raw = input.trim();
    if (!raw) return null;
    const handle = raw.replace(/^@/, "");
    if (HANDLE_RE.test(handle) && !handle.includes(".com")) return SOCIAL_BASE[kind] + handle;
    return asUrl(raw) ?? false;
}

/** Any link (Google Maps, website): adds https:// when missing. `false` when it isn't a link. */
export function normalizeLink(input: string): string | null | false {
    const raw = input.trim();
    if (!raw) return null;
    return asUrl(raw) ?? false;
}

export const LEAD_LIMITS = {
    name: 120,
    shortText: 200,
    url: 1000,
    notes: 10_000,
    activity: 2_000,
    /** Estimated deal value in EUR (whole euros). */
    maxValue: 100_000_000,
} as const;
