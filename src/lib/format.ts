import { format, formatDistanceToNow, parseISO, isValid } from "date-fns";

/**
 * Format an ISO date string for display.
 *
 * @param dateStr - ISO date string (e.g. "2024-03-05" or "2024-03-05T10:00:00Z")
 * @param pattern - date-fns format pattern (default: "MMM d, yyyy")
 * @returns Formatted string, or the original value if parsing fails.
 */
export function formatDate(dateStr: string, pattern = "MMM d, yyyy"): string {
    try {
        const date = parseISO(dateStr);
        if (!isValid(date)) return dateStr;
        return format(date, pattern);
    } catch {
        return dateStr;
    }
}

/**
 * Format a date as a short human-readable string.
 * Example: "Mar 5, 2026"
 */
export function formatDateShort(dateStr: string): string {
    return formatDate(dateStr, "MMM d, yyyy");
}

/**
 * Format a date with time component. Handles null (returns "-").
 * Example: "Mar 5, 2026 09:00"
 */
export function formatDateTime(dateStr: string | null, pattern = "MMM d, yyyy HH:mm"): string {
    if (!dateStr) return "\u2014";
    return formatDate(dateStr, pattern);
}

/**
 * Format a date as a relative time string (e.g. "3 days ago").
 */
export function formatTimeAgo(dateStr: string): string {
    try {
        const date = parseISO(dateStr);
        if (!isValid(date)) return dateStr;
        return formatDistanceToNow(date, { addSuffix: true });
    } catch {
        return dateStr;
    }
}

/**
 * Format a date as full ISO for CSV / machine consumption.
 * Example: "2026-03-05T09:00:00.000Z"
 */
export function formatDateISO(dateStr: string): string {
    try {
        const date = parseISO(dateStr);
        if (!isValid(date)) return dateStr;
        return date.toISOString();
    } catch {
        return dateStr;
    }
}
