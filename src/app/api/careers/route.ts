import { NextResponse } from "next/server";
import { asc, desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { jobOpenings } from "@/db/schema";

export async function GET() {
    try {
        const data = await db
            .select({
                id: jobOpenings.id,
                title: jobOpenings.title,
                department: jobOpenings.department,
                location: jobOpenings.location,
                type: jobOpenings.type,
                description: jobOpenings.description,
                apply_url: jobOpenings.applyUrl,
                sort_order: jobOpenings.sortOrder,
            })
            .from(jobOpenings)
            .where(eq(jobOpenings.status, "open"))
            .orderBy(asc(jobOpenings.sortOrder), desc(jobOpenings.createdAt));

        return NextResponse.json({ status: "success", data });
    } catch (err) {
        console.error("Error fetching job openings:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch job openings." },
            { status: 500 },
        );
    }
}
