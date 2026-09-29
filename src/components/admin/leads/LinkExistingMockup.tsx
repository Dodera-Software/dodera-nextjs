"use client";

import { useEffect, useMemo, useState } from "react";
import { Link2, Loader2, Rocket, Search, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { LeadDetail, LeadPreview } from "@/types/admin";

interface LinkableMockup extends LeadPreview {
    slug: string;
    client_name: string | null;
    updated_at: string;
    linked_lead: { id: number; name: string } | null;
}

interface LinkExistingMockupProps {
    lead: LeadDetail;
    busy: boolean;
    onLink: (projectId: number) => void;
}

const MAX_RESULTS = 8;

/**
 * Link a mock site that is already deployed in Admin → Mockups: the project
 * with the business's name is suggested first, and every project can be
 * searched by name or subdomain.
 */
export function LinkExistingMockup({ lead, busy, onLink }: LinkExistingMockupProps) {
    const [mockups, setMockups] = useState<LinkableMockup[] | null>(null);
    const [query, setQuery] = useState("");

    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/leads/linkable-mockups")
            .then((res) => res.json())
            .then((body) => {
                if (!cancelled && body.status === "success") setMockups(body.data);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);

    const suggested = lead.suggested_preview;
    const results = useMemo(() => {
        if (!mockups) return [];
        const q = query.trim().toLowerCase();
        const list = mockups.filter((m) => m.project_id !== suggested?.project_id);
        const hits = q
            ? list.filter((m) => [m.name, m.slug, m.client_name].some((v) => v?.toLowerCase().includes(q)))
            : list;
        return hits.slice(0, MAX_RESULTS);
    }, [mockups, query, suggested]);

    return (
        <div className="space-y-3">
            {suggested && (
                <div className="rounded-lg border border-primary/30 bg-primary/5 px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex items-start gap-2 min-w-0 flex-1">
                        <Sparkles className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                        <div className="min-w-0">
                            <p className="text-sm font-medium">Matching mockup: {suggested.name}</p>
                            <p className="text-xs text-muted-foreground truncate">
                                {suggested.live_version !== null ? `Live · v${suggested.live_version}` : "Not deployed"}
                                {suggested.url && ` · ${suggested.url}`}
                            </p>
                        </div>
                    </div>
                    <Button size="sm" onClick={() => onLink(suggested.project_id)} disabled={busy}>
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Link2 className="w-4 h-4" />}
                        Link it
                    </Button>
                </div>
            )}

            <div className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground">
                    {suggested ? "Or pick another mockup" : "Link a mockup you already deployed"}
                </p>
                <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={mockups ? `Search ${mockups.length} mockups by name or subdomain…` : "Loading mockups…"}
                        className="pl-9 h-9 text-sm"
                        aria-label="Search mockups"
                    />
                </div>
                {mockups && (
                    results.length === 0 ? (
                        <p className="text-xs text-muted-foreground px-1">No mockups match “{query}”.</p>
                    ) : (
                        <ul className="rounded-lg border border-border divide-y divide-border">
                            {results.map((m) => (
                                <li key={m.project_id} className="flex items-center gap-3 px-3 py-2">
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm truncate">{m.name}</p>
                                        <p className="text-xs text-muted-foreground truncate">
                                            <span className="font-mono">{m.slug}</span>
                                            {m.linked_lead && ` · already linked to ${m.linked_lead.name}`}
                                        </p>
                                    </div>
                                    {m.live_version !== null ? (
                                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[11px] font-medium bg-emerald-500/10 text-emerald-500 flex-shrink-0">
                                            <Rocket className="w-3 h-3" />v{m.live_version}
                                        </span>
                                    ) : (
                                        <span className="px-1.5 py-0.5 rounded text-[11px] bg-muted text-muted-foreground flex-shrink-0">not deployed</span>
                                    )}
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        className="h-7 px-2 text-xs flex-shrink-0"
                                        onClick={() => onLink(m.project_id)}
                                        disabled={busy}
                                    >
                                        Link
                                    </Button>
                                </li>
                            ))}
                        </ul>
                    )
                )}
            </div>
        </div>
    );
}
