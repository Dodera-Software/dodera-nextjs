/**
 * Leads pipeline (Admin → Leads) — shared constants (safe for client and server).
 *
 * The kanban board renders one column per stage, in this order. Stage ids are
 * stored in `leads.stage`, so renaming a label is free but changing an id
 * needs a data migration.
 */

export const LEAD_STAGES = [
    { id: "new", label: "New", description: "Just came in, not contacted yet", dot: "bg-sky-400" },
    { id: "contacted", label: "Contacted", description: "First conversation happened", dot: "bg-violet-400" },
    { id: "mockup", label: "Mockup", description: "Preparing or showing a preview", dot: "bg-amber-400" },
    { id: "proposal", label: "Proposal sent", description: "Offer is with the client", dot: "bg-orange-400" },
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

/** Where leads come from — free text in the DB, these are the suggestions. */
export const LEAD_SOURCES = ["Contact form", "Referral", "LinkedIn", "Cold outreach", "Upwork", "Event", "Other"] as const;

export const LEAD_LIMITS = {
    name: 120,
    shortText: 200,
    notes: 10_000,
    activity: 2_000,
    /** Estimated deal value in EUR (whole euros). */
    maxValue: 100_000_000,
} as const;
