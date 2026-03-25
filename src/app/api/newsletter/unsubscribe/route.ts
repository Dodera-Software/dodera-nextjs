import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
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

        /* Delete from Supabase (idempotent - no error if not found) */
        const { error } = await supabase
            .from("subscribers")
            .delete()
            .eq("email", normalizedEmail);

        if (error) {
            console.error("[unsubscribe] Supabase delete error:", error.message);
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
