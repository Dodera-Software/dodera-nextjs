"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AdminQueryKey, AdminRoute } from "@/config/admin";
import { MOCKUP_FIELD_LIMITS } from "@/config/admin-mockups";
import { slugify, validateSlug } from "@/config/mockups";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { mockupsCopy } from "@/i18n/admin/mockups";
import { adminFetch } from "@/lib/admin-api";
import type { MockupResponse } from "@/lib/mockups-client";
import type { MockupProjectDetail } from "@/types/admin";

const copy = mockupsCopy.form;

const schema = z.object({
    name: z.string().trim().min(1, copy.nameRequired).max(MOCKUP_FIELD_LIMITS.name, copy.nameRequired),
    slug: z.string().superRefine((slug, ctx) => {
        const error = validateSlug(slug);
        if (error) ctx.addIssue({ code: "custom", message: error });
    }),
    client_name: z.string().max(MOCKUP_FIELD_LIMITS.client),
    notes: z.string().max(MOCKUP_FIELD_LIMITS.notes),
});

type Values = z.infer<typeof schema>;

export interface MockupProjectDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    project?: MockupProjectDetail;
    domain?: string | null;
}

export function MockupProjectDialog({ open, onOpenChange, project, domain }: MockupProjectDialogProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md rounded-3xl border-foreground/10">
                <DialogHeader>
                    <DialogTitle className="font-display">{project ? copy.editTitle : copy.createTitle}</DialogTitle>
                    <DialogDescription>{project ? copy.editDescription : copy.createDescription}</DialogDescription>
                </DialogHeader>
                <ProjectForm project={project} domain={domain} onDone={() => onOpenChange(false)} />
            </DialogContent>
        </Dialog>
    );
}

function ProjectForm({ project, domain, onDone }: { project?: MockupProjectDetail; domain?: string | null; onDone: () => void }) {
    const router = useRouter();
    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: {
            name: project?.name ?? "",
            slug: project?.slug ?? "",
            client_name: project?.client_name ?? "",
            notes: project?.notes ?? "",
        },
    });

    const save = useAdminMutation({
        mutationFn: (values: Values) =>
            project
                ? adminFetch<MockupResponse>(`/api/admin/mockups/${project.id}`, { method: "PATCH", json: values })
                : adminFetch<MockupResponse>("/api/admin/mockups", {
                      method: "POST",
                      json: { name: values.name, slug: values.slug, client_name: values.client_name },
                  }),
        invalidates: [AdminQueryKey.Mockups, AdminQueryKey.Leads],
        success: (r) => (project ? (r.message ?? copy.updated) : copy.created),
        onSuccess: (r) => {
            onDone();
            if (!project) router.push(`${AdminRoute.Mockups}/${r.data.id}`);
        },
    });

    function onNameChange(name: string) {
        if (!project && !form.getFieldState("slug").isDirty) {
            form.setValue("slug", slugify(name), { shouldValidate: form.formState.isSubmitted });
        }
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => save.mutate(values))} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{copy.name}</FormLabel>
                            <FormControl>
                                <Input
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        onNameChange(e.target.value);
                                    }}
                                    maxLength={MOCKUP_FIELD_LIMITS.name}
                                    autoFocus
                                    placeholder={copy.namePlaceholder}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{copy.slug}</FormLabel>
                            <div className="flex items-center gap-2">
                                <FormControl>
                                    <Input
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value.toLowerCase())}
                                        className="font-mono"
                                        placeholder={copy.slugPlaceholder}
                                        autoComplete="off"
                                    />
                                </FormControl>
                                {domain && <span className="whitespace-nowrap font-mono text-xs text-muted-foreground">.{domain}</span>}
                            </div>
                            {!project && <FormDescription>{copy.slugHint}</FormDescription>}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="client_name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{project ? copy.client : copy.clientOptional}</FormLabel>
                            <FormControl>
                                <Input {...field} maxLength={MOCKUP_FIELD_LIMITS.client} placeholder={copy.clientPlaceholder} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {project && (
                    <FormField
                        control={form.control}
                        name="notes"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.notes}</FormLabel>
                                <FormControl>
                                    <Textarea
                                        {...field}
                                        maxLength={MOCKUP_FIELD_LIMITS.notes}
                                        placeholder={copy.notesPlaceholder}
                                        className="min-h-[90px]"
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={onDone}>
                        {adminCommon.actions.cancel}
                    </Button>
                    <Button type="submit" size="sm" className="rounded-full" disabled={save.isPending}>
                        {save.isPending && <Loader2 className="animate-spin" />}
                        {project
                            ? save.isPending ? adminCommon.actions.saving : adminCommon.actions.save
                            : save.isPending ? copy.creating : copy.create}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
