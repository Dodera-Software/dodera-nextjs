import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { sendEmail, verifySmtp } from "@/lib/email-service";

// ── POST /api/admin/send-email ─────────────────────────────
// Body: multipart/form-data
//   to         "all" | comma-separated emails
//   subject    string
//   html       string (rich HTML body)
//   files[]    optional file attachments
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json(
            { status: "error", message: "Invalid form data." },
            { status: 400 },
        );
    }

    const to = (formData.get("to") as string | null)?.trim();
    const subject = (formData.get("subject") as string | null)?.trim();
    const html = (formData.get("html") as string | null)?.trim();

    if (!to || !subject || !html) {
        return NextResponse.json(
            { status: "error", message: "Missing required fields: to, subject, html." },
            { status: 400 },
        );
    }

    // ── Build recipient list ───────────────────────────────
    let recipients: string[] = [];

    if (to === "all") {
        // Fetch all subscriber emails from Supabase
        const { data, error } = await supabase
            .from("subscribers")
            .select("email")
            .order("created_at", { ascending: true });

        if (error) {
            console.error("[send-email] Failed to fetch subscribers:", error);
            return NextResponse.json(
                { status: "error", message: "Failed to fetch subscribers." },
                { status: 500 },
            );
        }

        recipients = (data ?? []).map((r: { email: string }) => r.email);
    } else {
        recipients = to.split(",").map((e) => e.trim()).filter(Boolean);
    }

    if (recipients.length === 0) {
        return NextResponse.json(
            { status: "error", message: "No recipients found." },
            { status: 400 },
        );
    }

    // ── Build attachments ──────────────────────────────────
    const attachments: { filename: string; content: Buffer; contentType: string }[] = [];
    const fileEntries = formData.getAll("files[]");

    for (const entry of fileEntries) {
        if (entry instanceof File && entry.size > 0) {
            const buffer = Buffer.from(await entry.arrayBuffer());
            attachments.push({
                filename: entry.name,
                content: buffer,
                contentType: entry.type || "application/octet-stream",
            });
        }
    }

    // ── Send emails (one per recipient to avoid exposing addresses) ──
    let totalAccepted = 0;
    let totalRejected = 0;
    const errors: string[] = [];

    // Process in batches of 10 to avoid overwhelming the SMTP server
    const BATCH_SIZE = 10;
    for (let i = 0; i < recipients.length; i += BATCH_SIZE) {
        const batch = recipients.slice(i, i + BATCH_SIZE);

        const results = await Promise.allSettled(
            batch.map((email) =>
                sendEmail({ to: email, subject, html, attachments }),
            ),
        );

        for (const result of results) {
            if (result.status === "fulfilled") {
                totalAccepted += result.value.accepted.length;
                totalRejected += result.value.rejected.length;
                if (result.value.error) {
                    errors.push(result.value.error);
                }
            } else {
                totalRejected++;
                errors.push(result.reason?.message ?? "Unknown error");
            }
        }
    }

    return NextResponse.json({
        status: "success",
        data: {
            totalRecipients: recipients.length,
            accepted: totalAccepted,
            rejected: totalRejected,
            errors: errors.slice(0, 10), // cap error list
        },
    });
}

// ── GET /api/admin/send-email?action=verify ────────────────
export async function GET(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    const { searchParams } = new URL(request.url);
    if (searchParams.get("action") === "verify") {
        const result = await verifySmtp();
        return NextResponse.json({ status: result.ok ? "success" : "error", ...result });
    }

    return NextResponse.json({ status: "error", message: "Unknown action." }, { status: 400 });
}
