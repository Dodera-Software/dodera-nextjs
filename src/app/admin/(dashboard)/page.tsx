"use client";

import { useEffect, useState } from "react";
import { Users, Key, LayoutDashboard, Wand2, Loader2, CheckCircle2, XCircle, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";

interface Stats {
    subscribers: number;
    tokens: number;
    activeTokens: number;
}

interface AutoPostResult {
    status: "success" | "error";
    message: string;
    uid?: string;
    generated_post?: { title: string; excerpt: string; category: string };
}

export default function AdminDashboardPage() {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    // Auto-post
    const [posting, setPosting] = useState(false);
    const [postResult, setPostResult] = useState<AutoPostResult | null>(null);
    const [publish, setPublish] = useState(false);
    const [showOptions, setShowOptions] = useState(false);
    const [authorName, setAuthorName] = useState("Dodera Team");

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
                const activeTokens = tokens.filter(
                    (t: { revoked_at: string | null; expires_at: string | null }) =>
                        !t.revoked_at &&
                        (!t.expires_at || new Date(t.expires_at) > new Date()),
                );

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
        if (!confirm(`Generate and ${publish ? "publish" : "save as draft"} a new blog post?`)) return;
        setPosting(true);
        setPostResult(null);
        try {
            const res = await fetch("/api/admin/trigger-autopost", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ publish, author_name: authorName }),
            });
            const data = await res.json();
            setPostResult(data);
        } catch {
            setPostResult({ status: "error", message: "Request failed. Check the server logs." });
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
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Overview of your website data
                </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {cards.map((card) => (
                    <div
                        key={card.label}
                        className="rounded-xl border border-border bg-card p-5 space-y-3"
                    >
                        <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground">
                                {card.label}
                            </p>
                            <div className={`w-9 h-9 rounded-lg ${card.bg} flex items-center justify-center`}>
                                <card.icon className={`w-4 h-4 ${card.color}`} />
                            </div>
                        </div>
                        <p className="text-3xl font-bold">
                            {loading ? (
                                <span className="inline-block w-12 h-8 rounded bg-muted animate-pulse" />
                            ) : (
                                card.value
                            )}
                        </p>
                    </div>
                ))}
            </div>

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
                    <button
                        onClick={handleAutoPost}
                        disabled={posting}
                        className="flex-shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
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
                    </button>
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
                            <label className="flex items-center gap-2 text-sm cursor-pointer select-none">
                                <input
                                    type="checkbox"
                                    checked={publish}
                                    onChange={(e) => setPublish(e.target.checked)}
                                    className="rounded border-input accent-primary"
                                />
                                Publish immediately
                                <span className="text-xs text-muted-foreground">(unchecked = draft)</span>
                            </label>
                            <label className="flex items-center gap-2 text-sm">
                                Author name
                                <input
                                    type="text"
                                    value={authorName}
                                    onChange={(e) => setAuthorName(e.target.value)}
                                    className="rounded-md border border-input bg-background px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-ring w-40"
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
                                href={`/blog/${postResult.uid}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline pl-6"
                            >
                                <ExternalLink className="w-3 h-3" />
                                View post →
                            </a>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

