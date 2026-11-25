"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle2, ChevronDown, ExternalLink, Loader2, Wand2, XCircle } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { PostExamples } from "@/components/admin/dashboard/PostExamples";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ORGANIZATION_BYLINES } from "@/config/authors";
import { ADMIN_LINKS } from "@/config/admin";
import { useAdminMutation } from "@/hooks/use-admin";
import { ConfirmVariant } from "@/config/ui";
import { useConfirm } from "@/hooks/use-confirm";
import { dashboardCopy as copy } from "@/i18n/admin/dashboard";
import { adminFetch, errorMessage } from "@/lib/admin-api";
import type { AutoPostResult } from "@/types/admin";

const schema = z.object({
    author: z.string().trim().min(1),
    idea: z.string().trim(),
});

type AutoPostValues = z.infer<typeof schema>;

export function AutoPostPanel() {
    const confirm = useConfirm();
    const form = useForm<AutoPostValues>({
        resolver: zodResolver(schema),
        defaultValues: { author: ORGANIZATION_BYLINES[0], idea: "" },
    });

    const autoPost = useAdminMutation({
        mutationFn: (values: AutoPostValues) =>
            adminFetch<AutoPostResult>("/api/admin/trigger-autopost", {
                method: "POST",
                json: { publish: false, author_name: values.author, ...(values.idea ? { idea: values.idea } : {}) },
            }),
        success: (result) => result.message || copy.autoPost.done,
    });

    const onSubmit = form.handleSubmit(async (values) => {
        const ok = await confirm({
            title: copy.autoPost.confirmTitle,
            description: copy.autoPost.confirmDescription,
            confirmLabel: copy.autoPost.confirmLabel,
            variant: ConfirmVariant.Default,
        });
        if (ok) autoPost.mutate(values);
    });

    const result = autoPost.data;

    return (
        <AdminPanel
            eyebrow={copy.autoPost.eyebrow}
            title={copy.autoPost.title}
            description={copy.autoPost.description}
            actions={
                <Button size="sm" className="rounded-full" onClick={onSubmit} disabled={autoPost.isPending}>
                    {autoPost.isPending ? <Loader2 className="animate-spin" /> : <Wand2 />}
                    {autoPost.isPending ? copy.autoPost.running : copy.autoPost.trigger}
                </Button>
            }
        >
            <div className="space-y-6">
                <Collapsible className="group/options">
                    <CollapsibleTrigger className="inline-flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground">
                        {copy.autoPost.options}
                        <ChevronDown className="size-3.5 transition-transform group-data-[state=open]/options:rotate-180" />
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                        <Form {...form}>
                            <form onSubmit={onSubmit} className="grid gap-5 pt-5 md:grid-cols-[minmax(0,16rem)_1fr]">
                                <FormField
                                    control={form.control}
                                    name="author"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{copy.autoPost.author}</FormLabel>
                                            <FormControl>
                                                <Input {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="idea"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{copy.autoPost.idea}</FormLabel>
                                            <FormControl>
                                                <Textarea {...field} placeholder={copy.autoPost.ideaPlaceholder} className="min-h-[88px] resize-y" />
                                            </FormControl>
                                            <FormDescription>{copy.autoPost.ideaHint}</FormDescription>
                                        </FormItem>
                                    )}
                                />
                            </form>
                        </Form>
                    </CollapsibleContent>
                </Collapsible>

                {(result || autoPost.error) && (
                    <div
                        className={
                            result
                                ? "space-y-2 rounded-2xl border border-emerald-400/20 bg-emerald-400/[0.06] px-5 py-4 text-sm"
                                : "rounded-2xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm"
                        }
                    >
                        <p className="flex items-center gap-2 font-medium">
                            {result ? <CheckCircle2 className="size-4 text-emerald-400" /> : <XCircle className="size-4 text-red-400" />}
                            {result ? result.message || copy.autoPost.done : errorMessage(autoPost.error)}
                        </p>
                        {result?.generated_post && (
                            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 pl-6 text-muted-foreground">
                                <dt className="text-foreground">{copy.autoPost.resultTitle}</dt>
                                <dd>{result.generated_post.title}</dd>
                                <dt className="text-foreground">{copy.autoPost.resultCategory}</dt>
                                <dd>{result.generated_post.category}</dd>
                            </dl>
                        )}
                        {result?.uid && (
                            <a
                                href={ADMIN_LINKS.prismicMigration ?? ADMIN_LINKS.prismicMigrationFallback}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="ml-6 inline-flex items-center gap-1.5 border-b border-foreground/25 pb-0.5 text-sm font-semibold"
                            >
                                {copy.autoPost.viewInPrismic}
                                <ExternalLink className="size-3.5" />
                            </a>
                        )}
                    </div>
                )}

                <PostExamples />
            </div>
        </AdminPanel>
    );
}
