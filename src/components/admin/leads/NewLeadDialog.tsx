"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
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
import { LEAD_SOURCES, LEAD_STAGES, type LeadStage } from "@/config/leads";
import type { LeadDetail } from "@/types/admin";

interface NewLeadDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    /** Column the dialog was opened from. */
    initialStage: LeadStage;
    onCreated: (lead: LeadDetail) => void;
}

/** The few fields needed to put a card on the board; everything else is on the lead page. */
export function NewLeadDialog({ open, onOpenChange, initialStage, onCreated }: NewLeadDialogProps) {
    const [name, setName] = useState("");
    const [contactName, setContactName] = useState("");
    const [email, setEmail] = useState("");
    const [value, setValue] = useState("");
    const [source, setSource] = useState("");
    const [stage, setStage] = useState<LeadStage>(initialStage);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        if (!open) return;
        setName("");
        setContactName("");
        setEmail("");
        setValue("");
        setSource("");
        setStage(initialStage);
    }, [open, initialStage]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (saving || !name.trim()) return;
        setSaving(true);
        try {
            const res = await fetch("/api/admin/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name,
                    contact_name: contactName,
                    email,
                    value_eur: value,
                    source,
                    stage,
                }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                onCreated(data.data);
                onOpenChange(false);
            } else {
                toast.error(data.message ?? "Failed to create the lead");
            }
        } catch {
            toast.error("Failed to create the lead");
        } finally {
            setSaving(false);
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>New lead</DialogTitle>
                    <DialogDescription>Add the basics now — open the card later for notes, follow-ups and the preview.</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="leadName">Company / name</Label>
                        <Input
                            id="leadName"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            maxLength={120}
                            placeholder="Acme Dental"
                            autoFocus
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="leadContact">Contact person</Label>
                            <Input id="leadContact" value={contactName} onChange={(e) => setContactName(e.target.value)} maxLength={120} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leadEmail">Email</Label>
                            <Input id="leadEmail" type="email" value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} />
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="leadValue">Est. value (€)</Label>
                            <Input
                                id="leadValue"
                                type="number"
                                min={0}
                                step={100}
                                inputMode="numeric"
                                value={value}
                                onChange={(e) => setValue(e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="leadSource">Source</Label>
                            <Input
                                id="leadSource"
                                list="lead-sources"
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                maxLength={120}
                            />
                            <datalist id="lead-sources">
                                {LEAD_SOURCES.map((s) => <option key={s} value={s} />)}
                            </datalist>
                        </div>
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
                        <Button type="submit" disabled={saving || !name.trim()}>
                            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                            {saving ? "Adding…" : "Add lead"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
