/**
 * Browser-side helpers for the Leads admin pages (no server imports).
 */
import { format, parseISO } from "date-fns";

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

/** "acme.com" → "https://acme.com" so it can be opened from the card. */
export function websiteHref(website: string): string {
    return /^https?:\/\//i.test(website) ? website : `https://${website}`;
}
