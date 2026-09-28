import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { isLeadStage } from "@/config/leads";
import { moveLead } from "@/lib/leads";

/* ── POST /api/admin/leads/move — drag-and-drop on the board ──
 * { id, stage, ordered_ids } — ordered_ids is the target column after the
 * drop, top to bottom (including `id`).
 */
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid JSON body." }, { status: 400 });
    }

    const id = Number(body.id);
    const orderedIds = Array.isArray(body.ordered_ids) ? body.ordered_ids.map(Number) : null;
    if (
        !Number.isInteger(id) || id <= 0 ||
        !isLeadStage(body.stage) ||
        !orderedIds || orderedIds.length > 1000 ||
        !orderedIds.every((n) => Number.isInteger(n) && n > 0)
    ) {
        return NextResponse.json({ status: "error", message: "Invalid move." }, { status: 400 });
    }

    try {
        const ok = await moveLead(id, body.stage, orderedIds, session.email);
        if (!ok) return NextResponse.json({ status: "error", message: "Lead not found." }, { status: 404 });
        return NextResponse.json({ status: "success" });
    } catch (err) {
        console.error("Error moving lead:", err);
        return NextResponse.json({ status: "error", message: "Failed to move the lead." }, { status: 500 });
    }
}
