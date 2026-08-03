import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { AdminSession } from "@/types/admin";

/**
 * Resolved lazily (not at module scope): the secret must not be needed
 * during `next build` — the Docker image builds without any secrets and
 * they are injected only at container runtime. Missing config still
 * fails loudly on the first real request in production.
 */
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
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24 hours

/**
 * Create a signed JWT and set it as an httpOnly cookie.
 */
export async function createAdminSession(user: AdminSession): Promise<string> {
    const token = await new SignJWT({
        id: user.id,
        email: user.email,
        name: user.name,
    })
        .setProtectedHeader({ alg: "HS256" })
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

    return token;
}

/**
 * Verify the admin session cookie and return the payload.
 * Returns null if the session is invalid or expired.
 */
export async function verifyAdminSession(): Promise<AdminSession | null> {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, getJwtSecret());
        return {
            id: payload.id as number,
            email: payload.email as string,
            name: payload.name as string,
        };
    } catch {
        return null;
    }
}

/**
 * Destroy the admin session by clearing the cookie.
 */
export async function destroyAdminSession(): Promise<void> {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
}
