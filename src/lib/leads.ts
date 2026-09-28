import "server-only";
import { and, asc, desc, eq, inArray, min, sql } from "drizzle-orm";
import { db } from "@/db";
import { leadActivities, leads, mockupDeployments, mockupProjects } from "@/db/schema";
import { LEAD_LIMITS, stageLabel, type LeadStage } from "@/config/leads";
import { getProjectUrl } from "@/lib/mockups";
import type { Lead, LeadActivity, LeadActivityKind, LeadDetail } from "@/types/admin";

/* ══════════════════════════════════════════════════════════════
 * Leads pipeline — server-side service behind Admin → Leads.
 *
 * Each lead is a kanban card: `stage` is its column and `position` its
 * order inside the column (lower = higher up). A card can be linked to a
 * mockup project, so the card shows the preview link and deploys from
 * either page land on the card's timeline.
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
        contact_name: row.contactName,
        email: row.email,
        phone: row.phone,
        website: row.website,
        source: row.source,
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

/* ── Input validation ──────────────────────────────────────── */

export type ParsedLeadInput =
    | { ok: true; values: Partial<LeadInsert> }
    | { ok: false; message: string };

function optionalText(value: unknown, max: number): string | null {
    return typeof value === "string" ? value.trim().slice(0, max) || null : null;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate a create/update body (snake_case, as the UI sends it). Only keys
 * present in the body are returned, so the same parser serves PATCH.
 * `stage` and `mockup_project_id` are handled by their own code paths.
 */
export function parseLeadInput(body: Record<string, unknown>, { requireName }: { requireName: boolean }): ParsedLeadInput {
    const values: Partial<LeadInsert> = {};

    if ("name" in body || requireName) {
        const name = typeof body.name === "string" ? body.name.trim() : "";
        if (!name || name.length > LEAD_LIMITS.name) {
            return { ok: false, message: `Name is required (max ${LEAD_LIMITS.name} characters).` };
        }
        values.name = name;
    }
    if ("contact_name" in body) values.contactName = optionalText(body.contact_name, LEAD_LIMITS.name);
    if ("email" in body) {
        const email = optionalText(body.email, LEAD_LIMITS.shortText);
        if (email && !EMAIL_RE.test(email)) return { ok: false, message: "That email address doesn't look right." };
        values.email = email;
    }
    if ("phone" in body) values.phone = optionalText(body.phone, 60);
    if ("website" in body) values.website = optionalText(body.website, LEAD_LIMITS.shortText);
    if ("source" in body) values.source = optionalText(body.source, LEAD_LIMITS.name);
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
    values: Partial<LeadInsert> & { name: string },
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
    if (stageChanged) {
        await addActivity(id, "stage", `Moved from ${stageLabel(current.stage)} to ${stageLabel(stage)}`, by);
    }
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
    if (from !== stage) {
        await addActivity(leadId, "stage", `Moved from ${stageLabel(from)} to ${stageLabel(stage)}`, by);
    }
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
