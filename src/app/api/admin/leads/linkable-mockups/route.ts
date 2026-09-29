import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { listLinkableMockups } from "@/lib/leads";

/* ── GET /api/admin/leads/linkable-mockups — Mockups projects to link to a lead, with who they're linked to ── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    try {
        return NextResponse.json({ status: "success", data: await listLinkableMockups() });
    } catch (err) {
        console.error("Error listing linkable mockups:", err);
        return NextResponse.json({ status: "error", message: "Failed to load the mockups." }, { status: 500 });
    }
}
