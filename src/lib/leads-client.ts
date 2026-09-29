/**
 * Browser-side helpers for the Leads admin pages (no server imports).
 */
import { useEffect, useState } from "react";
import { format, parseISO } from "date-fns";
import { COMMON_COUNTRIES, mockPolicy, OUTREACH_STAGES } from "@/config/leads";
import type { Lead } from "@/types/admin";

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function formatEur(value: number): string {
    return eur.format(value);
}

/** Today as YYYY-MM-DD in the viewer's timezone (follow-up dates have no time). */
export function todayIso(): string {
    return format(new Date(), "yyyy-MM-dd");
}

export type FollowUpState = "overdue" | "today" | "upcoming";

export function followUpState(date: string): FollowUpState {
    const today = todayIso();
    if (date < today) return "overdue";
    if (date === today) return "today";
    return "upcoming";
}

export const FOLLOW_UP_CLASSES: Record<FollowUpState, string> = {
    overdue: "bg-destructive/10 text-destructive",
    today: "bg-amber-500/10 text-amber-500",
    upcoming: "bg-muted text-muted-foreground",
};

export function formatFollowUp(date: string): string {
    const state = followUpState(date);
    if (state === "today") return "Today";
    return format(parseISO(date), "MMM d");
}

export interface LeadSuggestions {
    countries: string[];
    categories: string[];
    cities: string[];
}

/** Autocomplete values: what's already on the board first, then common countries. */
export function useLeadSuggestions(): LeadSuggestions {
    const [data, setData] = useState<LeadSuggestions>({ countries: [...COMMON_COUNTRIES], categories: [], cities: [] });
    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/leads/suggestions")
            .then((res) => res.json())
            .then((body) => {
                if (cancelled || body?.status !== "success") return;
                const used: LeadSuggestions = body.data;
                setData({
                    countries: [...new Set([...used.countries, ...COMMON_COUNTRIES])],
                    categories: used.categories,
                    cities: used.cities,
                });
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);
    return data;
}

/* ── Mock status (card badge + lead page) ─────────────────── */

export type MockTone = "muted" | "ready" | "sent" | "attention" | "waiting";

export interface MockStatus {
    label: string;
    tone: MockTone;
    /** One line explaining what to do next, for tooltips and the lead page. */
    hint: string;
}

export const MOCK_TONE_CLASSES: Record<MockTone, string> = {
    muted: "bg-muted text-muted-foreground",
    ready: "bg-sky-400/10 text-sky-500",
    sent: "bg-emerald-500/10 text-emerald-500",
    attention: "bg-amber-500/10 text-amber-500",
    waiting: "bg-violet-400/10 text-violet-400",
};

/**
 * Where the lead's mock site stands in the outreach flow. The mock is built
 * for everyone; outside the "on request" countries it goes with the first
 * message, inside them only once the business is interested.
 */
export function mockStatus(lead: Lead): MockStatus {
    const onRequest = mockPolicy(lead.country) === "on-request";
    const reached = OUTREACH_STAGES.has(lead.stage);
    const live = lead.preview?.live_version ?? null;

    if (lead.mockup_sent_at) {
        return { label: live !== null ? `Mock v${live} sent` : "Mock sent", tone: "sent", hint: "The business has the preview link." };
    }
    if (!lead.preview) {
        return {
            label: "No mock",
            tone: lead.stage === "mockup" || reached ? "attention" : "muted",
            hint: "Create the preview project and deploy the mock site.",
        };
    }
    if (live === null) {
        return { label: "Mock not deployed", tone: "attention", hint: "Deploy the mock site to get a working link." };
    }
    if (!reached) {
        return {
            label: `Mock v${live} ready`,
            tone: "ready",
            hint: onRequest
                ? `${lead.country}: the first message goes out without the mock — send it only if they ask.`
                : "It goes out with the first message — moving the card to Contacted marks it as sent.",
        };
    }
    if (onRequest && lead.stage === "contacted") {
        return {
            label: "Mock on request",
            tone: "waiting",
            hint: `${lead.country}: don't attach the mock yet — send it once they're interested.`,
        };
    }
    if (lead.stage === "lost") {
        return { label: "Mock not sent", tone: "muted", hint: "The mock was never sent." };
    }
    return {
        label: "Send the mock",
        tone: "attention",
        hint: onRequest
            ? "They're interested — send the preview link and mark it as sent."
            : "The mock should have gone with the first message — send the link and mark it as sent.",
    };
}

/** Links saved before they were normalized may lack a scheme ("acme.com"). */
export function externalHref(link: string): string {
    return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}
