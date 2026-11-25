"use client";

import { useQuery } from "@tanstack/react-query";
import { Link2, Loader2, Rocket, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusTone } from "@/config/ui";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { linkableMockupsQuery } from "@/lib/leads-client";
import type { LeadDetail } from "@/types/admin";

interface LinkExistingMockupProps {
    lead: LeadDetail;
    busy: boolean;
    onLink: (projectId: number) => void;
}

export function LinkExistingMockup({ lead, busy, onLink }: LinkExistingMockupProps) {
    const mockups = useQuery(linkableMockupsQuery);
    const suggested = lead.suggested_preview;
    const others = (mockups.data ?? []).filter((m) => m.project_id !== suggested?.project_id);

    return (
        <div className="space-y-4">
            {suggested && (
                <div className="flex flex-col gap-3 rounded-2xl border border-brand/30 bg-brand/[0.06] px-4 py-3 sm:flex-row sm:items-center">
                    <div className="flex min-w-0 flex-1 items-start gap-2">
                        <Sparkles className="mt-0.5 size-4 shrink-0 text-brand-bright" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium">{copy.linkMockup.matching(suggested.name)}</p>
                            <p className="truncate text-xs text-muted-foreground">
                                {suggested.live_version !== null ? copy.linkMockup.live(suggested.live_version) : copy.linkMockup.notDeployed}
                                {suggested.url && ` · ${suggested.url}`}
                            </p>
                        </div>
                    </div>
                    <Button size="sm" className="rounded-full" onClick={() => onLink(suggested.project_id)} disabled={busy}>
                        {busy ? <Loader2 className="animate-spin" /> : <Link2 />}
                        {copy.linkMockup.linkIt}
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                    {suggested ? copy.linkMockup.pickAnother : copy.linkMockup.linkExisting}
                </p>
                {mockups.isPending ? (
                    <Skeleton className="h-14 rounded-2xl" />
                ) : (
                    <Command className="rounded-2xl border border-foreground/10 bg-transparent">
                        <CommandInput placeholder={copy.linkMockup.search(others.length)} className="h-11 text-sm" />
                        <CommandList className="max-h-72">
                            <CommandEmpty>{copy.linkMockup.noMatches}</CommandEmpty>
                            {others.map((m) => (
                                <CommandItem
                                    key={m.project_id}
                                    value={`${m.project_id} ${m.name}`}
                                    keywords={[m.slug, m.client_name ?? ""]}
                                    onSelect={() => !busy && onLink(m.project_id)}
                                    disabled={busy}
                                >
                                    <div className="min-w-0 flex-1">
                                        <p className="truncate">{m.name}</p>
                                        <p className="truncate text-xs text-muted-foreground">
                                            <span className="font-mono">{m.slug}</span>
                                            {m.linked_lead && ` · ${copy.linkMockup.alreadyLinked(m.linked_lead.name)}`}
                                        </p>
                                    </div>
                                    {m.live_version !== null ? (
                                        <Badge tone={StatusTone.Success}>
                                            <Rocket />
                                            {copy.linkMockup.version(m.live_version)}
                                        </Badge>
                                    ) : (
                                        <Badge tone={StatusTone.Neutral}>{copy.linkMockup.notDeployedShort}</Badge>
                                    )}
                                    <span className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-brand-bright">
                                        {copy.linkMockup.link}
                                    </span>
                                </CommandItem>
                            ))}
                        </CommandList>
                    </Command>
                )}
            </div>
        </div>
    );
}
