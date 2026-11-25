import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { listAllPosts } from "@/lib/blog-store";

export async function GET() {
    if (!(await verifyAdminSession())) return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    return NextResponse.json({ status: "success", posts: await listAllPosts() });
}
