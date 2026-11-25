"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRightLeft, Loader2, MailCheck, MessageSquare, Plus, Rocket, Send, Trash2, type LucideIcon } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { LEAD_LIMITS, LeadActivityKind } from "@/config/leads";
import { useConfirm } from "@/hooks/use-confirm";
import { adminCommon } from "@/i18n/admin/common";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { adminFetch } from "@/lib/admin-api";
import { formatDateTime, formatTimeAgo } from "@/lib/format";
import { leadNoteSchema, type LeadNoteValues } from "@/lib/lead-forms";
import { useLeadMutation } from "@/lib/leads-client";
import { cn } from "@/lib/utils";
import type { LeadDetail } from "@/types/admin";

const KIND_ICON: Record<LeadActivityKind, LucideIcon> = {
    [LeadActivityKind.Note]: MessageSquare,
    [LeadActivityKind.Created]: Plus,
    [LeadActivityKind.Stage]: ArrowRightLeft,
    [LeadActivityKind.Deploy]: Rocket,
    [LeadActivityKind.Mock]: MailCheck,
};

export function LeadTimeline({ lead }: { lead: LeadDetail }) {
    const confirm = useConfirm();
    const form = useForm<LeadNoteValues>({ resolver: zodResolver(leadNoteSchema), defaultValues: { body: "" } });

    const add = useLeadMutation({
        leadId: lead.id,
        mutationFn: (values: LeadNoteValues) =>
            adminFetch<{ data: LeadDetail }>(`/api/admin/leads/${lead.id}/activities`, { method: "POST", json: values }).then(
                (r) => r.data,
            ),
    });

    const remove = useLeadMutation({
        leadId: lead.id,
        mutationFn: (activityId: number) =>
            adminFetch<{ data: LeadDetail }>(`/api/admin/leads/${lead.id}/activities/${activityId}`, { method: "DELETE" }).then(
                (r) => r.data,
            ),
        success: copy.timeline.deleted,
    });

    const submit = form.handleSubmit((values) => add.mutate(values, { onSuccess: () => form.reset({ body: "" }) }));

    async function onDelete(activityId: number) {
        const ok = await confirm({
            title: copy.timeline.deleteTitle,
            description: copy.timeline.deleteDescription,
            confirmLabel: adminCommon.actions.delete,
        });
        if (ok) remove.mutate(activityId);
    }

    return (
        <AdminPanel title={copy.timeline.title} description={copy.timeline.description}>
            <div className="space-y-6">
                <Form {...form}>
                    <form onSubmit={submit} className="space-y-2">
                        <FormField
                            control={form.control}
                            name="body"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) submit(e);
                                            }}
                                            placeholder={copy.timeline.placeholder}
                                            maxLength={LEAD_LIMITS.activity}
                                            aria-label={copy.timeline.label}
                                            className="min-h-[70px] rounded-xl border-foreground/10 bg-foreground/[0.03] text-sm"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" size="sm" className="rounded-full" disabled={add.isPending}>
                                {add.isPending ? <Loader2 className="animate-spin" /> : <Send />}
                                {copy.timeline.add}
                            </Button>
                        </div>
                    </form>
                </Form>

                {lead.activities.length === 0 ? (
                    <p className="py-4 text-center text-sm text-muted-foreground">{copy.timeline.empty}</p>
                ) : (
                    <ol className="relative space-y-4 before:absolute before:bottom-2 before:left-[0.8125rem] before:top-2 before:w-px before:bg-foreground/10">
                        {lead.activities.map((a) => {
                            const Icon = KIND_ICON[a.kind] ?? MessageSquare;
                            const isNote = a.kind === LeadActivityKind.Note;
                            const deleting = remove.isPending && remove.variables === a.id;
                            return (
                                <li key={a.id} className="group relative flex gap-3">
                                    <span
                                        className={cn(
                                            "relative flex size-7 shrink-0 items-center justify-center rounded-full border bg-card [&_svg]:size-3.5",
                                            isNote ? "border-brand/40 text-brand-bright" : "border-foreground/10 text-muted-foreground",
                                        )}
                                    >
                                        <Icon />
                                    </span>
                                    <div className="min-w-0 flex-1 pt-0.5">
                                        <p className={cn("whitespace-pre-wrap break-words text-sm", !isNote && "text-muted-foreground")}>
                                            {a.body}
                                        </p>
                                        <p className="mt-0.5 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground" title={formatDateTime(a.created_at)}>
                                            {formatTimeAgo(a.created_at)}
                                            {a.created_by && copy.timeline.by(a.created_by)}
                                        </p>
                                    </div>
                                    {isNote && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 rounded-full text-muted-foreground opacity-100 hover:bg-red-400/10 hover:text-red-400 focus-visible:opacity-100 lg:opacity-0 lg:group-hover:opacity-100"
                                            onClick={() => onDelete(a.id)}
                                            disabled={deleting}
                                            aria-label={copy.timeline.deleteLabel}
                                            title={copy.timeline.deleteLabel}
                                        >
                                            {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                                        </Button>
                                    )}
                                </li>
                            );
                        })}
                    </ol>
                )}
            </div>
        </AdminPanel>
    );
}
