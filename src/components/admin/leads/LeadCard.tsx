"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DragEvent, MouseEvent, ReactNode } from "react";
import { useState } from "react";
import {
    ArrowRight,
    CalendarClock,
    Facebook,
    Globe,
    Instagram,
    Link2,
    Loader2,
    Lock,
    MapPin,
    TriangleAlert,
} from "lucide-react";
import { mockPolicy } from "@/config/leads";
import { outreachRuleFor, type OutreachRule } from "@/config/outreach-rules";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import {
    FOLLOW_UP_CLASSES,
    MOCK_TONE_CLASSES,
    externalHref,
    followUpState,
    formatEur,
    formatFollowUp,
    mockStatus,
} from "@/lib/leads-client";
import type { Lead } from "@/types/admin";

interface LeadCardProps {
    lead: Lead;
    dragging: boolean;
    onDragStart: (e: DragEvent<HTMLDivElement>, lead: Lead) => void;
    onDragEnd: () => void;
    /** Link the suggested Mockups project (same name as the business) to this lead. */
    onLinkSuggested: (lead: Lead) => Promise<void>;
}

/**
 * One card on the Leads board: the business, its category and location, its
 * Facebook / Instagram / Google Maps links, and where its mock site stands.
 * Click opens the lead; drag moves it between columns.
 */
export function LeadCard({ lead, dragging, onDragStart, onDragEnd, onLinkSuggested }: LeadCardProps) {
    const router = useRouter();
    const href = `/admin/leads/${lead.id}`;
    const followUp = lead.follow_up_on;
    const mock = mockStatus(lead);
    const onRequest = mockPolicy(lead.country) === "on-request";
    const place = [lead.city, lead.country].filter(Boolean).join(", ");
    const incomplete = !lead.country || !lead.category || !lead.google_maps_url;
    const rule = outreachRuleFor(lead.country);
    const note = lead.latest_note ?? lead.notes;
    const suggested = !lead.preview ? lead.suggested_preview : null;
    const [linking, setLinking] = useState(false);

    async function linkSuggested(e: MouseEvent) {
        e.stopPropagation();
        if (linking) return;
        setLinking(true);
        try {
            await onLinkSuggested(lead);
        } finally {
            setLinking(false);
        }
    }

    const card = (
        <div
            draggable
            onDragStart={(e) => onDragStart(e, lead)}
            onDragEnd={onDragEnd}
            onClick={() => router.push(href)}
            data-lead-card={lead.id}
            className={`rounded-lg border border-border bg-card p-3 space-y-2 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 transition-colors ${dragging ? "opacity-40" : ""}`}
        >
            <div className="flex items-start justify-between gap-2">
                <Link
                    href={href}
                    onClick={(e) => e.stopPropagation()}
                    draggable={false}
                    className="font-medium text-sm leading-snug break-words min-w-0 hover:text-primary focus-visible:outline-none focus-visible:underline"
                >
                    {lead.name}
                </Link>
                {lead.value_eur !== null && (
                    <span className="text-xs font-medium text-muted-foreground flex-shrink-0">
                        {formatEur(lead.value_eur)}
                    </span>
                )}
            </div>

            {(lead.category || place) && (
                <div className="space-y-0.5 text-xs text-muted-foreground">
                    {lead.category && <p className="truncate">{lead.category}</p>}
                    {place && (
                        <p className="flex items-center gap-1 min-w-0">
                            <MapPin className="w-3 h-3 flex-shrink-0" />
                            <span className="truncate">{place}</span>
                            {onRequest && (
                                <span title={`${lead.country}: mock only on request`} className="flex-shrink-0">
                                    <Lock className="w-3 h-3 text-violet-400" aria-label="Mock only on request" />
                                </span>
                            )}
                        </p>
                    )}
                </div>
            )}

            {incomplete && (
                <p className="flex items-center gap-1.5 text-[11px] text-amber-500">
                    <TriangleAlert className="w-3 h-3 flex-shrink-0" />
                    Add {[!lead.country && "country", !lead.category && "category", !lead.google_maps_url && "Maps link"].filter(Boolean).join(", ")}
                </p>
            )}

            {(lead.facebook_url || lead.instagram_url || lead.google_maps_url) && (
                <div className="flex items-center gap-1">
                    {lead.facebook_url && (
                        <CardLink href={lead.facebook_url} label="Facebook">
                            <Facebook className="w-3.5 h-3.5" />
                        </CardLink>
                    )}
                    {lead.instagram_url && (
                        <CardLink href={lead.instagram_url} label="Instagram">
                            <Instagram className="w-3.5 h-3.5" />
                        </CardLink>
                    )}
                    {lead.google_maps_url && (
                        <CardLink href={lead.google_maps_url} label="Google Maps">
                            <MapPin className="w-3.5 h-3.5" />
                        </CardLink>
                    )}
                </div>
            )}

            {lead.next_step && (
                <p className="flex items-start gap-1.5 text-xs">
                    <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2">{lead.next_step}</span>
                </p>
            )}

            <div className="flex flex-wrap items-center gap-1.5">
                {suggested ? (
                    <button
                        type="button"
                        onClick={linkSuggested}
                        draggable={false}
                        disabled={linking}
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
                        title={`Link the existing mockup "${suggested.name}"${suggested.url ? ` (${suggested.url})` : ""}`}
                    >
                        {linking ? <Loader2 className="w-3 h-3 animate-spin" /> : <Link2 className="w-3 h-3" />}
                        Link mock{suggested.live_version !== null ? ` v${suggested.live_version}` : ""}
                    </button>
                ) : (
                    <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${MOCK_TONE_CLASSES[mock.tone]}`}
                        title={mock.hint}
                    >
                        <Globe className="w-3 h-3" />
                        {mock.label}
                    </span>
                )}
                {note && (
                    <span
                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-amber-500/10 text-amber-500"
                        title={note}
                        aria-label={`Note: ${note}`}
                    >
                        <span className="flex items-center justify-center w-3 h-3 rounded-full bg-amber-500 text-[9px] font-bold text-white leading-none">!</span>
                        Note
                    </span>
                )}
                {followUp && (
                    <span
                        className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${FOLLOW_UP_CLASSES[followUpState(followUp)]}`}
                        title="Follow up on"
                    >
                        <CalendarClock className="w-3 h-3" />
                        {formatFollowUp(followUp)}
                    </span>
                )}
            </div>
        </div>
    );

    if (!rule) return card;

    // Hovering a card shows its country's outreach rule (closed while dragging).
    return (
        <Tooltip delayDuration={500} open={dragging ? false : undefined}>
            <TooltipTrigger asChild>{card}</TooltipTrigger>
            <TooltipContent side="right" align="start" className="max-w-xs p-3">
                <OutreachRuleSummary rule={rule} />
            </TooltipContent>
        </Tooltip>
    );
}

/** The card's hover text: when to send the mock in this country, and the rule behind it. */
function OutreachRuleSummary({ rule }: { rule: OutreachRule }) {
    const direct = rule.approach === "direct";
    return (
        <div className="space-y-1.5 text-xs">
            <p className={`font-medium ${direct ? "text-emerald-500" : "text-violet-400"}`}>
                {direct
                    ? `${rule.name}: the mock link can go with the first message.`
                    : `${rule.name}: the first message goes out without the mock — send it only once they ask.`}
            </p>
            {rule.rule && <p className="text-muted-foreground">{rule.rule}</p>}
            {rule.include.length > 0 && (
                <ul className="list-disc pl-4 text-muted-foreground">
                    {rule.include.map((item) => <li key={item}>{item}</li>)}
                </ul>
            )}
        </div>
    );
}

/** Small icon link that opens in a new tab without opening the card. */
function CardLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
    return (
        <a
            href={externalHref(href)}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            onClick={(e: MouseEvent) => e.stopPropagation()}
            title={`Open ${label}`}
            aria-label={`Open ${label}`}
            className="p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
        >
            {children}
        </a>
    );
}
