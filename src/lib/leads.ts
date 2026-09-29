import "server-only";
import { and, asc, desc, eq, inArray, min, sql } from "drizzle-orm";
import { db } from "@/db";
import { leadActivities, leads, mockupDeployments, mockupProjects } from "@/db/schema";
import {
    LEAD_LIMITS,
    mockPolicy,
    normalizeLink,
    normalizeSocial,
    OUTREACH_STAGES,
    stageLabel,
    type LeadStage,
} from "@/config/leads";
import { getProjectUrl } from "@/lib/mockups";
import type { Lead, LeadActivity, LeadActivityKind, LeadDetail } from "@/types/admin";

/* ══════════════════════════════════════════════════════════════
 * Leads pipeline — server-side service behind Admin → Leads.
 *
 * Each lead is a kanban card: `stage` is its column and `position` its
 * order inside the column (lower = higher up). A card can be linked to a
 * mockup project, so the card shows the preview link and deploys from
 * either page land on the card's timeline.
 *
 * Outreach rule (see mockPolicy): a mock site is built for every business,
 * but it only goes out with the first message outside the "on request"
 * countries (Romania, Canada). There it is sent once they are interested.
 * `mockup_sent_at` records whether the business has the link.
 * ══════════════════════════════════════════════════════════════ */

type LeadRow = typeof leads.$inferSelect;
type LeadInsert = typeof leads.$inferInsert;

/* ── Serialization ─────────────────────────────────────────── */

interface PreviewJoin {
    projectId: number | null;
    projectName: string | null;
    projectSlug: string | null;
    liveVersion: number | null;
}

function serializeLead(row: LeadRow, preview: PreviewJoin): Lead {
    return {
        id: row.id,
        name: row.name,
        country: row.country,
        city: row.city,
        category: row.category,
        facebook_url: row.facebookUrl,
        instagram_url: row.instagramUrl,
        google_maps_url: row.googleMapsUrl,
        contact_name: row.contactName,
        email: row.email,
        phone: row.phone,
        website: row.website,
        stage: row.stage,
        position: row.position,
        value_eur: row.valueEur,
        next_step: row.nextStep,
        follow_up_on: row.followUpOn,
        notes: row.notes,
        preview:
            preview.projectId !== null && preview.projectSlug !== null
                ? {
                    project_id: preview.projectId,
                    name: preview.projectName ?? "",
                    url: getProjectUrl(preview.projectSlug),
                    live_version: preview.liveVersion,
                }
                : null,
        mockup_sent_at: row.mockupSentAt?.toISOString() ?? null,
        created_by: row.createdBy,
        created_at: row.createdAt.toISOString(),
        updated_at: row.updatedAt.toISOString(),
    };
}

function serializeActivity(row: typeof leadActivities.$inferSelect): LeadActivity {
    return {
        id: row.id,
        kind: row.kind as LeadActivityKind,
        body: row.body,
        created_by: row.createdBy,
        created_at: row.createdAt.toISOString(),
    };
}

/* ── Queries ───────────────────────────────────────────────── */

function selectLeads() {
    return db
        .select({
            lead: leads,
            projectId: mockupProjects.id,
            projectName: mockupProjects.name,
            projectSlug: mockupProjects.slug,
            liveVersion: mockupDeployments.version,
        })
        .from(leads)
        .leftJoin(mockupProjects, eq(mockupProjects.id, leads.mockupProjectId))
        .leftJoin(mockupDeployments, eq(mockupDeployments.id, mockupProjects.activeDeploymentId));
}

/** Every lead, ordered as the board shows them (per column, top to bottom). */
export async function listLeads(): Promise<Lead[]> {
    const rows = await selectLeads().orderBy(asc(leads.stage), asc(leads.position), desc(leads.createdAt));
    return rows.map((r) => serializeLead(r.lead, r));
}

export async function getLead(id: number): Promise<Lead | null> {
    const [row] = await selectLeads().where(eq(leads.id, id)).limit(1);
    return row ? serializeLead(row.lead, row) : null;
}

export async function getLeadDetail(id: number): Promise<LeadDetail | null> {
    const lead = await getLead(id);
    if (!lead) return null;
    const activities = await db
        .select()
        .from(leadActivities)
        .where(eq(leadActivities.leadId, id))
        .orderBy(desc(leadActivities.createdAt), desc(leadActivities.id));
    return { ...lead, activities: activities.map(serializeActivity) };
}

/** Values already used, most common first — autocomplete for the add/edit forms. */
export async function getLeadSuggestions(): Promise<{ countries: string[]; categories: string[]; cities: string[] }> {
    const distinct = async (column: typeof leads.country | typeof leads.category | typeof leads.city) => {
        const rows = await db
            .select({ value: column, n: sql<number>`count(*)::int` })
            .from(leads)
            .where(sql`${column} is not null and ${column} <> ''`)
            .groupBy(column)
            .orderBy(sql`count(*) desc`, column)
            .limit(200);
        return rows.map((r) => r.value as string);
    };
    const [countries, categories, cities] = await Promise.all([
        distinct(leads.country),
        distinct(leads.category),
        distinct(leads.city),
    ]);
    return { countries, categories, cities };
}

/* ── Input validation ──────────────────────────────────────── */

export type ParsedLeadInput =
    | { ok: true; values: Partial<LeadInsert> }
    | { ok: false; message: string };

function optionalText(value: unknown, max: number): string | null {
    return typeof value === "string" ? value.trim().slice(0, max) || null : null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Fields every new lead needs (the Notion columns); PATCH may not blank them. */
const REQUIRED_TEXT = [
    { key: "name", column: "name", label: "Business" },
    { key: "country", column: "country", label: "Country" },
    { key: "category", column: "category", label: "Category" },
] as const;

/**
 * Validate a create/update body (snake_case, as the UI sends it). Only keys
 * present in the body are returned, so the same parser serves PATCH; with
 * `creating`, the required fields must be present too.
 * `stage`, `mockup_project_id` and `mockup_sent` are handled by their own code paths.
 */
export function parseLeadInput(body: Record<string, unknown>, { creating }: { creating: boolean }): ParsedLeadInput {
    const values: Partial<LeadInsert> = {};

    for (const field of REQUIRED_TEXT) {
        if (!(field.key in body) && !creating) continue;
        const value = typeof body[field.key] === "string" ? (body[field.key] as string).trim() : "";
        if (!value || value.length > LEAD_LIMITS.name) {
            return { ok: false, message: `${field.label} is required (max ${LEAD_LIMITS.name} characters).` };
        }
        values[field.column] = value;
    }

    if ("google_maps_url" in body || creating) {
        const link = normalizeLink(typeof body.google_maps_url === "string" ? body.google_maps_url : "");
        if (!link) {
            return {
                ok: false,
                message: link === null ? "Google Maps link is required." : "The Google Maps link doesn't look right.",
            };
        }
        values.googleMapsUrl = link.slice(0, LEAD_LIMITS.url);
    }
    for (const [key, column, kind, label] of [
        ["facebook_url", "facebookUrl", "facebook", "Facebook"],
        ["instagram_url", "instagramUrl", "instagram", "Instagram"],
    ] as const) {
        if (!(key in body)) continue;
        const link = normalizeSocial(kind, typeof body[key] === "string" ? (body[key] as string) : "");
        if (link === false) {
            return { ok: false, message: `The ${label} link doesn't look right — paste the page link or the @handle.` };
        }
        values[column] = link?.slice(0, LEAD_LIMITS.url) ?? null;
    }
    if ("website" in body) {
        const link = normalizeLink(typeof body.website === "string" ? body.website : "");
        if (link === false) return { ok: false, message: "The website link doesn't look right." };
        values.website = link?.slice(0, LEAD_LIMITS.url) ?? null;
    }

    if ("city" in body) values.city = optionalText(body.city, LEAD_LIMITS.name);
    if ("contact_name" in body) values.contactName = optionalText(body.contact_name, LEAD_LIMITS.name);
    if ("email" in body) {
        const email = optionalText(body.email, LEAD_LIMITS.shortText);
        if (email && !EMAIL_RE.test(email)) return { ok: false, message: "That email address doesn't look right." };
        values.email = email;
    }
    if ("phone" in body) values.phone = optionalText(body.phone, 60);
    if ("next_step" in body) values.nextStep = optionalText(body.next_step, LEAD_LIMITS.shortText);
    if ("notes" in body) values.notes = optionalText(body.notes, LEAD_LIMITS.notes);
    if ("value_eur" in body) {
        const raw = body.value_eur;
        if (raw === null || raw === "") {
            values.valueEur = null;
        } else {
            const n = typeof raw === "number" ? raw : Number(raw);
            if (!Number.isFinite(n) || n < 0 || n > LEAD_LIMITS.maxValue) {
                return { ok: false, message: "Value must be a positive amount in euros." };
            }
            values.valueEur = Math.round(n);
        }
    }
    if ("follow_up_on" in body) {
        const raw = body.follow_up_on;
        if (raw === null || raw === "") {
            values.followUpOn = null;
        } else if (typeof raw === "string" && DATE_RE.test(raw) && !Number.isNaN(Date.parse(raw))) {
            values.followUpOn = raw;
        } else {
            return { ok: false, message: "Follow-up date must be YYYY-MM-DD." };
        }
    }

    return { ok: true, values };
}

/* ── Mutations ─────────────────────────────────────────────── */

export async function addActivity(
    leadId: number,
    kind: LeadActivityKind,
    body: string,
    createdBy: string | null,
): Promise<void> {
    await db.insert(leadActivities).values({ leadId, kind, body: body.slice(0, LEAD_LIMITS.activity), createdBy });
}

/** Position that puts a card at the top of a column. */
async function topPosition(stage: LeadStage): Promise<number> {
    const [row] = await db.select({ top: min(leads.position) }).from(leads).where(eq(leads.stage, stage));
    return row?.top === null || row?.top === undefined ? 0 : row.top - 1;
}

export async function createLead(
    values: Partial<LeadInsert> & { name: string; country: string; category: string },
    stage: LeadStage,
    createdBy: string,
): Promise<number> {
    const position = await topPosition(stage);
    const [row] = await db
        .insert(leads)
        .values({ ...values, stage, position, createdBy })
        .returning({ id: leads.id });
    await addActivity(row.id, "created", `Added to ${stageLabel(stage)}`, createdBy);
    return row.id;
}

/**
 * Save field edits. A stage change moves the card to the top of the new
 * column and is logged on the timeline. Returns false when the lead is gone.
 */
export async function updateLead(
    id: number,
    values: Partial<LeadInsert>,
    stage: LeadStage | null,
    by: string,
): Promise<boolean> {
    const [current] = await db.select({ stage: leads.stage }).from(leads).where(eq(leads.id, id)).limit(1);
    if (!current) return false;

    const set: Partial<LeadInsert> = { ...values, updatedAt: new Date() };
    const stageChanged = stage !== null && stage !== current.stage;
    if (stageChanged) {
        set.stage = stage;
        set.position = await topPosition(stage);
    }
    await db.update(leads).set(set).where(eq(leads.id, id));
    if (stageChanged) await afterStageChange(id, current.stage, stage, by);
    return true;
}

/**
 * Drag-and-drop: put `leadId` into `stage` and store `orderedIds` (the full
 * column after the drop, top to bottom) as the new order. Ids that aren't in
 * that column (stale client) are ignored rather than pulled across.
 */
export async function moveLead(leadId: number, stage: LeadStage, orderedIds: number[], by: string): Promise<boolean> {
    const from = await db.transaction(async (tx) => {
        const [current] = await tx
            .select({ stage: leads.stage })
            .from(leads)
            .where(eq(leads.id, leadId))
            .for("update");
        if (!current) return null;

        await tx.update(leads).set({ stage, updatedAt: new Date() }).where(eq(leads.id, leadId));

        const ids = [...new Set(orderedIds.includes(leadId) ? orderedIds : [leadId, ...orderedIds])];
        const inColumn = await tx
            .select({ id: leads.id })
            .from(leads)
            .where(and(eq(leads.stage, stage), inArray(leads.id, ids)));
        const valid = new Set(inColumn.map((r) => r.id));
        const ordered = ids.filter((id) => valid.has(id));
        if (ordered.length > 0) {
            // One UPDATE … FROM (VALUES …) instead of a round-trip per card.
            const pairs = sql.join(
                ordered.map((id, i) => sql`(${id}::bigint, ${i}::int)`),
                sql`, `,
            );
            await tx.execute(sql`
                update ${leads} set position = v.pos
                from (values ${pairs}) as v(id, pos)
                where ${leads.id} = v.id
            `);
        }
        return current.stage;
    });

    if (from === null) return false;
    if (from !== stage) await afterStageChange(leadId, from, stage, by);
    return true;
}

/** Country, whether the mock was sent, and the live preview version of a lead. */
async function mockState(id: number) {
    const [row] = await db
        .select({
            country: leads.country,
            sentAt: leads.mockupSentAt,
            liveVersion: mockupDeployments.version,
        })
        .from(leads)
        .leftJoin(mockupProjects, eq(mockupProjects.id, leads.mockupProjectId))
        .leftJoin(mockupDeployments, eq(mockupDeployments.id, mockupProjects.activeDeploymentId))
        .where(eq(leads.id, id))
        .limit(1);
    return row ?? null;
}

/**
 * Log a stage move and apply the outreach rule: when a card first reaches
 * Contacted in a country where the mock goes with the first message, and a
 * version is live, the link counts as sent.
 */
async function afterStageChange(id: number, from: string, to: LeadStage, by: string): Promise<void> {
    await addActivity(id, "stage", `Moved from ${stageLabel(from)} to ${stageLabel(to)}`, by);
    if (to !== "contacted" || OUTREACH_STAGES.has(from)) return;

    const state = await mockState(id);
    if (!state || state.sentAt || state.liveVersion === null || mockPolicy(state.country) !== "with-message") return;

    await db.update(leads).set({ mockupSentAt: new Date() }).where(eq(leads.id, id));
    await addActivity(id, "mock", `Mock v${state.liveVersion} sent with the first message`, by);
}

/** Record that the preview link was (or wasn't) sent to the business. Returns false when the lead is gone. */
export async function setMockupSent(id: number, sent: boolean, by: string): Promise<boolean> {
    const state = await mockState(id);
    if (!state) return false;
    if (Boolean(state.sentAt) === sent) return true;

    await db
        .update(leads)
        .set({ mockupSentAt: sent ? new Date() : null, updatedAt: new Date() })
        .where(eq(leads.id, id));
    await addActivity(
        id,
        "mock",
        sent
            ? `Mock${state.liveVersion !== null ? ` v${state.liveVersion}` : ""} sent to the business`
            : "Marked the mock as not sent",
        by,
    );
    return true;
}

/** Link (or unlink with null) a mockup project. Returns false when the lead or project doesn't exist. */
export async function setLeadPreview(id: number, projectId: number | null): Promise<boolean> {
    if (projectId !== null) {
        const [project] = await db
            .select({ id: mockupProjects.id })
            .from(mockupProjects)
            .where(eq(mockupProjects.id, projectId))
            .limit(1);
        if (!project) return false;
    }
    const [row] = await db
        .update(leads)
        .set({ mockupProjectId: projectId, updatedAt: new Date() })
        .where(eq(leads.id, id))
        .returning({ id: leads.id });
    return Boolean(row);
}

/**
 * Called after a mockup deploy (from the lead card or the Mockups page):
 * every lead linked to that project gets a timeline entry.
 */
export async function logDeploymentOnLeads(
    projectId: number,
    version: number,
    note: string | null,
    by: string,
): Promise<void> {
    const linked = await db.select({ id: leads.id }).from(leads).where(eq(leads.mockupProjectId, projectId));
    if (linked.length === 0) return;
    const body = `Deployed preview v${version}${note ? ` — ${note}` : ""}`;
    await db.insert(leadActivities).values(linked.map((l) => ({ leadId: l.id, kind: "deploy", body, createdBy: by })));
    await db.update(leads).set({ updatedAt: new Date() }).where(inArray(leads.id, linked.map((l) => l.id)));
}
