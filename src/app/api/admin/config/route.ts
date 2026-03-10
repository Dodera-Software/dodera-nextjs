import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllConfigRows, setConfig } from "@/lib/app-config";
import { z } from "zod";

export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const rows = await getAllConfigRows();
    return NextResponse.json({ status: "success", data: rows });
}

const patchSchema = z.object({
    key: z.string().min(1),
    value: z.string(),
});

export async function PATCH(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const parsed = patchSchema.safeParse(body);
    if (!parsed.success) {
        return NextResponse.json(
            { status: "error", errors: parsed.error.flatten().fieldErrors },
            { status: 400 },
        );
    }

    try {
        await setConfig(parsed.data.key, parsed.data.value);
        return NextResponse.json({ status: "success" });
    } catch (err) {
        console.error("Config update error:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to update config." },
            { status: 500 },
        );
    }
}
