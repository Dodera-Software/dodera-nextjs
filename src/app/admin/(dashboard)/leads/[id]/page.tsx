"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ExternalLink, Loader2, Mail, Phone, Save, SquareKanban, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useConfirm } from "@/hooks/use-confirm";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { LeadPreviewPanel } from "@/components/admin/leads/LeadPreviewPanel";
import { LeadTimeline } from "@/components/admin/leads/LeadTimeline";
import { LEAD_LIMITS, LEAD_SOURCES, LEAD_STAGES } from "@/config/leads";
import { formatDateTime } from "@/lib/format";
import { FOLLOW_UP_CLASSES, followUpState, websiteHref } from "@/lib/leads-client";
import type { LeadDetail } from "@/types/admin";

/** Editable fields, as strings for the inputs. */
type Form = {
    name: string;
    contact_name: string;
    email: string;
    phone: string;
    website: string;
    source: string;
    value_eur: string;
    follow_up_on: string;
    next_step: string;
    notes: string;
};

function toForm(lead: LeadDetail): Form {
    return {
        name: lead.name,
        contact_name: lead.contact_name ?? "",
        email: lead.email ?? "",
        phone: lead.phone ?? "",
        website: lead.website ?? "",
        source: lead.source ?? "",
        value_eur: lead.value_eur === null ? "" : String(lead.value_eur),
        follow_up_on: lead.follow_up_on ?? "",
        next_step: lead.next_step ?? "",
        notes: lead.notes ?? "",
    };
}

export default function LeadPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const confirm = useConfirm();
    const leadId = Number(params.id);

    const [lead, setLead] = useState<LeadDetail | null>(null);
    const [form, setForm] = useState<Form | null>(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [saving, setSaving] = useState(false);
    const [movingStage, setMovingStage] = useState(false);
    const [deleting, setDeleting] = useState(false);

    /** Take a fresh lead from the server; keep unsaved edits unless told otherwise. */
    const applyLead = useCallback((next: LeadDetail, resetForm = false) => {
        setLead(next);
        setForm((prev) => (prev === null || resetForm ? toForm(next) : prev));
    }, []);

    const load = useCallback(async () => {
        if (!Number.isInteger(leadId) || leadId <= 0) {
            setNotFound(true);
            setLoading(false);
            return;
        }
        try {
            const res = await fetch(`/api/admin/leads/${leadId}`);
            if (res.status === 404) {
                setNotFound(true);
                return;
            }
            const data = await res.json();
            if (data.status === "success") applyLead(data.data);
            else toast.error(data.message ?? "Failed to load the lead");
        } catch {
            toast.error("Failed to load the lead");
        } finally {
            setLoading(false);
        }
    }, [leadId, applyLead]);

    useEffect(() => {
        load();
    }, [load]);

    const dirty = useMemo(() => {
        if (!lead || !form) return false;
        const saved = toForm(lead);
        return (Object.keys(form) as (keyof Form)[]).some((k) => form[k].trim() !== saved[k].trim());
    }, [lead, form]);

    // Warn before leaving the page with unsaved edits.
    useEffect(() => {
        if (!dirty) return;
        const handler = (e: BeforeUnloadEvent) => e.preventDefault();
        window.addEventListener("beforeunload", handler);
        return () => window.removeEventListener("beforeunload", handler);
    }, [dirty]);

    const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
        setForm((prev) => (prev ? { ...prev, [key]: e.target.value } : prev));

    async function patch(body: Record<string, unknown>): Promise<LeadDetail | null> {
        const res = await fetch(`/api/admin/leads/${leadId}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        if (res.ok && data.status === "success") return data.data;
        toast.error(data.message ?? "Failed to update the lead");
        return null;
    }

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        if (!form || saving || !form.name.trim()) return;
        setSaving(true);
        try {
            const updated = await patch(form);
            if (updated) {
                applyLead(updated, true);
                toast.success("Saved");
            }
        } catch {
            toast.error("Failed to update the lead");
        } finally {
            setSaving(false);
        }
    }

    async function handleStage(stage: string) {
        if (!lead || stage === lead.stage) return;
        setMovingStage(true);
        try {
            const updated = await patch({ stage });
            if (updated) applyLead(updated);
        } catch {
            toast.error("Failed to move the lead");
        } finally {
            setMovingStage(false);
        }
    }

    async function handleDelete() {
        if (!lead) return;
        const ok = await confirm({
            title: `Delete "${lead.name}"?`,
            description: lead.preview
                ? "The card and its timeline are removed. The preview project stays in Admin → Mockups — delete it there if it's no longer needed."
                : "The card and its timeline are removed. This cannot be undone.",
            confirmLabel: "Delete lead",
        });
        if (!ok) return;
        setDeleting(true);
        try {
            const res = await fetch(`/api/admin/leads/${lead.id}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                toast.success("Lead deleted");
                router.replace("/admin/leads");
            } else {
                toast.error(data.message ?? "Failed to delete the lead");
                setDeleting(false);
            }
        } catch {
            toast.error("Failed to delete the lead");
            setDeleting(false);
        }
    }

    if (loading) {
        return (
            <div className="py-16 flex justify-center">
                <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (notFound || !lead || !form) {
        return (
            <div className="space-y-4">
                <BackLink />
                <div className="rounded-xl border border-border px-6 py-16 text-center text-muted-foreground">
                    <SquareKanban className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    This lead does not exist (anymore).
                </div>
            </div>
        );
    }

    const stage = LEAD_STAGES.find((s) => s.id === lead.stage);

    return (
        <div className="space-y-6">
            <BackLink />

            <AdminPageHeader
                title={lead.name}
                subtitle={`Added ${formatDateTime(lead.created_at, "MMM d, yyyy")}${lead.created_by ? ` by ${lead.created_by}` : ""}`}
                actions={
                    <>
                        <Select value={lead.stage} onValueChange={handleStage} disabled={movingStage}>
                            <SelectTrigger className="h-9 w-44" aria-label="Stage">
                                <span className="flex items-center gap-2">
                                    {movingStage ? (
                                        <Loader2 className="w-3 h-3 animate-spin" />
                                    ) : (
                                        <span className={`w-2 h-2 rounded-full ${stage?.dot ?? "bg-muted"}`} />
                                    )}
                                    <SelectValue />
                                </span>
                            </SelectTrigger>
                            <SelectContent>
                                {LEAD_STAGES.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleDelete}
                            disabled={deleting}
                            className="h-9 text-destructive hover:text-destructive hover:bg-destructive/10"
                        >
                            {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                            Delete
                        </Button>
                    </>
                }
            />

            <div className="grid gap-6 xl:grid-cols-5">
                <div className="xl:col-span-2 space-y-6">
                    {/* Details */}
                    <form onSubmit={handleSave} className="rounded-xl border border-border bg-card p-5 space-y-4">
                        <div className="flex items-center justify-between gap-3">
                            <p className="font-medium text-sm">Details</p>
                            <div className="flex items-center gap-1">
                                {lead.email && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <a href={`mailto:${lead.email}`} title={`Email ${lead.email}`}>
                                            <Mail className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                                {lead.phone && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <a href={`tel:${lead.phone.replace(/\s+/g, "")}`} title={`Call ${lead.phone}`}>
                                            <Phone className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                                {lead.website && (
                                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                        <a href={websiteHref(lead.website)} target="_blank" rel="noopener noreferrer" title="Open website">
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="name">Company / name</Label>
                            <Input id="name" value={form.name} onChange={set("name")} required maxLength={LEAD_LIMITS.name} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="contact_name">Contact person</Label>
                                <Input id="contact_name" value={form.contact_name} onChange={set("contact_name")} maxLength={LEAD_LIMITS.name} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={form.email} onChange={set("email")} maxLength={LEAD_LIMITS.shortText} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" type="tel" value={form.phone} onChange={set("phone")} maxLength={60} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="website">Website</Label>
                                <Input id="website" value={form.website} onChange={set("website")} maxLength={LEAD_LIMITS.shortText} placeholder="acme.com" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="source">Source</Label>
                                <Input id="source" list="lead-detail-sources" value={form.source} onChange={set("source")} maxLength={LEAD_LIMITS.name} />
                                <datalist id="lead-detail-sources">
                                    {LEAD_SOURCES.map((s) => <option key={s} value={s} />)}
                                </datalist>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="value_eur">Est. value (€)</Label>
                                <Input id="value_eur" type="number" min={0} step={100} inputMode="numeric" value={form.value_eur} onChange={set("value_eur")} />
                            </div>
                        </div>
                        <div className="grid sm:grid-cols-[1fr_auto] gap-3">
                            <div className="space-y-2">
                                <Label htmlFor="next_step">Next step</Label>
                                <Input id="next_step" value={form.next_step} onChange={set("next_step")} maxLength={LEAD_LIMITS.shortText} placeholder="Send the revised mockup" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="follow_up_on" className="flex items-center gap-2">
                                    Follow up on
                                    {lead.follow_up_on && followUpState(lead.follow_up_on) !== "upcoming" && (
                                        <span className={`px-1.5 rounded text-[11px] ${FOLLOW_UP_CLASSES[followUpState(lead.follow_up_on)]}`}>
                                            {followUpState(lead.follow_up_on) === "today" ? "today" : "overdue"}
                                        </span>
                                    )}
                                </Label>
                                <Input id="follow_up_on" type="date" value={form.follow_up_on} onChange={set("follow_up_on")} className="sm:w-44" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="notes">Notes</Label>
                            <Textarea
                                id="notes"
                                value={form.notes}
                                onChange={set("notes")}
                                maxLength={LEAD_LIMITS.notes}
                                placeholder="What they need, budget, decision makers, links…"
                                className="min-h-[140px] text-sm"
                            />
                        </div>

                        <div className="flex items-center justify-end gap-2">
                            {dirty && (
                                <Button type="button" variant="ghost" size="sm" onClick={() => setForm(toForm(lead))} disabled={saving}>
                                    Discard
                                </Button>
                            )}
                            <Button type="submit" size="sm" disabled={!dirty || saving || !form.name.trim()}>
                                {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                                {saving ? "Saving…" : "Save"}
                            </Button>
                        </div>
                    </form>

                    <LeadTimeline lead={lead} onChange={(next) => applyLead(next)} />
                </div>

                <div className="xl:col-span-3">
                    <LeadPreviewPanel lead={lead} onChange={(next) => applyLead(next)} onReload={load} />
                </div>
            </div>
        </div>
    );
}

function BackLink() {
    return (
        <Link href="/admin/leads" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" />
            Back to Leads
        </Link>
    );
}
