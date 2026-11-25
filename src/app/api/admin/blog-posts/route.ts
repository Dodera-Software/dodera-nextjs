import "server-only";
import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { getAllPosts } from "@/lib/blog";
import { absoluteUrl } from "@/i18n/routes";
import { blogPostPath } from "@/config/blog";
import type { AdminBlogPost } from "@/types/admin";

export async function GET() {
    if (!(await verifyAdminSession())) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const posts: AdminBlogPost[] = (await getAllPosts("en")).map((post) => ({
        slug: post.slug,
        title: post.title,
        excerpt: post.excerpt,
        category: post.category,
        date: post.date,
        tags: post.tags,
        url: absoluteUrl(blogPostPath(post.slug, "en")),
        image: absoluteUrl(post.image),
    }));

    return NextResponse.json({ status: "success", posts });
}
