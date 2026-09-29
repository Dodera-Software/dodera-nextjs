/**
 * Suggested outreach messages for a lead (Admin → Leads → lead page).
 *
 * Only one message is suggested at a time:
 *   - before/at first contact: A (with the preview link) or B (without it),
 *     picked by the country's approach in OUTREACH_RULES;
 *   - once they're interested: one follow-up.
 * They are starting points — edit freely before sending.
 *
 * Every message names the sender; where a country rule applies, it also
 * offers an easy way to say no (see the `include` lists in outreach-rules.ts).
 */
import { mockPolicy } from "@/config/leads";
import { outreachRuleFor, PREVIEW_LINK_NOTE } from "@/config/outreach-rules";
import type { Lead } from "@/types/admin";

export const OUTREACH_COMPANY = "Dodera Software";

export type OutreachMessageKind = "A" | "B" | "follow-up";

export interface OutreachMessage {
    kind: OutreachMessageKind;
    title: string;
    /** Why this message (country approach / stage). */
    reason: string;
    text: string;
    /** The text contains the preview link. */
    includesLink: boolean;
}

const OPT_OUT = "If you'd rather not hear from me, just let me know and I won't message you again.";
const NO_LINK_YET = "[preview link — deploy the mock first]";

function signature(senderName: string | null): string {
    const name = senderName?.trim();
    const personal = name && !name.toLowerCase().includes("dodera") ? `${name}\n` : "";
    return `Best regards,\n${personal}${OUTREACH_COMPANY}`;
}

/** Countries with no relevant rule (USA, UAE) don't need the opt-out line; everyone else gets it. */
function needsOptOut(country: string | null): boolean {
    const rule = outreachRuleFor(country);
    return !rule || rule.rule !== null;
}

function paragraphs(...parts: (string | false | null | undefined)[]): string {
    return parts.filter(Boolean).join("\n\n");
}

/** The message to suggest for this lead right now, or null when there's nothing to send (Won / Lost). */
export function suggestedMessage(lead: Lead, senderName: string | null): OutreachMessage | null {
    const link = lead.preview?.url && lead.preview.live_version !== null ? lead.preview.url : null;
    const optOut = needsOptOut(lead.country) ? OPT_OUT : null;
    const country = lead.country?.trim() || "this country";
    const sign = signature(senderName);

    if (lead.stage === "won" || lead.stage === "lost") return null;

    if (lead.stage === "interested" || lead.stage === "negotiation") {
        const alreadySent = Boolean(lead.mockup_sent_at);
        return {
            kind: "follow-up",
            title: "Follow-up after they're interested",
            reason: alreadySent ? "They already have the preview link." : "Send the preview link now.",
            includesLink: !alreadySent,
            text: paragraphs(
                "Thanks for your interest, and for getting back to me!",
                alreadySent
                    ? "I'm glad the preview caught your attention."
                    : `Here's the free website preview I put together for ${lead.name}:\n${link ?? NO_LINK_YET}`,
                !alreadySent && PREVIEW_LINK_NOTE,
                "Everything in it can be adjusted — layout, colours, text and photos — so it ends up exactly how you'd like it. Tell me what you think and what you'd like changed, and we can go through the details and the price whenever it suits you.",
                sign,
            ),
        };
    }

    if (mockPolicy(lead.country) === "with-message") {
        return {
            kind: "A",
            title: "Message A — with the preview link",
            reason: `${country}: the link can go with the first message.`,
            includesLink: true,
            text: paragraphs(
                "Hello!",
                "I found you online and thought I'd reach out, as we're currently looking for new clients to build great relationships with, and we'd be glad to offer you quality web services.",
                "To make it easier to explain, I've put together a free website preview for you, which can be adjusted/changed at any time to be exactly how you'd like it. You have the link below. I'd love to hear what you think!",
                link ?? NO_LINK_YET,
                PREVIEW_LINK_NOTE,
                optOut,
                sign,
            ),
        };
    }

    return {
        kind: "B",
        title: "Message B — without the link",
        reason: `${country}: ask first, send the link once they reply positively.`,
        includesLink: false,
        text: paragraphs(
            "Hello!",
            `I found ${lead.name} online and thought I'd reach out. I'm with ${OUTREACH_COMPANY} — we build websites for businesses, and we're currently looking for new clients to build great relationships with.`,
            `I've prepared a free website preview for ${lead.name} to show what we could do for you. There's no cost and no obligation — if you'd like to see it, just reply and I'll send you the link.`,
            optOut,
            sign,
        ),
    };
}
