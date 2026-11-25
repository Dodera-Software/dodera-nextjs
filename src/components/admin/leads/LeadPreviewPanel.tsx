"use client";

import Link from "next/link";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Copy, ExternalLink, Globe, Link2Off, Loader2, MailCheck, Plus, Rocket, Settings2 } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { LinkExistingMockup } from "@/components/admin/leads/LinkExistingMockup";
import { MockupPreview } from "@/components/admin/mockups/MockupPreview";
import { MockupUploader } from "@/components/admin/mockups/MockupUploader";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AdminQueryKey, AdminRoute } from "@/config/admin";
import { PREVIEW_LINK_NOTE } from "@/config/outreach-rules";
import { StatusTone } from "@/config/ui";
import { useConfirm } from "@/hooks/use-confirm";
import { adminCommon } from "@/i18n/admin/common";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { adminFetch } from "@/lib/admin-api";
import { formatDateTime } from "@/lib/format";
import { copyToClipboard, mockStatus, patchLead, useLeadMutation } from "@/lib/leads-client";
import { useIntelilangConnected } from "@/lib/mockups-client";
import { cn } from "@/lib/utils";
import type { LeadDetail } from "@/types/admin";

const TONE_SURFACE: Record<StatusTone, string> = {
    [StatusTone.Neutral]: "border-foreground/10 bg-foreground/[0.03]",
    [StatusTone.Brand]: "border-brand/30 bg-brand/[0.06]",
    [StatusTone.Success]: "border-emerald-400/25 bg-emerald-400/[0.06]",
    [StatusTone.Warning]: "border-amber-400/25 bg-amber-400/[0.06]",
    [StatusTone.Danger]: "border-red-400/25 bg-red-400/[0.06]",
    [StatusTone.Info]: "border-sky-400/25 bg-sky-400/[0.06]",
};

export function LeadPreviewPanel({ lead }: { lead: LeadDetail }) {
    const confirm = useConfirm();
    const queryClient = useQueryClient();
    const intelilangConnected = useIntelilangConnected();
    const preview = lead.preview;

    const create = useLeadMutation({
        leadId: lead.id,
        mutationFn: () =>
            adminFetch<{ data: LeadDetail }>(`/api/admin/leads/${lead.id}/preview`, { method: "POST", json: {} }).then((r) => r.data),
        success: copy.preview.created,
        alsoInvalidates: [AdminQueryKey.Mockups],
    });

    const setProject = useLeadMutation({
        leadId: lead.id,
        mutationFn: (projectId: number | null) => patchLead(lead.id, { mockup_project_id: projectId }),
        success: (_, projectId) => (projectId === null ? copy.preview.unlinked : copy.preview.linked),
        alsoInvalidates: [AdminQueryKey.Mockups],
    });

    const markSent = useLeadMutation({
        leadId: lead.id,
        mutationFn: (sent: boolean) => patchLead(lead.id, { mockup_sent: sent }),
        success: (_, sent) => (sent ? copy.preview.markedSent : copy.preview.markedNotSent),
    });

    const busy = create.isPending || setProject.isPending || markSent.isPending;

    async function unlink() {
        const ok = await confirm({
            title: copy.preview.unlinkTitle,
            description: copy.preview.unlinkDescription,
            confirmLabel: copy.preview.unlink,
        });
        if (ok) setProject.mutate(null);
    }

    if (!preview) {
        return (
            <AdminPanel title={copy.preview.title} description={copy.preview.description}>
                <div className="space-y-5">
                    <LinkExistingMockup lead={lead} busy={busy} onLink={(id) => setProject.mutate(id)} />
                    <div className="flex items-center gap-3 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                        <span className="h-px flex-1 bg-foreground/10" />
                        {copy.preview.orStartNew}
                        <span className="h-px flex-1 bg-foreground/10" />
                    </div>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <p className="flex-1 text-xs text-muted-foreground">{copy.preview.createHint(lead.name)}</p>
                        <Button variant="glass" size="sm" className="rounded-full" onClick={() => create.mutate()} disabled={busy}>
                            {create.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
                            {copy.preview.create}
                        </Button>
                    </div>
                </div>
            </AdminPanel>
        );
    }

    const live = preview.live_version;
    const canSend = Boolean(preview.url) && live !== null;
    const status = mockStatus(lead);

    return (
        <div className="space-y-6">
            <AdminPanel
                title={copy.preview.title}
                description={copy.preview.description}
                actions={
                    <>
                        <Button variant="ghost" size="sm" className="rounded-full" asChild>
                            <Link href={`${AdminRoute.Mockups}/${preview.project_id}`} title={copy.preview.manageHint}>
                                <Settings2 />
                                {copy.preview.manage}
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="rounded-full text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
                            onClick={unlink}
                            disabled={busy}
                        >
                            <Link2Off />
                            {copy.preview.unlink}
                        </Button>
                    </>
                }
            >
                <div className="space-y-4">
                    <div className="flex flex-col gap-3 rounded-2xl border border-foreground/10 px-4 py-3 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-2">
                            <Globe className="size-4 shrink-0 text-muted-foreground" />
                            {preview.url ? (
                                <a
                                    href={preview.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="truncate font-mono text-sm transition-colors hover:text-brand-bright"
                                >
                                    {preview.url}
                                </a>
                            ) : (
                                <span className="inline-flex items-center gap-1.5 text-sm text-amber-400">
                                    <AlertTriangle className="size-4" />
                                    {copy.preview.noDomain}
                                </span>
                            )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                            {live !== null ? (
                                <Badge tone={StatusTone.Success}>
                                    <Rocket />
                                    {copy.preview.live(live)}
                                </Badge>
                            ) : (
                                <Badge tone={StatusTone.Neutral}>{copy.preview.notDeployed}</Badge>
                            )}
                            <Button
                                variant="glass"
                                size="sm"
                                className="rounded-full"
                                onClick={() => preview.url && copyToClipboard(preview.url)}
                                disabled={!canSend}
                            >
                                <Copy />
                                {adminCommon.actions.copy}
                            </Button>
                            {preview.url && live !== null && (
                                <Button size="sm" className="rounded-full" asChild>
                                    <a href={preview.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink />
                                        {adminCommon.actions.open}
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>

                    <div className="space-y-1.5 rounded-2xl border border-dashed border-foreground/15 px-4 py-3">
                        <div className="flex items-center justify-between gap-2">
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                                {copy.preview.sendWithLink}
                            </p>
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 rounded-full px-2.5 text-xs"
                                onClick={() => copyToClipboard(PREVIEW_LINK_NOTE, copy.textCopied)}
                            >
                                <Copy />
                                {copy.preview.copyText}
                            </Button>
                        </div>
                        <p className="text-xs text-muted-foreground">{PREVIEW_LINK_NOTE}</p>
                    </div>

                    <div className={cn("flex flex-col gap-3 rounded-2xl border px-4 py-3 sm:flex-row sm:items-center", TONE_SURFACE[status.tone])}>
                        <div className="flex min-w-0 flex-1 items-start gap-2">
                            <MailCheck className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
                            <div className="min-w-0 space-y-1">
                                <Badge tone={status.tone}>{status.label}</Badge>
                                <p className="text-xs text-muted-foreground">
                                    {lead.mockup_sent_at ? copy.preview.sentAt(formatDateTime(lead.mockup_sent_at)) : status.hint}
                                </p>
                            </div>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2">
                            {lead.mockup_sent_at ? (
                                <Button variant="ghost" size="sm" className="rounded-full" onClick={() => markSent.mutate(false)} disabled={busy}>
                                    {copy.preview.markNotSent}
                                </Button>
                            ) : (
                                <>
                                    <Button
                                        variant="glass"
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => markSent.mutate(true)}
                                        disabled={busy || !canSend}
                                    >
                                        {copy.preview.markSent}
                                    </Button>
                                    <Button
                                        size="sm"
                                        className="rounded-full"
                                        onClick={() => {
                                            if (preview.url) copyToClipboard(preview.url);
                                            markSent.mutate(true);
                                        }}
                                        disabled={busy || !canSend}
                                    >
                                        <Copy />
                                        {copy.preview.copyAndMark}
                                    </Button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </AdminPanel>

            <MockupUploader
                projectId={preview.project_id}
                intelilangConnected={intelilangConnected}
                onDeployed={() => queryClient.invalidateQueries({ queryKey: [AdminQueryKey.Leads] })}
            />

            <MockupPreview
                url={canSend ? preview.url : null}
                versionKey={live ?? "none"}
                emptyReason={preview.url ? copy.preview.emptyNotDeployed : copy.preview.emptyNoDomain}
            />
        </div>
    );
}
