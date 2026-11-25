"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { AdminQueryKey } from "@/config/admin";
import { JOB_DEFAULT_LOCATION, JOB_STATUSES, JOB_TYPES, JobStatus, JobType } from "@/config/careers";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { careersCopy as copy } from "@/i18n/admin/careers";
import { adminFetch } from "@/lib/admin-api";
import type { JobOpening } from "@/types/admin";

const jobSchema = z.object({
    title: z.string().trim().min(1, copy.form.titleRequired),
    department: z.string().trim(),
    location: z.string().trim(),
    type: z.enum(JobType),
    status: z.enum(JobStatus),
    apply_url: z
        .string()
        .trim()
        .refine((value) => !value || z.url().safeParse(value).success, copy.form.applyUrlInvalid),
    sort_order: z.number(copy.form.sortOrderInvalid).int(copy.form.sortOrderInvalid),
    description: z.string().trim(),
});

type JobValues = z.infer<typeof jobSchema>;

const EMPTY_JOB: JobValues = {
    title: "",
    department: "",
    location: JOB_DEFAULT_LOCATION,
    type: JobType.FullTime,
    status: JobStatus.Open,
    apply_url: "",
    sort_order: 0,
    description: "",
};

function toValues(job: JobOpening): JobValues {
    return {
        title: job.title,
        department: job.department ?? "",
        location: job.location,
        type: job.type,
        status: job.status,
        apply_url: job.apply_url ?? "",
        sort_order: job.sort_order,
        description: job.description ?? "",
    };
}

function toPayload(values: JobValues) {
    return {
        ...values,
        department: values.department || null,
        location: values.location || JOB_DEFAULT_LOCATION,
        apply_url: values.apply_url || null,
        description: values.description || null,
    };
}

export interface JobOpeningSheetProps {
    open: boolean;
    job: JobOpening | null;
    onClose: () => void;
}

export function JobOpeningSheet({ open, job, onClose }: JobOpeningSheetProps) {
    return (
        <Sheet open={open} onOpenChange={(next) => !next && onClose()}>
            <SheetContent closeLabel={adminCommon.actions.close} className="overflow-y-auto p-6 sm:max-w-xl">
                <div className="space-y-1.5 pr-8">
                    <SheetTitle>{job ? copy.form.editTitle : copy.form.createTitle}</SheetTitle>
                    <SheetDescription>{copy.form.description}</SheetDescription>
                </div>
                <JobOpeningForm key={job?.id ?? "new"} job={job} onDone={onClose} />
            </SheetContent>
        </Sheet>
    );
}

function JobOpeningForm({ job, onDone }: { job: JobOpening | null; onDone: () => void }) {
    const form = useForm<JobValues>({ resolver: zodResolver(jobSchema), defaultValues: job ? toValues(job) : EMPTY_JOB });

    const save = useAdminMutation({
        mutationFn: (values: JobValues) =>
            adminFetch("/api/admin/careers", {
                method: job ? "PATCH" : "POST",
                json: job ? { id: job.id, ...toPayload(values) } : toPayload(values),
            }),
        invalidates: [AdminQueryKey.Careers],
        success: job ? copy.updated : copy.created,
        onSuccess: onDone,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => save.mutate(values))} className="space-y-5 pt-2">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{copy.form.title}</FormLabel>
                            <FormControl>
                                <Input placeholder={copy.form.titlePlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid gap-5 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="department"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.form.department}</FormLabel>
                                <FormControl>
                                    <Input placeholder={copy.form.departmentPlaceholder} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="location"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.form.location}</FormLabel>
                                <FormControl>
                                    <Input placeholder={copy.form.locationPlaceholder} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.form.type}</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {JOB_TYPES.map((type) => (
                                            <SelectItem key={type} value={type}>
                                                {type}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="status"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.form.status}</FormLabel>
                                <Select value={field.value} onValueChange={field.onChange}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {JOB_STATUSES.map((status) => (
                                            <SelectItem key={status} value={status}>
                                                {copy.status[status]}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="apply_url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.form.applyUrl}</FormLabel>
                                <FormControl>
                                    <Input type="url" placeholder={copy.form.applyUrlPlaceholder} {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="sort_order"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.form.sortOrder}</FormLabel>
                                <FormControl>
                                    <Input
                                        type="number"
                                        step={1}
                                        {...field}
                                        value={Number.isNaN(field.value) ? "" : field.value}
                                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{copy.form.body}</FormLabel>
                            <FormControl>
                                <Textarea rows={8} placeholder={copy.form.bodyPlaceholder} {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 border-t border-foreground/10 pt-5">
                    <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={onDone} disabled={save.isPending}>
                        {adminCommon.actions.cancel}
                    </Button>
                    <Button type="submit" size="sm" className="rounded-full" disabled={save.isPending}>
                        {save.isPending ? adminCommon.actions.saving : job ? adminCommon.actions.save : adminCommon.actions.create}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
