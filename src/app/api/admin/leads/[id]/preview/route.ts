import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { createProject } from "@/lib/mockups";
import { getLead, getLeadDetail, setLeadPreview } from "@/lib/leads";

/* ── POST /api/admin/leads/[id]/preview — create a mockup project for this lead and link it ──
 * { slug? } — subdomain; derived from the lead name when omitted.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    let body: Record<string, unknown> = {};
    try {
        body = await request.json();
    } catch {
        /* an empty body is fine */
    }

    try {
        const lead = await getLead(id);
        if (!lead) return NextResponse.json({ status: "error", message: "Lead not found." }, { status: 404 });
        if (lead.preview) {
            return NextResponse.json(
                { status: "error", message: "This lead already has a preview project." },
                { status: 409 },
            );
        }

        const created = await createProject({
            name: lead.name,
            slug: typeof body.slug === "string" ? body.slug : null,
            clientName: lead.name,
            notes: [lead.category, [lead.city, lead.country].filter(Boolean).join(", ")].filter(Boolean).join(" · ") || null,
            createdBy: session.email,
        });
        if (!created.ok) {
            return NextResponse.json({ status: "error", message: created.message }, { status: created.status });
        }
        await setLeadPreview(id, created.id);
        return NextResponse.json(
            { status: "success", message: "Preview project created.", data: await getLeadDetail(id) },
            { status: 201 },
        );
    } catch (err) {
        console.error("Error creating lead preview:", err);
        return NextResponse.json({ status: "error", message: "Failed to create the preview project." }, { status: 500 });
    }
}
