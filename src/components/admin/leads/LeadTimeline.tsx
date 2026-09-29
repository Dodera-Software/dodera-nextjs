"use client";

import { useState } from "react";
import { ArrowRightLeft, History, Loader2, MailCheck, MessageSquare, Plus, Rocket, Send, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useConfirm } from "@/hooks/use-confirm";
import { formatDateTime, formatTimeAgo } from "@/lib/format";
import { LEAD_LIMITS } from "@/config/leads";
import type { LeadActivityKind, LeadDetail } from "@/types/admin";

const KIND_ICON: Record<LeadActivityKind, typeof MessageSquare> = {
    note: MessageSquare,
    created: Plus,
    stage: ArrowRightLeft,
    deploy: Rocket,
    mock: MailCheck,
};

interface LeadTimelineProps {
    lead: LeadDetail;
    onChange: (lead: LeadDetail) => void;
}

/** Notes from calls and meetings, plus automatic entries for stage moves and preview deploys. */
export function LeadTimeline({ lead, onChange }: LeadTimelineProps) {
    const confirm = useConfirm();
    const [text, setText] = useState("");
    const [posting, setPosting] = useState(false);
    const [deletingId, setDeletingId] = useState<number | null>(null);

    async function handleAdd(e: React.FormEvent) {
        e.preventDefault();
        if (posting || !text.trim()) return;
        setPosting(true);
        try {
            const res = await fetch(`/api/admin/leads/${lead.id}/activities`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ body: text }),
            });
            const data = await res.json();
            if (res.ok && data.status === "success") {
                onChange(data.data);
                setText("");
            } else {
                toast.error(data.message ?? "Failed to add the note");
            }
        } catch {
            toast.error("Failed to add the note");
        } finally {
            setPosting(false);
        }
    }

    async function handleDelete(activityId: number) {
        const ok = await confirm({ title: "Delete this note?", description: "It is removed from the timeline.", confirmLabel: "Delete" });
        if (!ok) return;
        setDeletingId(activityId);
        try {
            const res = await fetch(`/api/admin/leads/${lead.id}/activities/${activityId}`, { method: "DELETE" });
            const data = await res.json();
            if (res.ok && data.status === "success") onChange(data.data);
            else toast.error(data.message ?? "Failed to delete the note");
        } catch {
            toast.error("Failed to delete the note");
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-amber-400/10 flex items-center justify-center flex-shrink-0">
                    <History className="w-4 h-4 text-amber-400" />
                </div>
                <div>
                    <p className="font-medium text-sm">Timeline</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Calls, meetings, feedback — newest first</p>
                </div>
            </div>

            <form onSubmit={handleAdd} className="space-y-2">
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) handleAdd(e);
                    }}
                    placeholder="Add a note… (Ctrl+Enter to save)"
                    maxLength={LEAD_LIMITS.activity}
                    className="min-h-[70px] text-sm"
                    aria-label="New note"
                />
                <div className="flex justify-end">
                    <Button type="submit" size="sm" disabled={posting || !text.trim()}>
                        {posting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                        Add note
                    </Button>
                </div>
            </form>

            {lead.activities.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">Nothing here yet.</p>
            ) : (
                <ol className="space-y-3">
                    {lead.activities.map((a) => {
                        const Icon = KIND_ICON[a.kind] ?? MessageSquare;
                        const isNote = a.kind === "note";
                        return (
                            <li key={a.id} className="flex gap-3 group">
                                <div
                                    className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${isNote ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                                >
                                    <Icon className="w-3.5 h-3.5" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <p className={`text-sm whitespace-pre-wrap break-words ${isNote ? "" : "text-muted-foreground"}`}>
                                        {a.body}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-0.5" title={formatDateTime(a.created_at)}>
                                        {formatTimeAgo(a.created_at)}
                                        {a.created_by && ` · ${a.created_by}`}
                                    </p>
                                </div>
                                {isNote && (
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(a.id)}
                                        disabled={deletingId === a.id}
                                        className="self-start p-1 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 focus-visible:opacity-100 transition-opacity"
                                        title="Delete note"
                                        aria-label="Delete note"
                                    >
                                        {deletingId === a.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Trash2 className="w-3.5 h-3.5" />}
                                    </button>
                                )}
                            </li>
                        );
                    })}
                </ol>
            )}
        </div>
    );
}
