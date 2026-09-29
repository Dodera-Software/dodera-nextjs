import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { isLeadStage } from "@/config/leads";
import { createLead, getLeadDetail, listLeads, parseLeadInput } from "@/lib/leads";

const unauthorized = () =>
    NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });

/* ── GET /api/admin/leads — every card on the board ─────────── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    try {
        return NextResponse.json({ status: "success", data: await listLeads() });
    } catch (err) {
        console.error("Error listing leads:", err);
        return NextResponse.json({ status: "error", message: "Failed to load leads." }, { status: 500 });
    }
}

/* ── POST /api/admin/leads — add a card (top of its column) ─── */
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid JSON body." }, { status: 400 });
    }

    const parsed = parseLeadInput(body, { creating: true });
    if (!parsed.ok) return NextResponse.json({ status: "error", message: parsed.message }, { status: 400 });

    const stage = body.stage ?? "new";
    if (!isLeadStage(stage)) {
        return NextResponse.json({ status: "error", message: "Unknown stage." }, { status: 400 });
    }

    try {
        const { name, country, category } = parsed.values;
        const id = await createLead({ ...parsed.values, name: name!, country: country!, category: category! }, stage, session.email);
        return NextResponse.json({ status: "success", data: await getLeadDetail(id) }, { status: 201 });
    } catch (err) {
        console.error("Error creating lead:", err);
        return NextResponse.json({ status: "error", message: "Failed to create the lead." }, { status: 500 });
    }
}
