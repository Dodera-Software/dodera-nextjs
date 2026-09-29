"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import type { DragEvent, MouseEvent, ReactNode } from "react";
import { ArrowRight, CalendarClock, Facebook, Globe, Instagram, Lock, MapPin, TriangleAlert } from "lucide-react";
import { mockPolicy } from "@/config/leads";
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
}

/**
 * One card on the Leads board: the business, its category and location, its
 * Facebook / Instagram / Google Maps links, and where its mock site stands.
 * Click opens the lead; drag moves it between columns.
 */
export function LeadCard({ lead, dragging, onDragStart, onDragEnd }: LeadCardProps) {
    const router = useRouter();
    const href = `/admin/leads/${lead.id}`;
    const followUp = lead.follow_up_on;
    const mock = mockStatus(lead);
    const onRequest = mockPolicy(lead.country) === "on-request";
    const place = [lead.city, lead.country].filter(Boolean).join(", ");
    const incomplete = !lead.country || !lead.category || !lead.google_maps_url;

    return (
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
                <span
                    className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${MOCK_TONE_CLASSES[mock.tone]}`}
                    title={mock.hint}
                >
                    <Globe className="w-3 h-3" />
                    {mock.label}
                </span>
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
