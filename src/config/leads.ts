import { OUTREACH_RULES, outreachRuleFor, OutreachApproach } from "@/config/outreach-rules";
import { StatusTone } from "@/config/ui";

export enum LeadStage {
    New = "new",
    Mockup = "mockup",
    Contacted = "contacted",
    Interested = "interested",
    Negotiation = "negotiation",
    Won = "won",
    Lost = "lost",
}

export enum LeadActivityKind {
    Note = "note",
    Created = "created",
    Stage = "stage",
    Deploy = "deploy",
    Mock = "mock",
}

export interface LeadStageDefinition {
    id: LeadStage;
    label: string;
    description: string;
    tone: StatusTone;
}

export const LEAD_STAGES: readonly LeadStageDefinition[] = [
    { id: LeadStage.New, label: "New", description: "Business found — collect photos, logo and info", tone: StatusTone.Info },
    { id: LeadStage.Mockup, label: "Mockup", description: "Building the mock site", tone: StatusTone.Warning },
    { id: LeadStage.Contacted, label: "Contacted", description: "First message sent", tone: StatusTone.Brand },
    { id: LeadStage.Interested, label: "Interested", description: "Replied and wants to know more", tone: StatusTone.Warning },
    { id: LeadStage.Negotiation, label: "Negotiation", description: "Discussing scope and price", tone: StatusTone.Brand },
    { id: LeadStage.Won, label: "Won", description: "Signed — hand over to delivery", tone: StatusTone.Success },
    { id: LeadStage.Lost, label: "Lost", description: "Not moving forward", tone: StatusTone.Neutral },
];

const STAGE_IDS = new Set<string>(Object.values(LeadStage));

export function isLeadStage(value: unknown): value is LeadStage {
    return typeof value === "string" && STAGE_IDS.has(value);
}

export function stageDefinition(stage: string): LeadStageDefinition | undefined {
    return LEAD_STAGES.find((s) => s.id === stage);
}

export function stageLabel(stage: string): string {
    return stageDefinition(stage)?.label ?? stage;
}

export const OUTREACH_STAGES: ReadonlySet<string> = new Set<string>([
    LeadStage.Contacted,
    LeadStage.Interested,
    LeadStage.Negotiation,
    LeadStage.Won,
    LeadStage.Lost,
]);

export const CLOSED_STAGES: ReadonlySet<string> = new Set<string>([LeadStage.Won, LeadStage.Lost]);

export enum MockPolicy {
    WithMessage = "with-message",
    OnRequest = "on-request",
}

export function mockPolicy(country: string | null | undefined): MockPolicy {
    return outreachRuleFor(country)?.approach === OutreachApproach.AskFirst ? MockPolicy.OnRequest : MockPolicy.WithMessage;
}

export const COMMON_COUNTRIES: readonly string[] = OUTREACH_RULES.map((r) => r.name);

export enum SocialKind {
    Facebook = "facebook",
    Instagram = "instagram",
}

const SOCIAL_BASE: Record<SocialKind, string> = {
    [SocialKind.Facebook]: "https://www.facebook.com/",
    [SocialKind.Instagram]: "https://www.instagram.com/",
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

export function normalizeSocial(kind: SocialKind, input: string): string | null | false {
    const raw = input.trim();
    if (!raw) return null;
    const handle = raw.replace(/^@/, "");
    if (HANDLE_RE.test(handle) && !handle.includes(".com")) return SOCIAL_BASE[kind] + handle;
    return asUrl(raw) ?? false;
}

export function normalizeLink(input: string): string | null | false {
    const raw = input.trim();
    if (!raw) return null;
    return asUrl(raw) ?? false;
}

export const LEAD_LIMITS = {
    name: 120,
    shortText: 200,
    url: 1000,
    phone: 60,
    notes: 10_000,
    activity: 2_000,
    maxValue: 100_000_000,
} as const;
