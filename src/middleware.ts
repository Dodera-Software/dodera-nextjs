import { NextRequest, NextResponse } from "next/server";
import {
    PROTECTED_API_ROUTES,
    PUBLIC_API_ROUTES,
} from "@/config/api-auth";
import { MOCKUP_INTERNAL_PREFIX, parseMockupHost } from "@/config/mockups";
import { authenticateRequest } from "@/lib/api-auth";

const ADMIN_API_PREFIX = "/api/admin";
const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

function jsonError(message: string, status: number) {
    return NextResponse.json(
        { status: "error", message },
        { status },
    );
}

function isCrossOriginRequest(request: NextRequest): boolean {
    const fetchSite = request.headers.get("sec-fetch-site");
    if (fetchSite) return fetchSite !== "same-origin" && fetchSite !== "none";
    const origin = request.headers.get("origin");
    if (!origin) return false;
    try {
        return new URL(origin).host !== request.headers.get("host");
    } catch {
        return true;
    }
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

    if (
        (pathname === ADMIN_API_PREFIX || pathname.startsWith(`${ADMIN_API_PREFIX}/`)) &&
        !SAFE_METHODS.has(request.method) &&
        isCrossOriginRequest(request)
    ) {
        return jsonError("Cross-origin requests are not allowed.", 403);
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

    const auth = await authenticateRequest(request);
    return auth.valid ? NextResponse.next() : auth.errorResponse;
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
