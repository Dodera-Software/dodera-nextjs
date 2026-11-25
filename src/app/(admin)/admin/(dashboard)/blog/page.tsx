"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, EyeOff, Newspaper, Pencil, RefreshCw, Send, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { BlogPostSheet } from "@/components/admin/blog/BlogPostSheet";
import { BlogSetupGuide } from "@/components/admin/blog/BlogSetupGuide";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminQueryKey } from "@/config/admin";
import { BlogStatus, blogPostPath } from "@/config/blog";
import { ConfirmVariant, StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { useConfirm } from "@/hooks/use-confirm";
import { adminCommon } from "@/i18n/admin/common";
import { blogCopy as copy } from "@/i18n/admin/blog";
import { adminFetch } from "@/lib/admin-api";
import { formatDateShort } from "@/lib/format";
import type { BlogPostRow } from "@/types/admin";

const SKELETON_ROWS = 3;

interface PostGroup {
    key: string;
    published: boolean;
    lead: BlogPostRow;
    posts: BlogPostRow[];
}

function groupPosts(rows: BlogPostRow[]): PostGroup[] {
    const groups = new Map<string, BlogPostRow[]>();
    for (const row of rows) groups.set(row.translationKey, [...(groups.get(row.translationKey) ?? []), row]);
    const sortDate = (g: PostGroup) => g.lead.publishedAt ?? g.lead.createdAt;
    return [...groups.entries()]
        .map(([key, posts]) => ({
            key,
            posts,
            lead: posts.find((p) => p.locale === "en") ?? posts[0],
            published: posts.every((p) => p.status === BlogStatus.Published),
        }))
        .sort((a, b) => Number(a.published) - Number(b.published) || sortDate(b).localeCompare(sortDate(a)));
}

export default function AdminBlogPage() {
    const confirm = useConfirm();
    const [editing, setEditing] = useState<BlogPostRow | null>(null);

    const posts = useQuery({
        queryKey: [AdminQueryKey.Blog],
        queryFn: () => adminFetch<{ posts: BlogPostRow[] }>("/api/admin/blog").then((r) => r.posts),
    });
    const groups = useMemo(() => groupPosts(posts.data ?? []), [posts.data]);

    const setStatus = useAdminMutation({
        mutationFn: ({ key, status }: { key: string; status: BlogStatus }) => adminFetch(`/api/admin/blog/${key}`, { method: "PATCH", json: { status } }),
        invalidates: [AdminQueryKey.Blog, AdminQueryKey.BlogPosts],
        success: (_, { status }) => (status === BlogStatus.Published ? copy.status.published : copy.status.unpublished),
    });

    const remove = useAdminMutation({
        mutationFn: (key: string) => adminFetch(`/api/admin/blog/${key}`, { method: "DELETE" }),
        invalidates: [AdminQueryKey.Blog, AdminQueryKey.BlogPosts],
        success: copy.remove.done,
    });

    async function toggle(group: PostGroup) {
        const status = group.published ? BlogStatus.Draft : BlogStatus.Published;
        const ok = await confirm({
            title: group.published ? copy.status.unpublishTitle : copy.status.publishTitle,
            description: group.published ? copy.status.unpublishDescription : copy.status.publishDescription,
            confirmLabel: group.published ? copy.list.unpublish : copy.list.publish,
            variant: ConfirmVariant.Default,
        });
        if (ok) setStatus.mutate({ key: group.key, status });
    }

    async function onDelete(group: PostGroup) {
        const ok = await confirm({
            title: copy.remove.title,
            description: copy.remove.description(group.lead.title),
            confirmLabel: adminCommon.actions.delete,
            variant: ConfirmVariant.Destructive,
        });
        if (ok) remove.mutate(group.key);
    }

    const busyKey = setStatus.isPending ? setStatus.variables.key : remove.isPending ? remove.variables : null;

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            actions={
                <Button variant="glass" size="sm" onClick={() => posts.refetch()} disabled={posts.isFetching}>
                    <RefreshCw className={posts.isFetching ? "animate-spin" : undefined} />
                    {adminCommon.actions.refresh}
                </Button>
            }
        >
            <BlogSetupGuide />

            <AdminPanel title={copy.list.title} description={posts.data ? copy.list.description(groups.length) : undefined} flush>
                {posts.isPending ? (
                    <div className="space-y-3 p-6">
                        {Array.from({ length: SKELETON_ROWS }, (_, i) => (
                            <Skeleton key={i} className="h-24 rounded-2xl" />
                        ))}
                    </div>
                ) : groups.length === 0 ? (
                    <EmptyState icon={Newspaper} {...copy.list.empty} />
                ) : (
                    <ul className="divide-y divide-foreground/[0.07]">
                        {groups.map((group) => {
                            const busy = busyKey === group.key;
                            return (
                                <li key={group.key} className="space-y-4 px-6 py-5">
                                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0 space-y-2">
                                            <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                                                <Badge tone={group.published ? StatusTone.Success : StatusTone.Warning} dot>
                                                    {group.published ? copy.list.published : copy.list.draft}
                                                </Badge>
                                                {!group.lead.indexed && <Badge tone={StatusTone.Neutral}>{copy.list.noindex}</Badge>}
                                                <span className="tabular-nums">
                                                    {group.lead.publishedAt ? copy.list.publishedOn(formatDateShort(group.lead.publishedAt)) : copy.list.createdOn(formatDateShort(group.lead.createdAt))}
                                                </span>
                                                <span>· {group.lead.category}</span>
                                                <span>· {group.lead.author}</span>
                                            </div>
                                            <p className="font-medium leading-snug">{group.lead.title}</p>
                                            <p className="line-clamp-2 text-sm text-muted-foreground">{group.lead.excerpt}</p>
                                        </div>
                                        <div className="flex shrink-0 gap-2">
                                            <Button size="sm" variant={group.published ? "glass" : "default"} disabled={busy} onClick={() => toggle(group)}>
                                                {group.published ? <EyeOff /> : <Send />}
                                                {group.published ? copy.list.unpublish : copy.list.publish}
                                            </Button>
                                            <Button size="icon" variant="ghost" className="size-9 rounded-full text-muted-foreground" disabled={busy} onClick={() => onDelete(group)} aria-label={adminCommon.actions.delete}>
                                                <Trash2 />
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {group.posts.map((post) => (
                                            <div key={post.id} className="flex items-center gap-1 rounded-full border border-foreground/10 py-1 pl-3 pr-1">
                                                <span className="pr-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{post.locale}</span>
                                                <Button asChild size="sm" variant="ghost" className="h-7 rounded-full">
                                                    <a href={blogPostPath(post.slug, post.locale)} target="_blank" rel="noopener noreferrer">
                                                        {copy.list.preview}
                                                        <ArrowUpRight />
                                                    </a>
                                                </Button>
                                                <Button size="sm" variant="ghost" className="h-7 rounded-full" onClick={() => setEditing(post)}>
                                                    <Pencil />
                                                    {adminCommon.actions.edit}
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                </li>
                            );
                        })}
                    </ul>
                )}
            </AdminPanel>

            <BlogPostSheet post={editing} onClose={() => setEditing(null)} />
        </AdminPage>
    );
}
