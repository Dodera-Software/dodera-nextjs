import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

/* ── GET /api/admin/blog-post-examples ───────────────────────── */
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const { data, error } = await supabase
        .from("blog_post_examples")
        .select("id, content, created_at")
        .order("created_at", { ascending: true });

    if (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 502 });
    }

    return NextResponse.json({ status: "success", examples: data });
}

/* ── POST /api/admin/blog-post-examples ──────────────────────── */
export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const body = await request.json().catch(() => null);
    const { content } = body ?? {};

    if (!content || typeof content !== "string" || content.trim().length < 10) {
        return NextResponse.json(
            { status: "error", message: "Content must be at least 10 characters." },
            { status: 400 },
        );
    }

    const { data, error } = await supabase
        .from("blog_post_examples")
        .insert({ content: content.trim() })
        .select("id, content, created_at")
        .single();

    if (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 502 });
    }

    return NextResponse.json({ status: "success", example: data }, { status: 201 });
}
