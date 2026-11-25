import "server-only";
import { type NextRequest } from "next/server";
import { RateLimiterDrizzle, RateLimiterRes } from "rate-limiter-flexible";
import { db } from "@/db";
import { rateLimits } from "@/db/schema";
import { getConfig } from "@/lib/app-config";
import { FAIL_CLOSED_SCOPES, RATE_LIMIT_DEFAULTS, RateLimitScope } from "@/config/rate-limit";

export function getClientIp(request: NextRequest): string {
    const realIp = request.headers.get("x-real-ip")?.trim();
    if (realIp) return realIp;
    const forwarded = request.headers.get("x-forwarded-for");
    if (forwarded) return forwarded.split(",")[0].trim();
    return "unknown";
}

const limiters = new Map<string, RateLimiterDrizzle>();

async function limiterFor(scope: RateLimitScope): Promise<RateLimiterDrizzle> {
    const defaults = RATE_LIMIT_DEFAULTS[scope];
    const [maxRaw, windowRaw] = await Promise.all([
        getConfig(`${scope}_rate_limit_max`, String(defaults.max)),
        getConfig(`${scope}_rate_limit_window_minutes`, String(defaults.windowMinutes)),
    ]);
    const points = Math.max(1, parseInt(maxRaw, 10) || defaults.max);
    const duration = Math.max(1, parseInt(windowRaw, 10) || defaults.windowMinutes) * 60;
    const cacheKey = `${scope}:${points}:${duration}`;
    let limiter = limiters.get(cacheKey);
    if (!limiter) {
        limiter = new RateLimiterDrizzle({ storeClient: db, schema: rateLimits, keyPrefix: scope, points, duration });
        limiters.set(cacheKey, limiter);
    }
    return limiter;
}

export async function checkRateLimit(scope: RateLimitScope, subject: string): Promise<{ limited: boolean }> {
    try {
        await (await limiterFor(scope)).consume(subject);
        return { limited: false };
    } catch (err) {
        if (err instanceof RateLimiterRes) return { limited: true };
        console.error("[rate-limit] check failed:", err);
        return { limited: FAIL_CLOSED_SCOPES.has(scope) };
    }
}

export async function resetRateLimit(scope: RateLimitScope, subject: string): Promise<void> {
    try {
        await (await limiterFor(scope)).delete(subject);
    } catch (err) {
        console.error("[rate-limit] reset failed:", err);
    }
}
