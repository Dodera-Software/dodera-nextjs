import { NextRequest, NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { apiTokens } from "@/db/schema";
import {
    PROTECTED_API_ROUTES,
    PUBLIC_API_ROUTES,
} from "@/config/api-auth";
import { MOCKUP_INTERNAL_PREFIX, parseMockupHost } from "@/config/mockups";

/* ── Helpers ─────────────────────────────────────────────────── */

async function sha256(input: string): Promise<string> {
    const encoded = new TextEncoder().encode(input);
    const hashBuffer = await crypto.subtle.digest("SHA-256", encoded);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

function jsonError(message: string, status: number) {
    return NextResponse.json(
        { status: "error", message },
        { status },
    );
}

/* ── Route matching ─────────────────────────────────────────── */

function isProtectedRoute(pathname: string): boolean {
    // Explicitly public routes always bypass
    if (PUBLIC_API_ROUTES.some((r) => pathname === r || pathname.startsWith(r + "/"))) {
        return false;
    }
    // Check if the pathname matches any protected prefix
    return PROTECTED_API_ROUTES.some(
        (prefix) => pathname === prefix || pathname.startsWith(prefix + "/"),
    );
}

/* ── Middleware ──────────────────────────────────────────────── */

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // --- Mockup previews: <slug>.<MOCKUPS_DOMAIN> ---
    // Every request on a mockup subdomain is served by the internal
    // /mockup-host route; nothing else of the app is exposed on those hosts.
    const mockupHost = parseMockupHost(request.headers.get("host"), process.env.MOCKUPS_DOMAIN);
    if (mockupHost.isMockupHost) {
        if (!mockupHost.slug) {
            // Bare mockups domain (or an invalid label): send visitors to the main site.
            return NextResponse.redirect(process.env.SITE_URL || "https://doderasoft.com", 302);
        }
        const url = request.nextUrl.clone();
        url.pathname = `${MOCKUP_INTERNAL_PREFIX}/${mockupHost.slug}${pathname === "/" ? "" : pathname}`;
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set("x-mockup-slug", mockupHost.slug);
        requestHeaders.set("x-mockup-path", pathname);
        return NextResponse.rewrite(url, { request: { headers: requestHeaders } });
    }

    // The internal serving route must never be reachable on the main site.
    if (pathname === MOCKUP_INTERNAL_PREFIX || pathname.startsWith(`${MOCKUP_INTERNAL_PREFIX}/`)) {
        return new NextResponse("Not found", { status: 404 });
    }

    // --- Trailing-slash redirect ---
    // Next's built-in redirect is disabled (skipTrailingSlashRedirect) so
    // mockup hosts can serve "folder/" URLs; keep the default behaviour here.
    // Built by hand rather than via nextUrl.clone(): NextURL remembers that
    // the original URL had a trailing slash and would put it straight back.
    // Redirects from middleware must be absolute, so use the proxy's
    // forwarded scheme/host (Traefik sets both) with a plain-host fallback.
    if (pathname.length > 1 && pathname.endsWith("/")) {
        const proto = (request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", ""))
            .split(",")[0]
            .trim();
        const host = (request.headers.get("x-forwarded-host") ?? request.headers.get("host") ?? request.nextUrl.host)
            .split(",")[0]
            .trim();
        const location = `${proto}://${host}${pathname.replace(/\/+$/, "")}${request.nextUrl.search}`;
        return NextResponse.redirect(location, 308);
    }

    // --- Origin check for public contact endpoint ---
    // Browsers always send Origin on cross-site POSTs; reject anything that
    // isn't the site itself so scrapers/bots can't call the API directly.
    if (pathname === "/api/contact" && request.method === "POST") {
        const origin = request.headers.get("origin");
        const siteUrl = (process.env.SITE_URL ?? "").replace(/\/$/, "");
        const isLocalhost = origin?.startsWith("http://localhost") || origin?.startsWith("http://127.0.0.1");
        if (origin && siteUrl && !isLocalhost) {
            try {
                const originHostname = new URL(origin).hostname.replace(/^www\./, "");
                const siteHostname = new URL(siteUrl).hostname.replace(/^www\./, "");
                if (originHostname !== siteHostname) {
                    return jsonError("Forbidden.", 403);
                }
            } catch {
                return jsonError("Forbidden.", 403);
            }
        }
    }

    // Only intercept protected API routes
    if (!isProtectedRoute(pathname)) {
        return NextResponse.next();
    }

    // --- Bearer token extraction ---
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return jsonError(
            "Missing or malformed Authorization header. Expected: Bearer <token>",
            401,
        );
    }

    const plainToken = authHeader.slice(7);

    if (!plainToken || plainToken.length < 10) {
        return jsonError("Invalid token format.", 401);
    }

    // --- Token verification ---
    const tokenHash = await sha256(plainToken);

    let data: { id: number; name: string; expiresAt: Date | null; revokedAt: Date | null } | undefined;
    try {
        [data] = await db
            .select({
                id: apiTokens.id,
                name: apiTokens.name,
                expiresAt: apiTokens.expiresAt,
                revokedAt: apiTokens.revokedAt,
            })
            .from(apiTokens)
            .where(eq(apiTokens.tokenHash, tokenHash))
            .limit(1);
    } catch (err) {
        console.error("Middleware: token lookup failed:", err);
        return jsonError("Internal server configuration error.", 500);
    }

    if (!data) {
        return jsonError("Invalid API token.", 401);
    }

    if (data.revokedAt) {
        return jsonError("This API token has been revoked.", 401);
    }

    if (data.expiresAt && data.expiresAt < new Date()) {
        return jsonError("This API token has expired.", 401);
    }

    // Update last_used_at (fire-and-forget)
    db.update(apiTokens)
        .set({ lastUsedAt: new Date() })
        .where(eq(apiTokens.id, data.id))
        .catch(() => {});

    // Forward token metadata in headers so route handlers can access it
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("x-api-token-id", String(data.id));
    requestHeaders.set("x-api-token-name", data.name);

    return NextResponse.next({
        request: { headers: requestHeaders },
    });
}

/* ── Matcher ────────────────────────────────────────────────── */
// Runs on every request except Next's static assets: API routes need the
// token check, and any path may belong to a mockup subdomain.
// runtime "nodejs" — the token lookup talks to Postgres via pg,
// which requires the Node runtime (self-hosted, so no edge anyway).
export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
    runtime: "nodejs",
};
