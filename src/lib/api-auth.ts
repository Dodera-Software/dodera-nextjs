import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { createHash } from "crypto";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { apiTokens } from "@/db/schema";

export interface AuthResult {
    /** Whether the token is valid */
    valid: boolean;
    /** Token metadata (only set when valid) */
    token?: { id: number; name: string };
    /** Error response ready to return (only set when invalid) */
    errorResponse?: NextResponse;
}

/**
 * Verify an API bearer token from the `Authorization` header.
 *
 * Usage in a route handler:
 * ```ts
 * import { authenticateRequest } from "@/lib/api-auth";
 *
 * export async function GET(request: NextRequest) {
 *   const auth = await authenticateRequest(request);
 *   if (!auth.valid) return auth.errorResponse!;
 *
 *   // auth.token.id / auth.token.name available
 *   return NextResponse.json({ data: "protected" });
 * }
 * ```
 */
export async function authenticateRequest(
    request: NextRequest,
): Promise<AuthResult> {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return {
            valid: false,
            errorResponse: NextResponse.json(
                { status: "error", message: "Missing or malformed Authorization header. Expected: Bearer <token>" },
                { status: 401 },
            ),
        };
    }

    const plainToken = authHeader.slice(7); // strip "Bearer "

    if (!plainToken || plainToken.length < 10) {
        return {
            valid: false,
            errorResponse: NextResponse.json(
                { status: "error", message: "Invalid token format." },
                { status: 401 },
            ),
        };
    }

    const tokenHash = createHash("sha256")
        .update(plainToken, "utf8")
        .digest("hex");

    // Look up the hash
    let data: { id: number; name: string; expiresAt: Date | null; revokedAt: Date | null } | undefined;
    try {
        [data] = await db
            .select({
                id: apiTokens.id,
                name: apiTokens.name,
                expiresAt: apiTokens.expiresAt,
                revokedAt: apiTokens.revokedAt,
            })
            .from(apiTokens)
            .where(eq(apiTokens.tokenHash, tokenHash))
            .limit(1);
    } catch (err) {
        console.error("[api-auth] Token lookup failed:", err);
    }

    if (!data) {
        return {
            valid: false,
            errorResponse: NextResponse.json(
                { status: "error", message: "Invalid API token." },
                { status: 401 },
            ),
        };
    }

    // Check revocation
    if (data.revokedAt) {
        return {
            valid: false,
            errorResponse: NextResponse.json(
                { status: "error", message: "This API token has been revoked." },
                { status: 401 },
            ),
        };
    }

    // Check expiration
    if (data.expiresAt && data.expiresAt < new Date()) {
        return {
            valid: false,
            errorResponse: NextResponse.json(
                { status: "error", message: "This API token has expired." },
                { status: 401 },
            ),
        };
    }

    // Update last_used_at (fire-and-forget, don't block the response)
    db.update(apiTokens)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiTokens.id, data.id))
        .catch((err) => console.warn("[api-auth] last_used_at update failed:", err));

    return {
        valid: true,
        token: { id: data.id, name: data.name },
    };
}
