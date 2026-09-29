"use client";

import { useEffect, useState } from "react";
import { Facebook, Instagram, Loader2, Lock, MapPin } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { LEAD_LIMITS, LEAD_STAGES, mockPolicy, type LeadStage } from "@/config/leads";
import { useLeadSuggestions } from "@/lib/leads-client";
import type { LeadDetail } from "@/types/admin";

interface NewLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Column the dialog was opened from. */
    initialStage: LeadStage;
    onCreated: (lead: LeadDetail) => void;
}

const EMPTY = {
    country: "",
    name: "",
    city: "",
    category: "",
    facebook_url: "",
    instagram_url: "",
    google_maps_url: "",
};

/**
 * Add a business you found: the same columns as the old Notion table.
 * Country, Business, Category and Google Maps are required; City, Facebook
 * and Instagram are optional (add whichever of the two you found).
 */
export function NewLeadDialog({ open, onOpenChange, initialStage, onCreated }: NewLeadDialogProps) {
    const suggestions = useLeadSuggestions();
    const [form, setForm] = useState(EMPTY);
    const [stage, setStage] = useState<LeadStage>(initialStage);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        // Keep the last country: businesses are usually added a country at a time.
        setForm((prev) => ({ ...EMPTY, country: prev.country }));
        setStage(initialStage);
    }, [open, initialStage]);

    const set = (key: keyof typeof EMPTY) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((prev) => ({ ...prev, [key]: e.target.value }));

    const canSave = form.country.trim() && form.name.trim() && form.category.trim() && form.google_maps_url.trim();
    const onRequest = form.country.trim() !== "" && mockPolicy(form.country) === "on-request";

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (saving || !canSave) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ...form, stage }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                onCreated(data.data);
                onOpenChange(false);
            } else {
                toast.error(data.message ?? "Failed to add the business");
            }
        } catch {
            toast.error("Failed to add the business");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New business</DialogTitle>
                    <DialogDescription>Fields marked * are required. Add Facebook, Instagram or both — whatever you found.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="leadCountry">Country *</Label>
                            <Input
                                id="leadCountry"
                                list="lead-countries"
                                value={form.country}
                                onChange={set("country")}
                                required
                                maxLength={LEAD_LIMITS.name}
                                autoFocus={!form.country}
                            />
                            <datalist id="lead-countries">
                                {suggestions.countries.map((c) => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leadCity">City</Label>
                            <Input id="leadCity" list="lead-cities" value={form.city} onChange={set("city")} maxLength={LEAD_LIMITS.name} />
                            <datalist id="lead-cities">
                                {suggestions.cities.map((c) => <option key={c} value={c} />)}
                            </datalist>
                        </div>
                    </div>
                    {onRequest && (
                        <p className="flex items-start gap-2 rounded-lg bg-violet-400/10 px-3 py-2 text-xs text-violet-400">
                            <Lock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            {form.country.trim()}: the first message goes out without the mock — send it only once they ask.
                        </p>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="leadName">Business *</Label>
                        <Input
                            id="leadName"
                            value={form.name}
                            onChange={set("name")}
                            required
                            maxLength={LEAD_LIMITS.name}
                            placeholder="Happy Paws Grooming"
                            autoFocus={!!form.country}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="leadCategory">Category *</Label>
                        <Input
                            id="leadCategory"
                            list="lead-categories"
                            value={form.category}
                            onChange={set("category")}
                            required
                            maxLength={LEAD_LIMITS.name}
                            placeholder="Pet grooming"
                        />
                        <datalist id="lead-categories">
                            {suggestions.categories.map((c) => <option key={c} value={c} />)}
                        </datalist>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="leadFacebook" className="flex items-center gap-1.5">
                                <Facebook className="w-3.5 h-3.5" /> Facebook
                            </Label>
                            <Input
                                id="leadFacebook"
                                value={form.facebook_url}
                                onChange={set("facebook_url")}
                                maxLength={LEAD_LIMITS.url}
                                placeholder="Page link or name"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leadInstagram" className="flex items-center gap-1.5">
                                <Instagram className="w-3.5 h-3.5" /> Instagram
                            </Label>
                            <Input
                                id="leadInstagram"
                                value={form.instagram_url}
                                onChange={set("instagram_url")}
                                maxLength={LEAD_LIMITS.url}
                                placeholder="@handle or link"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="leadMaps" className="flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5" /> Google Maps *
                        </Label>
                        <Input
                            id="leadMaps"
                            value={form.google_maps_url}
                            onChange={set("google_maps_url")}
                            required
                            maxLength={LEAD_LIMITS.url}
                            placeholder="https://maps.app.goo.gl/…"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label>Stage</Label>
                        <Select value={stage} onValueChange={(v) => setStage(v as LeadStage)}>
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {LEAD_STAGES.map((s) => (
                                    <SelectItem key={s.id} value={s.id}>{s.label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter className="gap-2 sm:gap-0">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={saving || !canSave}>
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {saving ? "Adding…" : "Add business"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
