import "server-only";
import { NextRequest, NextResponse } from "next/server";

/* ── Author pool ────────────────────────────────────────────── */

const AUTHORS = ["Amalia", "Denis", "Dodera Team"] as const;

function pickRandomAuthor(): string {
    return AUTHORS[Math.floor(Math.random() * AUTHORS.length)];
}

/* ── Route handler ──────────────────────────────────────────── */

/**
 * GET /api/cron/auto-post
 *
 * Invoked automatically by Vercel Cron at 09:00 UTC every day.
 * Picks a random author and forwards the request to /api/auto-post.
 *
 * Required env vars:
 *   CRON_SECRET        — set automatically by Vercel; used to validate the
 *                        incoming request is genuinely from Vercel Cron.
 *   AUTO_POST_API_TOKEN — a valid Supabase-backed API token used to
 *                         authenticate the forwarded /api/auto-post call.
 */
export async function GET(request: NextRequest) {
    /* ── 1. Verify the request comes from Vercel Cron ────────── */
    const cronSecret = process.env.CRON_SECRET;
    if (!cronSecret) {
        console.error("[cron/auto-post] CRON_SECRET env var is not set.");
        return NextResponse.json(
            { status: "error", message: "Server misconfiguration: CRON_SECRET not set." },
            { status: 500 },
        );
    }

    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json(
            { status: "error", message: "Unauthorized." },
            { status: 401 },
        );
    }

    /* ── 2. Validate API token for the forwarded call ────────── */
    const apiToken = process.env.AUTO_POST_API_TOKEN;
    if (!apiToken) {
        console.error("[cron/auto-post] AUTO_POST_API_TOKEN env var is not set.");
        return NextResponse.json(
            { status: "error", message: "Server misconfiguration: AUTO_POST_API_TOKEN not set." },
            { status: 500 },
        );
    }

    /* ── 3. Pick a random author ─────────────────────────────── */
    const author = pickRandomAuthor();

    /* ── 4. Call /api/auto-post ──────────────────────────────── */
    const origin = `${request.nextUrl.protocol}//${request.nextUrl.host}`;
    const url = new URL("/api/auto-post", origin);
    url.searchParams.set("author_name", author);
    url.searchParams.set("publish", "true");

    console.log(`[cron/auto-post] Triggering auto-post — author="${author}"`);

    try {
        const res = await fetch(url.toString(), {
            method: "GET",
            headers: {
                Authorization: `Bearer ${apiToken}`,
            },
        });

        const json = await res.json() as Record<string, unknown>;

        if (!res.ok) {
            console.error("[cron/auto-post] auto-post failed:", json);
            return NextResponse.json(
                { status: "error", message: "auto-post call failed.", details: json },
                { status: res.status },
            );
        }

        console.log(`[cron/auto-post] Success — uid="${json.uid}", author="${author}"`);

        return NextResponse.json(
            { status: "success", author, uid: json.uid, auto_post_response: json },
            { status: 200 },
        );
    } catch (err) {
        console.error("[cron/auto-post] Unexpected error:", err);
        return NextResponse.json(
            {
                status: "error",
                message: "Unexpected error while calling auto-post.",
                details: err instanceof Error ? err.message : String(err),
            },
            { status: 500 },
        );
    }
}
