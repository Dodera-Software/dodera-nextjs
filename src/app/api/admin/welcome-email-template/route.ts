import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import { setConfig } from "@/lib/app-config";
import { z } from "zod";

const SUBJECT_KEY = "welcome_email_subject";
const HTML_KEY = "welcome_email_html";
const DESIGN_KEY = "welcome_email_design";

/* ── GET /api/admin/welcome-email-template ───────────────── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("app_config")
        .select("key, value")
        .in("key", [SUBJECT_KEY, HTML_KEY, DESIGN_KEY]);

    if (error) {
        console.error("[welcome-email-template] Supabase read error:", error);
        return NextResponse.json({ status: "error", message: "Failed to load template." }, { status: 500 });
    }

    const rows = data ?? [];
    const subject = rows.find((r) => r.key === SUBJECT_KEY)?.value ?? "";
    const html = rows.find((r) => r.key === HTML_KEY)?.value ?? "";
    const design = rows.find((r) => r.key === DESIGN_KEY)?.value ?? null;

    return NextResponse.json({ status: "success", subject, html, design });
}

/* ── PUT /api/admin/welcome-email-template ───────────────── */
const putSchema = z.object({
    subject: z.string().min(1, "Subject is required."),
    html: z.string().min(1, "HTML body is required."),
    design: z.string().optional(),
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
        const saves = [
            setConfig(SUBJECT_KEY, parsed.data.subject),
            setConfig(HTML_KEY, parsed.data.html),
        ];
        if (parsed.data.design !== undefined) {
            saves.push(setConfig(DESIGN_KEY, parsed.data.design));
        }
        await Promise.all(saves);
        return NextResponse.json({ status: "success" });
    } catch (err) {
        console.error("[welcome-email-template] Save error:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to save template." },
            { status: 500 },
        );
    }
}
