"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
    ArrowLeft,
    Copy,
    ExternalLink,
    Pencil,
    Trash2,
    Loader2,
    History,
    Rocket,
    RotateCcw,
    AlertTriangle,
    Globe,
    MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { MockupUploader } from "@/components/admin/mockups/MockupUploader";
import { MockupPreview } from "@/components/admin/mockups/MockupPreview";
import { MockupIntelilangStatus } from "@/components/admin/mockups/MockupIntelilangStatus";
import { useIntelilangConnected } from "@/lib/mockups-client";
import { formatDateTime } from "@/lib/format";
import { formatBytes } from "@/lib/mockups-client";
import { validateSlug } from "@/config/mockups";
import type { MockupProjectDetail } from "@/types/admin";

export default function MockupProjectPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const confirm = useConfirm();
    const intelilangConnected = useIntelilangConnected();
    const projectId = Number(params.id);

    const [project, setProject] = useState<MockupProjectDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [busyDeploymentId, setBusyDeploymentId] = useState<number | null>(null);
    const [deleting, setDeleting] = useState(false);

    // Edit dialog
    const [showEdit, setShowEdit] = useState(false);
    const [editName, setEditName] = useState("");
    const [editSlug, setEditSlug] = useState("");
    const [editClient, setEditClient] = useState("");
    const [editNotes, setEditNotes] = useState("");
    const [saving, setSaving] = useState(false);

    const load = useCallback(async () => {
        if (!Number.isInteger(projectId) || projectId <= 0) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/admin/mockups/${projectId}`);
            if (res.status === 404) {
                setNotFound(true);
                return;
            }
            const data = await res.json();
            if (data.status === "success") setProject(data.data);
            else toast.error(data.message ?? "Failed to load the project");
        } catch {
            toast.error("Failed to load the project");
        } finally {
            setLoading(false);
        }
    }, [projectId]);

    useEffect(() => {
        load();
    }, [load]);

    function copyLink() {
        if (!project?.url) return;
        navigator.clipboard.writeText(project.url);
        toast.success("Link copied");
    }

    function openEdit() {
        if (!project) return;
        setEditName(project.name);
        setEditSlug(project.slug);
        setEditClient(project.client_name ?? "");
        setEditNotes(project.notes ?? "");
        setShowEdit(true);
    }

    const editSlugError = editSlug ? validateSlug(editSlug) : "Subdomain is required.";

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!project || saving || editSlugError) return;
        setSaving(true);
        try {
            const res = await fetch(`/api/admin/mockups/${project.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: editName, slug: editSlug, client_name: editClient, notes: editNotes }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                setProject(data.data);
                setShowEdit(false);
                toast.success("Project updated");
            } else {
                toast.error(data.message ?? "Failed to update the project");
            }
        } catch {
            toast.error("Failed to update the project");
        } finally {
            setSaving(false);
        }
    }

    async function handleActivate(deploymentId: number, version: number) {
        if (!project) return;
        const ok = await confirm({
            title: `Make version ${version} live?`,
            description: "The project link will immediately serve this version instead of the current one.",
            confirmLabel: "Make live",
            variant: "default",
        });
        if (!ok) return;
        setBusyDeploymentId(deploymentId);
        try {
            const res = await fetch(`/api/admin/mockups/${project.id}/deployments/${deploymentId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ action: "activate" }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                setProject(data.data);
                toast.success(data.message ?? `Version ${version} is live`);
            } else {
                toast.error(data.message ?? "Failed to switch versions");
            }
        } catch {
            toast.error("Failed to switch versions");
        } finally {
            setBusyDeploymentId(null);
        }
    }

    async function handleDeleteDeployment(deploymentId: number, version: number) {
        if (!project) return;
        const ok = await confirm({
            title: `Delete version ${version}?`,
            description: "Its files are removed permanently. The live version is not affected.",
            confirmLabel: "Delete",
        });
        if (!ok) return;
        setBusyDeploymentId(deploymentId);
        try {
            const res = await fetch(`/api/admin/mockups/${project.id}/deployments/${deploymentId}`, {
                method: "DELETE",
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                setProject(data.data);
                toast.success(data.message ?? "Version deleted");
            } else {
                toast.error(data.message ?? "Failed to delete the version");
            }
        } catch {
            toast.error("Failed to delete the version");
        } finally {
            setBusyDeploymentId(null);
        }
    }

    async function handleDeleteProject() {
        if (!project) return;
        const ok = await confirm({
            title: `Delete "${project.name}"?`,
            description: `All versions and files are removed and ${project.url ?? "the preview link"} stops working immediately. This cannot be undone.`,
            confirmLabel: "Delete project",
        });
        if (!ok) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/mockups/${project.id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                toast.success(data.message ?? "Project deleted");
                router.replace("/admin/mockups");
            } else {
                toast.error(data.message ?? "Failed to delete the project");
                setDeleting(false);
            }
        } catch {
            toast.error("Failed to delete the project");
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="py-16 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (notFound || !project) {
        return (
            <div className="space-y-4">
                <Link href="/admin/mockups" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="w-4 h-4" />
                    Back to Mockups
                </Link>
                <div className="rounded-xl border border-border px-6 py-16 text-center text-muted-foreground">
                    <MonitorSmartphone className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    This project does not exist (anymore).
                </div>
            </div>
        );
    }

    const live = project.active_deployment;
    const previewUrl = project.url && live ? project.url : null;

    return (
        <div className="space-y-6">
            <Link href="/admin/mockups" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
                <ArrowLeft className="w-4 h-4" />
                Back to Mockups
            </Link>

            <AdminPageHeader
                title={project.name}
                subtitle={project.client_name ? `For ${project.client_name}` : "No client set"}
                actions={
                    <>
                        <Button variant="outline" size="sm" onClick={openEdit}>
                            <Pencil className="w-4 h-4" />
                            Edit
                        </Button>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDeleteProject}
                            disabled={deleting}
                            className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete
                        </Button>
                    </>
                }
            />

            {/* Share link */}
            <div className="rounded-xl border border-border bg-card p-4 flex flex-col sm:flex-row sm:items-center gap-3">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    <Globe className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {project.url ? (
                        <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-mono text-sm truncate hover:text-primary transition-colors"
                        >
                            {project.url}
                        </a>
                    ) : (
                        <span className="text-sm text-amber-500 inline-flex items-center gap-1.5">
                            <AlertTriangle className="w-4 h-4" />
                            MOCKUPS_DOMAIN is not configured — no link can be served yet.
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    {live ? (
                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500">
                            <Rocket className="w-3 h-3" />
                            Live · v{live.version}
                        </span>
                    ) : (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground">
                            Not deployed
                        </span>
                    )}
                    <Button variant="outline" size="sm" onClick={copyLink} disabled={!project.url}>
                        <Copy className="w-4 h-4" />
                        Copy link
                    </Button>
                    <Button size="sm" asChild={!!project.url} disabled={!project.url}>
                        {project.url ? (
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                                Open
                            </a>
                        ) : (
                            <span>
                                <ExternalLink className="w-4 h-4" />
                                Open
                            </span>
                        )}
                    </Button>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-5">
                <div className="xl:col-span-2 space-y-6">
                    <MockupUploader
                        projectId={project.id}
                        intelilangConnected={intelilangConnected}
                        onDeployed={(updated) => setProject(updated)}
                    />

                    {/* Versions */}
                    <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                                <History className="w-4 h-4 text-amber-400" />
                            </div>
                            <div>
                                <p className="font-medium text-sm">Versions</p>
                                <p className="text-xs text-muted-foreground mt-0.5">
                                    Every deploy is kept so you can roll back
                                </p>
                            </div>
                        </div>

                        {project.deployments.length === 0 ? (
                            <p className="text-sm text-muted-foreground text-center py-6">
                                Nothing deployed yet — upload the mockup above.
                            </p>
                        ) : (
                            <ul className="divide-y divide-border rounded-lg border border-border">
                                {project.deployments.map((d) => {
                                    const busy = busyDeploymentId === d.id;
                                    return (
                                        <li key={d.id} className="flex items-center gap-3 px-3 py-2.5 text-sm">
                                            <span
                                                className={`font-mono text-xs px-1.5 py-0.5 rounded ${d.is_active
                                                    ? "bg-emerald-500/10 text-emerald-500"
                                                    : "bg-muted text-muted-foreground"
                                                    }`}
                                            >
                                                v{d.version}
                                            </span>
                                            <div className="min-w-0 flex-1">
                                                <p className="text-xs text-muted-foreground">
                                                    {formatDateTime(d.created_at)} · {d.file_count} file{d.file_count === 1 ? "" : "s"} ·{" "}
                                                    {formatBytes(d.total_bytes)}
                                                    {d.created_by && ` · ${d.created_by}`}
                                                </p>
                                                {d.note && <p className="text-xs truncate mt-0.5">{d.note}</p>}
                                                <MockupIntelilangStatus
                                                    projectId={project.id}
                                                    deployment={d}
                                                    connected={intelilangConnected}
                                                    onChange={setProject}
                                                />
                                            </div>
                                            {d.is_active ? (
                                                <span className="text-xs text-emerald-500 font-medium">Live</span>
                                            ) : busy ? (
                                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                            ) : (
                                                <div className="flex items-center gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-7 px-2 text-xs"
                                                        onClick={() => handleActivate(d.id, d.version)}
                                                        title="Make this version live"
                                                    >
                                                        <RotateCcw className="w-3.5 h-3.5" />
                                                        Make live
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                                                        onClick={() => handleDeleteDeployment(d.id, d.version)}
                                                        title="Delete this version"
                                                    >
                                                        <Trash2 className="w-3.5 h-3.5" />
                                                    </Button>
                                                </div>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>

                    {project.notes && (
                        <div className="rounded-xl border border-border bg-card p-5">
                            <p className="text-sm font-medium mb-2">Notes</p>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">{project.notes}</p>
                        </div>
                    )}
                </div>

                <div className="xl:col-span-3">
                    <MockupPreview
                        url={previewUrl}
                        versionKey={live?.id ?? "none"}
                        emptyReason={
                            !project.url
                                ? "Configure MOCKUPS_DOMAIN to serve previews."
                                : "Nothing deployed yet — the preview appears after the first deploy."
                        }
                    />
                </div>
            </div>

            {/* Edit Dialog */}
            <Dialog open={showEdit} onOpenChange={setShowEdit}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>Edit project</DialogTitle>
                        <DialogDescription>Changing the subdomain changes the link — old links stop working.</DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSave} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="editName">Project name</Label>
                            <Input id="editName" value={editName} onChange={(e) => setEditName(e.target.value)} required maxLength={120} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editSlug">Subdomain</Label>
                            <Input
                                id="editSlug"
                                value={editSlug}
                                onChange={(e) => setEditSlug(e.target.value.toLowerCase())}
                                required
                                className="font-mono text-sm"
                            />
                            {editSlugError && editSlug && <p className="text-xs text-destructive">{editSlugError}</p>}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editClient">Client / lead</Label>
                            <Input id="editClient" value={editClient} onChange={(e) => setEditClient(e.target.value)} maxLength={120} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="editNotes">Notes</Label>
                            <Textarea
                                id="editNotes"
                                value={editNotes}
                                onChange={(e) => setEditNotes(e.target.value)}
                                maxLength={2000}
                                placeholder="Context for the team — what was pitched, feedback, next steps…"
                                className="min-h-[90px] text-sm"
                            />
                        </div>
                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setShowEdit(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving || !editName.trim() || !!editSlugError}>
                                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                                {saving ? "Saving…" : "Save"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
