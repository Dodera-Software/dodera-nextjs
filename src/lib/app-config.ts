import "server-only";
import { supabase } from "@/lib/supabase";
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

    const { data, error } = await supabase
        .from("app_config")
        .select("value")
        .eq("key", key)
        .single();

    if (error || !data) return fallback;

    setCached(key, data.value);
    return data.value;
}

/**
 * Read all config rows, returned as a plain Record<string, string>.
 */
export async function getAllConfig(): Promise<Record<string, string>> {
    const { data, error } = await supabase
        .from("app_config")
        .select("key, value, description, updated_at")
        .order("key");

    if (error || !data) return {};
    return Object.fromEntries(data.map((row) => [row.key, row.value]));
}

/**
 * Read all config rows with metadata (for the admin UI).
 */
export async function getAllConfigRows(): Promise<ConfigRow[]> {
    const { data, error } = await supabase
        .from("app_config")
        .select("key, value, description, updated_at")
        .order("key");

    if (error || !data) return [];
    return data as ConfigRow[];
}

/**
 * Upsert a config value. Also invalidates the local cache entry.
 */
export async function setConfig(key: string, value: string): Promise<void> {
    const { error } = await supabase
        .from("app_config")
        .upsert({ key, value, updated_at: new Date().toISOString() });

    if (error) throw new Error(error.message);
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
