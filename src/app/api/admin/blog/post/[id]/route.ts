import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { verifyAdminSession } from "@/lib/admin-auth";
import { editPost, editSchema } from "@/lib/blog-store";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    if (!(await verifyAdminSession())) return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    const parsed = editSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ status: "error", message: "Invalid fields.", issues: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
    }
    const row = await editPost(Number((await params).id), parsed.data);
    return row ? NextResponse.json({ status: "success", post: row }) : NextResponse.json({ status: "error", message: "Post not found." }, { status: 404 });
}
