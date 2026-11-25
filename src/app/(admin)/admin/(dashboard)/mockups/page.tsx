"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
    Plus,
    RefreshCw,
    MonitorSmartphone,
    ExternalLink,
    Copy,
    Loader2,
    AlertTriangle,
    Rocket,
    ArrowRight,
    Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { formatTimeAgo } from "@/lib/format";
import { slugify, validateSlug } from "@/config/mockups";
import type { MockupProject } from "@/types/admin";

export default function MockupsPage() {
    const router = useRouter();
    const [projects, setProjects] = useState<MockupProject[]>([]);
    const [domain, setDomain] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    // Create dialog
    const [showCreate, setShowCreate] = useState(false);
    const [name, setName] = useState("");
    const [slug, setSlug] = useState("");
    const [slugTouched, setSlugTouched] = useState(false);
    const [clientName, setClientName] = useState("");
    const [creating, setCreating] = useState(false);

    const fetchProjects = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/admin/mockups");
            const data = await res.json();
            if (data.status === "success") {
                setProjects(data.data);
                setDomain(data.domain ?? null);
            } else {
                toast.error(data.message ?? "Failed to load projects");
            }
        } catch {
            toast.error("Failed to load projects");
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects]);

    // Keep the subdomain in sync with the name until it is edited by hand.
    useEffect(() => {
        if (!slugTouched) setSlug(slugify(name));
    }, [name, slugTouched]);

    const slugError = slug ? validateSlug(slug) : null;

    function openCreate() {
        setName("");
        setSlug("");
        setSlugTouched(false);
        setClientName("");
        setShowCreate(true);
    }

    async function handleCreate(e: React.FormEvent) {
        e.preventDefault();
        if (creating || slugError) return;
        setCreating(true);
        try {
            const res = await fetch("/api/admin/mockups", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, slug, client_name: clientName }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                toast.success("Project created — upload your mockup to go live.");
                setShowCreate(false);
                router.push(`/admin/mockups/${data.data.id}`);
            } else {
                toast.error(data.message ?? "Failed to create the project");
            }
        } catch {
            toast.error("Failed to create the project");
        } finally {
            setCreating(false);
        }
    }

    function copyLink(url: string) {
        navigator.clipboard.writeText(url);
        toast.success("Link copied");
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Mockups"
                subtitle={`${projects.length} project${projects.length !== 1 ? "s" : ""} — deploy HTML mockups to a shareable link for leads`}
                actions={
                    <>
                        <Button variant="outline" size="sm" onClick={fetchProjects}>
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </Button>
                        <Button size="sm" onClick={openCreate}>
                            <Plus className="w-4 h-4" />
                            New project
                        </Button>
                    </>
                }
            />

            {!loading && !domain && (
                <div className="rounded-lg bg-amber-500/10 border border-amber-500/20 px-4 py-3 text-sm text-amber-500 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <span>
                        <span className="font-medium">MOCKUPS_DOMAIN is not configured.</span> You can create projects and
                        upload files, but no preview links can be served until it is set (see MOCKUPS.md).
                    </span>
                </div>
            )}

            {loading ? (
                <div className="py-16 flex justify-center">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : projects.length === 0 ? (
                <div className="rounded-xl border border-dashed border-border px-6 py-16 text-center">
                    <MonitorSmartphone className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-50" />
                    <p className="font-medium">No mockup projects yet</p>
                    <p className="text-sm text-muted-foreground mt-1 max-w-md mx-auto">
                        Create a project for a lead, drop in the HTML / CSS / JS, and share the link
                        {domain ? (
                            <>
                                {" "}
                                <span className="font-mono text-foreground">https://&lt;name&gt;.{domain}</span>
                            </>
                        ) : null}
                        .
                    </p>
                    <Button size="sm" className="mt-5" onClick={openCreate}>
                        <Plus className="w-4 h-4" />
                        New project
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                    {projects.map((p) => {
                        const live = p.active_deployment;
                        return (
                            <div
                                key={p.id}
                                className="rounded-xl border border-border bg-card p-5 flex flex-col gap-4 hover:border-primary/40 transition-colors"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <Link
                                            href={`/admin/mockups/${p.id}`}
                                            className="font-medium hover:text-primary transition-colors truncate block"
                                        >
                                            {p.name}
                                        </Link>
                                        <p className="text-xs text-muted-foreground mt-0.5 truncate">
                                            {p.client_name || "No client set"}
                                        </p>
                                    </div>
                                    {live ? (
                                        <span className="inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-500 flex-shrink-0">
                                            <Rocket className="w-3 h-3" />
                                            Live · v{live.version}
                                        </span>
                                    ) : (
                                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground flex-shrink-0">
                                            Not deployed
                                        </span>
                                    )}
                                </div>

                                <div className="flex items-center gap-1.5 rounded-lg bg-background border border-border px-3 py-2">
                                    <Globe className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                    <span className="font-mono text-xs truncate flex-1" title={p.url ?? undefined}>
                                        {p.url ? p.url.replace(/^https?:\/\//, "") : `${p.slug}.<domain not set>`}
                                    </span>
                                    {p.url && (
                                        <>
                                            <button
                                                type="button"
                                                onClick={() => copyLink(p.url!)}
                                                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                                                title="Copy link"
                                            >
                                                <Copy className="w-3.5 h-3.5" />
                                            </button>
                                            <a
                                                href={p.url}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-muted-foreground hover:text-foreground transition-colors p-0.5"
                                                title="Open"
                                            >
                                                <ExternalLink className="w-3.5 h-3.5" />
                                            </a>
                                        </>
                                    )}
                                </div>

                                <div className="flex items-center justify-between text-xs text-muted-foreground mt-auto">
                                    <span>
                                        {live ? `Deployed ${formatTimeAgo(live.created_at)}` : `Created ${formatTimeAgo(p.created_at)}`}
                                        {p.deployments_count > 0 && ` · ${p.deployments_count} version${p.deployments_count === 1 ? "" : "s"}`}
                                    </span>
                                    <Link
                                        href={`/admin/mockups/${p.id}`}
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        Open
                                        <ArrowRight className="w-3 h-3" />
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Create Project Dialog */}
            <Dialog open={showCreate} onOpenChange={setShowCreate}>
                <DialogContent className="max-w-md">
                    <DialogHeader>
                        <DialogTitle>New mockup project</DialogTitle>
                        <DialogDescription>
                            One project per lead. You upload the files on the next screen.
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="mockupName">Project name</Label>
                            <Input
                                id="mockupName"
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                maxLength={120}
                                autoFocus
                                placeholder='e.g. "Venetian Nail Spa"'
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mockupSlug">Subdomain</Label>
                            <div className="flex items-center gap-1.5">
                                <Input
                                    id="mockupSlug"
                                    type="text"
                                    value={slug}
                                    onChange={(e) => {
                                        setSlugTouched(true);
                                        setSlug(e.target.value.toLowerCase());
                                    }}
                                    required
                                    className="font-mono text-sm"
                                    placeholder="venetian-nail-spa"
                                />
                                {domain && (
                                    <span className="text-xs text-muted-foreground whitespace-nowrap">.{domain}</span>
                                )}
                            </div>
                            {slugError ? (
                                <p className="text-xs text-destructive">{slugError}</p>
                            ) : (
                                <p className="text-xs text-muted-foreground">
                                    Lowercase letters, numbers and dashes. This is the link you send to the lead.
                                </p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="mockupClient">Client / lead (optional)</Label>
                            <Input
                                id="mockupClient"
                                type="text"
                                value={clientName}
                                onChange={(e) => setClientName(e.target.value)}
                                maxLength={120}
                                placeholder="Company or contact name"
                            />
                        </div>

                        <DialogFooter className="gap-2 sm:gap-0">
                            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={creating || !name.trim() || !!slugError || !slug}>
                                {creating && <Loader2 className="w-4 h-4 animate-spin" />}
                                {creating ? "Creating…" : "Create project"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
