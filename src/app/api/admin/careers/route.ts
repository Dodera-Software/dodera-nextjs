import { NextRequest, NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { jobOpenings } from "@/db/schema";

const ALLOWED_STATUSES = ["open", "closed", "draft"] as const;
const ALLOWED_TYPES = ["Full-time", "Part-time", "Contract", "Internship"] as const;

/** Serialize a job_openings row with the snake_case keys the admin UI expects. */
function toApiShape(row: typeof jobOpenings.$inferSelect) {
    return {
        id: row.id,
        title: row.title,
        department: row.department,
        location: row.location,
        type: row.type,
        status: row.status,
        description: row.description,
        apply_url: row.applyUrl,
        sort_order: row.sortOrder,
        created_at: row.createdAt,
        updated_at: row.updatedAt,
    };
}

export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    try {
        const rows = await db
            .select()
            .from(jobOpenings)
            .orderBy(asc(jobOpenings.sortOrder), desc(jobOpenings.createdAt));

        return NextResponse.json({ status: "success", data: rows.map(toApiShape) });
    } catch (err) {
        console.error("Error fetching job openings:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch job openings." },
            { status: 500 },
        );
    }
}

export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const body = await request.json();
    const { title, department, location, type, status, description, apply_url, sort_order } = body;

    if (!title?.trim()) {
        return NextResponse.json(
            { status: "error", message: "Title is required." },
            { status: 400 },
        );
    }

    if (status && !ALLOWED_STATUSES.includes(status)) {
        return NextResponse.json(
            { status: "error", message: "Invalid status." },
            { status: 400 },
        );
    }

    if (type && !ALLOWED_TYPES.includes(type)) {
        return NextResponse.json(
            { status: "error", message: "Invalid type." },
            { status: 400 },
        );
    }

    try {
        const [row] = await db
            .insert(jobOpenings)
            .values({
                title: title.trim(),
                department: department?.trim() || null,
                location: location?.trim() || "Remote",
                type: type || "Full-time",
                status: status || "open",
                description: description?.trim() || null,
                applyUrl: apply_url?.trim() || null,
                sortOrder: sort_order ?? 0,
            })
            .returning();

        return NextResponse.json({ status: "success", data: toApiShape(row) }, { status: 201 });
    } catch (err) {
        console.error("Error creating job opening:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to create job opening." },
            { status: 500 },
        );
    }
}

export async function PATCH(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const body = await request.json();
    const { id, ...fields } = body;

    if (!id) {
        return NextResponse.json(
            { status: "error", message: "Job opening ID is required." },
            { status: 400 },
        );
    }

    if (fields.status && !ALLOWED_STATUSES.includes(fields.status)) {
        return NextResponse.json(
            { status: "error", message: "Invalid status." },
            { status: 400 },
        );
    }

    if (fields.type && !ALLOWED_TYPES.includes(fields.type)) {
        return NextResponse.json(
            { status: "error", message: "Invalid type." },
            { status: 400 },
        );
    }

    // Map allowed snake_case API fields onto drizzle columns
    const updatePayload: Partial<typeof jobOpenings.$inferInsert> = {};
    if ("title" in fields) updatePayload.title = fields.title;
    if ("department" in fields) updatePayload.department = fields.department;
    if ("location" in fields) updatePayload.location = fields.location;
    if ("type" in fields) updatePayload.type = fields.type;
    if ("status" in fields) updatePayload.status = fields.status;
    if ("description" in fields) updatePayload.description = fields.description;
    if ("apply_url" in fields) updatePayload.applyUrl = fields.apply_url;
    if ("sort_order" in fields) updatePayload.sortOrder = fields.sort_order;

    if (Object.keys(updatePayload).length === 0) {
        return NextResponse.json(
            { status: "error", message: "No valid fields to update." },
            { status: 400 },
        );
    }

    // The old Postgres trigger kept updated_at fresh; now the app does it
    updatePayload.updatedAt = new Date();

    try {
        const [row] = await db
            .update(jobOpenings)
            .set(updatePayload)
            .where(eq(jobOpenings.id, id))
            .returning();

        if (!row) {
            return NextResponse.json(
                { status: "error", message: "Job opening not found." },
                { status: 404 },
            );
        }

        return NextResponse.json({ status: "success", data: toApiShape(row) });
    } catch (err) {
        console.error("Error updating job opening:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to update job opening." },
            { status: 500 },
        );
    }
}

export async function DELETE(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { id } = await request.json();
    if (!id) {
        return NextResponse.json(
            { status: "error", message: "Job opening ID is required." },
            { status: 400 },
        );
    }

    try {
        await db.delete(jobOpenings).where(eq(jobOpenings.id, id));
    } catch (err) {
        console.error("Error deleting job opening:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to delete job opening." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success" });
}
