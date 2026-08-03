import "server-only";
import { eq, asc } from "drizzle-orm";
import { db } from "@/db";
import { appConfig } from "@/db/schema";
import type { ConfigRow } from "@/types/admin";

/* ── In-memory cache (best-effort on serverless) ─────────── */

const CACHE_TTL_MS = 60_000; // 1 minute

const cache = new Map<string, { value: string; expiresAt: number }>();

function getCached(key: string): string | undefined {
    const entry = cache.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
        cache.delete(key);
        return undefined;
    }
    return entry.value;
}

function setCached(key: string, value: string) {
    cache.set(key, { value, expiresAt: Date.now() + CACHE_TTL_MS });
}

/* ── Core read / write ───────────────────────────────────── */

/**
 * Read a single config value by key.
 * Returns `fallback` if the key is not found or the query fails.
 */
export async function getConfig(key: string, fallback = ""): Promise<string> {
    const hit = getCached(key);
    if (hit !== undefined) return hit;

    try {
        const rows = await db
            .select({ value: appConfig.value })
            .from(appConfig)
            .where(eq(appConfig.key, key))
            .limit(1);

        if (rows.length === 0) return fallback;

        setCached(key, rows[0].value);
        return rows[0].value;
    } catch {
        return fallback;
    }
}

/**
 * Read all config rows, returned as a plain Record<string, string>.
 */
export async function getAllConfig(): Promise<Record<string, string>> {
    try {
        const rows = await db
            .select({ key: appConfig.key, value: appConfig.value })
            .from(appConfig)
            .orderBy(asc(appConfig.key));

        return Object.fromEntries(rows.map((row) => [row.key, row.value]));
    } catch {
        return {};
    }
}

/**
 * Read all config rows with metadata (for the admin UI).
 */
export async function getAllConfigRows(): Promise<ConfigRow[]> {
    try {
        const rows = await db
            .select({
                key: appConfig.key,
                value: appConfig.value,
                description: appConfig.description,
                updated_at: appConfig.updatedAt,
            })
            .from(appConfig)
            .orderBy(asc(appConfig.key));

        return rows.map((row): ConfigRow => ({
            ...row,
            updated_at: row.updated_at.toISOString(),
        }));
    } catch {
        return [];
    }
}

/**
 * Upsert a config value. Also invalidates the local cache entry.
 */
export async function setConfig(key: string, value: string): Promise<void> {
    await db
        .insert(appConfig)
        .values({ key, value, updatedAt: new Date() })
        .onConflictDoUpdate({
            target: appConfig.key,
            set: { value, updatedAt: new Date() },
        });

    setCached(key, value); // update cache immediately
}

/* ── Typed helpers for known keys ────────────────────────── */

export async function getContactFollowupModel(): Promise<string> {
    return getConfig("contact_followup_model", "gpt-4o-mini");
}

export async function getContactFollowupEnabled(): Promise<boolean> {
    const raw = await getConfig("contact_followup_enabled", "true");
    return raw.trim().toLowerCase() !== "false";
}

export async function getImageGenerationModel(): Promise<string> {
    return getConfig("image_generation_model", "dall-e-3");
}

export async function getSocialPostModel(): Promise<string> {
    return getConfig("social_post_model", "gpt-4o");
}

export async function getContactFollowupDailyLimit(): Promise<number> {
    const raw = await getConfig("contact_followup_daily_limit", "10");
    return Math.max(0, parseInt(raw, 10) || 0);
}
