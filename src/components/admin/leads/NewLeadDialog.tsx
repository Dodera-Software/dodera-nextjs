"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LeadBusinessFields } from "@/components/admin/leads/LeadFormFields";
import { AdminQueryKey } from "@/config/admin";
import { LEAD_STAGES, LeadStage } from "@/config/leads";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { adminFetch } from "@/lib/admin-api";
import { emptyNewLead, newLeadSchema, type NewLeadValues } from "@/lib/lead-forms";
import type { LeadDetail } from "@/types/admin";

interface NewLeadDialogProps {
    stage: LeadStage | null;
    onClose: () => void;
    onCreated: (lead: LeadDetail) => void;
}

export function NewLeadDialog({ stage, onClose, onCreated }: NewLeadDialogProps) {
    const [lastCountry, setLastCountry] = useState("");
    return (
        <Dialog open={stage !== null} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto rounded-3xl border-foreground/10">
                <DialogHeader>
                    <DialogTitle className="font-display text-xl">{copy.newLead.title}</DialogTitle>
                    <DialogDescription>{copy.newLead.description}</DialogDescription>
                </DialogHeader>
                {stage !== null && (
                    <NewLeadForm
                        defaults={emptyNewLead(lastCountry, stage)}
                        onCancel={onClose}
                        onCreated={(lead) => {
                            setLastCountry(lead.country ?? "");
                            onClose();
                            onCreated(lead);
                        }}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

function NewLeadForm({
    defaults,
    onCancel,
    onCreated,
}: {
    defaults: NewLeadValues;
    onCancel: () => void;
    onCreated: (lead: LeadDetail) => void;
}) {
    const form = useForm<NewLeadValues>({ resolver: zodResolver(newLeadSchema), defaultValues: defaults });

    const create = useAdminMutation({
        mutationFn: (values: NewLeadValues) =>
            adminFetch<{ data: LeadDetail }>("/api/admin/leads", { method: "POST", json: values }).then((r) => r.data),
        invalidates: [AdminQueryKey.Leads, AdminQueryKey.LeadSuggestions],
        onSuccess: onCreated,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => create.mutate(values))} className="space-y-4" noValidate>
                <LeadBusinessFields focusName={Boolean(defaults.country)} />
                <FormField
                    control={form.control}
                    name="stage"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{copy.form.stage}</FormLabel>
                            <Select value={field.value} onValueChange={field.onChange}>
                                <FormControl>
                                    <SelectTrigger className="rounded-xl border-foreground/10 bg-foreground/[0.03]">
                                        <SelectValue />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    {LEAD_STAGES.map((s) => (
                                        <SelectItem key={s.id} value={s.id}>
                                            {s.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="gap-2 pt-2 sm:gap-2">
                    <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={onCancel}>
                        {adminCommon.actions.cancel}
                    </Button>
                    <Button type="submit" size="sm" className="rounded-full" disabled={create.isPending}>
                        {create.isPending && <Loader2 className="animate-spin" />}
                        {create.isPending ? copy.newLead.submitting : copy.newLead.submit}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}
