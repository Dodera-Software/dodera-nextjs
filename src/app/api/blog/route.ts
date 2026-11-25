import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { blogPostPath } from "@/config/blog";
import { BlogConflict, draftSchema, listAllPosts, saveDraft } from "@/lib/blog-store";
import type { Locale } from "@/i18n/config";

export async function GET() {
    const rows = await listAllPosts();
    return NextResponse.json({
        status: "success",
        posts: rows.map((row) => ({
            key: row.translationKey,
            locale: row.locale,
            slug: row.slug,
            status: row.status,
            title: row.title,
            category: row.category,
            tags: row.tags,
            sources: row.sources.map((s) => s.url),
            publishedAt: row.publishedAt,
            createdAt: row.createdAt,
        })),
    });
}

export async function POST(request: NextRequest) {
    const parsed = draftSchema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
        return NextResponse.json({ status: "error", message: "Invalid post.", issues: z.flattenError(parsed.error).fieldErrors }, { status: 400 });
    }

    try {
        const rows = await saveDraft(parsed.data);
        const origin = request.nextUrl.origin;
        return NextResponse.json({
            status: "success",
            key: parsed.data.key,
            preview: Object.fromEntries(rows.map((row) => [row.locale, `${origin}${blogPostPath(row.slug, row.locale as Locale)}`])),
            admin: `${origin}/admin/blog`,
        });
    } catch (err) {
        if (err instanceof BlogConflict) return NextResponse.json({ status: "error", message: err.message }, { status: 409 });
        throw err;
    }
}
