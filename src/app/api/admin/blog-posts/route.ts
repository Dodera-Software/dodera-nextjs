import "server-only";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllPosts } from "@/lib/cms";

/** Strip HTML tags produced by prismic.asHTML() to get plain text for AI context. */
function stripHtml(html: string): string {
    return html
        .replace(/<br\s*\/?>/gi, "\n")
        .replace(/<\/p>/gi, "\n\n")
        .replace(/<\/h[1-6]>/gi, "\n\n")
        .replace(/<\/li>/gi, "\n")
        .replace(/<[^>]+>/g, "")
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/&nbsp;/g, " ")
        .replace(/\n{3,}/g, "\n\n")
        .trim();
}

export async function GET() {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    try {
        // getAllPosts() is the same function that powers the live /blog page —
        // it only returns what is actually published and visible on the website.
        const posts = await getAllPosts();

        const summaries = posts.map((post) => ({
            uid: post.slug,
            title: post.title,
            excerpt: post.excerpt ?? "",
            category: post.category ?? "",
            date: post.date ?? null,
            read_time: post.readTime ?? "",
            tags: post.tags ?? [],
            url: `https://doderasoft.com/blog/${post.slug}`,
            image: post.image ?? null,
            body_plain: post.body ? stripHtml(post.body).slice(0, 4000) : "",
        }));

        return NextResponse.json({ status: "success", posts: summaries });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Failed to fetch blog posts.";
        console.error("[admin/blog-posts] Error:", message);
        return NextResponse.json({ status: "error", message }, { status: 502 });
    }
}
