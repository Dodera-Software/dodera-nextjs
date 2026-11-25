"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    closestCorners,
    DndContext,
    DragOverlay,
    KeyboardSensor,
    MouseSensor,
    TouchSensor,
    useDroppable,
    useSensor,
    useSensors,
    type Announcements,
    type DragEndEvent,
    type DragOverEvent,
    type DragStartEvent,
    type UniqueIdentifier,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { Plus, RefreshCw, SquareKanban } from "lucide-react";
import { toast } from "sonner";
import { AdminPage } from "@/components/admin/AdminPage";
import { EmptyState } from "@/components/admin/EmptyState";
import { SearchInput, Toolbar } from "@/components/admin/SearchInput";
import { StatGrid, StatTile } from "@/components/admin/StatGrid";
import { LeadCardBody, SortableLeadCard } from "@/components/admin/leads/LeadCard";
import { NewLeadDialog } from "@/components/admin/leads/NewLeadDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { AdminQueryKey } from "@/config/admin";
import {
    CLOSED_STAGES,
    isLeadStage,
    LEAD_STAGES,
    LeadStage,
    MockPolicy,
    mockPolicy,
    OUTREACH_STAGES,
    stageLabel,
    type LeadStageDefinition,
} from "@/config/leads";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { adminFetch, errorMessage } from "@/lib/admin-api";
import { leadsQuery } from "@/lib/admin-queries";
import { copyToClipboard, formatEur, leadHref, patchLead } from "@/lib/leads-client";
import { lowerFirst } from "@/lib/format";
import type { Lead, LeadPreview } from "@/types/admin";

type Columns = Record<LeadStage, number[]>;

interface MoveVariables {
    lead: Lead;
    stage: LeadStage;
    ordered: number[];
    previous: Lead[] | undefined;
}

const ALL_COUNTRIES = "__all";

function byPosition(a: Lead, b: Lead): number {
    return a.position - b.position || b.created_at.localeCompare(a.created_at);
}

function matches(lead: Lead, query: string, country: string): boolean {
    if (country !== ALL_COUNTRIES && (lead.country ?? "").toLowerCase() !== country) return false;
    if (!query) return true;
    return [lead.name, lead.country, lead.city, lead.category, lead.contact_name, lead.email, lead.next_step, lead.notes]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query);
}

function emptyColumns<T>(make: () => T): Record<LeadStage, T> {
    return Object.fromEntries(LEAD_STAGES.map((s) => [s.id, make()])) as Record<LeadStage, T>;
}

function stageOf(id: UniqueIdentifier, columns: Columns): LeadStage | null {
    if (isLeadStage(id)) return id;
    return LEAD_STAGES.find((s) => columns[s.id].includes(Number(id)))?.id ?? null;
}

export default function LeadsBoardPage() {
    const router = useRouter();
    const queryClient = useQueryClient();
    const leads = useQuery(leadsQuery);
    const [search, setSearch] = useState("");
    const [country, setCountry] = useState(ALL_COUNTRIES);
    const [newLeadStage, setNewLeadStage] = useState<LeadStage | null>(null);
    const [activeId, setActiveId] = useState<number | null>(null);
    const [draft, setDraft] = useState<Columns | null>(null);

    const sensors = useSensors(
        useSensor(MouseSensor, { activationConstraint: { distance: 6 } }),
        useSensor(TouchSensor, { activationConstraint: { delay: 250, tolerance: 6 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
    );

    const list = useMemo(() => leads.data ?? [], [leads.data]);
    const byId = useMemo(() => new Map(list.map((l) => [l.id, l])), [list]);
    const query = search.trim().toLowerCase();

    const countries = useMemo(() => {
        const map = new Map<string, string>();
        for (const l of list) if (l.country) map.set(l.country.toLowerCase(), l.country);
        return [...map.entries()].sort((a, b) => a[1].localeCompare(b[1]));
    }, [list]);

    const fullColumns = useMemo(() => {
        const columns = emptyColumns<Lead[]>(() => []);
        for (const lead of list) columns[lead.stage]?.push(lead);
        for (const column of Object.values(columns)) column.sort(byPosition);
        return columns;
    }, [list]);

    const visibleColumns = useMemo(() => {
        const columns = emptyColumns<number[]>(() => []);
        for (const stage of LEAD_STAGES) {
            columns[stage.id] = fullColumns[stage.id].filter((l) => matches(l, query, country)).map((l) => l.id);
        }
        return columns;
    }, [fullColumns, query, country]);

    const columns = draft ?? visibleColumns;

    const totals = useMemo(() => {
        let open = 0;
        let openValue = 0;
        let wonValue = 0;
        for (const l of list) {
            if (l.stage === LeadStage.Won) wonValue += l.value_eur ?? 0;
            else if (!CLOSED_STAGES.has(l.stage)) {
                open += 1;
                openValue += l.value_eur ?? 0;
            }
        }
        return { open, openValue, wonValue };
    }, [list]);

    const move = useMutation({
        mutationFn: ({ lead, stage, ordered }: MoveVariables) =>
            adminFetch("/api/admin/leads/move", { method: "POST", json: { id: lead.id, stage, ordered_ids: ordered } }),
        onError: (error, { previous }) => {
            queryClient.setQueryData(leadsQuery.queryKey, previous);
            toast.error(errorMessage(error) || copy.moveFailed);
            queryClient.invalidateQueries({ queryKey: leadsQuery.queryKey });
        },
        onSuccess: (_, { lead, stage }) => {
            if (lead.stage === stage) return;
            outreachReminder(lead, stage);
            queryClient.invalidateQueries({ queryKey: [AdminQueryKey.Leads, lead.id] });
            if (stage === LeadStage.Contacted) queryClient.invalidateQueries({ queryKey: leadsQuery.queryKey });
        },
    });

    const linkSuggested = useAdminMutation({
        mutationFn: ({ lead, project }: { lead: Lead; project: LeadPreview }) =>
            patchLead(lead.id, { mockup_project_id: project.project_id }),
        invalidates: [AdminQueryKey.Leads, AdminQueryKey.Mockups],
        success: (_, { lead, project }) => copy.preview.linkedTo(project.name, lead.name),
    });

    function outreachReminder(lead: Lead, to: LeadStage) {
        if (lead.mockup_sent_at) return;
        const onRequest = mockPolicy(lead.country) === MockPolicy.OnRequest;
        const live = lead.preview?.live_version ?? null;
        const url = lead.preview?.url ?? null;
        const open = { label: copy.reminder.open, onClick: () => router.push(leadHref(lead.id)) };
        const copyLink = url ? { label: copy.reminder.copyLink, onClick: () => copyToClipboard(url) } : undefined;

        if (to === LeadStage.Contacted && !OUTREACH_STAGES.has(lead.stage)) {
            if (onRequest) toast.info(copy.reminder.onRequest(lead.country ?? ""));
            else if (live !== null) toast.success(copy.reminder.sentWithFirst(live, lead.name), { action: copyLink });
            else toast.warning(copy.reminder.noMockYet(lead.name), { action: open });
        } else if (to === LeadStage.Interested || to === LeadStage.Negotiation) {
            const stage = lowerFirst(stageLabel(to));
            if (live !== null && copyLink) toast(copy.reminder.sendNow(lead.name, stage), { action: copyLink });
            else toast.warning(copy.reminder.noMockForStage(lead.name, stage), { action: open });
        }
    }

    function commit(id: number, stage: LeadStage, visibleOrder: number[]) {
        const lead = byId.get(id);
        if (!lead) return;
        const full = fullColumns[stage].filter((l) => l.id !== id);
        const shown = visibleOrder.filter((other) => other !== id);
        const index = visibleOrder.indexOf(id);
        const anchor = shown[index];
        const last = shown[shown.length - 1];
        const insertAt =
            anchor !== undefined
                ? full.findIndex((l) => l.id === anchor)
                : last !== undefined
                  ? full.findIndex((l) => l.id === last) + 1
                  : full.length;
        const ordered = [...full.slice(0, insertAt).map((l) => l.id), id, ...full.slice(insertAt).map((l) => l.id)];

        const current = fullColumns[stage].map((l) => l.id);
        if (lead.stage === stage && ordered.every((other, i) => other === current[i])) return;

        const previous = queryClient.getQueryData(leadsQuery.queryKey);
        const positions = new Map(ordered.map((other, i) => [other, i]));
        queryClient.cancelQueries({ queryKey: leadsQuery.queryKey });
        queryClient.setQueryData(leadsQuery.queryKey, (old) =>
            old?.map((l) => {
                const position = positions.get(l.id);
                return position === undefined ? l : { ...l, stage, position };
            }),
        );
        move.mutate({ lead, stage, ordered, previous });
    }

    function onDragStart({ active }: DragStartEvent) {
        setActiveId(Number(active.id));
        setDraft(visibleColumns);
    }

    function onDragOver({ active, over }: DragOverEvent) {
        if (!over || !draft) return;
        const from = stageOf(active.id, draft);
        const to = stageOf(over.id, draft);
        if (!from || !to || from === to) return;
        const id = Number(active.id);
        setDraft((prev) => {
            if (!prev) return prev;
            const target = prev[to];
            const overIndex = isLeadStage(over.id) ? target.length : target.indexOf(Number(over.id));
            const translated = active.rect.current.translated;
            const below = translated ? translated.top > over.rect.top + over.rect.height / 2 : false;
            const at = overIndex < 0 ? target.length : overIndex + (below && !isLeadStage(over.id) ? 1 : 0);
            return {
                ...prev,
                [from]: prev[from].filter((other) => other !== id),
                [to]: [...target.slice(0, at), id, ...target.slice(at)],
            };
        });
    }

    function onDragEnd({ active, over }: DragEndEvent) {
        const final = draft;
        setActiveId(null);
        setDraft(null);
        if (!over || !final) return;
        const id = Number(active.id);
        const stage = stageOf(active.id, final);
        if (!stage) return;
        let order = final[stage];
        if (!isLeadStage(over.id) && stageOf(over.id, final) === stage && over.id !== active.id) {
            order = arrayMove(order, order.indexOf(id), order.indexOf(Number(over.id)));
        }
        commit(id, stage, order);
    }

    function onDragCancel() {
        setActiveId(null);
        setDraft(null);
    }

    function nameOf(id: UniqueIdentifier): string {
        return byId.get(Number(id))?.name ?? "";
    }

    const announcements: Announcements = {
        onDragStart: ({ active }) => copy.dnd.picked(nameOf(active.id)),
        onDragOver: ({ active, over }) => {
            const stage = over ? stageOf(over.id, columns) : null;
            return stage ? copy.dnd.over(nameOf(active.id), stageLabel(stage)) : undefined;
        },
        onDragEnd: ({ active, over }) => {
            const stage = over ? stageOf(over.id, columns) : null;
            return stage ? copy.dnd.dropped(nameOf(active.id), stageLabel(stage)) : copy.dnd.cancelled(nameOf(active.id));
        },
        onDragCancel: ({ active }) => copy.dnd.cancelled(nameOf(active.id)),
    };

    const filtering = Boolean(query) || country !== ALL_COUNTRIES;
    const active = activeId !== null ? byId.get(activeId) : undefined;

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={
                leads.data ? copy.description(totals.open, formatEur(totals.openValue), formatEur(totals.wonValue)) : undefined
            }
            actions={
                <>
                    <Button
                        variant="glass"
                        size="sm"
                        className="rounded-full"
                        onClick={() => leads.refetch()}
                        disabled={leads.isFetching}
                    >
                        <RefreshCw className={leads.isFetching ? "animate-spin" : undefined} />
                        {adminCommon.actions.refresh}
                    </Button>
                    <Button size="sm" className="rounded-full" onClick={() => setNewLeadStage(LeadStage.New)}>
                        <Plus />
                        {copy.addBusiness}
                    </Button>
                </>
            }
        >
            <div className="space-y-6">
                <StatGrid className="xl:grid-cols-3">
                    <StatTile label={copy.stats.open} value={totals.open} loading={leads.isPending} />
                    <StatTile label={copy.stats.pipeline} value={formatEur(totals.openValue)} loading={leads.isPending} />
                    <StatTile label={copy.stats.won} value={formatEur(totals.wonValue)} loading={leads.isPending} />
                </StatGrid>

                <Toolbar>
                    <SearchInput value={search} onChange={setSearch} placeholder={copy.search} />
                    {countries.length > 1 && (
                        <Select value={country} onValueChange={setCountry}>
                            <SelectTrigger
                                className="h-10 rounded-full border-foreground/10 bg-foreground/[0.03] sm:w-52"
                                aria-label={copy.country.label}
                            >
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={ALL_COUNTRIES}>{copy.country.all}</SelectItem>
                                {countries.map(([key, label]) => (
                                    <SelectItem key={key} value={key}>
                                        {label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </Toolbar>

                {leads.isError ? (
                    <EmptyState
                        icon={SquareKanban}
                        title={adminCommon.errors.loadFailed}
                        description={errorMessage(leads.error)}
                        action={
                            <Button variant="glass" size="sm" className="rounded-full" onClick={() => leads.refetch()}>
                                {adminCommon.actions.retry}
                            </Button>
                        }
                        className="rounded-3xl border border-foreground/10"
                    />
                ) : (
                    <>
                        {leads.data && list.length === 0 && (
                            <EmptyState
                                icon={SquareKanban}
                                title={copy.empty.title}
                                description={copy.empty.description}
                                className="rounded-3xl border border-dashed border-foreground/15 py-10"
                            />
                        )}
                        <DndContext
                            sensors={sensors}
                            collisionDetection={closestCorners}
                            onDragStart={onDragStart}
                            onDragOver={onDragOver}
                            onDragEnd={onDragEnd}
                            onDragCancel={onDragCancel}
                            accessibility={{ announcements, screenReaderInstructions: { draggable: copy.dnd.instructions } }}
                        >
                            <div className="-mx-[var(--gutter)] snap-x snap-proximity overflow-x-auto scroll-px-[var(--gutter)] px-[var(--gutter)] pb-4 lg:snap-none">
                                <div className="flex min-w-max items-start gap-4">
                                    {LEAD_STAGES.map((stage) => (
                                        <BoardColumn
                                            key={stage.id}
                                            stage={stage}
                                            ids={columns[stage.id]}
                                            leads={byId}
                                            loading={leads.isPending}
                                            filtering={filtering}
                                            linkingId={linkSuggested.isPending ? linkSuggested.variables?.lead.id : undefined}
                                            onAdd={() => setNewLeadStage(stage.id)}
                                            onLinkSuggested={(lead) =>
                                                lead.suggested_preview &&
                                                linkSuggested.mutate({ lead, project: lead.suggested_preview })
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                            <DragOverlay>{active ? <LeadCardBody lead={active} lifted className="w-72" /> : null}</DragOverlay>
                        </DndContext>
                    </>
                )}
            </div>

            <NewLeadDialog
                stage={newLeadStage}
                onClose={() => setNewLeadStage(null)}
                onCreated={(lead) =>
                    toast.success(copy.created(lead.name), {
                        action: { label: adminCommon.actions.open, onClick: () => router.push(leadHref(lead.id)) },
                    })
                }
            />
        </AdminPage>
    );
}

interface BoardColumnProps {
    stage: LeadStageDefinition;
    ids: number[];
    leads: Map<number, Lead>;
    loading: boolean;
    filtering: boolean;
    linkingId: number | undefined;
    onAdd: () => void;
    onLinkSuggested: (lead: Lead) => void;
}

function BoardColumn({ stage, ids, leads, loading, filtering, linkingId, onAdd, onLinkSuggested }: BoardColumnProps) {
    const { setNodeRef, isOver } = useDroppable({ id: stage.id });
    const cards = ids.map((id) => leads.get(id)).filter((l): l is Lead => Boolean(l));
    const value = cards.reduce((sum, l) => sum + (l.value_eur ?? 0), 0);

    return (
        <section
            aria-label={stage.label}
            className="flex w-[17.5rem] shrink-0 snap-start flex-col rounded-3xl border border-foreground/10 bg-card/60 sm:w-72"
        >
            <header className="flex items-center gap-2 border-b border-foreground/[0.07] px-4 py-3">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <span>
                            <Badge tone={stage.tone} dot>
                                {stage.label}
                            </Badge>
                        </span>
                    </TooltipTrigger>
                    <TooltipContent className="rounded-xl border-foreground/10 text-xs">{stage.description}</TooltipContent>
                </Tooltip>
                <span className="font-mono text-[0.68rem] tabular-nums text-muted-foreground" aria-label={copy.column.count(cards.length)}>
                    {cards.length}
                </span>
                {value > 0 && <span className="ml-auto text-xs tabular-nums text-muted-foreground">{formatEur(value)}</span>}
                <Button
                    variant="ghost"
                    size="icon"
                    className={`size-8 rounded-full text-muted-foreground ${value > 0 ? "" : "ml-auto"}`}
                    onClick={onAdd}
                    aria-label={copy.column.add(stage.label)}
                    title={copy.column.add(stage.label)}
                >
                    <Plus />
                </Button>
            </header>
            <SortableContext id={stage.id} items={ids} strategy={verticalListSortingStrategy}>
                <div
                    ref={setNodeRef}
                    className={`min-h-[8rem] flex-1 space-y-2 rounded-b-3xl p-2 transition-colors ${isOver ? "bg-brand/[0.06]" : ""}`}
                >
                    {loading ? (
                        <>
                            <Skeleton className="h-28 rounded-2xl" />
                            <Skeleton className="h-20 rounded-2xl" />
                        </>
                    ) : (
                        cards.map((lead) => (
                            <SortableLeadCard
                                key={lead.id}
                                lead={lead}
                                linking={linkingId === lead.id}
                                onLinkSuggested={onLinkSuggested}
                            />
                        ))
                    )}
                    {!loading && cards.length === 0 && (
                        <p className="py-6 text-center text-xs text-muted-foreground">
                            {filtering ? copy.column.noMatches : copy.column.dropHere}
                        </p>
                    )}
                </div>
            </SortableContext>
        </section>
    );
}
