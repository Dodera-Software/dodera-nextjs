import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

const VALID_PLATFORMS = ["linkedin", "facebook", "instagram"] as const;
type Platform = (typeof VALID_PLATFORMS)[number];

/* ── GET /api/admin/social-post-examples?platform=linkedin ── */
export async function GET(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const platform = request.nextUrl.searchParams.get("platform") as Platform | null;
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
        return NextResponse.json(
            { status: "error", message: "Missing or invalid platform query param." },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("social_post_examples")
        .select("id, platform, content, created_at")
        .eq("platform", platform)
        .order("created_at", { ascending: true });

    if (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 502 });
    }

    return NextResponse.json({ status: "success", examples: data });
}

/* ── POST /api/admin/social-post-examples ─────────────────── */
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const { platform, content } = body ?? {};

    if (!platform || !VALID_PLATFORMS.includes(platform as Platform)) {
        return NextResponse.json({ status: "error", message: "Invalid platform." }, { status: 400 });
    }
    if (!content || typeof content !== "string" || content.trim().length < 10) {
        return NextResponse.json(
            { status: "error", message: "Content must be at least 10 characters." },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("social_post_examples")
        .insert({ platform, content: content.trim() })
        .select("id, platform, content, created_at")
        .single();

    if (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 502 });
    }

    return NextResponse.json({ status: "success", example: data }, { status: 201 });
}
