import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/db";
import { adminUsers } from "@/db/schema";
import { createAdminSession } from "@/lib/admin-auth";
import { checkRateLimit, getClientIp, resetRateLimit } from "@/lib/rate-limit";
import { RateLimitScope } from "@/config/rate-limit";

const BCRYPT_ROUNDS = 12;

const credentialsSchema = z.object({
    email: z.string().trim().toLowerCase().min(1).max(254),
    password: z.string().min(1).max(1024),
});

let unknownUserHash: Promise<string> | null = null;
function hashForUnknownUser(): Promise<string> {
    unknownUserHash ??= bcrypt.hash("unknown-admin-user", BCRYPT_ROUNDS);
    return unknownUserHash;
}

function tooManyAttempts() {
    return NextResponse.json(
        { status: "error", message: "Too many login attempts. Please try again later." },
        { status: 429 },
    );
}

function invalidCredentials() {
    return NextResponse.json(
        { status: "error", message: "Invalid email or password." },
        { status: 401 },
    );
}

export async function POST(request: NextRequest) {
    const { limited } = await checkRateLimit(RateLimitScope.AdminLogin, getClientIp(request));
    if (limited) return tooManyAttempts();

    const parsed = credentialsSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json(
            { status: "error", message: "Email and password are required." },
            { status: 400 },
        );
    }
    const { email, password } = parsed.data;

    if ((await checkRateLimit(RateLimitScope.AdminLoginAccount, email)).limited) return tooManyAttempts();

    try {
        const [user] = await db
            .select({
                id: adminUsers.id,
                email: adminUsers.email,
                name: adminUsers.name,
                passwordHash: adminUsers.passwordHash,
                sessionVersion: adminUsers.sessionVersion,
            })
            .from(adminUsers)
            .where(eq(adminUsers.email, email))
            .limit(1);

        const passwordMatch = await bcrypt.compare(password, user?.passwordHash ?? (await hashForUnknownUser()));
        if (!user || !passwordMatch) return invalidCredentials();

        await resetRateLimit(RateLimitScope.AdminLoginAccount, email);
        await db.update(adminUsers).set({ lastLoginAt: new Date() }).where(eq(adminUsers.id, user.id));
        await createAdminSession(user);

        return NextResponse.json({
            status: "success",
            message: "Login successful.",
            user: { id: user.id, email: user.email, name: user.name },
        });
    } catch (err) {
        console.error("[admin-login] failed:", err);
        return NextResponse.json(
            { status: "error", message: "Login failed. Please try again." },
            { status: 500 },
        );
    }
}
