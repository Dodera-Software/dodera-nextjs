import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { mockupProjects } from "@/db/schema";
import { validateSlug } from "@/config/mockups";
import { getProjectDetail } from "@/lib/mockups";
import { deletionNotice, notifyIntelilangOfDeletion, readMockupSentToIntelilang } from "@/lib/intelilang";

const unauthorized = () =>
    NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });

function parseId(raw: string): number | null {
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

type Ctx = { params: Promise<{ id: string }> };

/* ── GET /api/admin/mockups/[id] — project + deployment history ── */
export async function GET(_request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const id = parseId((await params).id);
    if (!id) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    try {
        const project = await getProjectDetail(id);
        if (!project) {
            return NextResponse.json({ status: "error", message: "Project not found." }, { status: 404 });
        }
        return NextResponse.json({ status: "success", data: project });
    } catch (err) {
        console.error("Error loading mockup project:", err);
        return NextResponse.json({ status: "error", message: "Failed to load the project." }, { status: 500 });
    }
}

/* ── PATCH /api/admin/mockups/[id] — rename / change subdomain / client / notes ── */
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

    const update: Partial<typeof mockupProjects.$inferInsert> = {};

    if ("name" in body) {
        const name = typeof body.name === "string" ? body.name.trim() : "";
        if (!name || name.length > 120) {
            return NextResponse.json(
                { status: "error", message: "Project name is required (max 120 characters)." },
                { status: 400 },
            );
        }
        update.name = name;
    }
    if ("slug" in body) {
        const slug = typeof body.slug === "string" ? body.slug.trim().toLowerCase() : "";
        const slugError = validateSlug(slug);
        if (slugError) return NextResponse.json({ status: "error", message: slugError }, { status: 400 });
        const [taken] = await db
            .select({ id: mockupProjects.id })
            .from(mockupProjects)
            .where(and(eq(mockupProjects.slug, slug), ne(mockupProjects.id, id)))
            .limit(1);
        if (taken) {
            return NextResponse.json(
                { status: "error", message: `The subdomain "${slug}" is already in use.` },
                { status: 409 },
            );
        }
        update.slug = slug;
    }
    if ("client_name" in body) {
        update.clientName = typeof body.client_name === "string" ? body.client_name.trim().slice(0, 120) || null : null;
    }
    if ("notes" in body) {
        update.notes = typeof body.notes === "string" ? body.notes.trim().slice(0, 2000) || null : null;
    }

    if (Object.keys(update).length === 0) {
        return NextResponse.json({ status: "error", message: "No valid fields to update." }, { status: 400 });
    }
    update.updatedAt = new Date();

    try {
        const [row] = await db
            .update(mockupProjects)
            .set(update)
            .where(eq(mockupProjects.id, id))
            .returning({ id: mockupProjects.id });
        if (!row) {
            return NextResponse.json({ status: "error", message: "Project not found." }, { status: 404 });
        }
        const project = await getProjectDetail(id);
        return NextResponse.json({ status: "success", message: "Project updated.", data: project });
    } catch (err) {
        console.error("Error updating mockup project:", err);
        return NextResponse.json({ status: "error", message: "Failed to update the project." }, { status: 500 });
    }
}

/* ── DELETE /api/admin/mockups/[id] — remove project + all deployments/files ── */
export async function DELETE(_request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const id = parseId((await params).id);
    if (!id) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    try {
        const before = await readMockupSentToIntelilang(id);
        const [row] = await db
            .delete(mockupProjects)
            .where(eq(mockupProjects.id, id))
            .returning({ id: mockupProjects.id });
        if (!row || !before) {
            return NextResponse.json({ status: "error", message: "Project not found." }, { status: 404 });
        }
        const intelilang = await notifyIntelilangOfDeletion(before, session.email);
        return NextResponse.json({ status: "success", message: deletionNotice("Project deleted.", intelilang) });
    } catch (err) {
        console.error("Error deleting mockup project:", err);
        return NextResponse.json({ status: "error", message: "Failed to delete the project." }, { status: 500 });
    }
}
