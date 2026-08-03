import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { asc } from "drizzle-orm";
import { db } from "@/db";
import { blogPostExamples } from "@/db/schema";

/* ── GET /api/admin/blog-post-examples ───────────────────────── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    try {
        const data = await db
            .select({
                id: blogPostExamples.id,
                content: blogPostExamples.content,
                created_at: blogPostExamples.createdAt,
            })
            .from(blogPostExamples)
            .orderBy(asc(blogPostExamples.createdAt));

        return NextResponse.json({ status: "success", examples: data });
    } catch (err) {
        return NextResponse.json(
            { status: "error", message: err instanceof Error ? err.message : "Query failed." },
            { status: 502 },
        );
    }
}

/* ── POST /api/admin/blog-post-examples ──────────────────────── */
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const { content } = body ?? {};

    if (!content || typeof content !== "string" || content.trim().length < 10) {
        return NextResponse.json(
            { status: "error", message: "Content must be at least 10 characters." },
            { status: 400 },
        );
    }

    try {
        const [data] = await db
            .insert(blogPostExamples)
            .values({ content: content.trim() })
            .returning({
                id: blogPostExamples.id,
                content: blogPostExamples.content,
                created_at: blogPostExamples.createdAt,
            });

        return NextResponse.json({ status: "success", example: data }, { status: 201 });
    } catch (err) {
        return NextResponse.json(
            { status: "error", message: err instanceof Error ? err.message : "Insert failed." },
            { status: 502 },
        );
    }
}
