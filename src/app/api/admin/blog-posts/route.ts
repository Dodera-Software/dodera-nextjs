import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllPosts } from "@/lib/cms";

// ── GET /api/admin/blog-posts ──────────────────────────────
// Returns a lightweight list of blog posts for the admin UI.
// Full body HTML is included so the send-email page can load
// a post directly into the rich-text editor.
export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    try {
        const posts = await getAllPosts();

        const mapped = posts.map((p) => ({
            slug: p.slug,
            title: p.title,
            excerpt: p.excerpt,
            date: p.date,
            category: p.category,
            image: p.image ?? null,
        }));

        return NextResponse.json({ status: "success", posts: mapped });
    } catch (err) {
        console.error("[admin/blog-posts] Failed to fetch posts:", err);
        return NextResponse.json(
            { status: "error", message: "Failed to fetch blog posts." },
            { status: 500 },
        );
    }
}
