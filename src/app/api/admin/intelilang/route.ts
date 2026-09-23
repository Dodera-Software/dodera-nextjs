import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getIntelilangSettings, IntelilangError, saveIntelilangSettings } from "@/lib/intelilang";

/* ── GET /api/admin/intelilang — the webhook address, and whether a secret is stored (never the secret) ── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }
    return NextResponse.json({ status: "success", data: await getIntelilangSettings() });
}

const putSchema = z.object({
    url: z.string().max(500),
    /** Left out or empty: keep the stored secret. */
    secret: z.string().max(200).optional(),
});

/* ── PUT /api/admin/intelilang — save the address and, optionally, a new secret ── */
export async function PUT(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }
    const parsed = putSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ status: "error", errors: parsed.error.flatten().fieldErrors }, { status: 400 });
    }
    try {
        const data = await saveIntelilangSettings(parsed.data);
        return NextResponse.json({ status: "success", message: "InteliLang settings saved.", data });
    } catch (err) {
        if (err instanceof IntelilangError) {
            return NextResponse.json({ status: "error", message: err.message }, { status: err.status });
        }
        console.error("InteliLang settings error:", err);
        return NextResponse.json({ status: "error", message: "Failed to save the InteliLang settings." }, { status: 500 });
    }
}
