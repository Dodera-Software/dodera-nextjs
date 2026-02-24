import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";

/* ── Validation schema ────────────────────────────────── */
const subscriberSchema = z.object({
    email: z
        .string()
        .trim()
        .email("Enter a valid email address.")
        .max(254),
});

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        /* Validate */
        const parsed = subscriberSchema.safeParse(body);
        if (!parsed.success) {
            const fieldErrors = parsed.error.flatten().fieldErrors;
            return NextResponse.json(
                { status: "error", errors: fieldErrors },
                { status: 400 },
            );
        }

        const email = parsed.data.email.toLowerCase();

        /* Check if already subscribed */
        const { data: existing, error: selectError } = await supabase
            .from("subscribers")
            .select("id")
            .eq("email", email)
            .maybeSingle();

        if (selectError) {
            console.error("Supabase select error:", selectError);
            return NextResponse.json(
                { status: "error", message: "Something went wrong. Please try again." },
                { status: 500 },
            );
        }

        if (existing) {
            return NextResponse.json(
                { status: "success", message: "You're already subscribed!" },
            );
        }

        /* Insert new subscriber */
        const { error: insertError } = await supabase
            .from("subscribers")
            .insert({ email });

        if (insertError) {
            console.error("Supabase insert error:", insertError);
            return NextResponse.json(
                { status: "error", message: "Failed to subscribe. Please try again." },
                { status: 500 },
            );
        }

        // TODO: Send a greeting / welcome email to the new subscriber.
        // This should be implemented later (e.g. via Resend, SendGrid, or
        // Supabase Edge Functions) to confirm the subscription and welcome
        // the user to the newsletter.

        return NextResponse.json(
            { status: "success", message: "Successfully subscribed!" },
            { status: 201 },
        );
    } catch {
        return NextResponse.json(
            { status: "error", message: "Invalid request." },
            { status: 400 },
        );
    }
}
