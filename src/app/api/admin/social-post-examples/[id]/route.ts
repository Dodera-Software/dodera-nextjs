import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { socialPostExamples } from "@/db/schema";

/* ── DELETE /api/admin/social-post-examples/[id] ──────────── */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    try {
        await db.delete(socialPostExamples).where(eq(socialPostExamples.id, numId));
    } catch (err) {
        return NextResponse.json(
            { status: "error", message: err instanceof Error ? err.message : "Delete failed." },
            { status: 502 },
        );
    }

    return NextResponse.json({ status: "success" });
}
