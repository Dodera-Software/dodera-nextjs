import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getLeadSuggestions } from "@/lib/leads";

/* ── GET /api/admin/leads/suggestions — countries, categories and cities already used ── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    try {
        return NextResponse.json({ status: "success", data: await getLeadSuggestions() });
    } catch (err) {
        console.error("Error loading lead suggestions:", err);
        return NextResponse.json({ status: "error", message: "Failed to load suggestions." }, { status: 500 });
    }
}
