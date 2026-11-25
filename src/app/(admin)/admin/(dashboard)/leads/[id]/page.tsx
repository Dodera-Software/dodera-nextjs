"use client";

import { useEffect, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    ChevronDown,
    ExternalLink,
    Facebook,
    Instagram,
    Loader2,
    Mail,
    MapPin,
    MoreHorizontal,
    Phone,
    Save,
    SquareKanban,
    Trash2,
} from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { LeadBusinessFields, TextAreaField, TextField } from "@/components/admin/leads/LeadFormFields";
import { LeadMessages } from "@/components/admin/leads/LeadMessages";
import { LeadPreviewPanel } from "@/components/admin/leads/LeadPreviewPanel";
import { LeadTimeline } from "@/components/admin/leads/LeadTimeline";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminRoute } from "@/config/admin";
import { isLeadStage, LEAD_LIMITS, LEAD_STAGES, stageDefinition, type LeadStage } from "@/config/leads";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { useConfirm } from "@/hooks/use-confirm";
import { adminCommon } from "@/i18n/admin/common";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import { leadsQuery } from "@/lib/admin-queries";
import { formatDateTime } from "@/lib/format";
import { leadDetailSchema, leadDetailValues, type LeadDetailValues } from "@/lib/lead-forms";
import { externalHref, FOLLOW_UP_TONE, followUpState, FollowUpState, leadQuery, patchLead, useLeadMutation } from "@/lib/leads-client";
import type { LeadDetail } from "@/types/admin";

const BACK = { href: AdminRoute.Leads, label: copy.detail.back };

function isNotFound(error: unknown): boolean {
    return error instanceof AdminApiError && error.status === 404;
}

export default function LeadPage() {
    const params = useParams<{ id: string }>();
    const leadId = Number(params.id);
    const valid = Number.isInteger(leadId) && leadId > 0;
    const lead = useQuery({
        ...leadQuery(leadId),
        enabled: valid,
        retry: (count, error) => !isNotFound(error) && count < 1,
    });

    if (!valid || isNotFound(lead.error)) {
        return (
            <AdminPage title={copy.title} back={BACK}>
                <EmptyState icon={SquareKanban} title={copy.detail.notFound} className="rounded-3xl border border-foreground/10" />
            </AdminPage>
        );
    }

    if (lead.isError) {
        return (
            <AdminPage title={copy.title} back={BACK}>
                <EmptyState
                    icon={SquareKanban}
                    title={adminCommon.errors.loadFailed}
                    action={
                        <Button variant="glass" size="sm" className="rounded-full" onClick={() => lead.refetch()}>
                            {adminCommon.actions.retry}
                        </Button>
                    }
                    className="rounded-3xl border border-foreground/10"
                />
            </AdminPage>
        );
    }

    if (!lead.data) {
        return (
            <AdminPage title={<Skeleton className="h-10 w-64" />} back={BACK}>
                <div className="grid gap-6 xl:grid-cols-5">
                    <Skeleton className="h-[32rem] rounded-3xl xl:col-span-2" />
                    <Skeleton className="h-[32rem] rounded-3xl xl:col-span-3" />
                </div>
            </AdminPage>
        );
    }

    return <LeadView lead={lead.data} />;
}

function LeadView({ lead }: { lead: LeadDetail }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const confirm = useConfirm();
    const stage = stageDefinition(lead.stage);

    const moveStage = useLeadMutation({
        leadId: lead.id,
        mutationFn: (next: LeadStage) => patchLead(lead.id, { stage: next }),
    });

    const remove = useAdminMutation({
        mutationFn: () => adminFetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" }),
        success: copy.detail.delete.done,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: leadsQuery.queryKey, exact: true });
            router.replace(AdminRoute.Leads);
        },
    });

    async function onDelete() {
        const ok = await confirm({
            title: copy.detail.delete.title(lead.name),
            description: lead.preview ? copy.detail.delete.withPreview : copy.detail.delete.withoutPreview,
            confirmLabel: copy.detail.delete.action,
        });
        if (ok) remove.mutate();
    }

    return (
        <AdminPage
            back={BACK}
            title={lead.name}
            description={copy.detail.subtitle([
                lead.category,
                [lead.city, lead.country].filter(Boolean).join(", "),
                copy.detail.added(formatDateTime(lead.created_at, "MMM d, yyyy"), lead.created_by),
            ])}
            actions={
                <>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="glass" size="sm" className="rounded-full" disabled={moveStage.isPending} aria-label={copy.detail.stage}>
                                {moveStage.isPending && <Loader2 className="animate-spin" />}
                                <Badge tone={stage?.tone ?? StatusTone.Neutral} dot>
                                    {stage?.label ?? lead.stage}
                                </Badge>
                                <ChevronDown className="text-muted-foreground" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                            <DropdownMenuLabel>{copy.detail.stage}</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={lead.stage}
                                onValueChange={(value) => isLeadStage(value) && value !== lead.stage && moveStage.mutate(value)}
                            >
                                {LEAD_STAGES.map((s) => (
                                    <DropdownMenuRadioItem key={s.id} value={s.id}>
                                        <Badge tone={s.tone} dot className="border-transparent bg-transparent px-0">
                                            {s.label}
                                        </Badge>
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-9 rounded-full" aria-label={adminCommon.actions.more}>
                                {remove.isPending ? <Loader2 className="animate-spin" /> : <MoreHorizontal />}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem destructive onSelect={onDelete} disabled={remove.isPending}>
                                <Trash2 />
                                {copy.detail.delete.action}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </>
            }
        >
            <div className="grid gap-6 xl:grid-cols-5">
                <div className="space-y-6 xl:col-span-2">
                    <LeadDetailForm lead={lead} />
                    <LeadTimeline lead={lead} />
                </div>
                <div className="space-y-6 xl:col-span-3">
                    <LeadMessages lead={lead} />
                    <LeadPreviewPanel lead={lead} />
                </div>
            </div>
        </AdminPage>
    );
}

function LeadDetailForm({ lead }: { lead: LeadDetail }) {
    const form = useForm<LeadDetailValues>({ resolver: zodResolver(leadDetailSchema), defaultValues: leadDetailValues(lead) });
    const { isDirty } = useFormState({ control: form.control });

    const save = useLeadMutation({
        leadId: lead.id,
        mutationFn: (values: LeadDetailValues) => patchLead(lead.id, values),
        success: copy.detail.saved,
    });

    useEffect(() => {
        if (!isDirty) return;
        const handler = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [isDirty]);

    const followUp = lead.follow_up_on ? followUpState(lead.follow_up_on) : null;

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit((values) =>
                    save.mutate(values, { onSuccess: (updated) => form.reset(leadDetailValues(updated)) }),
                )}
                noValidate
            >
                <AdminPanel
                    title={copy.detail.business}
                    actions={<ContactLinks lead={lead} />}
                    footer={
                        <div className="flex items-center justify-end gap-2">
                            {isDirty && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    className="rounded-full"
                                    onClick={() => form.reset(leadDetailValues(lead))}
                                    disabled={save.isPending}
                                >
                                    {copy.detail.discard}
                                </Button>
                            )}
                            <Button type="submit" size="sm" className="rounded-full" disabled={!isDirty || save.isPending}>
                                {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                                {save.isPending ? adminCommon.actions.saving : adminCommon.actions.save}
                            </Button>
                        </div>
                    }
                >
                    <div className="space-y-6">
                        <LeadBusinessFields />
                        <div className="space-y-4 border-t border-foreground/[0.07] pt-6">
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                                {copy.detail.contactDeal}
                            </p>
                            <div className="grid gap-3 sm:grid-cols-2">
                                <TextField name="contact_name" label={copy.form.contactName} maxLength={LEAD_LIMITS.name} />
                                <TextField name="email" type="email" label={copy.form.email} maxLength={LEAD_LIMITS.shortText} />
                                <TextField name="phone" type="tel" label={copy.form.phone} maxLength={LEAD_LIMITS.phone} />
                                <TextField
                                    name="website"
                                    label={copy.form.website}
                                    placeholder={copy.form.websitePlaceholder}
                                    maxLength={LEAD_LIMITS.url}
                                />
                                <TextField
                                    name="value_eur"
                                    type="number"
                                    min={0}
                                    step={100}
                                    inputMode="numeric"
                                    label={copy.form.value}
                                    className="tabular-nums"
                                />
                            </div>
                            <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
                                <TextField
                                    name="next_step"
                                    label={copy.form.nextStep}
                                    placeholder={copy.form.nextStepPlaceholder}
                                    maxLength={LEAD_LIMITS.shortText}
                                />
                                <TextField
                                    name="follow_up_on"
                                    type="date"
                                    className="sm:w-44"
                                    label={
                                        <span className="flex items-center gap-2">
                                            {copy.form.followUpOn}
                                            {followUp && followUp !== FollowUpState.Upcoming && (
                                                <Badge tone={FOLLOW_UP_TONE[followUp]} className="px-1.5 py-0 text-[0.65rem]">
                                                    {followUp === FollowUpState.Today ? copy.followUp.todayShort : copy.followUp.overdue}
                                                </Badge>
                                            )}
                                        </span>
                                    }
                                />
                            </div>
                            <TextAreaField
                                name="notes"
                                label={copy.form.notes}
                                placeholder={copy.form.notesPlaceholder}
                                maxLength={LEAD_LIMITS.notes}
                                className="min-h-[140px] text-sm"
                            />
                        </div>
                    </div>
                </AdminPanel>
            </form>
        </Form>
    );
}

function ContactLinks({ lead }: { lead: LeadDetail }) {
    return (
        <div className="flex items-center gap-1">
            {lead.facebook_url && (
                <IconLink href={externalHref(lead.facebook_url)} label={copy.card.open(copy.links.facebook)} external>
                    <Facebook />
                </IconLink>
            )}
            {lead.instagram_url && (
                <IconLink href={externalHref(lead.instagram_url)} label={copy.card.open(copy.links.instagram)} external>
                    <Instagram />
                </IconLink>
            )}
            {lead.google_maps_url && (
                <IconLink href={externalHref(lead.google_maps_url)} label={copy.card.open(copy.links.maps)} external>
                    <MapPin />
                </IconLink>
            )}
            {lead.website && (
                <IconLink href={externalHref(lead.website)} label={copy.card.open(copy.links.website)} external>
                    <ExternalLink />
                </IconLink>
            )}
            {lead.email && (
                <IconLink href={`mailto:${lead.email}`} label={copy.links.email(lead.email)}>
                    <Mail />
                </IconLink>
            )}
            {lead.phone && (
                <IconLink href={`tel:${lead.phone.replace(/\s+/g, "")}`} label={copy.links.call(lead.phone)}>
                    <Phone />
                </IconLink>
            )}
        </div>
    );
}

function IconLink({ href, label, external, children }: { href: string; label: string; external?: boolean; children: ReactNode }) {
    return (
        <Button variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground hover:text-foreground" asChild>
            <a
                href={href}
                title={label}
                aria-label={label}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
                {children}
            </a>
        </Button>
    );
}
