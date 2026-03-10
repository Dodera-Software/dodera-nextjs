import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { setConfig } from "@/lib/app-config";
import { z } from "zod";

const SUBJECT_KEY = "welcome_email_subject";
const HTML_KEY = "welcome_email_html";

/* ── GET /api/admin/welcome-email-template ───────────────── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("app_config")
        .select("key, value")
        .in("key", [SUBJECT_KEY, HTML_KEY]);

    if (error) {
        console.error("[welcome-email-template] Supabase read error:", error);
        return NextResponse.json({ status: "error", message: "Failed to load template." }, { status: 500 });
    }

    const rows = data ?? [];
    const subject = rows.find((r) => r.key === SUBJECT_KEY)?.value ?? "";
    const html = rows.find((r) => r.key === HTML_KEY)?.value ?? "";

    return NextResponse.json({ status: "success", subject, html });
}

/* ── PUT /api/admin/welcome-email-template ───────────────── */
const putSchema = z.object({
    subject: z.string().min(1, "Subject is required."),
    html: z.string().min(1, "HTML body is required."),
});

export async function PUT(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = putSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { status: "error", errors: parsed.error.flatten().fieldErrors },
            { status: 400 },
        );
    }

    try {
        // Save both keys atomically via setConfig (also keeps the in-memory cache coherent)
        await Promise.all([
            setConfig(SUBJECT_KEY, parsed.data.subject),
            setConfig(HTML_KEY, parsed.data.html),
        ]);
        return NextResponse.json({ status: "success" });
    } catch (err) {
        console.error("[welcome-email-template] Save error:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to save template." },
            { status: 500 },
        );
    }
}
