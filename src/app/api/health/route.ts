import { NextResponse } from "next/server";
import { sql } from "drizzle-orm";
import { db } from "@/db";

export const dynamic = "force-dynamic";

/**
 * GET /api/health — liveness/readiness probe for Coolify.
 * Verifies the app is up and the database is reachable.
 */
export async function GET() {
    try {
        await db.execute(sql`select 1`);
        return NextResponse.json({ status: "ok", db: "up" });
    } catch (err) {
        console.error("[health] DB check failed:", err);
        return NextResponse.json(
            { status: "error", db: "down" },
            { status: 503 },
        );
    }
}
