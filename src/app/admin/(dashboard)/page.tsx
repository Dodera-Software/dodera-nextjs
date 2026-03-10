"use client";

import React, { useEffect, useState } from "react";
import { Users, Key, LayoutDashboard, Wand2, Loader2, CheckCircle2, XCircle, ExternalLink, ChevronDown, ChevronUp, BarChart2, GitBranch, Database } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { isTokenActive } from "@/lib/utils";
import type { DashboardStats, AutoPostResult } from "@/types/admin";

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

