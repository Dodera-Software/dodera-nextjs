import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { createProject, getMockupsDomain, getProject, listProjects } from "@/lib/mockups";

const unauthorized = () =>
    NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });

/* ── GET /api/admin/mockups — all projects + the configured domain ── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    try {
        const data = await listProjects();
        return NextResponse.json({ status: "success", domain: getMockupsDomain(), data });
    } catch (err) {
        console.error("Error listing mockup projects:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to load mockup projects." },
            { status: 500 },
        );
    }
}

/* ── POST /api/admin/mockups — create a project ───────────────── */
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    let body: Record<string, unknown>;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid JSON body." }, { status: 400 });
    }

    const name = typeof body.name === "string" ? body.name.trim() : "";
    if (!name || name.length > 120) {
        return NextResponse.json(
            { status: "error", message: "Project name is required (max 120 characters)." },
            { status: 400 },
        );
    }

    const clientName = typeof body.client_name === "string" ? body.client_name.trim().slice(0, 120) || null : null;
    const notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) || null : null;

    const slug = typeof body.slug === "string" ? body.slug : null;

    try {
        const created = await createProject({ name, slug, clientName, notes, createdBy: session.email });
        if (!created.ok) {
            return NextResponse.json({ status: "error", message: created.message }, { status: created.status });
        }
        const project = await getProject(created.id);
        return NextResponse.json({ status: "success", data: project }, { status: 201 });
    } catch (err) {
        console.error("Error creating mockup project:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to create the project." },
            { status: 500 },
        );
    }
}
