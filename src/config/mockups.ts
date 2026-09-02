/**
 * Mockup previews — shared constants/helpers (safe for client and server).
 *
 * Every mockup project is served on its own subdomain:
 *   https://<slug>.<MOCKUPS_DOMAIN>/   e.g. https://venetian-nail.demo.doderasoft.com/
 *
 * `MOCKUPS_DOMAIN` is a server env var; the API hands the value to the UI.
 */

/** DNS label rules: lowercase alphanumerics + dashes, 1–63 chars, no leading/trailing dash. */
export const SLUG_RE = /^[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?$/;

/** Labels that must never become a mockup subdomain. */
export const RESERVED_SLUGS = new Set([
    "www", "api", "admin", "app", "mail", "smtp", "imap", "pop", "ftp", "sftp",
    "ns1", "ns2", "cdn", "static", "assets", "dev", "staging", "test", "vps",
    "hooks", "preview", "demo", "mockups", "autoconfig", "autodiscover", "localhost",
]);

/** Internal path prefix the middleware rewrites mockup-host requests to. */
export const MOCKUP_INTERNAL_PREFIX = "/mockup-host";

export const MOCKUP_LIMITS = {
    /** Max number of files in a single deployment (after zip expansion). */
    maxFiles: 500,
    /** Max size of a single file. */
    maxFileBytes: 25 * 1024 * 1024,
    /** Max total size of a deployment. */
    maxTotalBytes: 80 * 1024 * 1024,
    /** Non-active deployments kept per project (older ones are pruned). */
    keepDeployments: 10,
} as const;

/** Turn a free-form project name into a slug candidate. */
export function slugify(input: string): string {
    return input
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "") // strip diacritics
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "")
        .slice(0, 63)
        .replace(/-+$/g, "");
}

/** Returns an error message, or null when the slug is acceptable. */
export function validateSlug(slug: string): string | null {
    if (!slug) return "Subdomain is required.";
    if (!SLUG_RE.test(slug)) {
        return "Use only lowercase letters, numbers and dashes (max 63 characters, no leading/trailing dash).";
    }
    if (RESERVED_SLUGS.has(slug)) return `"${slug}" is reserved.`;
    return null;
}

/** Public URL of a mockup project. `domain` may include a port for local dev. */
export function mockupUrl(domain: string, slug: string): string {
    const host = `${slug}.${domain}`;
    const isLocal = /(^|\.)localhost(:\d+)?$/.test(domain) || /^127\.0\.0\.1/.test(domain);
    return `${isLocal ? "http" : "https"}://${host}/`;
}

export interface MockupHostMatch {
    /** True when the request's Host is the mockups domain or one of its subdomains. */
    isMockupHost: boolean;
    /** The project slug (first label), or null for the bare domain / invalid labels. */
    slug: string | null;
}

/**
 * Classify an incoming Host header against the configured mockups domain.
 * Ports are ignored on both sides so `demo.localhost:3000` works in dev.
 */
export function parseMockupHost(hostHeader: string | null | undefined, domain: string | null | undefined): MockupHostMatch {
    const none: MockupHostMatch = { isMockupHost: false, slug: null };
    if (!hostHeader || !domain) return none;

    const host = hostHeader.split(":", 1)[0].toLowerCase();
    const base = domain.split(":", 1)[0].toLowerCase();
    if (!base) return none;

    if (host === base) return { isMockupHost: true, slug: null };
    if (!host.endsWith(`.${base}`)) return none;

    const label = host.slice(0, -(base.length + 1));
    if (label.includes(".") || !SLUG_RE.test(label)) return { isMockupHost: true, slug: null };
    return { isMockupHost: true, slug: label };
}
