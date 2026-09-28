import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { leads } from "@/db/schema";
import { isLeadStage, type LeadStage } from "@/config/leads";
import { getLeadDetail, parseLeadInput, setLeadPreview, updateLead } from "@/lib/leads";

const unauthorized = () =>
    NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });

function parseId(raw: string): number | null {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

type Ctx = { params: Promise<{ id: string }> };

/* ── GET /api/admin/leads/[id] — card + timeline ────────────── */
export async function GET(_request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const id = parseId((await params).id);
    if (!id) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    try {
        const lead = await getLeadDetail(id);
        if (!lead) return NextResponse.json({ status: "error", message: "Lead not found." }, { status: 404 });
        return NextResponse.json({ status: "success", data: lead });
    } catch (err) {
        console.error("Error loading lead:", err);
        return NextResponse.json({ status: "error", message: "Failed to load the lead." }, { status: 500 });
    }
}

/* ── PATCH /api/admin/leads/[id] — edit fields, stage, or linked preview ──
 * `mockup_project_id`: a mockup project id to link, or null to unlink.
 */
export async function PATCH(request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const id = parseId((await params).id);
    if (!id) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = parseLeadInput(body, { requireName: false });
    if (!parsed.ok) return NextResponse.json({ status: "error", message: parsed.message }, { status: 400 });

    let stage: LeadStage | null = null;
    if ("stage" in body) {
        if (!isLeadStage(body.stage)) {
            return NextResponse.json({ status: "error", message: "Unknown stage." }, { status: 400 });
        }
        stage = body.stage;
    }

    let projectId: number | null | undefined;
    if ("mockup_project_id" in body) {
        projectId = body.mockup_project_id === null ? null : parseId(String(body.mockup_project_id));
        if (projectId === null && body.mockup_project_id !== null) {
            return NextResponse.json({ status: "error", message: "Invalid mockup project." }, { status: 400 });
        }
    }

    if (Object.keys(parsed.values).length === 0 && stage === null && projectId === undefined) {
        return NextResponse.json({ status: "error", message: "No valid fields to update." }, { status: 400 });
    }

    try {
        const found = await updateLead(id, parsed.values, stage, session.email);
        if (!found) return NextResponse.json({ status: "error", message: "Lead not found." }, { status: 404 });
        if (projectId !== undefined && !(await setLeadPreview(id, projectId))) {
            return NextResponse.json({ status: "error", message: "Mockup project not found." }, { status: 404 });
        }
        return NextResponse.json({ status: "success", message: "Lead updated.", data: await getLeadDetail(id) });
    } catch (err) {
        console.error("Error updating lead:", err);
        return NextResponse.json({ status: "error", message: "Failed to update the lead." }, { status: 500 });
    }
}

/* ── DELETE /api/admin/leads/[id] — the linked preview project is kept ── */
export async function DELETE(_request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const id = parseId((await params).id);
    if (!id) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    try {
        const [row] = await db.delete(leads).where(eq(leads.id, id)).returning({ id: leads.id });
        if (!row) return NextResponse.json({ status: "error", message: "Lead not found." }, { status: 404 });
        return NextResponse.json({ status: "success", message: "Lead deleted." });
    } catch (err) {
        console.error("Error deleting lead:", err);
        return NextResponse.json({ status: "error", message: "Failed to delete the lead." }, { status: 500 });
    }
}
