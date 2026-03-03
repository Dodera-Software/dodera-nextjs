import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { generateSocialPost } from "@/lib/social-post-service";
import type { SocialPlatform, BlogContext } from "@/app/api/admin/social-post/prompts";

const VALID_PLATFORMS: SocialPlatform[] = ["linkedin", "facebook", "instagram"];

export async function POST(request: NextRequest) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json(
            { status: "error", message: "Not authenticated." },
            { status: 401 },
        );
    }

    let body: Record<string, unknown> = {};
    try {
        body = await request.json();
    } catch {
        return NextResponse.json(
            { status: "error", message: "Invalid JSON body." },
            { status: 400 },
        );
    }

    const platform = body.platform as SocialPlatform;
    if (!platform || !VALID_PLATFORMS.includes(platform)) {
        return NextResponse.json(
            {
                status: "error",
                message: `Invalid platform. Must be one of: ${VALID_PLATFORMS.join(", ")}.`,
            },
            { status: 400 },
        );
    }

    const blog = body.blog as BlogContext | undefined;
    if (!blog?.title || !blog?.url) {
        return NextResponse.json(
            { status: "error", message: "Missing required blog fields: title, url." },
            { status: 400 },
        );
    }

    try {
        const result = await generateSocialPost({ platform, blog });
        return NextResponse.json({ status: "success", platform: result.platform, post: result.post });
    } catch (err) {
        const message = err instanceof Error ? err.message : "Social post generation failed.";
        console.error("[api/admin/social-post] Error:", message);
        return NextResponse.json({ status: "error", message }, { status: 502 });
    }
}
