import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { z } from "zod";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { getConfig } from "@/lib/app-config";
import { sendEmail, buildSubscriberEmail, injectUnsubscribeFooter } from "@/lib/email-service";

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

        /* IP rate limit */
        const ip = getClientIp(request);
        const { limited } = await checkRateLimit("newsletter", ip);
        if (limited) {
            return NextResponse.json(
                { status: "error", message: "Too many requests. Please try again later." },
                { status: 429 },
            );
        }

        /* Check if already subscribed */
        try {
            const existing = await db
                .select({ id: subscribers.id })
                .from(subscribers)
                .where(eq(subscribers.email, email))
                .limit(1);

            if (existing.length > 0) {
                return NextResponse.json(
                    { status: "success", message: "You're already subscribed!" },
                );
            }
        } catch (err) {
            console.error("Subscriber lookup error:", err);
            return NextResponse.json(
                { status: "error", message: "Something went wrong. Please try again." },
                { status: 500 },
            );
        }

        /* Insert new subscriber */
        try {
            await db.insert(subscribers).values({ email });
        } catch (err) {
            console.error("Subscriber insert error:", err);
            return NextResponse.json(
                { status: "error", message: "Failed to subscribe. Please try again." },
                { status: 500 },
            );
        }

        /* Send welcome email (fire-and-forget — don't block the response) */
        (async () => {
            try {
                const [subject, bodyHtml] = await Promise.all([
                    getConfig("welcome_email_subject", "Welcome to the Dodera newsletter! 🎉"),
                    getConfig("welcome_email_html", "<p>Thank you for subscribing!</p>"),
                ]);

                if (subject && bodyHtml) {
                    const isFullDoc = /^\s*<!doctype/i.test(bodyHtml) || /^\s*<html/i.test(bodyHtml);
                    const html = isFullDoc
                        ? injectUnsubscribeFooter(bodyHtml, email)
                        : buildSubscriberEmail(bodyHtml, email);
                    await sendEmail({ to: email, subject, html });
                }
            } catch (err) {
                // Log but never let a failed welcome email break the subscription
                console.error("[newsletter] Failed to send welcome email:", err);
            }
        })();

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
