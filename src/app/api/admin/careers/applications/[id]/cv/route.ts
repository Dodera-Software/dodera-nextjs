import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { cvFiles, jobApplications } from "@/db/schema";

/* ── GET /api/admin/careers/applications/[id]/cv ──────────────
 * Streams the CV file attached to a job application (stored in
 * the cv_files table — replaces Supabase Storage signed URLs).
 */
export async function GET(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    try {
        const [application] = await db
            .select({ cvPath: jobApplications.cvPath })
            .from(jobApplications)
            .where(eq(jobApplications.id, numId))
            .limit(1);

        if (!application) {
            return NextResponse.json(
                { status: "error", message: "Application not found." },
                { status: 404 },
            );
        }

        const [file] = await db
            .select()
            .from(cvFiles)
            .where(eq(cvFiles.path, application.cvPath))
            .limit(1);

        if (!file) {
            return NextResponse.json(
                { status: "error", message: "CV file not found." },
                { status: 404 },
            );
        }

        return new NextResponse(new Uint8Array(file.data), {
            headers: {
                "Content-Type": file.contentType,
                "Content-Disposition": `attachment; filename="${file.filename.replace(/"/g, "")}"`,
                "Content-Length": String(file.data.byteLength),
                "Cache-Control": "private, no-store",
            },
        });
    } catch (err) {
        console.error("Error fetching CV:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch CV." },
            { status: 500 },
        );
    }
}
