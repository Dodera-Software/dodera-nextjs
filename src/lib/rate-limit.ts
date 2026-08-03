import "server-only";
import { type NextRequest } from "next/server";
import { and, count, eq, gte, lt } from "drizzle-orm";
import { db } from "@/db";
import { rateLimitLog } from "@/db/schema";
import { getConfig } from "@/lib/app-config";

/* ── IP extraction ────────────────────────────────────────── */

/**
 * Extracts the real client IP from standard forwarded headers.
 * Falls back to "unknown" if none are present.
 */
export function getClientIp(request: NextRequest): string {
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) {
        // x-forwarded-for may be a comma-separated list; first entry is the client
        return forwarded.split(",")[0].trim();
    }
    return request.headers.get("x-real-ip") ?? "unknown";
}

/* ── Rate limit check ─────────────────────────────────────── */

export interface RateLimitResult {
    limited: boolean;
    /** How many requests remain in the current window (approximate). */
    remaining: number;
}

/**
 * Checks whether `ip` has exceeded the rate limit for `endpoint`.
 * If not limited, logs the attempt in `rate_limit_log`.
 *
 * Config keys (from app_config table):
 *   `{endpoint}_rate_limit_max`             — max requests per window (default 5)
 *   `{endpoint}_rate_limit_window_minutes`  — rolling window in minutes (default 60)
 *
 * Example keys for the contact form:
 *   contact_rate_limit_max = 5
 *   contact_rate_limit_window_minutes = 60
 *
 * Falls back to allowing the request if the DB check itself fails.
 */
export async function checkRateLimit(
    endpoint: string,
    ip: string,
): Promise<RateLimitResult> {
    try {
        const [maxRaw, windowRaw] = await Promise.all([
            getConfig(`${endpoint}_rate_limit_max`, "5"),
            getConfig(`${endpoint}_rate_limit_window_minutes`, "60"),
        ]);

        const max = Math.max(1, parseInt(maxRaw, 10) || 5);
        const windowMinutes = Math.max(1, parseInt(windowRaw, 10) || 60);
        const windowStart = new Date(Date.now() - windowMinutes * 60 * 1000);

        const key = `${endpoint}:${ip}`;

        // Count requests in the current window
        const [row] = await db
            .select({ count: count() })
            .from(rateLimitLog)
            .where(and(eq(rateLimitLog.key, key), gte(rateLimitLog.createdAt, windowStart)));

        const current = row?.count ?? 0;

        if (current >= max) {
            return { limited: true, remaining: 0 };
        }

        // Log this attempt (fire-and-forget — never fails silently)
        db.insert(rateLimitLog)
            .values({ key })
            .catch((err) => console.warn("[rate-limit] Insert failed:", err));

        // Opportunistically clean entries older than the window to keep the table lean
        db.delete(rateLimitLog)
            .where(
                and(
                    eq(rateLimitLog.key, key),
                    lt(rateLimitLog.createdAt, new Date(Date.now() - windowMinutes * 60 * 1000 * 2)),
                ),
            )
            .catch(() => {});

        return { limited: false, remaining: max - current - 1 };
    } catch (err) {
        console.error("[rate-limit] Unexpected error:", err);
        return { limited: false, remaining: 1 };
    }
}
