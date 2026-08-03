import { NextRequest, NextResponse } from "next/server";
import { count, desc, eq, ilike, type SQL } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { subscribers } from "@/db/schema";

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
    const limit = Math.min(200, Math.max(1, parseInt(searchParams.get("limit") || "50", 10)));
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    let where: SQL | undefined;
    if (search) {
        where = ilike(subscribers.email, `%${search}%`);
    }

    try {
        const [data, [{ total }]] = await Promise.all([
            db
                .select({
                    id: subscribers.id,
                    email: subscribers.email,
                    created_at: subscribers.createdAt,
                })
                .from(subscribers)
                .where(where)
                .orderBy(desc(subscribers.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({ total: count() }).from(subscribers).where(where),
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
        console.error("Error fetching subscribers:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch subscribers." },
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
            { status: "error", message: "Subscriber ID is required." },
            { status: 400 },
        );
    }

    try {
        await db.delete(subscribers).where(eq(subscribers.id, id));
    } catch (err) {
        console.error("Error deleting subscriber:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to delete subscriber." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success", message: "Subscriber deleted." });
}
