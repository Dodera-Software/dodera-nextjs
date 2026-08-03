import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { asc, eq } from "drizzle-orm";
import { db } from "@/db";
import { socialPostExamples } from "@/db/schema";

const VALID_PLATFORMS = ["linkedin", "facebook", "instagram"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

/* ── GET /api/admin/social-post-examples?platform=linkedin ── */
export async function GET(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const platform = request.nextUrl.searchParams.get("platform") as Platform | null;
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
        return NextResponse.json(
            { status: "error", message: "Missing or invalid platform query param." },
            { status: 400 },
        );
    }

    try {
        const data = await db
            .select({
                id: socialPostExamples.id,
                platform: socialPostExamples.platform,
                content: socialPostExamples.content,
                created_at: socialPostExamples.createdAt,
            })
            .from(socialPostExamples)
            .where(eq(socialPostExamples.platform, platform))
            .orderBy(asc(socialPostExamples.createdAt));

        return NextResponse.json({ status: "success", examples: data });
    } catch (err) {
        return NextResponse.json(
            { status: "error", message: err instanceof Error ? err.message : "Query failed." },
            { status: 502 },
        );
    }
}

/* ── POST /api/admin/social-post-examples ─────────────────── */
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const { platform, content } = body ?? {};

    if (!platform || !VALID_PLATFORMS.includes(platform as Platform)) {
        return NextResponse.json({ status: "error", message: "Invalid platform." }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length < 10) {
        return NextResponse.json(
            { status: "error", message: "Content must be at least 10 characters." },
            { status: 400 },
        );
    }

    try {
        const [data] = await db
            .insert(socialPostExamples)
            .values({ platform, content: content.trim() })
            .returning({
                id: socialPostExamples.id,
                platform: socialPostExamples.platform,
                content: socialPostExamples.content,
                created_at: socialPostExamples.createdAt,
            });

        return NextResponse.json({ status: "success", example: data }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { status: "error", message: err instanceof Error ? err.message : "Insert failed." },
            { status: 502 },
        );
    }
}
