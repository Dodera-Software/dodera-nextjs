import { NextRequest, NextResponse } from "next/server";
import { count, desc, eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { db } from "@/db";
import { apiTokens } from "@/db/schema";
import { randomBytes, createHash } from "crypto";

function generateToken(): string {
    const random = randomBytes(48).toString("base64url");
    return `dod_${random}`;
}

function hashToken(token: string): string {
    return createHash("sha256").update(token, "utf8").digest("hex");
}

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

    try {
        const [data, [{ total }]] = await Promise.all([
            db
                .select({
                    id: apiTokens.id,
                    name: apiTokens.name,
                    created_at: apiTokens.createdAt,
                    expires_at: apiTokens.expiresAt,
                    revoked_at: apiTokens.revokedAt,
                    last_used_at: apiTokens.lastUsedAt,
                })
                .from(apiTokens)
                .orderBy(desc(apiTokens.createdAt))
                .limit(limit)
                .offset(offset),
            db.select({ total: count() }).from(apiTokens),
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
        console.error("Error fetching tokens:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch tokens." },
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
    const { name, expiresDays } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
            { status: "error", message: "Token name is required." },
            { status: 400 },
        );
    }

    const plainToken = generateToken();
    const tokenHash = hashToken(plainToken);

    const expiresAt = expiresDays
        ? new Date(Date.now() + expiresDays * 86400000)
        : null;

    try {
        const [data] = await db
            .insert(apiTokens)
            .values({
                tokenHash,
                name: name.trim(),
                expiresAt,
            })
            .returning({
                id: apiTokens.id,
                name: apiTokens.name,
                created_at: apiTokens.createdAt,
                expires_at: apiTokens.expiresAt,
            });

        return NextResponse.json({
            status: "success",
            message: "Token created. Copy it now — it won't be shown again.",
            plainToken,
            data,
        }, { status: 201 });
    } catch (err) {
        console.error("Error creating token:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to create token." },
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

    const { id, action } = await request.json();

    if (!id) {
        return NextResponse.json(
            { status: "error", message: "Token ID is required." },
            { status: 400 },
        );
    }

    if (action === "revoke") {
        try {
            await db
                .update(apiTokens)
                .set({ revokedAt: new Date() })
                .where(eq(apiTokens.id, id));
        } catch (err) {
            console.error("Error revoking token:", err);
            return NextResponse.json(
                { status: "error", message: "Failed to revoke token." },
                { status: 500 },
            );
        }

        return NextResponse.json({ status: "success", message: "Token revoked." });
    }

    // Full delete
    try {
        await db.delete(apiTokens).where(eq(apiTokens.id, id));
    } catch (err) {
        console.error("Error deleting token:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to delete token." },
            { status: 500 },
        );
    }

    return NextResponse.json({ status: "success", message: "Token deleted." });
}

export async function PATCH(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { id, name } = await request.json();

    if (!id) {
        return NextResponse.json(
            { status: "error", message: "Token ID is required." },
            { status: 400 },
        );
    }

    if (!name || typeof name !== "string" || name.trim().length === 0) {
        return NextResponse.json(
            { status: "error", message: "Token name is required." },
            { status: 400 },
        );
    }

    try {
        const [data] = await db
            .update(apiTokens)
            .set({ name: name.trim() })
            .where(eq(apiTokens.id, id))
            .returning({ id: apiTokens.id, name: apiTokens.name });

        if (!data) {
            return NextResponse.json(
                { status: "error", message: "Token not found." },
                { status: 404 },
            );
        }

        return NextResponse.json({ status: "success", message: "Token renamed.", data });
    } catch (err) {
        console.error("Error renaming token:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to rename token." },
            { status: 500 },
        );
    }
}
