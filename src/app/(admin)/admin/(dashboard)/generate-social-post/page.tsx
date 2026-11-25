"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { toast } from "sonner";
import { AlertTriangle, CalendarDays, Clock, ExternalLink, Loader2, RefreshCw, Send, Sparkles, Tag } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { BlogPostCommand } from "@/components/admin/BlogPostCommand";
import { EmptyState } from "@/components/admin/EmptyState";
import { StyleExamples } from "@/components/admin/social/StyleExamples";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SOCIAL_PLATFORMS, SocialPlatform } from "@/config/social-post";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { socialCopy as copy } from "@/i18n/admin/social";
import { blogPostsQuery } from "@/lib/admin-queries";
import { adminFetch } from "@/lib/admin-api";
import { formatDateShort } from "@/lib/format";
import type { AdminBlogPost } from "@/types/admin";

interface GenerateRequest {
    post: AdminBlogPost;
    platform: SocialPlatform;
}

const FEATURED_IMAGE = { width: 1200, height: 630 };

function resultKey(slug: string, platform: SocialPlatform): string {
    return `${slug}:${platform}`;
}

function ArticleSummary({ post }: { post: AdminBlogPost }) {
    return (
        <AdminPanel
            title={post.title}
            description={post.excerpt || undefined}
            actions={
                <Button asChild variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground">
                    <a href={post.url} target="_blank" rel="noopener noreferrer" aria-label={copy.article.open} title={copy.article.open}>
                        <ExternalLink />
                    </a>
                </Button>
            }
        >
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-muted-foreground">
                {post.category && <Badge tone={StatusTone.Neutral}>{post.category}</Badge>}
                {post.read_time && (
                    <span className="inline-flex items-center gap-1.5">
                        <Clock className="size-3.5" />
                        {post.read_time}
                    </span>
                )}
                {post.date && (
                    <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {formatDateShort(post.date)}
                    </span>
                )}
                {post.tags.length > 0 && (
                    <span className="inline-flex flex-wrap items-center gap-1.5">
                        <Tag className="size-3.5" />
                        {post.tags.map((tag) => (
                            <span key={tag} className="rounded-full bg-foreground/[0.05] px-2 py-0.5">
                                {tag}
                            </span>
                        ))}
                    </span>
                )}
            </div>
        </AdminPanel>
    );
}

export default function GenerateSocialPostPage() {
    const [selected, setSelected] = useState<AdminBlogPost | null>(null);
    const [platform, setPlatform] = useState<SocialPlatform | null>(null);
    const [results, setResults] = useState<Record<string, string>>({});

    const posts = useQuery(blogPostsQuery);

    const generate = useAdminMutation({
        mutationFn: ({ post, platform }: GenerateRequest) =>
            adminFetch<{ post: string }>("/api/admin/social-post", {
                method: "POST",
                json: {
                    platform,
                    blog: {
                        title: post.title,
                        excerpt: post.excerpt,
                        category: post.category,
                        tags: post.tags,
                        url: post.url,
                        body_plain: post.body_plain,
                    },
                },
            }),
        silentError: true,
        onSuccess: (data, { post, platform }) => setResults((prev) => ({ ...prev, [resultKey(post.slug, platform)]: data.post })),
    });

    function run(next: SocialPlatform) {
        if (!selected) return;
        generate.mutate({ post: selected, platform: next });
    }

    function choosePlatform(next: SocialPlatform) {
        setPlatform(next);
        if (selected && !results[resultKey(selected.slug, next)]) run(next);
    }

    async function share(text: string) {
        if (!selected || !platform) return;
        const config = SOCIAL_PLATFORMS.find((p) => p.id === platform);
        if (!config) return;
        await navigator.clipboard.writeText(text).catch(() => undefined);
        toast.success(copy.output.shared(copy.platform[platform].label));
        window.open(config.shareUrl(selected.url), "_blank", "noopener,noreferrer");
    }

    const currentKey = selected && platform ? resultKey(selected.slug, platform) : null;
    const forCurrent = (request: GenerateRequest | undefined) =>
        !!request && resultKey(request.post.slug, request.platform) === currentKey;
    const pending = generate.isPending && forCurrent(generate.variables);
    const failed = generate.isError && forCurrent(generate.variables);
    const text = currentKey ? results[currentKey] : undefined;
    const label = platform ? copy.platform[platform].label : "";

    return (
        <AdminPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,24rem)_minmax(0,1fr)]">
                <AdminPanel title={copy.posts.title} flush className="lg:sticky lg:top-6">
                    <BlogPostCommand
                        posts={posts.data}
                        loading={posts.isPending}
                        error={posts.error}
                        selected={selected?.slug}
                        onSelect={(post) => {
                            setSelected(post);
                            setPlatform(null);
                        }}
                        placeholder={copy.posts.search}
                        empty={copy.posts.empty}
                        count={copy.posts.count}
                        listClassName="max-h-[28rem]"
                    />
                </AdminPanel>

                <div className="min-w-0 space-y-6">
                    {!selected ? (
                        <AdminPanel>
                            <EmptyState icon={Sparkles} title={copy.pick.title} description={copy.pick.description} />
                        </AdminPanel>
                    ) : (
                        <>
                            <ArticleSummary post={selected} />

                            <AdminPanel title={copy.platforms.title} description={copy.platforms.description} flush>
                                <div className="space-y-5 p-6">
                                    <Tabs value={platform ?? ""} onValueChange={(value) => choosePlatform(value as SocialPlatform)}>
                                        <TabsList className="flex h-auto w-full flex-wrap sm:w-auto">
                                            {SOCIAL_PLATFORMS.map(({ id, icon: Icon }) => (
                                                <TabsTrigger key={id} value={id} disabled={generate.isPending} className="flex-1 sm:flex-none">
                                                    {generate.isPending && generate.variables?.platform === id ? <Loader2 className="animate-spin" /> : <Icon />}
                                                    {copy.platform[id].label}
                                                    {results[resultKey(selected.slug, id)] && <span className="size-1.5 rounded-full bg-emerald-400" aria-label={copy.platforms.ready} />}
                                                </TabsTrigger>
                                            ))}
                                        </TabsList>
                                    </Tabs>
                                    {platform && <p className="text-sm text-muted-foreground">{copy.platform[platform].description}</p>}
                                </div>

                                {platform && (
                                    <div className="space-y-5 border-t border-foreground/[0.07] p-6">
                                        <div className="flex flex-wrap items-center justify-between gap-3">
                                            <h3 className="inline-flex items-center gap-2 font-display text-base font-semibold">
                                                <Sparkles className="size-4 text-brand-bright" />
                                                {copy.output.title(label)}
                                            </h3>
                                            {text && !pending && (
                                                <div className="flex items-center gap-2">
                                                    <Button variant="ghost" size="sm" className="rounded-full" onClick={() => run(platform)} disabled={generate.isPending}>
                                                        <RefreshCw />
                                                        {copy.output.regenerate}
                                                    </Button>
                                                    <CopyButton value={text} />
                                                </div>
                                            )}
                                        </div>

                                        {pending ? (
                                            <p className="flex items-center justify-center gap-3 py-8 text-sm text-muted-foreground">
                                                <Loader2 className="size-4 animate-spin text-brand-bright" />
                                                {copy.output.generating}
                                            </p>
                                        ) : failed ? (
                                            <Alert tone={StatusTone.Danger} icon={AlertTriangle}>
                                                <div className="space-y-3">
                                                    <div>
                                                        <p className="font-medium">{copy.output.failed}</p>
                                                        <p className="text-xs text-muted-foreground">{generate.error?.message}</p>
                                                    </div>
                                                    <Button variant="glass" size="sm" className="rounded-full" onClick={() => run(platform)}>
                                                        <RefreshCw />
                                                        {adminCommon.actions.retry}
                                                    </Button>
                                                </div>
                                            </Alert>
                                        ) : text ? (
                                            <>
                                                <p className="whitespace-pre-wrap break-words text-sm leading-relaxed">{text}</p>
                                                {selected.image && (
                                                    <figure className="overflow-hidden rounded-2xl border border-foreground/10">
                                                        <Image
                                                            src={selected.image}
                                                            alt={selected.title}
                                                            unoptimized
                                                            {...FEATURED_IMAGE}
                                                            className="h-auto w-full object-cover"
                                                        />
                                                        <figcaption className="flex items-center justify-between gap-3 border-t border-foreground/10 px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                                                            {copy.output.featuredImage}
                                                            <a href={selected.image} target="_blank" rel="noopener noreferrer" className="text-brand-bright hover:underline">
                                                                {copy.output.openImage}
                                                            </a>
                                                        </figcaption>
                                                    </figure>
                                                )}
                                                <div className="space-y-2">
                                                    <Button size="sm" className="w-full rounded-full" onClick={() => share(text)}>
                                                        <Send />
                                                        {copy.output.share(label)}
                                                    </Button>
                                                    <p className="text-center text-xs text-muted-foreground">{copy.output.shareHint(label)}</p>
                                                </div>
                                            </>
                                        ) : null}
                                    </div>
                                )}

                                {platform && <StyleExamples key={platform} platform={platform} />}
                            </AdminPanel>
                        </>
                    )}
                </div>
            </div>
        </AdminPage>
    );
}
