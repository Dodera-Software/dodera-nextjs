import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { autoPost } from "@/lib/auto-post-service";

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
        // body is optional
    }

    const result = await autoPost({
        publish: body.publish as boolean | undefined,
        authorName: body.author_name as string | undefined,
        lang: body.lang as string | undefined,
        saveToPrismic: body.save_to_prismic as boolean | undefined,
    });

    return NextResponse.json(result, { status: result.status === "success" ? 201 : 502 });
}
