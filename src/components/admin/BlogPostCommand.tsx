"use client";

import { useCommandState } from "cmdk";
import { AlertTriangle, Check, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandEmpty, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { StatusTone } from "@/config/ui";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { AdminBlogPost } from "@/types/admin";

export interface BlogPostCommandProps {
    posts: AdminBlogPost[] | undefined;
    loading: boolean;
    error: Error | null;
    selected?: string | null;
    onSelect: (post: AdminBlogPost) => void;
    placeholder: string;
    empty: string;
    count?: (shown: number, total: number) => string;
    className?: string;
    listClassName?: string;
}

function FilteredCount({ total, format }: { total: number; format: (shown: number, total: number) => string }) {
    const shown = useCommandState((state) => state.filtered.count);
    return (
        <p className="border-t border-foreground/[0.07] px-4 py-2.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
            {format(shown, total)}
        </p>
    );
}

export function BlogPostCommand({
    posts,
    loading,
    error,
    selected,
    onSelect,
    placeholder,
    empty,
    count,
    className,
    listClassName,
}: BlogPostCommandProps) {
    return (
        <Command className={cn("rounded-none bg-transparent", className)}>
            <CommandInput placeholder={placeholder} className="h-12 text-sm" />
            <CommandList className={listClassName}>
                {loading ? (
                    <div className="flex justify-center py-8">
                        <Loader2 className="size-4 animate-spin text-muted-foreground" />
                    </div>
                ) : error ? (
                    <p className="flex items-center gap-2 p-4 text-sm text-red-400">
                        <AlertTriangle className="size-4" />
                        {error.message}
                    </p>
                ) : (
                    <>
                        <CommandEmpty>{empty}</CommandEmpty>
                        {posts?.map((post) => {
                            const active = post.slug === selected;
                            return (
                                <CommandItem
                                    key={post.slug}
                                    value={post.slug}
                                    keywords={[post.title, post.excerpt, post.category, ...post.tags]}
                                    onSelect={() => onSelect(post)}
                                    className={cn("items-start", active && "bg-brand/10")}
                                >
                                    <div className="min-w-0 flex-1 space-y-1">
                                        <div className="flex flex-wrap items-center gap-2">
                                            {post.category && <Badge tone={StatusTone.Neutral}>{post.category}</Badge>}
                                            {post.date && (
                                                <span className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                                                    {formatDateShort(post.date)}
                                                </span>
                                            )}
                                        </div>
                                        <p className={cn("font-medium leading-snug", active && "text-brand-bright")}>{post.title}</p>
                                        {post.excerpt && <p className="line-clamp-2 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p>}
                                    </div>
                                    {active && <Check className="mt-1" />}
                                </CommandItem>
                            );
                        })}
                    </>
                )}
            </CommandList>
            {count && posts && posts.length > 0 && <FilteredCount total={posts.length} format={count} />}
        </Command>
    );
}
