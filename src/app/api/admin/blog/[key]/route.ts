import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { BlogStatus } from "@/config/blog";
import { verifyAdminSession } from "@/lib/admin-auth";
import { deletePosts, setStatus } from "@/lib/blog-store";

type Context = { params: Promise<{ key: string }> };

const statusSchema = z.object({ status: z.enum(BlogStatus) });
const unauthorized = () => NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
const notFound = () => NextResponse.json({ status: "error", message: "Post not found." }, { status: 404 });

export async function PATCH(request: NextRequest, { params }: Context) {
    if (!(await verifyAdminSession())) return unauthorized();
    const parsed = statusSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) return NextResponse.json({ status: "error", message: "Invalid status." }, { status: 400 });
    return (await setStatus((await params).key, parsed.data.status)) ? NextResponse.json({ status: "success" }) : notFound();
}

export async function DELETE(_request: NextRequest, { params }: Context) {
    if (!(await verifyAdminSession())) return unauthorized();
    return (await deletePosts((await params).key)) ? NextResponse.json({ status: "success" }) : notFound();
}
