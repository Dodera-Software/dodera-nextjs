import { z } from "zod";
import { LEAD_LIMITS, LeadStage } from "@/config/leads";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import type { LeadDetail } from "@/types/admin";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function requiredText(field: string, max: number) {
    return z.string().trim().min(1, copy.form.required(field)).max(max, copy.form.tooLong(max));
}

function optionalText(max: number) {
    return z.string().trim().max(max, copy.form.tooLong(max));
}

const leadBusinessSchema = z.object({
    country: requiredText(copy.form.fieldNames.country, LEAD_LIMITS.name),
    city: optionalText(LEAD_LIMITS.name),
    name: requiredText(copy.form.fieldNames.name, LEAD_LIMITS.name),
    category: requiredText(copy.form.fieldNames.category, LEAD_LIMITS.name),
    facebook_url: optionalText(LEAD_LIMITS.url),
    instagram_url: optionalText(LEAD_LIMITS.url),
    google_maps_url: requiredText(copy.form.fieldNames.maps, LEAD_LIMITS.url),
});

export type LeadBusinessValues = z.infer<typeof leadBusinessSchema>;

export const newLeadSchema = leadBusinessSchema.extend({
    stage: z.enum(LeadStage),
});

export type NewLeadValues = z.infer<typeof newLeadSchema>;

export const leadDetailSchema = leadBusinessSchema.extend({
    contact_name: optionalText(LEAD_LIMITS.name),
    email: optionalText(LEAD_LIMITS.shortText).refine((v) => !v || EMAIL_RE.test(v), copy.form.invalidEmail),
    phone: optionalText(LEAD_LIMITS.phone),
    website: optionalText(LEAD_LIMITS.url),
    value_eur: z
        .string()
        .trim()
        .refine((v) => v === "" || (Number.isFinite(Number(v)) && Number(v) >= 0 && Number(v) <= LEAD_LIMITS.maxValue), copy.form.invalidValue),
    follow_up_on: z.string(),
    next_step: optionalText(LEAD_LIMITS.shortText),
    notes: optionalText(LEAD_LIMITS.notes),
});

export type LeadDetailValues = z.infer<typeof leadDetailSchema>;

export function emptyNewLead(country: string, stage: LeadStage): NewLeadValues {
    return {
        country,
        city: "",
        name: "",
        category: "",
        facebook_url: "",
        instagram_url: "",
        google_maps_url: "",
        stage,
    };
}

export function leadDetailValues(lead: LeadDetail): LeadDetailValues {
    return {
        name: lead.name,
        country: lead.country ?? "",
        city: lead.city ?? "",
        category: lead.category ?? "",
        facebook_url: lead.facebook_url ?? "",
        instagram_url: lead.instagram_url ?? "",
        google_maps_url: lead.google_maps_url ?? "",
        contact_name: lead.contact_name ?? "",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        website: lead.website ?? "",
        value_eur: lead.value_eur === null ? "" : String(lead.value_eur),
        follow_up_on: lead.follow_up_on ?? "",
        next_step: lead.next_step ?? "",
        notes: lead.notes ?? "",
    };
}

export const leadNoteSchema = z.object({
    body: z.string().trim().min(1, copy.timeline.required).max(LEAD_LIMITS.activity, copy.form.tooLong(LEAD_LIMITS.activity)),
});

export type LeadNoteValues = z.infer<typeof leadNoteSchema>;
