"use client";

import { useCallback, useEffect, useMemo, useState, type DragEvent } from "react";
import { useRouter } from "next/navigation";
import { Plus, RefreshCw, Loader2, Search, SquareKanban } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadCard } from "@/components/admin/leads/LeadCard";
import { NewLeadDialog } from "@/components/admin/leads/NewLeadDialog";
import { LEAD_STAGES, type LeadStage } from "@/config/leads";
import { formatEur } from "@/lib/leads-client";
import type { Lead } from "@/types/admin";

const CLOSED_STAGES = new Set<string>(["won", "lost"]);

function byPosition(a: Lead, b: Lead): number {
    return a.position - b.position || b.created_at.localeCompare(a.created_at);
}

function matches(lead: Lead, query: string): boolean {
    if (!query) return true;
    const haystack = [lead.name, lead.contact_name, lead.email, lead.source, lead.next_step, lead.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
    return haystack.includes(query);
}

export default function LeadsBoardPage() {
    const router = useRouter();
    const [leads, setLeads] = useState<Lead[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [newLeadStage, setNewLeadStage] = useState<LeadStage | null>(null);

    // Drag state: the card being dragged and where it would land.
    const [dragId, setDragId] = useState<number | null>(null);
    const [dropTarget, setDropTarget] = useState<{ stage: LeadStage; index: number } | null>(null);

    const fetchLeads = useCallback(async () => {
        try {
            const res = await fetch("/api/admin/leads");
            const data = await res.json();
            if (data.status === "success") setLeads(data.data);
            else toast.error(data.message ?? "Failed to load leads");
        } catch {
            toast.error("Failed to load leads");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, [fetchLeads]);

    const query = search.trim().toLowerCase();

    /** Full column contents (ignoring the search) — the order that gets saved. */
    const fullColumns = useMemo(() => {
        const map = new Map<string, Lead[]>(LEAD_STAGES.map((s) => [s.id, []]));
        for (const lead of leads) map.get(lead.stage)?.push(lead);
        for (const list of map.values()) list.sort(byPosition);
        return map;
    }, [leads]);

    const totals = useMemo(() => {
        let open = 0;
        let openValue = 0;
        let wonValue = 0;
        for (const l of leads) {
            if (l.stage === "won") wonValue += l.value_eur ?? 0;
            else if (!CLOSED_STAGES.has(l.stage)) {
                open += 1;
                openValue += l.value_eur ?? 0;
            }
        }
        return { open, openValue, wonValue };
    }, [leads]);

    /* ── Drag and drop ─────────────────────────────────────── */

    function handleDragStart(e: DragEvent<HTMLAnchorElement>, lead: Lead) {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", String(lead.id));
        setDragId(lead.id);
    }

    function handleDragEnd() {
        setDragId(null);
        setDropTarget(null);
    }

    function handleColumnDragOver(e: DragEvent<HTMLDivElement>, stage: LeadStage) {
        if (dragId === null) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
        // Drop index = number of (other) cards whose middle is above the pointer.
        const cards = Array.from(e.currentTarget.querySelectorAll<HTMLElement>("[data-lead-card]")).filter(
            (el) => el.dataset.leadCard !== String(dragId),
        );
        let index = 0;
        for (const el of cards) {
            const rect = el.getBoundingClientRect();
            if (e.clientY > rect.top + rect.height / 2) index += 1;
        }
        if (dropTarget?.stage !== stage || dropTarget.index !== index) setDropTarget({ stage, index });
    }

    async function handleDrop(e: DragEvent<HTMLDivElement>, stage: LeadStage) {
        e.preventDefault();
        const id = dragId;
        const index = dropTarget?.stage === stage ? dropTarget.index : 0;
        handleDragEnd();
        if (id === null) return;

        const dragged = leads.find((l) => l.id === id);
        if (!dragged) return;

        // Insert relative to the visible cards, but save the full column so
        // cards hidden by the search keep their place.
        const full = (fullColumns.get(stage) ?? []).filter((l) => l.id !== id);
        const visible = full.filter((l) => matches(l, query));
        const anchor = visible[index];
        const insertAt = anchor ? full.indexOf(anchor) : visible.length > 0 ? full.indexOf(visible[visible.length - 1]) + 1 : full.length;
        const ordered = [...full.slice(0, insertAt), dragged, ...full.slice(insertAt)];

        const unchanged =
            dragged.stage === stage &&
            ordered.every((l, i) => l.id === (fullColumns.get(stage) ?? [])[i]?.id);
        if (unchanged) return;

        const previous = leads;
        const positions = new Map(ordered.map((l, i) => [l.id, i]));
        setLeads((prev) =>
            prev.map((l) =>
                positions.has(l.id) ? { ...l, stage, position: positions.get(l.id)! } : l,
            ),
        );

        try {
            const res = await fetch("/api/admin/leads/move", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, stage, ordered_ids: ordered.map((l) => l.id) }),
            });
            const data = await res.json();
            if (!res.ok || data.status !== "success") throw new Error(data.message);
        } catch (err) {
            setLeads(previous);
            toast.error((err as Error)?.message || "Failed to move the lead");
            fetchLeads();
        }
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Leads"
                subtitle={`${totals.open} open lead${totals.open !== 1 ? "s" : ""} · ${formatEur(totals.openValue)} in the pipeline · ${formatEur(totals.wonValue)} won`}
                actions={
                    <>
                        <Button variant="outline" size="sm" onClick={fetchLeads}>
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        <Button size="sm" onClick={() => setNewLeadStage("new")}>
                            <Plus className="w-4 h-4" />
                            New lead
                        </Button>
                    </>
                }
            />

            <div className="relative max-w-sm">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <Input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search leads…"
                    className="pl-9 h-9"
                    aria-label="Search leads"
                />
            </div>

            {loading ? (
                <div className="py-16 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : (
                <>
                    {leads.length === 0 && (
                        <div className="rounded-xl border border-dashed border-border px-6 py-8 text-center">
                            <SquareKanban className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                            <p className="font-medium">No leads yet</p>
                            <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                                Add a card for each potential customer, drag it across the columns as the deal moves, and
                                open it to keep notes, follow-ups and a preview link in one place.
                            </p>
                        </div>
                    )}

                    <div className="-mx-4 lg:-mx-6 px-4 lg:px-6 overflow-x-auto pb-4">
                        <div className="flex gap-4 min-w-max items-start">
                            {LEAD_STAGES.map((stage) => {
                                const cards = (fullColumns.get(stage.id) ?? []).filter((l) => matches(l, query));
                                const value = cards.reduce((sum, l) => sum + (l.value_eur ?? 0), 0);
                                const isTarget = dropTarget?.stage === stage.id;
                                const visibleCards = cards.filter((l) => l.id !== dragId);

                                return (
                                    <section
                                        key={stage.id}
                                        aria-label={stage.label}
                                        className={`w-72 flex-shrink-0 rounded-xl border bg-muted/30 flex flex-col transition-colors ${isTarget ? "border-primary/50 bg-primary/5" : "border-border"}`}
                                    >
                                        <header className="flex items-center gap-2 px-3 pt-3 pb-2">
                                            <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                                            <h2 className="text-sm font-semibold" title={stage.description}>{stage.label}</h2>
                                            <span className="text-xs text-muted-foreground">{cards.length}</span>
                                            {value > 0 && (
                                                <span className="text-xs text-muted-foreground ml-auto">{formatEur(value)}</span>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setNewLeadStage(stage.id)}
                                                className={`${value > 0 ? "" : "ml-auto"} p-1 rounded text-muted-foreground hover:text-foreground hover:bg-accent transition-colors`}
                                                title={`Add a lead to ${stage.label}`}
                                                aria-label={`Add a lead to ${stage.label}`}
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </header>

                                        <div
                                            onDragOver={(e) => handleColumnDragOver(e, stage.id)}
                                            onDrop={(e) => handleDrop(e, stage.id)}
                                            onDragLeave={(e) => {
                                                if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDropTarget(null);
                                            }}
                                            className="flex-1 px-2 pb-2 space-y-2 min-h-[8rem]"
                                        >
                                            {cards.map((lead) => {
                                                const indexAmongOthers = visibleCards.indexOf(lead);
                                                return (
                                                    <div key={lead.id}>
                                                        {isTarget && indexAmongOthers === dropTarget.index && <DropIndicator />}
                                                        <LeadCard
                                                            lead={lead}
                                                            dragging={lead.id === dragId}
                                                            onDragStart={handleDragStart}
                                                            onDragEnd={handleDragEnd}
                                                        />
                                                    </div>
                                                );
                                            })}
                                            {isTarget && dropTarget.index >= visibleCards.length && <DropIndicator />}
                                            {cards.length === 0 && !isTarget && (
                                                <p className="text-xs text-muted-foreground text-center py-6">
                                                    {query ? "No matches" : "Drop a card here"}
                                                </p>
                                            )}
                                        </div>
                                    </section>
                                );
                            })}
                        </div>
                    </div>
                </>
            )}

            <NewLeadDialog
                open={newLeadStage !== null}
                onOpenChange={(open) => !open && setNewLeadStage(null)}
                initialStage={newLeadStage ?? "new"}
                onCreated={(lead) => {
                    setLeads((prev) => [...prev, lead]);
                    toast.success(`${lead.name} added`, {
                        action: { label: "Open", onClick: () => router.push(`/admin/leads/${lead.id}`) },
                    });
                }}
            />
        </div>
    );
}

function DropIndicator() {
    return <div className="h-1 rounded-full bg-primary/60 my-1" aria-hidden />;
}
