import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { LEAD_LIMITS } from "@/config/leads";
import { addActivity, getLead, getLeadDetail } from "@/lib/leads";

/* ── POST /api/admin/leads/[id]/activities — add a note to the timeline ── */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid JSON body." }, { status: 400 });
    }

    const text = typeof body.body === "string" ? body.body.trim() : "";
    if (!text || text.length > LEAD_LIMITS.activity) {
        return NextResponse.json(
            { status: "error", message: `Write something (max ${LEAD_LIMITS.activity} characters).` },
            { status: 400 },
        );
    }

    try {
        if (!(await getLead(id))) {
            return NextResponse.json({ status: "error", message: "Lead not found." }, { status: 404 });
        }
        await addActivity(id, "note", text, session.email);
        return NextResponse.json({ status: "success", data: await getLeadDetail(id) }, { status: 201 });
    } catch (err) {
        console.error("Error adding lead note:", err);
        return NextResponse.json({ status: "error", message: "Failed to add the note." }, { status: 500 });
    }
}
