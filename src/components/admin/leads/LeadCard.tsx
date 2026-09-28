"use client";

import Link from "next/link";
import type { DragEvent } from "react";
import { CalendarClock, Globe, User, ArrowRight } from "lucide-react";
import { FOLLOW_UP_CLASSES, followUpState, formatEur, formatFollowUp } from "@/lib/leads-client";
import type { Lead } from "@/types/admin";

interface LeadCardProps {
    lead: Lead;
    dragging: boolean;
    onDragStart: (e: DragEvent<HTMLAnchorElement>, lead: Lead) => void;
    onDragEnd: () => void;
}

/** One card on the Leads board. Click opens the lead; drag moves it between columns. */
export function LeadCard({ lead, dragging, onDragStart, onDragEnd }: LeadCardProps) {
    const followUp = lead.follow_up_on;

    return (
        <Link
            href={`/admin/leads/${lead.id}`}
            draggable
            onDragStart={(e) => onDragStart(e, lead)}
            onDragEnd={onDragEnd}
            data-lead-card={lead.id}
            className={`block rounded-lg border border-border bg-card p-3 space-y-2 shadow-sm cursor-grab active:cursor-grabbing hover:border-primary/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring transition-colors ${dragging ? "opacity-40" : ""}`}
        >
            <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-sm leading-snug break-words min-w-0">{lead.name}</p>
                {lead.value_eur !== null && (
                    <span className="text-xs font-medium text-muted-foreground flex-shrink-0">
                        {formatEur(lead.value_eur)}
                    </span>
                )}
            </div>

            {lead.contact_name && (
                <p className="flex items-center gap-1.5 text-xs text-muted-foreground truncate">
                    <User className="w-3 h-3 flex-shrink-0" />
                    {lead.contact_name}
                </p>
            )}

            {lead.next_step && (
                <p className="flex items-start gap-1.5 text-xs">
                    <ArrowRight className="w-3 h-3 mt-0.5 flex-shrink-0 text-muted-foreground" />
                    <span className="line-clamp-2">{lead.next_step}</span>
                </p>
            )}

            {(followUp || lead.preview || lead.source) && (
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                    {followUp && (
                        <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${FOLLOW_UP_CLASSES[followUpState(followUp)]}`}
                            title="Follow up on"
                        >
                            <CalendarClock className="w-3 h-3" />
                            {formatFollowUp(followUp)}
                        </span>
                    )}
                    {lead.preview && (
                        <span
                            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium ${lead.preview.live_version !== null
                                ? "bg-emerald-500/10 text-emerald-500"
                                : "bg-muted text-muted-foreground"
                                }`}
                            title={lead.preview.url ?? "Preview project"}
                        >
                            <Globe className="w-3 h-3" />
                            {lead.preview.live_version !== null ? `Preview v${lead.preview.live_version}` : "Preview not deployed"}
                        </span>
                    )}
                    {lead.source && (
                        <span className="inline-flex px-1.5 py-0.5 rounded text-[11px] bg-muted text-muted-foreground truncate max-w-[8rem]">
                            {lead.source}
                        </span>
                    )}
                </div>
            )}
        </Link>
    );
}
