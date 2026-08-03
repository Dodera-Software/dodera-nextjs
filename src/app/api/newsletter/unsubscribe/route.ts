import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { z } from "zod";

const schema = z.object({
    email: z.string().trim().email(),
    token: z.string().min(1),
});

/**
 * DELETE /api/newsletter/unsubscribe
 *
 * Body: { email: string; token: string }
 *
 * Validates the HMAC token, then removes the subscriber from Supabase.
 * Returns 200 regardless of whether the email was actually in the DB
 * (prevents email enumeration).
 */
export async function DELETE(request: NextRequest) {
    try {
        const body = await request.json();

        const parsed = schema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { status: "error", message: "Invalid request parameters." },
                { status: 400 },
            );
        }

        const { email, token } = parsed.data;
        const normalizedEmail = email.toLowerCase().trim();

        /* Verify HMAC token */
        if (!verifyUnsubscribeToken(normalizedEmail, token)) {
            return NextResponse.json(
                { status: "error", message: "Invalid or expired unsubscribe link." },
                { status: 403 },
            );
        }

        /* Delete (idempotent — no error if not found) */
        try {
            await db.delete(subscribers).where(eq(subscribers.email, normalizedEmail));
        } catch (err) {
            console.error("[unsubscribe] Delete error:", err);
            return NextResponse.json(
                { status: "error", message: "Failed to unsubscribe. Please try again." },
                { status: 500 },
            );
        }

        console.log(`[unsubscribe] Removed subscriber: ${normalizedEmail}`);

        return NextResponse.json(
            { status: "success", message: "You have been unsubscribed successfully." },
            { status: 200 },
        );
    } catch {
        return NextResponse.json(
            { status: "error", message: "Invalid request." },
            { status: 400 },
        );
    }
}
