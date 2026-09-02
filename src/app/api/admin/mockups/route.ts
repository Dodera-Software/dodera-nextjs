import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { mockupProjects } from "@/db/schema";
import { slugify, validateSlug } from "@/config/mockups";
import { getMockupsDomain, getProject, listProjects } from "@/lib/mockups";

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

    const explicitSlug = typeof body.slug === "string" && body.slug.trim().length > 0;
    let slug = explicitSlug ? (body.slug as string).trim().toLowerCase() : slugify(name);
    const slugError = validateSlug(slug);
    if (slugError) {
        return NextResponse.json({ status: "error", message: slugError }, { status: 400 });
    }

    try {
        // Auto-generated slugs get a numeric suffix on collision; explicit ones must be free.
        let free = false;
        for (let attempt = 1; attempt <= 20 && !free; attempt++) {
            const candidate = attempt === 1 ? slug : `${slug.slice(0, 60)}-${attempt}`;
            const [existing] = await db
                .select({ id: mockupProjects.id })
                .from(mockupProjects)
                .where(eq(mockupProjects.slug, candidate))
                .limit(1);
            if (!existing) {
                slug = candidate;
                free = true;
            } else if (explicitSlug) {
                return NextResponse.json(
                    { status: "error", message: `The subdomain "${slug}" is already in use.` },
                    { status: 409 },
                );
            }
        }
        if (!free) {
            return NextResponse.json(
                { status: "error", message: "Could not find a free subdomain — pick one manually." },
                { status: 409 },
            );
        }

        const [row] = await db
            .insert(mockupProjects)
            .values({ slug, name, clientName, notes, createdBy: session.email })
            .returning({ id: mockupProjects.id });

        const project = await getProject(row.id);
        return NextResponse.json({ status: "success", data: project }, { status: 201 });
    } catch (err) {
        if ((err as { code?: string })?.code === "23505") {
            return NextResponse.json(
                { status: "error", message: `The subdomain "${slug}" is already in use.` },
                { status: 409 },
            );
        }
        console.error("Error creating mockup project:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to create the project." },
            { status: 500 },
        );
    }
}
