import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { leadActivities } from "@/db/schema";
import { getLeadDetail } from "@/lib/leads";

/* ── DELETE /api/admin/leads/[id]/activities/[activityId] — notes only;
 * stage moves and deploys are history and stay. */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string; activityId: string }> },
) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const { id: rawId, activityId: rawActivityId } = await params;
    const id = Number(rawId);
    const activityId = Number(rawActivityId);
    if (!Number.isInteger(id) || id <= 0 || !Number.isInteger(activityId) || activityId <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    try {
        const [row] = await db
            .delete(leadActivities)
            .where(and(
                eq(leadActivities.id, activityId),
                eq(leadActivities.leadId, id),
                eq(leadActivities.kind, "note"),
            ))
            .returning({ id: leadActivities.id });
        if (!row) return NextResponse.json({ status: "error", message: "Note not found." }, { status: 404 });
        return NextResponse.json({ status: "success", message: "Note deleted.", data: await getLeadDetail(id) });
    } catch (err) {
        console.error("Error deleting lead note:", err);
        return NextResponse.json({ status: "error", message: "Failed to delete the note." }, { status: 500 });
    }
}
