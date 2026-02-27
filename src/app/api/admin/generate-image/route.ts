import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { generateImageUrl } from "@/lib/generate-image-service";

export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    let body: Record<string, unknown> = {};
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { status: "error", message: "Invalid JSON body." },
            { status: 400 },
        );
    }

    try {
        const { url, prompt, size } = await generateImageUrl(body);
        return NextResponse.json({ status: "success", url, prompt, size });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Image generation failed.";
        return NextResponse.json({ status: "error", message }, { status: 502 });
    }
}
