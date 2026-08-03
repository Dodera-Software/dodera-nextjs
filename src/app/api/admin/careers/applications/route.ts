import { NextRequest, NextResponse, after } from "next/server";
import { count, desc } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { cleanupExpiredApplications } from "@/lib/application-retention";
import { db } from "@/db";
import { jobApplications } from "@/db/schema";

/* ── GET /api/admin/careers/applications ──────────────────────
 * Paginated list of job applications. Download a CV via
 * /api/admin/careers/applications/[id]/cv.
 */
export async function GET(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "25", 10)));
    const offset = (page - 1) * limit;

    // GDPR retention sweep — runs after the response is sent
    after(() => cleanupExpiredApplications());

    try {
        const [data, [{ total }]] = await Promise.all([
            db
                .select({
                    id: jobApplications.id,
                    job_id: jobApplications.jobId,
                    job_title: jobApplications.jobTitle,
                    full_name: jobApplications.fullName,
                    email: jobApplications.email,
                    cv_path: jobApplications.cvPath,
                    created_at: jobApplications.createdAt,
                })
                .from(jobApplications)
                .orderBy(desc(jobApplications.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({ total: count() }).from(jobApplications),
        ]);

        return NextResponse.json({
            status: "success",
            data,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (err) {
        console.error("Error fetching job applications:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch job applications." },
            { status: 500 },
        );
    }
}
