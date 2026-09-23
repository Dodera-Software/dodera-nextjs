import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { IntelilangError, sendToIntelilang } from "@/lib/intelilang";

/* ── POST /api/admin/intelilang/test — send one signed message to check the address and secret ── */
export async function POST() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }
    try {
        await sendToIntelilang({
            // One entry, updated by every test, so tests don't pile up in the project's memory.
            id: "dodera-admin-connection-test",
            title: "Dodera admin is connected",
            body: `The Dodera admin panel can send deployments to this project. Last checked by ${session.email}.`,
            author: session.email,
        });
        return NextResponse.json({ status: "success", message: "InteliLang received the test message." });
    } catch (err) {
        if (err instanceof IntelilangError) {
            return NextResponse.json({ status: "error", message: err.message }, { status: err.status });
        }
        console.error("InteliLang test error:", err);
        return NextResponse.json({ status: "error", message: "The test message couldn't be sent." }, { status: 500 });
    }
}
