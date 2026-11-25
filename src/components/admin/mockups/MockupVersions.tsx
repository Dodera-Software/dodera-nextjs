"use client";

import { History, Loader2, RotateCcw, Trash2 } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { MockupIntelilangStatus } from "@/components/admin/mockups/MockupIntelilangStatus";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminQueryKey } from "@/config/admin";
import { StatusTone, ConfirmVariant } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { useConfirm } from "@/hooks/use-confirm";
import { adminCommon } from "@/i18n/admin/common";
import { mockupsCopy } from "@/i18n/admin/mockups";
import { adminFetch } from "@/lib/admin-api";
import { formatDateTime } from "@/lib/format";
import { formatBytes, type MockupResponse } from "@/lib/mockups-client";
import type { MockupDeployment, MockupProjectDetail } from "@/types/admin";

const copy = mockupsCopy.versionsPanel;

export function MockupVersions({ project, intelilangConnected }: { project: MockupProjectDetail; intelilangConnected: boolean }) {
    const confirm = useConfirm();
    const base = `/api/admin/mockups/${project.id}/deployments`;

    const activate = useAdminMutation({
        mutationFn: (d: MockupDeployment) =>
            adminFetch<MockupResponse>(`${base}/${d.id}`, { method: "PATCH", json: { action: "activate" } }),
        invalidates: [AdminQueryKey.Mockups, AdminQueryKey.Leads],
        success: (r, d) => r.message ?? copy.activated(d.version),
    });

    const remove = useAdminMutation({
        mutationFn: (d: MockupDeployment) => adminFetch<MockupResponse>(`${base}/${d.id}`, { method: "DELETE" }),
        invalidates: [AdminQueryKey.Mockups],
        success: (r) => r.message ?? copy.deleted,
    });

    async function onActivate(d: MockupDeployment) {
        const ok = await confirm({
            title: copy.activateTitle(d.version),
            description: copy.activateDescription,
            confirmLabel: copy.makeLive,
            variant: ConfirmVariant.Default,
        });
        if (ok) activate.mutate(d);
    }

    async function onRemove(d: MockupDeployment) {
        const ok = await confirm({
            title: copy.deleteTitle(d.version),
            description: copy.deleteDescription,
            confirmLabel: adminCommon.actions.delete,
        });
        if (ok) remove.mutate(d);
    }

    return (
        <AdminPanel title={copy.title} description={copy.description} flush>
            {project.deployments.length === 0 ? (
                <EmptyState icon={History} title={copy.empty} className="py-10" />
            ) : (
                <ul className="divide-y divide-foreground/[0.07]">
                    {project.deployments.map((d) => {
                        const busy =
                            (activate.isPending && activate.variables?.id === d.id) || (remove.isPending && remove.variables?.id === d.id);
                        return (
                            <li key={d.id} className="flex items-start gap-3 px-6 py-3.5 text-sm">
                                <Badge tone={d.is_active ? StatusTone.Success : StatusTone.Neutral} className="mt-0.5 font-mono tabular-nums">
                                    v{d.version}
                                </Badge>
                                <div className="min-w-0 flex-1 space-y-1">
                                    <p className="text-xs tabular-nums text-muted-foreground">
                                        {copy.meta(formatDateTime(d.created_at), d.file_count, formatBytes(d.total_bytes), d.created_by)}
                                    </p>
                                    {d.note && <p className="truncate text-sm">{d.note}</p>}
                                    <MockupIntelilangStatus projectId={project.id} deployment={d} connected={intelilangConnected} />
                                </div>
                                {d.is_active ? (
                                    <span className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-emerald-400">{copy.live}</span>
                                ) : busy ? (
                                    <Loader2 className="mt-1 size-4 animate-spin text-muted-foreground" />
                                ) : (
                                    <div className="flex shrink-0 items-center gap-1">
                                        <Button variant="ghost" size="sm" className="h-8 rounded-full px-3 text-xs" aria-label={copy.makeLive} onClick={() => onActivate(d)}>
                                            <RotateCcw className="!size-3.5" />
                                            <span className="hidden sm:inline">{copy.makeLive}</span>
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 rounded-full text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
                                            aria-label={copy.delete}
                                            title={copy.delete}
                                            onClick={() => onRemove(d)}
                                        >
                                            <Trash2 className="!size-3.5" />
                                        </Button>
                                    </div>
                                )}
                            </li>
                        );
                    })}
                </ul>
            )}
        </AdminPanel>
    );
}
