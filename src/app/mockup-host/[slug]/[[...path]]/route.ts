import { NextRequest, NextResponse } from "next/server";
import { readMockupFile, resolveMockupFile } from "@/lib/mockups";

/* ── GET <slug>.<MOCKUPS_DOMAIN>/<path> ──────────────────────────
 * The middleware rewrites every request on a mockup subdomain to
 * /mockup-host/<slug>/… and tags it with x-mockup-slug / x-mockup-path.
 * Requests without those headers (someone hitting this path on the main
 * site) are refused, so mockup code never runs on the doderasoft.com origin.
 */

export const dynamic = "force-dynamic";

const ONE_YEAR = 60 * 60 * 24 * 365;

/** Origins allowed to embed a mockup in an <iframe>: the admin dashboard. */
function frameAncestors(): string {
    const origins = new Set<string>(["'self'"]);
    const site = process.env.SITE_URL?.trim();
    if (site) {
        try {
            const u = new URL(site);
            origins.add(u.origin);
            const bare = u.hostname.replace(/^www\./, "");
            origins.add(`${u.protocol}//${bare}`);
            origins.add(`${u.protocol}//www.${bare}`);
        } catch {
            /* ignore malformed SITE_URL */
        }
    }
    if (process.env.NODE_ENV !== "production") origins.add("http://localhost:*");
    return [...origins].join(" ");
}

function baseHeaders(): Record<string, string> {
    return {
        "X-Robots-Tag": "noindex, nofollow, noarchive",
        "X-Content-Type-Options": "nosniff",
        "Referrer-Policy": "strict-origin-when-cross-origin",
        "Strict-Transport-Security": `max-age=${ONE_YEAR}`,
        "Content-Security-Policy": `frame-ancestors ${frameAncestors()}`,
    };
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
}

function htmlPage(status: number, title: string, body: string): NextResponse {
    const t = escapeHtml(title);
    const b = escapeHtml(body);
    const html =
        `<!doctype html><html lang="en"><head><meta charset="utf-8">` +
        `<meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex">` +
        `<title>${t}</title><style>body{margin:0;min-height:100vh;display:grid;place-items:center;` +
        `font:16px/1.5 system-ui,sans-serif;background:#0b0f19;color:#e5e7eb}main{text-align:center;padding:2rem}` +
        `h1{font-size:1.25rem;margin:0 0 .5rem}p{margin:0;color:#9ca3af}</style></head>` +
        `<body><main><h1>${t}</h1><p>${b}</p></main></body></html>`;
    return new NextResponse(html, {
        status,
        headers: { ...baseHeaders(), "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" },
    });
}

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string; path?: string[] }> },
) {
    const { slug } = await params;
    const taggedSlug = request.headers.get("x-mockup-slug");
    const pathname = request.headers.get("x-mockup-path");
    if (!taggedSlug || taggedSlug !== slug || pathname === null) {
        return htmlPage(404, "Not found", "This page is only available on a mockup subdomain.");
    }

    let resolved;
    try {
        resolved = await resolveMockupFile(slug, pathname);
    } catch (err) {
        console.error("[mockups] resolve failed:", err);
        return htmlPage(500, "Something went wrong", "The mockup could not be loaded. Please try again in a moment.");
    }

    switch (resolved.kind) {
        case "not-found":
            return htmlPage(404, "Not found", "There is nothing at this address.");
        case "empty":
            return htmlPage(404, resolved.projectName, "Nothing has been deployed to this mockup yet.");
        case "redirect":
            return new NextResponse(null, {
                status: 302,
                headers: { ...baseHeaders(), Location: resolved.location + (request.nextUrl.search || "") },
            });
    }

    // Stored bytes never change, so the row id is a valid strong ETag.
    const etag = `"m${resolved.id}"`;
    const headers: Record<string, string> = {
        ...baseHeaders(),
        "Content-Type": resolved.contentType,
        ETag: etag,
        // Always revalidate (a cheap 304) so a redeploy shows up immediately.
        "Cache-Control": "no-cache",
    };

    if (request.headers.get("if-none-match") === etag) {
        return new NextResponse(null, { status: 304, headers });
    }

    const data = await readMockupFile(resolved.id);
    if (!data) return htmlPage(404, "Not found", "There is nothing at this address.");

    headers["Content-Length"] = String(data.byteLength);
    return new NextResponse(new Uint8Array(data), { status: 200, headers });
}
