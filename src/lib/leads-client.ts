"use client";

import { queryOptions, useQuery, useQueryClient, type MutationFunction } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { toast } from "sonner";
import { AdminQueryKey } from "@/config/admin";
import { COMMON_COUNTRIES, LeadStage, MockPolicy, mockPolicy, OUTREACH_STAGES } from "@/config/leads";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { sessionQuery } from "@/lib/admin-queries";
import { adminFetch } from "@/lib/admin-api";
import type { Lead, LeadDetail, LeadSuggestions, LinkableMockup } from "@/types/admin";

const eur = new Intl.NumberFormat("en-IE", { style: "currency", currency: "EUR", maximumFractionDigits: 0 });

export function formatEur(value: number): string {
    return eur.format(value);
}

export function leadHref(id: number): string {
    return `/admin/leads/${id}`;
}

function todayIso(): string {
    return format(new Date(), "yyyy-MM-dd");
}

export enum FollowUpState {
    Overdue = "overdue",
    Today = "today",
    Upcoming = "upcoming",
}

export const FOLLOW_UP_TONE: Record<FollowUpState, StatusTone> = {
    [FollowUpState.Overdue]: StatusTone.Danger,
    [FollowUpState.Today]: StatusTone.Warning,
    [FollowUpState.Upcoming]: StatusTone.Neutral,
};

export function followUpState(date: string): FollowUpState {
    const today = todayIso();
    if (date < today) return FollowUpState.Overdue;
    if (date === today) return FollowUpState.Today;
    return FollowUpState.Upcoming;
}

export function formatFollowUp(date: string): string {
    return followUpState(date) === FollowUpState.Today ? copy.followUp.today : format(parseISO(date), "MMM d");
}

export function externalHref(link: string): string {
    return /^https?:\/\//i.test(link) ? link : `https://${link}`;
}

export function copyToClipboard(text: string, message: string = copy.linkCopied): void {
    navigator.clipboard.writeText(text);
    toast.success(message);
}

export function leadQuery(id: number) {
    return queryOptions({
        queryKey: [AdminQueryKey.Leads, id],
        queryFn: () => adminFetch<{ data: LeadDetail }>(`/api/admin/leads/${id}`).then((r) => r.data),
    });
}

export const linkableMockupsQuery = queryOptions({
    queryKey: [AdminQueryKey.Mockups, AdminQueryKey.Leads],
    queryFn: () => adminFetch<{ data: LinkableMockup[] }>("/api/admin/leads/linkable-mockups").then((r) => r.data),
});

export function patchLead(id: number, body: Record<string, unknown>): Promise<LeadDetail> {
    return adminFetch<{ data: LeadDetail }>(`/api/admin/leads/${id}`, { method: "PATCH", json: body }).then((r) => r.data);
}

export function useLeadMutation<TVariables = void>({
    leadId,
    mutationFn,
    success,
    alsoInvalidates = [],
}: {
    leadId: number;
    mutationFn: MutationFunction<LeadDetail, TVariables>;
    success?: string | ((data: LeadDetail, variables: TVariables) => string);
    alsoInvalidates?: AdminQueryKey[];
}) {
    const queryClient = useQueryClient();
    return useAdminMutation<LeadDetail, TVariables>({
        mutationFn: async (variables, context) => {
            const lead = await mutationFn(variables, context);
            queryClient.setQueryData(leadQuery(leadId).queryKey, lead);
            return lead;
        },
        invalidates: [AdminQueryKey.Leads, ...alsoInvalidates],
        success,
    });
}

const EMPTY_SUGGESTIONS: LeadSuggestions = { countries: [...COMMON_COUNTRIES], categories: [], cities: [] };

export function useLeadSuggestions(): LeadSuggestions {
    const { data } = useQuery({
        queryKey: [AdminQueryKey.LeadSuggestions],
        queryFn: () => adminFetch<{ data: LeadSuggestions }>("/api/admin/leads/suggestions").then((r) => r.data),
        select: (used): LeadSuggestions => ({
            countries: [...new Set([...used.countries, ...COMMON_COUNTRIES])],
            categories: used.categories,
            cities: used.cities,
        }),
    });
    return data ?? EMPTY_SUGGESTIONS;
}

export function useAdminName(): string | null {
    return useQuery(sessionQuery).data?.name ?? null;
}

interface MockStatus {
    label: string;
    tone: StatusTone;
    hint: string;
}

export function mockStatus(lead: Lead): MockStatus {
    const onRequest = mockPolicy(lead.country) === MockPolicy.OnRequest;
    const reached = OUTREACH_STAGES.has(lead.stage);
    const live = lead.preview?.live_version ?? null;
    const country = lead.country ?? "";

    if (lead.mockup_sent_at) {
        return { label: copy.mock.sent(live), tone: StatusTone.Success, hint: copy.mock.sentHint };
    }
    if (!lead.preview) {
        return {
            label: copy.mock.none,
            tone: lead.stage === LeadStage.Mockup || reached ? StatusTone.Warning : StatusTone.Neutral,
            hint: copy.mock.noneHint,
        };
    }
    if (live === null) {
        return { label: copy.mock.notDeployed, tone: StatusTone.Warning, hint: copy.mock.notDeployedHint };
    }
    if (!reached) {
        return {
            label: copy.mock.ready(live),
            tone: StatusTone.Info,
            hint: onRequest ? copy.mock.readyOnRequestHint(country) : copy.mock.readyWithMessageHint,
        };
    }
    if (onRequest && lead.stage === LeadStage.Contacted) {
        return { label: copy.mock.onRequest, tone: StatusTone.Brand, hint: copy.mock.onRequestHint(country) };
    }
    if (lead.stage === LeadStage.Lost) {
        return { label: copy.mock.notSent, tone: StatusTone.Neutral, hint: copy.mock.notSentHint };
    }
    return {
        label: copy.mock.send,
        tone: StatusTone.Warning,
        hint: onRequest ? copy.mock.sendOnRequestHint : copy.mock.sendWithMessageHint,
    };
}
