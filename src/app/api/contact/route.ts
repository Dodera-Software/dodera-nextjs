import { NextRequest, NextResponse, after } from "next/server";
import { supabase } from "@/lib/supabase";
import { z } from "zod";
import { generateFollowUp, type LeadData } from "@/lib/contact-followup-service";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

/* ── Honeypot field name (must match ContactForm) ─────────── */
const HONEYPOT_FIELD = "website_url";

/* ── Validation schema (mirrors client-side rules) ────────── */
const contactSchema = z.object({
    name: z
        .string()
        .trim()
        .min(2, "Name must be at least 2 characters.")
        .max(80, "Name must be at most 80 characters."),
    email: z
        .string()
        .trim()
        .email("Enter a valid email address.")
        .max(254),
    company: z
        .string()
        .trim()
        .max(120, "Company must be at most 120 characters.")
        .optional()
        .default(""),
    phone: z
        .string()
        .trim()
        .max(20, "Phone must be at most 20 characters.")
        .optional()
        .default(""),
    message: z
        .string()
        .trim()
        .min(10, "Message must be at least 10 characters.")
        .max(2000, "Message must be at most 2000 characters."),
    // Honeypot - must be empty; bots fill this, humans don't
    [HONEYPOT_FIELD]: z.string().optional().default(""),
});

/* ── Slack notification ────────────────────────────────────── */

interface SlackLeadData extends LeadData {
    followUp?: string;
}

async function notifySlack(data: SlackLeadData) {
    const webhookUrl = process.env.SLACK_LEADS_WEBHOOK_URL;
    if (!webhookUrl || webhookUrl.includes("XXXX")) return;

    const lines: string[] = [
        `*New lead from the website* 🎉`,
        ``,
        `*Name:* ${data.name}`,
        `*Email:* ${data.email}`,
    ];
    if (data.company) lines.push(`*Company:* ${data.company}`);
    if (data.phone) lines.push(`*Phone:* ${data.phone}`);
    lines.push(``, `*Message:*`, `>${data.message.replace(/\n/g, "\n>")}`);

    if (data.followUp) {
        lines.push(
            ``,
            `*💡 Suggested follow-up:*`,
            `>${data.followUp.replace(/\n/g, "\n>")}`,
        );
    }

    await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: lines.join("\n") }),
    }).catch((err) => console.error("Slack notification failed:", err));
}

/* ── Route handler ────────────────────────────────────────── */

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();

        /* Validate */
        const parsed = contactSchema.safeParse(body);
        if (!parsed.success) {
            return NextResponse.json(
                { status: "error", errors: parsed.error.flatten().fieldErrors },
                { status: 400 },
            );
        }

        /* Honeypot - silent success so bots don't know they were blocked */
        if (parsed.data[HONEYPOT_FIELD]) {
            return NextResponse.json({ status: "success", message: "Message received!" });
        }

        /* IP rate limit */
        const ip = getClientIp(request);
        const { limited } = await checkRateLimit("contact", ip);
        if (limited) {
            return NextResponse.json(
                { status: "error", message: "Too many requests. Please try again later." },
                { status: 429 },
            );
        }

        /* Persist */
        const { error } = await supabase.from("contacts").insert({
            name: parsed.data.name,
            email: parsed.data.email,
            company: parsed.data.company || null,
            phone: parsed.data.phone || null,
            message: parsed.data.message,
        });

        if (error) {
            console.error("Supabase insert error:", error);
            return NextResponse.json(
                { status: "error", message: "Failed to save your message. Please try again." },
                { status: 500 },
            );
        }

        /* Notify Slack + AI follow-up - runs after response is sent, keeps the function alive on Vercel */
        after(async () => {
            const lead: LeadData = {
                name: parsed.data.name,
                email: parsed.data.email,
                company: parsed.data.company ?? "",
                phone: parsed.data.phone ?? "",
                message: parsed.data.message,
            };
            const followUp = await generateFollowUp(lead);
            await notifySlack({ ...lead, followUp });
        });

        return NextResponse.json({ status: "success", message: "Message received!" });
    } catch {
        return NextResponse.json(
            { status: "error", message: "Invalid request." },
            { status: 400 },
        );
    }
}

