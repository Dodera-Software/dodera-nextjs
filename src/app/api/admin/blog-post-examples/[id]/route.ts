import "server-only";
import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";

/* ── DELETE /api/admin/blog-post-examples/[id] ───────────────── */
export async function DELETE(
    _request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const { id } = await params;
    const numId = Number(id);
    if (!Number.isInteger(numId) || numId <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    const { error } = await supabase
        .from("blog_post_examples")
        .delete()
        .eq("id", numId);

    if (error) {
        return NextResponse.json({ status: "error", message: error.message }, { status: 502 });
    }

    return NextResponse.json({ status: "success" });
}
