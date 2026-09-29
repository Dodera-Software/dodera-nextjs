"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
    AlertTriangle,
    Copy,
    ExternalLink,
    Globe,
    Link2Off,
    Loader2,
    MailCheck,
    MonitorSmartphone,
    Plus,
    Rocket,
    Settings2,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfirm } from "@/hooks/use-confirm";
import { MockupUploader } from "@/components/admin/mockups/MockupUploader";
import { MockupPreview } from "@/components/admin/mockups/MockupPreview";
import { useIntelilangConnected } from "@/lib/mockups-client";
import { formatDateTime } from "@/lib/format";
import { MOCK_TONE_CLASSES, mockStatus } from "@/lib/leads-client";
import type { LeadDetail, MockupProject } from "@/types/admin";

interface LeadPreviewPanelProps {
    lead: LeadDetail;
    /** Replace the lead after a server change (link, unlink). */
    onChange: (lead: LeadDetail) => void;
    /** Re-fetch the lead (after a deploy the card's timeline and version change). */
    onReload: () => void;
}

/**
 * The lead's preview site: create or link a Mockups project, then deploy with
 * the same uploader and Deploy button as Admin → Mockups. The link is
 * https://<slug>.<MOCKUPS_DOMAIN>/. Also tracks whether the link has been
 * sent to the business (see mockPolicy for when it should be).
 */
export function LeadPreviewPanel({ lead, onChange, onReload }: LeadPreviewPanelProps) {
    const confirm = useConfirm();
    const intelilangConnected = useIntelilangConnected();
    const [busy, setBusy] = useState(false);
    const [projects, setProjects] = useState<MockupProject[] | null>(null);

    const preview = lead.preview;

    // Existing projects for "link an existing one" — only needed while nothing is linked.
    useEffect(() => {
        if (preview) return;
        let cancelled = false;
        fetch("/api/admin/mockups")
            .then((res) => res.json())
            .then((body) => {
                if (!cancelled && body.status === "success") setProjects(body.data);
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, [preview]);

    async function send(url: string, init: RequestInit, success: string) {
        setBusy(true);
        try {
            const res = await fetch(url, { headers: { "Content-Type": "application/json" }, ...init });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                onChange(data.data);
                toast.success(success);
            } else {
                toast.error(data.message ?? "Something went wrong");
            }
        } catch {
            toast.error("Something went wrong");
        } finally {
            setBusy(false);
        }
    }

    const createProject = () =>
        send(`/api/admin/leads/${lead.id}/preview`, { method: "POST", body: "{}" }, "Preview project created — deploy the mockup below.");

    const linkProject = (projectId: string) =>
        send(
            `/api/admin/leads/${lead.id}`,
            { method: "PATCH", body: JSON.stringify({ mockup_project_id: Number(projectId) }) },
            "Preview project linked",
        );

    async function unlinkProject() {
        const ok = await confirm({
            title: "Unlink the preview project?",
            description: "The project and its link keep working in Admin → Mockups; this card just stops showing it.",
            confirmLabel: "Unlink",
        });
        if (!ok) return;
        await send(
            `/api/admin/leads/${lead.id}`,
            { method: "PATCH", body: JSON.stringify({ mockup_project_id: null }) },
            "Preview project unlinked",
        );
    }

    function copyLink() {
        if (!preview?.url) return;
        navigator.clipboard.writeText(preview.url);
        toast.success("Link copied");
    }

    const markSent = (sent: boolean) =>
        send(
            `/api/admin/leads/${lead.id}`,
            { method: "PATCH", body: JSON.stringify({ mockup_sent: sent }) },
            sent ? "Marked as sent" : "Marked as not sent",
        );

    async function copyAndMarkSent() {
        copyLink();
        await markSent(true);
    }

    if (!preview) {
        return (
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <PanelTitle />
                <div className="rounded-lg border border-dashed border-border px-4 py-8 text-center space-y-4">
                    <MonitorSmartphone className="w-8 h-8 mx-auto text-muted-foreground opacity-60" />
                    <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                        Create a preview project for {lead.name} to deploy a mockup and get a shareable link.
                    </p>
                    <Button size="sm" onClick={createProject} disabled={busy}>
                        {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                        Create preview project
                    </Button>
                    {projects && projects.length > 0 && (
                        <div className="max-w-xs mx-auto space-y-1.5">
                            <p className="text-xs text-muted-foreground">or link an existing Mockups project</p>
                            <Select onValueChange={linkProject} disabled={busy}>
                                <SelectTrigger className="h-9 text-sm">
                                    <SelectValue placeholder="Choose a project…" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projects.map((p) => (
                                        <SelectItem key={p.id} value={String(p.id)}>
                                            {p.name} <span className="text-muted-foreground">· {p.slug}</span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    const live = preview.live_version;

    return (
        <div className="space-y-6">
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-start justify-between gap-3">
                    <PanelTitle />
                    <div className="flex items-center gap-1">
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" asChild>
                            <Link href={`/admin/mockups/${preview.project_id}`} title="Versions, rollback, subdomain">
                                <Settings2 className="w-3.5 h-3.5" />
                                Manage
                            </Link>
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2 text-xs text-muted-foreground hover:text-destructive"
                            onClick={unlinkProject}
                            disabled={busy}
                        >
                            <Link2Off className="w-3.5 h-3.5" />
                            Unlink
                        </Button>
                    </div>
                </div>

                <div className="rounded-lg border border-border px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                        <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                        {preview.url ? (
                            <a
                                href={preview.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-mono text-sm truncate hover:text-primary transition-colors"
                            >
                                {preview.url}
                            </a>
                        ) : (
                            <span className="text-sm text-amber-500 inline-flex items-center gap-1.5">
                                <AlertTriangle className="w-4 h-4" />
                                MOCKUPS_DOMAIN is not configured.
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {live !== null ? (
                            <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                                <Rocket className="w-3 h-3" />
                                Live · v{live}
                            </span>
                        ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                                Not deployed
                            </span>
                        )}
                        <Button variant="outline" size="sm" onClick={copyLink} disabled={!preview.url || live === null}>
                            <Copy className="w-4 h-4" />
                            Copy
                        </Button>
                        {preview.url && live !== null && (
                            <Button size="sm" asChild>
                                <a href={preview.url} target="_blank" rel="noopener noreferrer">
                                    <ExternalLink className="w-4 h-4" />
                                    Open
                                </a>
                            </Button>
                        )}
                    </div>
                </div>

                <MockSentRow
                    lead={lead}
                    busy={busy}
                    canSend={Boolean(preview.url) && live !== null}
                    onCopyAndMark={copyAndMarkSent}
                    onMark={markSent}
                />
            </div>

            <MockupUploader
                projectId={preview.project_id}
                intelilangConnected={intelilangConnected}
                onDeployed={() => onReload()}
            />

            <MockupPreview
                url={preview.url && live !== null ? preview.url : null}
                versionKey={live ?? "none"}
                emptyReason={
                    !preview.url
                        ? "Configure MOCKUPS_DOMAIN to serve previews."
                        : "Nothing deployed yet — the preview appears after the first deploy."
                }
            />
        </div>
    );
}

/** Whether the business has the preview link, with the next action. */
function MockSentRow({
    lead,
    busy,
    canSend,
    onCopyAndMark,
    onMark,
}: {
    lead: LeadDetail;
    busy: boolean;
    canSend: boolean;
    onCopyAndMark: () => void;
    onMark: (sent: boolean) => void;
}) {
    const status = mockStatus(lead);
    const sentAt = lead.mockup_sent_at;

    return (
        <div className={`rounded-lg px-3 py-2.5 flex flex-col sm:flex-row sm:items-center gap-3 ${MOCK_TONE_CLASSES[status.tone]}`}>
            <div className="flex items-start gap-2 min-w-0 flex-1">
                <MailCheck className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="min-w-0">
                    <p className="text-sm font-medium">{status.label}</p>
                    <p className="text-xs opacity-90">
                        {sentAt ? `Sent ${formatDateTime(sentAt)}` : status.hint}
                    </p>
                </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
                {sentAt ? (
                    <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={() => onMark(false)} disabled={busy}>
                        Mark as not sent
                    </Button>
                ) : (
                    <>
                        <Button variant="outline" size="sm" className="h-8 text-xs bg-card" onClick={() => onMark(true)} disabled={busy || !canSend}>
                            Mark as sent
                        </Button>
                        <Button size="sm" className="h-8 text-xs" onClick={onCopyAndMark} disabled={busy || !canSend}>
                            <Copy className="w-3.5 h-3.5" />
                            Copy link &amp; mark sent
                        </Button>
                    </>
                )}
            </div>
        </div>
    );
}

function PanelTitle() {
    return (
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                <Globe className="w-4 h-4 text-sky-400" />
            </div>
            <div>
                <p className="font-medium text-sm">Preview link</p>
                <p className="text-xs text-muted-foreground mt-0.5">A mockup for this lead, live on its own subdomain</p>
            </div>
        </div>
    );
}
