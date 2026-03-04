"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
    Loader2,
    Search,
    ExternalLink,
    Copy,
    Check,
    RefreshCw,
    Sparkles,
    AlertTriangle,
    ChevronRight,
    CalendarDays,
    Tag,
    Send,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { PLATFORMS, getPlatformShareUrl, type SocialPlatform } from "./platforms";

/* ── Types ─────────────────────────────────────────────────── */

interface BlogPost {
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    date: string | null;
    read_time: string;
    tags: string[];
    url: string;
    image: string | null;
    body_plain: string;
}

interface GeneratedItem {
    platform: SocialPlatform;
    post: string;
    loading: boolean;
    error?: string;
}

/* ── Component ──────────────────────────────────────────────── */

export default function GenerateSocialPostPage() {
    /* posts */
    const [posts, setPosts] = useState<BlogPost[]>([]);
    const [postsLoading, setPostsLoading] = useState(true);
    const [postsError, setPostsError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    /* selection */
    const [selected, setSelected] = useState<BlogPost | null>(null);

    /* generation */
    const [activePlatform, setActivePlatform] = useState<SocialPlatform | null>(null);
    const [generated, setGenerated] = useState<Partial<Record<SocialPlatform, GeneratedItem>>>({});
    const [generating, setGenerating] = useState(false);

    /* copy / share state */
    const [copied, setCopied] = useState(false);
    const [shared, setShared] = useState(false);
    const outputRef = useRef<HTMLDivElement>(null);

    /* ── Fetch posts ─────────────────────────────────────────── */
    useEffect(() => {
        setPostsLoading(true);
        fetch("/api/admin/blog-posts")
            .then((r) => r.json())
            .then((data) => {
                if (data.status === "success") {
                    setPosts(data.posts);
                } else {
                    setPostsError(data.message ?? "Failed to load posts.");
                }
            })
            .catch(() => setPostsError("Network error — could not load blog posts."))
            .finally(() => setPostsLoading(false));
    }, []);

    /* ── Filter posts by search ──────────────────────────────── */
    const filtered = posts.filter((p) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
            p.title.toLowerCase().includes(q) ||
            p.excerpt.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q) ||
            p.tags.some((t) => t.toLowerCase().includes(q))
        );
    });

    /* ── Generate ────────────────────────────────────────────── */
    const generate = useCallback(
        async (platform: SocialPlatform) => {
            if (!selected || generating) return;
            setActivePlatform(platform);
            setGenerating(true);

            // Set loading state for this platform
            setGenerated((prev) => ({
                ...prev,
                [platform]: { platform, post: "", loading: true },
            }));

            // Scroll to output
            setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" }), 100);

            try {
                const res = await fetch("/api/admin/social-post", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        platform,
                        blog: {
                            title: selected.title,
                            excerpt: selected.excerpt,
                            category: selected.category,
                            tags: selected.tags,
                            url: selected.url,
                            body_plain: selected.body_plain,
                        },
                    }),
                });

                const data = await res.json();

                if (!res.ok || data.status !== "success") {
                    setGenerated((prev) => ({
                        ...prev,
                        [platform]: {
                            platform,
                            post: "",
                            loading: false,
                            error: data.message ?? "Generation failed.",
                        },
                    }));
                    return;
                }

                setGenerated((prev) => ({
                    ...prev,
                    [platform]: { platform, post: data.post, loading: false },
                }));
            } catch {
                setGenerated((prev) => ({
                    ...prev,
                    [platform]: {
                        platform,
                        post: "",
                        loading: false,
                        error: "Request failed. Check the server logs.",
                    },
                }));
            } finally {
                setGenerating(false);
            }
        },
        [selected, generating],
    );

    /* ── Copy ────────────────────────────────────────────────── */
    const handleCopy = useCallback(async (text: string) => {
        try {
            await navigator.clipboard.writeText(text);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            // fallback
        }
    }, []);

    /* ── Open in platform (copy text + redirect) ─────────────── */
    const handleOpenInPlatform = useCallback(async (platform: SocialPlatform, text: string, articleUrl: string) => {
        try {
            await navigator.clipboard.writeText(text);
        } catch { /* ignore */ }
        setShared(true);
        setTimeout(() => setShared(false), 2500);
        window.open(getPlatformShareUrl(platform, articleUrl), "_blank", "noopener,noreferrer");
    }, []);

    /* ── Select a post ───────────────────────────────────────── */
    const handleSelect = (post: BlogPost) => {
        setSelected(post);
        setGenerated({});
        setActivePlatform(null);
        setShared(false);
        setCopied(false);
    };

    /* ── Regenerate helper ───────────────────────────────────── */
    const generateSocialPostRegenerate = useCallback((platform: SocialPlatform) => {
        setShared(false);
        setCopied(false);
        setGenerated((prev) => {
            const next = { ...prev };
            delete next[platform];
            return next;
        });
        generate(platform);
    }, [generate]);

    /* ── Active generated content ────────────────────────────── */
    const activeItem = activePlatform ? generated[activePlatform] : null;

    /* ── Format date ─────────────────────────────────────────── */
    const fmt = (d: string | null) =>
        d
            ? new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
            : null;

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Generate Social Post</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Select a published blog post and generate platform-ready social content with AI
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">

                {/* ── Left: Post selector ───────────────────────────────── */}
                <div className="rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                    <div className="px-4 pt-4 pb-3 border-b border-border">
                        <p className="text-sm font-semibold mb-2">Published Posts</p>
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground pointer-events-none" />
                            <Input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search by title, category, tag…"
                                className="h-8 pl-8 text-xs"
                            />
                        </div>
                    </div>

                    <div className="overflow-y-auto max-h-[480px]">
                        {postsLoading && (
                            <div className="flex items-center justify-center gap-2 py-10 text-muted-foreground">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="text-sm">Loading posts…</span>
                            </div>
                        )}

                        {postsError && (
                            <div className="flex items-start gap-2 m-4 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                                <p className="text-xs text-destructive">{postsError}</p>
                            </div>
                        )}

                        {!postsLoading && !postsError && filtered.length === 0 && (
                            <p className="text-center text-sm text-muted-foreground py-10">
                                {search ? "No posts match your search." : "No published posts found."}
                            </p>
                        )}

                        {!postsLoading && !postsError && filtered.map((post) => {
                            const isSelected = selected?.slug === post.slug;
                            return (
                                <button
                                    key={post.slug}
                                    onClick={() => handleSelect(post)}
                                    className={`w-full text-left px-4 py-3 border-b border-border last:border-0 transition-colors flex items-start gap-3 group
                                        ${isSelected
                                            ? "bg-primary/8 border-l-2 border-l-primary"
                                            : "hover:bg-muted/40 border-l-2 border-l-transparent"
                                        }`}
                                >
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-0.5">
                                            {post.category && (
                                                <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4 font-normal shrink-0">
                                                    {post.category}
                                                </Badge>
                                            )}
                                            {post.date && (
                                                <span className="text-[10px] text-muted-foreground shrink-0">{fmt(post.date)}</span>
                                            )}
                                        </div>
                                        <p className={`text-sm font-medium leading-snug truncate ${isSelected ? "text-primary" : ""}`}>
                                            {post.title}
                                        </p>
                                        {post.excerpt && (
                                            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
                                                {post.excerpt}
                                            </p>
                                        )}
                                    </div>
                                    <ChevronRight className={`w-3.5 h-3.5 flex-shrink-0 mt-1 transition-colors ${isSelected ? "text-primary" : "text-muted-foreground/40 group-hover:text-muted-foreground"}`} />
                                </button>
                            );
                        })}
                    </div>

                    {!postsLoading && posts.length > 0 && (
                        <div className="px-4 py-2 border-t border-border">
                            <p className="text-[10px] text-muted-foreground">
                                {filtered.length} of {posts.length} post{posts.length !== 1 ? "s" : ""}
                            </p>
                        </div>
                    )}
                </div>

                {/* ── Right: Generation panel ───────────────────────────── */}
                <div className="flex flex-col gap-4">

                    {/* No post selected — empty state */}
                    {!selected && (
                        <div className="rounded-xl border border-border bg-card flex flex-col items-center justify-center py-16 px-6 text-center gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-primary/10 ring-1 ring-primary/20 flex items-center justify-center">
                                <Sparkles className="w-6 h-6 text-primary opacity-80" />
                            </div>
                            <div>
                                <p className="text-sm font-semibold">Select a blog post</p>
                                <p className="text-xs text-muted-foreground mt-1 max-w-xs">
                                    Pick any published article from the list and instantly generate LinkedIn, Facebook, or Instagram content.
                                </p>
                            </div>
                        </div>
                    )}

                    {/* Post selected */}
                    {selected && (
                        <>
                            {/* Post preview card */}
                            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex flex-wrap items-center gap-2 mb-1">
                                            {selected.category && (
                                                <Badge variant="secondary" className="text-xs px-2">
                                                    {selected.category}
                                                </Badge>
                                            )}
                                            {selected.read_time && (
                                                <span className="text-xs text-muted-foreground">{selected.read_time}</span>
                                            )}
                                            {selected.date && (
                                                <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <CalendarDays className="w-3 h-3" />
                                                    {fmt(selected.date)}
                                                </span>
                                            )}
                                        </div>
                                        <h2 className="text-base font-semibold leading-snug">{selected.title}</h2>
                                        {selected.excerpt && (
                                            <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{selected.excerpt}</p>
                                        )}
                                        {selected.tags.length > 0 && (
                                            <div className="flex flex-wrap items-center gap-1.5 mt-2">
                                                <Tag className="w-3 h-3 text-muted-foreground/60" />
                                                {selected.tags.map((t) => (
                                                    <span key={t} className="text-xs text-muted-foreground bg-muted/50 px-1.5 py-0.5 rounded">
                                                        {t}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                    <a
                                        href={selected.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                                        title="Open article"
                                    >
                                        <ExternalLink className="w-4 h-4" />
                                    </a>
                                </div>
                            </div>

                            {/* Platform buttons */}
                            <div className="rounded-xl border border-border bg-card p-4 space-y-3">
                                <div>
                                    <p className="text-sm font-semibold">Choose a platform</p>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                        Each platform has its own AI agent tuned for that audience and format
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {PLATFORMS.map((p) => {
                                        const isActive = activePlatform === p.id;
                                        const isLoading = generating && activePlatform === p.id;
                                        const hasResult = !!generated[p.id]?.post;

                                        return (
                                            <button
                                                key={p.id}
                                                onClick={() => {
                                                    setActivePlatform(p.id);
                                                    setShared(false);
                                                    setCopied(false);
                                                    if (!generated[p.id]?.post) {
                                                        generate(p.id);
                                                    }
                                                }}
                                                disabled={generating}
                                                className={`relative flex items-center gap-3 rounded-lg border px-4 py-3 text-sm font-medium transition-all text-left
                                                    ${isActive ? p.activeColor : p.color}
                                                    disabled:opacity-50 disabled:cursor-not-allowed`}
                                            >
                                                <span className="w-7 h-7 rounded-full bg-current/10 ring-1 ring-current/20 flex items-center justify-center shrink-0 select-none" aria-hidden>
                                                    {isLoading ? (
                                                        <Loader2 className="w-3 h-3 animate-spin" />
                                                    ) : (
                                                        <p.Icon className="w-3.5 h-3.5" />
                                                    )}
                                                </span>
                                                <div className="min-w-0">
                                                    <div className="flex items-center gap-2">
                                                        <span>{p.label}</span>
                                                        {hasResult && !isLoading && (
                                                            <span className="text-[10px] font-normal opacity-70 bg-current/10 rounded px-1 py-0 leading-4">
                                                                ready
                                                            </span>
                                                        )}
                                                    </div>
                                                    <p className={`text-[11px] font-normal mt-0.5 leading-tight ${isActive ? "opacity-80" : "opacity-60"}`}>
                                                        {p.description}
                                                    </p>
                                                </div>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Generated output */}
                            {activePlatform && (
                                <div ref={outputRef} className="rounded-xl border border-border bg-card overflow-hidden">
                                    {/* Output header */}
                                    <div className="flex items-center justify-between gap-3 px-4 py-3 border-b border-border bg-muted/20">
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-3.5 h-3.5 text-primary" />
                                            <p className="text-sm font-semibold capitalize">
                                                {PLATFORMS.find((p) => p.id === activePlatform)?.label} Post
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {activeItem?.post && !activeItem.loading && (
                                                <>
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-7 gap-1.5 text-xs"
                                                        onClick={() => generateSocialPostRegenerate(activePlatform)}
                                                        disabled={generating}
                                                    >
                                                        <RefreshCw className="w-3 h-3" />
                                                        Regenerate
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="h-7 gap-1.5 text-xs"
                                                        onClick={() => handleCopy(activeItem.post)}
                                                    >
                                                        {copied ? (
                                                            <>
                                                                <Check className="w-3 h-3 text-green-500" />
                                                                Copied!
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Copy className="w-3 h-3" />
                                                                Copy
                                                            </>
                                                        )}
                                                    </Button>
                                                </>
                                            )}
                                        </div>
                                    </div>

                                    {/* Output body */}
                                    <div className="p-4 space-y-4">
                                        {activeItem?.loading && (
                                            <div className="flex items-center gap-3 py-6 justify-center text-muted-foreground">
                                                <Loader2 className="w-4 h-4 animate-spin text-primary" />
                                                <span className="text-sm">AI is crafting your post…</span>
                                            </div>
                                        )}

                                        {activeItem?.error && !activeItem.loading && (
                                            <div className="flex items-start gap-2.5 p-3 rounded-lg bg-destructive/10 border border-destructive/20">
                                                <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                                                <div>
                                                    <p className="text-sm font-medium text-destructive">Generation failed</p>
                                                    <p className="text-xs text-muted-foreground mt-0.5">{activeItem.error}</p>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        className="mt-3 h-7 text-xs gap-1.5"
                                                        onClick={() => generate(activePlatform)}
                                                        disabled={generating}
                                                    >
                                                        <RefreshCw className="w-3 h-3" />
                                                        Try again
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {activeItem?.post && !activeItem.loading && (() => {
                                            const meta = PLATFORMS.find((p) => p.id === activePlatform)!;
                                            return (
                                                <>
                                                    {/* Post text */}
                                                    <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
                                                        {activeItem.post}
                                                    </pre>

                                                    {/* Blog image — shown for Facebook & Instagram */}
                                                    {meta.showImage && selected?.image && (
                                                        <div className="rounded-lg overflow-hidden border border-border">
                                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                                            <img
                                                                src={selected.image}
                                                                alt={selected.title}
                                                                className="w-full h-auto object-cover"
                                                            />
                                                            <div className="px-3 py-2 bg-muted/40 border-t border-border flex items-center gap-1.5">
                                                                <span className="text-[10px] text-muted-foreground">Featured image</span>
                                                                <a
                                                                    href={selected.image}
                                                                    target="_blank"
                                                                    rel="noopener noreferrer"
                                                                    className="text-[10px] text-primary hover:underline ml-auto"
                                                                >
                                                                    Open original
                                                                </a>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Post to platform button */}
                                                    <div className="pt-1">
                                                        <button
                                                            onClick={() => handleOpenInPlatform(activePlatform, activeItem.post, selected!.url)}
                                                            className={`w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-all ${meta.shareColor}`}
                                                        >
                                                            {shared ? (
                                                                <>
                                                                    <Check className="w-4 h-4" />
                                                                    Text copied — {meta.label} opening…
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <Send className="w-4 h-4" />
                                                                    Post to {meta.label}
                                                                </>
                                                            )}
                                                        </button>
                                                        <p className="text-[10px] text-muted-foreground text-center mt-1.5">
                                                            Copies post text to clipboard, then opens {meta.label}
                                                        </p>
                                                    </div>
                                                </>
                                            );
                                        })()}

                                        {!activeItem && (
                                            <div className="flex items-center justify-center py-8 text-muted-foreground">
                                                <Loader2 className="w-4 h-4 animate-spin text-primary mr-2" />
                                                <span className="text-sm">Starting generation…</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}
