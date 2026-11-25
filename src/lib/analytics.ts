import type { AnalyticsEvent } from "@/config/analytics";

type EventData = Record<string, string | number>;

declare global {
    interface Window {
        umami?: { track: (event: string, data?: EventData) => void };
    }
}

export function track(event: AnalyticsEvent, data?: EventData) {
    window.umami?.track(event, data);
}

export function trackAttrs(event: AnalyticsEvent, data: EventData = {}): Record<string, string> {
    return {
        "data-umami-event": event,
        ...Object.fromEntries(Object.entries(data).map(([key, value]) => [`data-umami-event-${key}`, String(value)])),
    };
}
