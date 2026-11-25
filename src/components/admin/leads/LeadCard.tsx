"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { forwardRef, type HTMLAttributes, type KeyboardEvent, type MouseEvent, type ReactNode } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { ArrowRight, CalendarClock, Facebook, Globe, Instagram, Link2, Loader2, Lock, MapPin, MessageSquare, TriangleAlert } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { MockPolicy, mockPolicy } from "@/config/leads";
import { outreachRuleFor, type OutreachRule, OutreachApproach } from "@/config/outreach-rules";
import { StatusTone } from "@/config/ui";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { FOLLOW_UP_TONE, externalHref, followUpState, formatEur, formatFollowUp, leadHref, mockStatus } from "@/lib/leads-client";
import { cn } from "@/lib/utils";
import type { Lead } from "@/types/admin";

interface LeadCardProps {
    lead: Lead;
    linking?: boolean;
    onLinkSuggested?: (lead: Lead) => void;
}

function stop(e: MouseEvent | KeyboardEvent) {
    e.stopPropagation();
}

export const LeadCardBody = forwardRef<HTMLDivElement, LeadCardProps & HTMLAttributes<HTMLDivElement> & { lifted?: boolean }>(
    function LeadCardBody({ lead, linking, onLinkSuggested, lifted, className, ...rest }, ref) {
        const href = leadHref(lead.id);
        const mock = mockStatus(lead);
        const onRequest = mockPolicy(lead.country) === MockPolicy.OnRequest;
        const place = [lead.city, lead.country].filter(Boolean).join(", ");
        const missing: string[] = [
            ...(lead.country ? [] : [copy.card.missingCountry]),
            ...(lead.category ? [] : [copy.card.missingCategory]),
            ...(lead.google_maps_url ? [] : [copy.card.missingMaps]),
        ];
        const note = lead.latest_note ?? lead.notes;
        const suggested = !lead.preview ? lead.suggested_preview : null;
        const followUp = lead.follow_up_on;

        return (
            <div
                ref={ref}
                className={cn(
                    "group/card space-y-3 rounded-2xl border border-foreground/10 bg-card p-4 text-left outline-none transition-colors hover:border-foreground/25 focus-visible:border-brand-bright/60 focus-visible:ring-2 focus-visible:ring-brand/40",
                    lifted && "cursor-grabbing border-brand/40 shadow-2xl shadow-black/50",
                    className,
                )}
                {...rest}
            >
                <div className="flex items-start justify-between gap-2">
                    <Link
                        href={href}
                        onClick={stop}
                        onKeyDown={stop}
                        draggable={false}
                        className="min-w-0 break-words font-display text-[0.95rem] font-semibold leading-snug hover:text-brand-bright focus-visible:underline focus-visible:outline-none"
                    >
                        {lead.name}
                    </Link>
                    {lead.value_eur !== null && (
                        <span className="shrink-0 text-xs font-medium tabular-nums text-muted-foreground">{formatEur(lead.value_eur)}</span>
                    )}
                </div>

                {(lead.category || place) && (
                    <div className="space-y-0.5 text-xs text-muted-foreground">
                        {lead.category && <p className="truncate">{lead.category}</p>}
                        {place && (
                            <p className="flex min-w-0 items-center gap-1">
                                <MapPin className="size-3 shrink-0" />
                                <span className="truncate">{place}</span>
                                {onRequest && (
                                    <Lock className="size-3 shrink-0 text-brand-bright" aria-label={copy.card.onRequest(lead.country ?? "")} />
                                )}
                            </p>
                        )}
                    </div>
                )}

                {missing.length > 0 && (
                    <p className="flex items-center gap-1.5 text-[0.7rem] text-amber-400">
                        <TriangleAlert className="size-3 shrink-0" />
                        {copy.card.missing(missing)}
                    </p>
                )}

                {(lead.facebook_url || lead.instagram_url || lead.google_maps_url) && (
                    <div className="-ml-1 flex items-center gap-0.5">
                        {lead.facebook_url && (
                            <CardLink href={lead.facebook_url} label={copy.links.facebook}>
                                <Facebook />
                            </CardLink>
                        )}
                        {lead.instagram_url && (
                            <CardLink href={lead.instagram_url} label={copy.links.instagram}>
                                <Instagram />
                            </CardLink>
                        )}
                        {lead.google_maps_url && (
                            <CardLink href={lead.google_maps_url} label={copy.links.maps}>
                                <MapPin />
                            </CardLink>
                        )}
                    </div>
                )}

                {lead.next_step && (
                    <p className="flex items-start gap-1.5 text-xs">
                        <ArrowRight className="mt-0.5 size-3 shrink-0 text-muted-foreground" />
                        <span className="line-clamp-2">{lead.next_step}</span>
                    </p>
                )}

                <div className="flex flex-wrap items-center gap-1.5">
                    {suggested ? (
                        <button
                            type="button"
                            onClick={(e) => {
                                stop(e);
                                onLinkSuggested?.(lead);
                            }}
                            onKeyDown={stop}
                            disabled={linking || !onLinkSuggested}
                            title={copy.card.linkMockHint(suggested.name, suggested.url)}
                            className="rounded-full transition-opacity hover:opacity-80 disabled:opacity-60"
                        >
                            <Badge tone={StatusTone.Brand}>
                                {linking ? <Loader2 className="animate-spin" /> : <Link2 />}
                                {copy.card.linkMock(suggested.live_version)}
                            </Badge>
                        </button>
                    ) : (
                        <Badge tone={mock.tone} title={mock.hint}>
                            <Globe />
                            {mock.label}
                        </Badge>
                    )}
                    {note && (
                        <Badge tone={StatusTone.Warning} title={note} aria-label={`${copy.card.note}: ${note}`}>
                            <MessageSquare />
                            {copy.card.note}
                        </Badge>
                    )}
                    {followUp && (
                        <Badge tone={FOLLOW_UP_TONE[followUpState(followUp)]} title={copy.card.followUp}>
                            <CalendarClock />
                            {formatFollowUp(followUp)}
                        </Badge>
                    )}
                </div>
            </div>
        );
    },
);

export function SortableLeadCard(props: LeadCardProps) {
    const router = useRouter();
    const { lead } = props;
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: lead.id,
        data: { stage: lead.stage },
    });
    const rule = outreachRuleFor(lead.country);

    const card = (
        <LeadCardBody
            {...props}
            ref={setNodeRef}
            style={{ transform: CSS.Translate.toString(transform), transition }}
            className={cn("cursor-grab touch-manipulation", isDragging && "opacity-40")}
            onClick={() => router.push(leadHref(lead.id))}
            {...attributes}
            {...listeners}
        />
    );

    if (!rule) return card;

    return (
        <Tooltip delayDuration={500} open={isDragging ? false : undefined}>
            <TooltipTrigger asChild>{card}</TooltipTrigger>
            <TooltipContent side="right" align="start" className="hidden max-w-xs rounded-2xl border-foreground/10 p-3 lg:block">
                <OutreachRuleSummary rule={rule} />
            </TooltipContent>
        </Tooltip>
    );
}

function OutreachRuleSummary({ rule }: { rule: OutreachRule }) {
    const direct = rule.approach === OutreachApproach.Direct;
    return (
        <div className="space-y-1.5 text-xs">
            <p className={cn("font-medium", direct ? "text-emerald-400" : "text-brand-bright")}>
                {direct ? copy.card.ruleDirect(rule.name) : copy.card.ruleAskFirst(rule.name)}
            </p>
            {rule.rule && <p className="text-muted-foreground">{rule.rule}</p>}
            {rule.include.length > 0 && (
                <ul className="list-disc pl-4 text-muted-foreground">
                    {rule.include.map((item) => (
                        <li key={item}>{item}</li>
                    ))}
                </ul>
            )}
        </div>
    );
}

function CardLink({ href, label, children }: { href: string; label: string; children: ReactNode }) {
    return (
        <a
            href={externalHref(href)}
            target="_blank"
            rel="noopener noreferrer"
            draggable={false}
            onClick={stop}
            onKeyDown={stop}
            title={copy.card.open(label)}
            aria-label={copy.card.open(label)}
            className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground [&_svg]:size-3.5"
        >
            {children}
        </a>
    );
}
