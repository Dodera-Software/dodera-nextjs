"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Users, Key, LayoutDashboard, Wand2, Loader2, CheckCircle2, XCircle, ExternalLink, ChevronDown, ChevronUp, BarChart2, GitBranch, Database, Plus, Trash2, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { isTokenActive } from "@/lib/utils";
import type { DashboardStats, AutoPostResult } from "@/types/admin";

interface BlogExampleItem {
    id: number;
    content: string;
    created_at: string;
}

/* ── Platform-aware quick links ────────────────────────────── */
const PLATFORM = process.env.NEXT_PUBLIC_DEPLOY_PLATFORM ?? "netlify";

const PLATFORM_LINKS: Record<string, { label: string; description: string; icon: React.ElementType; color: string; bg: string; url?: string }[]> = {
    netlify: [
        {
            label: "Netlify",
            description: "Deployments & settings",
            icon: ExternalLink,
            color: "text-sky-400",
            bg: "bg-sky-400/10",
            url: process.env.NEXT_PUBLIC_ADMIN_LINK_NETLIFY,
        },
        {
            label: "Netlify Analytics",
            description: "Traffic & performance",
            icon: BarChart2,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
            url: process.env.NEXT_PUBLIC_ADMIN_LINK_NETLIFY_ANALYTICS,
        },
    ],
    vercel: [
        {
            label: "Vercel",
            description: "Deployments & settings",
            icon: ExternalLink,
            color: "text-sky-400",
            bg: "bg-sky-400/10",
            url: process.env.NEXT_PUBLIC_ADMIN_LINK_VERCEL,
        },
        {
            label: "Vercel Analytics",
            description: "Traffic & performance",
            icon: BarChart2,
            color: "text-violet-400",
            bg: "bg-violet-400/10",
            url: process.env.NEXT_PUBLIC_ADMIN_LINK_VERCEL_ANALYTICS,
        },
    ],
};

const QUICK_LINKS = [
    ...(PLATFORM_LINKS[PLATFORM] ?? []),
    {
        label: "Prismic Migration",
        description: "Drafts waiting to publish",
        icon: GitBranch,
        color: "text-rose-400",
        bg: "bg-rose-400/10",
        url: process.env.NEXT_PUBLIC_ADMIN_LINK_PRISMIC_MIGRATION,
    },
    {
        label: "Supabase",
        description: "Database & auth",
        icon: Database,
        color: "text-emerald-400",
        bg: "bg-emerald-400/10",
        url: process.env.NEXT_PUBLIC_ADMIN_LINK_SUPABASE,
    },
].filter((l) => !!l.url) as { label: string; description: string; icon: React.ElementType; color: string; bg: string; url: string }[];

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    // Auto-post
    const [posting, setPosting] = useState(false);
    const [postResult, setPostResult] = useState<AutoPostResult | null>(null);
    const [showOptions, setShowOptions] = useState(false);
    const [authorName, setAuthorName] = useState("Dodera Team");
    const confirm = useConfirm();

    // Blog post examples
    const [examples, setExamples] = useState<BlogExampleItem[]>([]);
    const [examplesLoaded, setExamplesLoaded] = useState(false);
    const [examplesOpen, setExamplesOpen] = useState(false);
    const [newExampleText, setNewExampleText] = useState("");
    const [addingExample, setAddingExample] = useState(false);
    const [deletingExampleId, setDeletingExampleId] = useState<number | null>(null);
    const [expandedExampleIds, setExpandedExampleIds] = useState<Set<number>>(new Set());

    useEffect(() => {
        async function fetchStats() {
            try {
                const [subsRes, tokensRes] = await Promise.all([
                    fetch("/api/admin/subscribers?limit=1"),
                    fetch("/api/admin/tokens"),
                ]);

                const subsData = await subsRes.json();
                const tokensData = await tokensRes.json();

                const tokens = tokensData.data || [];
                const activeTokens = tokens.filter(isTokenActive);

                setStats({
                    subscribers: subsData.pagination?.total || 0,
                    tokens: tokens.length,
                    activeTokens: activeTokens.length,
                });
            } catch {
                console.error("Failed to load dashboard stats");
            } finally {
                setLoading(false);
            }
        }

        fetchStats();
    }, []);

    /* ── Blog post examples ──────────────────────────────────── */
    const fetchExamples = useCallback(async () => {
        if (examplesLoaded) return;
        try {
            const res = await fetch("/api/admin/blog-post-examples");
            const data = await res.json();
            if (data.status === "success") {
                setExamples(data.examples);
                setExamplesLoaded(true);
            }
        } catch {
            // non-blocking
        }
    }, [examplesLoaded]);

    const handleToggleExamples = () => {
        const next = !examplesOpen;
        setExamplesOpen(next);
        if (next) fetchExamples();
    };

    const handleAddExample = useCallback(async () => {
        if (!newExampleText.trim() || addingExample) return;
        setAddingExample(true);
        try {
            const res = await fetch("/api/admin/blog-post-examples", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newExampleText.trim() }),
            });
            const data = await res.json();
            if (data.status === "success") {
                setExamples((prev) => [...prev, data.example]);
                setNewExampleText("");
                toast.success("Example added.");
            } else {
                toast.error(data.message ?? "Failed to add example.");
            }
        } finally {
            setAddingExample(false);
        }
    }, [newExampleText, addingExample]);

    const handleDeleteExample = useCallback(async (id: number) => {
        setDeletingExampleId(id);
        try {
            await fetch(`/api/admin/blog-post-examples/${id}`, { method: "DELETE" });
            setExamples((prev) => prev.filter((e) => e.id !== id));
            toast.success("Example removed.");
        } finally {
            setDeletingExampleId(null);
        }
    }, []);

    const toggleExpandExample = (id: number) => {
        setExpandedExampleIds((prev) => {
            const next = new Set(prev);
            next.has(id) ? next.delete(id) : next.add(id);
            return next;
        });
    };

    async function handleAutoPost() {
        setPosting(true);
        setPostResult(null);
        try {
            const res = await fetch("/api/admin/trigger-autopost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publish: false, author_name: authorName }),
            });
            const data = await res.json();
            setPostResult(data);
            if (data.status === "success") {
                toast.success(data.message ?? "Blog post generated");
            } else {
                toast.error(data.message ?? "Auto post failed");
            }
        } catch {
            const errResult = { status: "error" as const, message: "Request failed. Check the server logs." };
            setPostResult(errResult);
            toast.error(errResult.message);
        } finally {
            setPosting(false);
        }
    }

    const cards = [
        {
            label: "Total Subscribers",
            value: stats?.subscribers ?? "—",
            icon: Users,
            color: "text-blue-400",
            bg: "bg-blue-400/10",
        },
        {
            label: "Total API Tokens",
            value: stats?.tokens ?? "—",
            icon: Key,
            color: "text-amber-400",
            bg: "bg-amber-400/10",
        },
        {
            label: "Active Tokens",
            value: stats?.activeTokens ?? "—",
            icon: LayoutDashboard,
            color: "text-emerald-400",
            bg: "bg-emerald-400/10",
        },
    ];

    return (
        <div className="space-y-6">
            <AdminPageHeader title="Dashboard" subtitle="Overview of your website data" />

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <AdminStatCard
                        key={card.label}
                        label={card.label}
                        value={card.value as string | number}
                        icon={card.icon}
                        iconColor={card.color}
                        iconBg={card.bg}
                        isLoading={loading}
                    />
                ))}
            </div>

            {/* Quick Links */}
            {QUICK_LINKS.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-5 space-y-3">
                    <p className="text-sm font-medium">Quick Links</p>
                    <div className="flex flex-wrap gap-2">
                        {QUICK_LINKS.map((link) => (
                            <Button key={link.label} variant="outline" size="sm" asChild>
                                <a href={link.url} target="_blank" rel="noopener noreferrer">
                                    <link.icon className={`w-3.5 h-3.5 ${link.color}`} />
                                    {link.label}
                                    <ExternalLink className="w-3 h-3 opacity-40" />
                                </a>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Auto Post */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <Wand2 className="w-4 h-4 text-primary" />
                        </div>
                        <div>
                            <p className="font-medium text-sm">Auto Post</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                                AI generates a trending blog post and saves it to Prismic
                            </p>
                        </div>
                    </div>
                    <Button onClick={async () => {
                        const ok = await confirm({
                            title: "Generate blog post",
                            description: "AI will generate a trending blog post and save it as a draft in Prismic. Continue?",
                            confirmLabel: "Generate",
                            variant: "default",
                        });
                        if (ok) handleAutoPost();
                    }} disabled={posting}>
                        {posting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Generating…
                            </>
                        ) : (
                            <>
                                <Wand2 className="w-4 h-4" />
                                Trigger
                            </>
                        )}
                    </Button>
                </div>

                {/* Options toggle */}
                <div>
                    <button
                        onClick={() => setShowOptions((v) => !v)}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        {showOptions ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        Options
                    </button>

                    {showOptions && (
                        <div className="mt-3 flex flex-wrap gap-4 items-center">
                            <label className="flex items-center gap-2 text-sm">
                                Author name
                                <Input
                                    type="text"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    className="w-40 h-8"
                                />
                            </label>
                        </div>
                    )}
                </div>

                {/* Blog post examples */}
                <div className="border-t border-border pt-4">
                    <button
                        onClick={handleToggleExamples}
                        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors"
                    >
                        <BookOpen className="w-3.5 h-3.5" />
                        Post Examples
                        {examples.length > 0 && (
                            <span className="ml-1 rounded-full bg-primary/10 text-primary px-1.5 py-0 text-[10px] font-medium">
                                {examples.length}
                            </span>
                        )}
                        {examplesOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>

                    {examplesOpen && (
                        <div className="mt-3 space-y-3">
                            <p className="text-xs text-muted-foreground">
                                Paste blog posts you like. The AI will mirror their structure, tone, length, and linking style.
                            </p>

                            {/* Existing examples */}
                            {examples.length > 0 && (
                                <div className="space-y-2">
                                    {examples.map((ex) => {
                                        const isExpanded = expandedExampleIds.has(ex.id);
                                        const preview = ex.content.slice(0, 120);
                                        return (
                                            <div key={ex.id} className="rounded-lg border border-border bg-muted/30 p-3 text-xs">
                                                <div className="flex items-start justify-between gap-2">
                                                    <p className="leading-relaxed text-foreground whitespace-pre-wrap break-words flex-1">
                                                        {isExpanded ? ex.content : preview}
                                                        {!isExpanded && ex.content.length > 120 && "…"}
                                                    </p>
                                                    <div className="flex items-center gap-1 shrink-0">
                                                        {ex.content.length > 120 && (
                                                            <button
                                                                onClick={() => toggleExpandExample(ex.id)}
                                                                className="text-muted-foreground hover:text-foreground transition-colors p-1"
                                                                title={isExpanded ? "Collapse" : "Expand"}
                                                            >
                                                                {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => handleDeleteExample(ex.id)}
                                                            disabled={deletingExampleId === ex.id}
                                                            className="text-muted-foreground hover:text-destructive transition-colors p-1"
                                                            title="Delete example"
                                                        >
                                                            {deletingExampleId === ex.id
                                                                ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                                                : <Trash2 className="w-3.5 h-3.5" />}
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}

                            {/* Add new example */}
                            <div className="space-y-2">
                                <Textarea
                                    value={newExampleText}
                                    onChange={(e) => setNewExampleText(e.target.value)}
                                    placeholder="Paste a blog post example here…"
                                    className="text-xs min-h-[100px] resize-y"
                                />
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleAddExample}
                                    disabled={addingExample || !newExampleText.trim()}
                                    className="h-7 text-xs"
                                >
                                    {addingExample
                                        ? <><Loader2 className="w-3 h-3 animate-spin" /> Adding…</>
                                        : <><Plus className="w-3 h-3" /> Add Example</>}
                                </Button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Result */}
                {postResult && (
                    <div className={`rounded-lg border px-4 py-3 text-sm space-y-2 ${postResult.status === "success"
                        ? "bg-emerald-500/10 border-emerald-500/20"
                        : "bg-destructive/10 border-destructive/20"
                        }`}>
                        <div className="flex items-center gap-2 font-medium">
                            {postResult.status === "success" ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                                <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />
                            )}
                            {postResult.message}
                        </div>
                        {postResult.generated_post && (
                            <div className="text-xs text-muted-foreground space-y-0.5 pl-6">
                                <p><span className="font-medium text-foreground">Title:</span> {postResult.generated_post.title}</p>
                                <p><span className="font-medium text-foreground">Category:</span> {postResult.generated_post.category}</p>
                            </div>
                        )}
                        {postResult.uid && (
                            <a
                                href="https://dodera-nextjs.prismic.io/builder/migration"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline pl-6"
                            >
                                <ExternalLink className="w-3 h-3" />
                                View in Prismic →
                            </a>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
}

