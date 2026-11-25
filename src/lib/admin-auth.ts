import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { eq, sql } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import type { AdminSession } from "@/types/admin";

let cachedJwtSecret: Uint8Array | null = null;
function getJwtSecret(): Uint8Array {
    if (cachedJwtSecret) return cachedJwtSecret;

    const raw = process.env.ADMIN_JWT_SECRET;
    if (process.env.NODE_ENV === "production" && !raw) {
        throw new Error(
            "[admin-auth] ADMIN_JWT_SECRET environment variable is not set. " +
            "This is required in production to secure admin sessions."
        );
    }

    cachedJwtSecret = new TextEncoder().encode(raw ?? "fallback-secret-change-me");
    return cachedJwtSecret;
}

const COOKIE_NAME = "admin_session";
const COOKIE_MAX_AGE = 60 * 60 * 24;
const JWT_ALGORITHM = "HS256";

const sessionClaims = z.object({
    sub: z.string().regex(/^\d+$/),
    ver: z.number().int().positive(),
});

export async function createAdminSession(user: { id: number; sessionVersion: number }): Promise<void> {
    const token = await new SignJWT({ ver: user.sessionVersion })
        .setProtectedHeader({ alg: JWT_ALGORITHM })
        .setSubject(String(user.id))
        .setIssuedAt()
        .setExpirationTime(`${COOKIE_MAX_AGE}s`)
        .sign(getJwtSecret());

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: COOKIE_MAX_AGE,
    });
}

async function readSessionClaims(): Promise<{ id: number; ver: number } | null> {
    const token = (await cookies()).get(COOKIE_NAME)?.value;
    if (!token) return null;
    try {
        const { payload } = await jwtVerify(token, getJwtSecret(), { algorithms: [JWT_ALGORITHM] });
        const claims = sessionClaims.safeParse(payload);
        return claims.success ? { id: Number(claims.data.sub), ver: claims.data.ver } : null;
    } catch {
        return null;
    }
}

export async function verifyAdminSession(): Promise<AdminSession | null> {
    const claims = await readSessionClaims();
    if (!claims) return null;

    const [user] = await db
        .select({
            id: adminUsers.id,
            email: adminUsers.email,
            name: adminUsers.name,
            sessionVersion: adminUsers.sessionVersion,
        })
        .from(adminUsers)
        .where(eq(adminUsers.id, claims.id))
        .limit(1);

    if (!user || user.sessionVersion !== claims.ver) return null;
    return { id: user.id, email: user.email, name: user.name || "Admin" };
}

export async function destroyAdminSession(): Promise<void> {
    const session = await verifyAdminSession();
    if (session) {
        await db
            .update(adminUsers)
            .set({ sessionVersion: sql`${adminUsers.sessionVersion} + 1` })
            .where(eq(adminUsers.id, session.id));
    }
    (await cookies()).delete(COOKIE_NAME);
}
