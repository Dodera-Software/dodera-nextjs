/**
 * Netlify Scheduled Function — auto-post cron
 *
 * Equivalent of the Vercel Cron job defined in vercel.json:
 *   { "path": "/api/cron/auto-post", "schedule": "0 9 * * *" }
 *
 * Runs daily at 09:00 UTC and hits the app's /api/cron/auto-post route,
 * passing the CRON_SECRET for authentication (same mechanism as Vercel).
 *
 * Required env vars (set in Netlify dashboard → Site → Environment variables):
 *   CRON_SECRET   — shared secret to authenticate the cron request
 *   SITE_URL      — the deployed site URL, e.g. https://doderasoft.com
 *                   (Netlify also sets URL automatically, used as fallback)
 */

import type { Config } from "@netlify/functions";

const handler = async () => {
    const cronSecret = process.env.CRON_SECRET;
    const siteUrl = process.env.SITE_URL || process.env.URL; // URL is auto-set by Netlify

    if (!cronSecret) {
        console.error("[netlify-cron] CRON_SECRET env var is not set.");
        return new Response(
            JSON.stringify({ status: "error", message: "CRON_SECRET not set." }),
            { status: 500 },
        );
    }

    if (!siteUrl) {
        console.error("[netlify-cron] SITE_URL / URL env var is not set.");
        return new Response(
            JSON.stringify({ status: "error", message: "SITE_URL not set." }),
            { status: 500 },
        );
    }

    const url = `${siteUrl}/api/cron/auto-post`;
    console.log(`[netlify-cron] Calling ${url}`);

    try {
        const res = await fetch(url, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${cronSecret}`,
            },
        });

        const json = await res.json();
        console.log("[netlify-cron] Response:", JSON.stringify(json));

        return new Response(JSON.stringify(json), { status: res.status });
    } catch (err) {
        console.error("[netlify-cron] Unexpected error:", err);
        return new Response(
            JSON.stringify({
                status: "error",
                message: err instanceof Error ? err.message : String(err),
            }),
            { status: 500 },
        );
    }
};

export default handler;

// ── Schedule: daily at 09:00 UTC (same as vercel.json) ──
export const config: Config = {
    schedule: "0 9 * * *",
};
