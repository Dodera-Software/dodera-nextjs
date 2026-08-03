import { NextRequest, NextResponse } from "next/server";
import { count, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { contacts } from "@/db/schema";

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
    const search = searchParams.get("search") || "";
    const offset = (page - 1) * limit;

    let where: SQL | undefined;
    if (search) {
        where = or(
            ilike(contacts.name, `%${search}%`),
            ilike(contacts.email, `%${search}%`),
            ilike(contacts.company, `%${search}%`),
        );
    }

    try {
        const [data, [{ total }]] = await Promise.all([
            db
                .select({
                    id: contacts.id,
                    name: contacts.name,
                    email: contacts.email,
                    company: contacts.company,
                    phone: contacts.phone,
                    message: contacts.message,
                    created_at: contacts.createdAt,
                })
                .from(contacts)
                .where(where)
                .orderBy(desc(contacts.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({ total: count() }).from(contacts).where(where),
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
        console.error("Error fetching contacts:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch contacts." },
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
            { status: "error", message: "Contact ID is required." },
            { status: 400 },
        );
    }

    try {
        await db.delete(contacts).where(eq(contacts.id, id));
    } catch (err) {
        console.error("Error deleting contact:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to delete contact." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success" });
}
