"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { BookOpen, ChevronDown, Loader2, Plus, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { AdminQueryKey } from "@/config/admin";
import { SOCIAL_EXAMPLE_MIN_LENGTH, SocialPlatform } from "@/config/social-post";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { socialCopy } from "@/i18n/admin/social";
import { adminFetch } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import type { SocialPostExample } from "@/types/admin";

const copy = socialCopy.examples;

const schema = z.object({
    content: z.string().trim().min(SOCIAL_EXAMPLE_MIN_LENGTH, copy.tooShort(SOCIAL_EXAMPLE_MIN_LENGTH)),
});

function ExampleItem({ example, onRemove, removing }: { example: SocialPostExample; onRemove: () => void; removing: boolean }) {
    const [open, setOpen] = useState(false);
    return (
        <li className="flex items-start gap-3 rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] p-4 text-sm">
            <div className="min-w-0 flex-1 space-y-2">
                <p className={cn("whitespace-pre-wrap break-words leading-relaxed text-muted-foreground", !open && "line-clamp-4")}>
                    {example.content}
                </p>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    className="text-xs font-semibold text-foreground hover:text-brand-bright"
                >
                    {open ? copy.collapse : copy.expand}
                </button>
            </div>
            <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
                aria-label={adminCommon.actions.delete}
                disabled={removing}
                onClick={onRemove}
            >
                {removing ? <Loader2 className="animate-spin" /> : <Trash2 />}
            </Button>
        </li>
    );
}

export function StyleExamples({ platform }: { platform: SocialPlatform }) {
    const [open, setOpen] = useState(false);
    const label = socialCopy.platform[platform].label;
    const form = useForm<z.infer<typeof schema>>({ resolver: zodResolver(schema), defaultValues: { content: "" } });

    const examples = useQuery({
        queryKey: [AdminQueryKey.SocialPostExamples, platform],
        queryFn: () =>
            adminFetch<{ examples: SocialPostExample[] }>("/api/admin/social-post-examples", { query: { platform } }).then((r) => r.examples),
    });

    const add = useAdminMutation({
        mutationFn: (content: string) => adminFetch("/api/admin/social-post-examples", { method: "POST", json: { platform, content } }),
        invalidates: [AdminQueryKey.SocialPostExamples],
        success: copy.added,
        onSuccess: () => form.reset(),
    });

    const remove = useAdminMutation({
        mutationFn: (id: number) => adminFetch(`/api/admin/social-post-examples/${id}`, { method: "DELETE" }),
        invalidates: [AdminQueryKey.SocialPostExamples],
        success: copy.removed,
    });

    return (
        <Collapsible open={open} onOpenChange={setOpen} className="group/examples border-t border-foreground/[0.07] px-6 py-5">
            <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 text-left">
                <span className="inline-flex items-center gap-2 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                    <BookOpen className="size-3.5" />
                    {copy.title}
                    {examples.data && examples.data.length > 0 && <Badge tone={StatusTone.Brand}>{examples.data.length}</Badge>}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                    {open ? copy.toggleClose : copy.toggleOpen}
                    <ChevronDown className="size-3.5 transition-transform group-data-[state=open]/examples:rotate-180" />
                </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="space-y-4 pt-4">
                <p className="text-sm text-muted-foreground">{copy.description(label)}</p>
                <Form {...form}>
                    <form noValidate onSubmit={form.handleSubmit((v) => add.mutate(v.content))} className="space-y-3">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea {...field} placeholder={copy.placeholder(label)} className="min-h-[120px] resize-y" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Button type="submit" variant="glass" size="sm" className="rounded-full" disabled={add.isPending}>
                            {add.isPending ? <Loader2 className="animate-spin" /> : <Plus />}
                            {add.isPending ? copy.adding : copy.add}
                        </Button>
                    </form>
                </Form>
                {examples.isPending ? (
                    <Loader2 className="size-4 animate-spin text-muted-foreground" />
                ) : examples.isError ? (
                    <p className="text-sm text-red-400">{examples.error.message}</p>
                ) : examples.data?.length ? (
                    <ul className="space-y-2">
                        {examples.data.map((example) => (
                            <ExampleItem
                                key={example.id}
                                example={example}
                                removing={remove.isPending && remove.variables === example.id}
                                onRemove={() => remove.mutate(example.id)}
                            />
                        ))}
                    </ul>
                ) : (
                    <p className="text-sm text-muted-foreground/70">{copy.empty}</p>
                )}
            </CollapsibleContent>
        </Collapsible>
    );
}
