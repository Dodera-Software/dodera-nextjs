import type { NextConfig } from "next";

/* ── Mockup previews ─────────────────────────────────────────
 * Requests on <slug>.<MOCKUPS_DOMAIN> serve user-uploaded HTML, so the
 * site-wide security headers (X-Frame-Options: DENY etc.) must not apply
 * there — the serving route sets its own. `headers()` is evaluated at build
 * time, which is why MOCKUPS_DOMAIN is also a build arg in the Dockerfile.
 */
const mockupsDomain = (process.env.MOCKUPS_DOMAIN ?? "").trim().toLowerCase().split(":")[0];
const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const mockupHostPattern = mockupsDomain
    ? `(?:[a-z0-9-]+\\.)?${escapeRegExp(mockupsDomain)}`
    : null;

const securityHeaders = [
  /* Prevent clickjacking */
  { key: "X-Frame-Options", value: "DENY" },
  /* Stop MIME-type sniffing */
  { key: "X-Content-Type-Options", value: "nosniff" },
  /* Control referrer leakage */
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  /* Disable browser features you don't use */
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  /* Force HTTPS (2 years, include subdomains, preload-eligible) */
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  /* XSS protection (legacy browsers) */
  { key: "X-XSS-Protection", value: "1; mode=block" },
  /* DNS prefetch control */
  { key: "X-DNS-Prefetch-Control", value: "on" },
];

const nextConfig: NextConfig = {
  /* ── Standalone output — required for the Docker/Coolify build ── */
  output: "standalone",

  /* ── Trailing slashes ────────────────────────────────────
   * Handled in middleware instead of by Next so that mockup hosts can
   * serve "folder/" URLs (the default redirect would strip the slash).
   */
  skipTrailingSlashRedirect: true,

  /* ── Security headers applied to every route ─────────── */
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
        // Mockup hosts set their own headers (see src/app/mockup-host).
        ...(mockupHostPattern
            ? { missing: [{ type: "host" as const, value: mockupHostPattern }] }
            : {}),
      },
    ];
  },

  /* ── Image optimisation ──────────────────────────────── */
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.prismic.io",
      },
      {
        protocol: "https",
        hostname: "*.cdn.prismic.io",
      },
    ],
  },

  /* ── Powered-by header removal ───────────────────────── */
  poweredByHeader: false,
};

export default nextConfig;
