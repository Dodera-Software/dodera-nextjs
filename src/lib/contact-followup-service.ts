import "server-only";
import OpenAI from "openai";
import { supabase } from "@/lib/supabase";
import { FOLLOWUP_SYSTEM_PROMPT } from "@/app/api/contact/prompts";
import { getContactFollowupModel, getContactFollowupDailyLimit, getContactFollowupEnabled } from "@/lib/app-config";

/* ── Static limits (not user-configurable) ───────────────── */

/** Minimum message length - too short to extract useful context. */
const MIN_MSG_LENGTH = 30;

/** Max characters sent to AI - caps token usage on long messages. */
const MAX_INPUT_CHARS = 600;

/** Hard timeout in ms - AI slowness never delays the Slack notification. */
const TIMEOUT_MS = 8_000;

/** o-series reasoning models do not accept a temperature parameter. */
function isReasoningModel(model: string): boolean {
    return /^o[1-9]/.test(model);
}

/* ── Types ────────────────────────────────────────────────── */

export interface LeadData {
    name: string;
    email: string;
    company: string;
    phone: string;
    service_type?: string;
    budget?: string;
    message: string;
}

/* ── Daily limit check (Supabase-backed, serverless-safe) ─── */

/**
 * Returns true if the daily AI call limit has been reached.
 * Limit is read from the DB config (contact_followup_daily_limit).
 * Falls back to false (allow) if the check itself fails.
 */
async function isDailyLimitReached(): Promise<boolean> {
    const dailyLimit = await getContactFollowupDailyLimit();
    if (dailyLimit <= 0) return false;

    try {
        const todayUtc = new Date().toISOString().slice(0, 10); // "YYYY-MM-DD"
        const { count, error } = await supabase
            .from("contacts")
            .select("id", { count: "exact", head: true })
            .gte("created_at", `${todayUtc}T00:00:00Z`)
            .lt("created_at", `${todayUtc}T23:59:59Z`);

        if (error) {
            console.warn("[contact-followup] Daily limit check failed:", error.message);
            return false;
        }

        return (count ?? 0) >= dailyLimit;
    } catch {
        return false;
    }
}

/* ── Main export ──────────────────────────────────────────── */

/**
 * Generates a suggested follow-up email for a new lead using OpenAI.
 *
 * Guardrails:
 *  - Requires OPENAI_API_KEY to be set.
 *  - Skipped if CONTACT_FOLLOWUP_MODEL is empty (opt-out).
 *  - Skipped when the daily limit (CONTACT_FOLLOWUP_DAILY_LIMIT) is reached.
 *  - Skipped for very short messages (< 30 chars).
 *  - Lead context is capped at 600 chars before being sent to the model.
 *  - Hard 8 s timeout via AbortController.
 *  - All failures are swallowed - never blocks the Slack notification.
 */
export async function generateFollowUp(data: LeadData): Promise<string | undefined> {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) return undefined;
    if (data.message.length < MIN_MSG_LENGTH) return undefined;

    const [enabled, model] = await Promise.all([
        getContactFollowupEnabled(),
        getContactFollowupModel(),
    ]);
    if (!enabled || !model) return undefined;

    if (await isDailyLimitReached()) {
        console.log("[contact-followup] Daily limit reached - skipping AI follow-up.");
        return undefined;
    }

    try {
        const openai = new OpenAI({ apiKey });

        const context = [
            `Name: ${data.name}`,
            data.company ? `Company: ${data.company}` : null,
            data.phone ? `Phone: ${data.phone}` : null,
            `Email: ${data.email}`,
            `Message: ${data.message.slice(0, MAX_INPUT_CHARS)}`,
        ]
            .filter(Boolean)
            .join("\n");

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const completion = await openai.chat.completions.create(
            {
                model,
                max_completion_tokens: 220,
                ...(!isReasoningModel(model) && { temperature: 0.7 }),
                messages: [
                    { role: "system", content: FOLLOWUP_SYSTEM_PROMPT },
                    { role: "user", content: context },
                ],
            },
            { signal: controller.signal },
        );
        clearTimeout(timeout);

        return completion.choices[0]?.message?.content?.trim() ?? undefined;
    } catch (err) {
        console.error("[contact-followup] Generation skipped:", err);
        return undefined;
    }
}
