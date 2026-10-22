"use client";

import { useState } from "react";
import Link from "next/link";
import { Send, User, Mail, MessageSquare, Building, Phone, AlertCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FieldError } from "@/components/ui/field-error";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EMAIL_RE, NAME_RE, PHONE_RE, DANGEROUS_RE, CONTACT_LIMITS } from "@/lib/validation";
import { useDict } from "@/i18n/LocaleProvider";
import type { Dictionary } from "@/i18n/dictionaries";

const LIMITS = CONTACT_LIMITS;

/* ── Per-field validation ─────────────────────────────────── */
export interface FieldErrors {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    service_type?: string;
    budget?: string;
    message?: string;
    gdpr_consent?: string;
}

function validate(data: Record<string, string>, m: Dictionary["contactForm"]["errors"]): FieldErrors {
    const errors: FieldErrors = {};

    const name = data.name?.trim() ?? "";
    if (!name) errors.name = m.nameRequired;
    else if (name.length < LIMITS.name.min) errors.name = m.minChars(LIMITS.name.min);
    else if (name.length > LIMITS.name.max) errors.name = m.maxChars(LIMITS.name.max);
    else if (!NAME_RE.test(name)) errors.name = m.nameChars;

    const email = data.email?.trim() ?? "";
    if (!email) errors.email = m.emailRequired;
    else if (email.length > LIMITS.email.max) errors.email = m.maxChars(LIMITS.email.max);
    else if (!EMAIL_RE.test(email)) errors.email = m.emailInvalid;

    const company = data.company?.trim() ?? "";
    if (company && company.length > LIMITS.company.max) errors.company = m.maxChars(LIMITS.company.max);
    else if (company && DANGEROUS_RE.test(company)) errors.company = m.invalidChars;

    const phone = data.phone?.trim() ?? "";
    if (phone && !PHONE_RE.test(phone)) errors.phone = m.phoneInvalid;
    else if (phone && phone.length > LIMITS.phone.max) errors.phone = m.maxChars(LIMITS.phone.max);

    const message = data.message?.trim() ?? "";
    if (!message) errors.message = m.messageRequired;
    else if (message.length < LIMITS.message.min) errors.message = m.minChars(LIMITS.message.min);
    else if (message.length > LIMITS.message.max) errors.message = m.maxChars(LIMITS.message.max);
    else if (DANGEROUS_RE.test(message)) errors.message = m.invalidChars;

    return errors;
}

const HONEYPOT_FIELD = "website_url";

/* ── Component ────────────────────────────────────────────── */
export function ContactForm() {
    const { contactForm: t, links } = useDict();
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);
    const [errors, setErrors] = useState<FieldErrors>({});
    const [submitCount, setSubmitCount] = useState(0);
    const [lastSubmitTime, setLastSubmitTime] = useState(0);
    const [gdpr, setGdpr] = useState(false);
    const [serviceType, setServiceType] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        const now = Date.now();
        if (submitCount >= 3 && now - lastSubmitTime < 60_000) return;

        const form = e.currentTarget;
        const fd = new FormData(form);

        if (fd.get(HONEYPOT_FIELD)) return;

        const raw: Record<string, string> = {};
        for (const [key, val] of fd.entries()) {
            raw[key] = typeof val === "string" ? val : "";
        }
        raw.service_type = serviceType;

        const fieldErrors = validate(raw, t.errors);
        if (!gdpr) {
            fieldErrors.gdpr_consent = t.errors.consent;
        }
        if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            return;
        }

        setErrors({});
        setServerError(null);
        setSubmitting(true);
        setSubmitCount((c) => c + 1);
        setLastSubmitTime(now);

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(raw),
            });

            const data = await res.json();

            if (!res.ok) {
                if (data.errors) {
                    setErrors(data.errors);
                } else {
                    setServerError(data.message ?? t.errors.generic);
                }
                return;
            }

            setSubmitted(true);
        } catch {
            setServerError(t.errors.network);
        } finally {
            setSubmitting(false);
        }
    }

    if (submitted) {
        return (
            <div className="mx-auto max-w-lg rounded-xl border border-border bg-card p-10 text-center shadow-sm">
                <div className="mx-auto mb-4 flex size-14 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50">
                    <Send className="size-6 text-emerald-600" />
                </div>
                <h3 className="mb-2 text-xl font-bold">{t.sentTitle}</h3>
                <p className="text-sm text-muted-foreground">
                    {t.sentText}
                </p>
            </div>
        );
    }

    return (
        <form
            onSubmit={handleSubmit}
            noValidate
            aria-label={t.formAria}
            className="mx-auto max-w-lg space-y-5 rounded-xl border border-border bg-card p-8 shadow-sm"
        >
            {/* Honeypot */}
            <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                <label htmlFor="website_url">Do not fill this</label>
                <input type="text" id="website_url" name={HONEYPOT_FIELD} tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="contact-name" className="flex items-center gap-2 text-sm font-medium">
                        <User className="size-3.5 text-muted-foreground" />
                        {t.name}
                    </label>
                    <Input
                        id="contact-name"
                        required
                        name="name"
                        autoComplete="name"
                        placeholder={t.namePlaceholder}
                        maxLength={LIMITS.name.max}
                        minLength={LIMITS.name.min}
                        aria-invalid={!!errors.name}
                        className="border-input"
                    />
                    <FieldError message={errors.name} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="contact-email" className="flex items-center gap-2 text-sm font-medium">
                        <Mail className="size-3.5 text-muted-foreground" />
                        {t.email}
                    </label>
                    <Input
                        id="contact-email"
                        required
                        type="email"
                        name="email"
                        autoComplete="email"
                        placeholder={t.emailPlaceholder}
                        maxLength={LIMITS.email.max}
                        aria-invalid={!!errors.email}
                        className="border-input"
                    />
                    <FieldError message={errors.email} />
                </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                    <label htmlFor="contact-company" className="flex items-center gap-2 text-sm font-medium">
                        <Building className="size-3.5 text-muted-foreground" />
                        {t.company} <span className="text-muted-foreground font-normal">{t.optional}</span>
                    </label>
                    <Input
                        id="contact-company"
                        name="company"
                        autoComplete="organization"
                        placeholder={t.companyPlaceholder}
                        maxLength={LIMITS.company.max}
                        aria-invalid={!!errors.company}
                        className="border-input"
                    />
                    <FieldError message={errors.company} />
                </div>
                <div className="space-y-2">
                    <label htmlFor="contact-phone" className="flex items-center gap-2 text-sm font-medium">
                        <Phone className="size-3.5 text-muted-foreground" />
                        {t.phone} <span className="text-muted-foreground font-normal">{t.optional}</span>
                    </label>
                    <Input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        autoComplete="tel"
                        placeholder={t.phonePlaceholder}
                        maxLength={LIMITS.phone.max}
                        pattern="[+]?[\d\s()\-]{7,20}"
                        aria-invalid={!!errors.phone}
                        className="border-input"
                    />
                    <FieldError message={errors.phone} />
                </div>
            </div>

            <div className="space-y-2">
                <label htmlFor="contact-service-type" className="flex items-center gap-2 text-sm font-medium">
                    <Layers className="size-3.5 text-muted-foreground" />
                    {t.serviceType} <span className="text-muted-foreground font-normal">{t.optional}</span>
                </label>
                <Select
                    value={serviceType}
                    onValueChange={setServiceType}
                >
                    <SelectTrigger id="contact-service-type" aria-invalid={!!errors.service_type}>
                        <SelectValue placeholder={t.servicePlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                        {t.serviceOptions.map((o) => (
                            <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
                <FieldError message={errors.service_type} />
            </div>

            {serverError && (
                <div className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    <AlertCircle className="size-4 shrink-0" />
                    {serverError}
                </div>
            )}

            <div className="space-y-2">
                <label htmlFor="contact-message" className="flex items-center gap-2 text-sm font-medium">
                    <MessageSquare className="size-3.5 text-muted-foreground" />
                    {t.details}
                </label>
                <Textarea
                    id="contact-message"
                    required
                    name="message"
                    rows={4}
                    placeholder={t.detailsPlaceholder}
                    maxLength={LIMITS.message.max}
                    minLength={LIMITS.message.min}
                    aria-invalid={!!errors.message}
                    className="resize-none border-input"
                />
                <FieldError message={errors.message} />
            </div>

            {/* GDPR consent */}
            <div className="space-y-1.5">
                <label className="flex items-start gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={gdpr}
                        onChange={(e) => setGdpr(e.target.checked)}
                        className="mt-0.5 size-4 shrink-0 accent-primary"
                        aria-invalid={!!errors.gdpr_consent}
                    />
                    <span className="text-xs leading-relaxed text-muted-foreground">
                        {t.consentBefore}{" "}
                        <Link
                            href={links.privacy}
                            target="_blank"
                            className="text-primary underline underline-offset-2"
                        >
                            {t.privacyPolicy}
                        </Link>
                        {t.consentAfter}
                    </span>
                </label>
                <FieldError message={errors.gdpr_consent} />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
                {submitting ? t.sending : t.send}
                {!submitting && <Send className="ml-2 size-4" />}
            </Button>
        </form>
    );
}
