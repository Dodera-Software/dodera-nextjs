"use client";

import { useMemo, useState } from "react";
import { Copy, MessageSquareText, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { suggestedMessage } from "@/config/outreach-messages";
import { useAdminName } from "@/lib/leads-client";
import type { LeadDetail } from "@/types/admin";

/**
 * The one message to send this business now: A (with the preview link) or B
 * (without it) before they're interested — picked by their country — and a
 * follow-up once they are. Editable before copying.
 */
export function LeadMessages({ lead }: { lead: LeadDetail }) {
    const senderName = useAdminName();
    const message = useMemo(() => suggestedMessage(lead, senderName), [lead, senderName]);
    // Edits belong to the suggestion they were made on: when it changes
    // (stage, country, link or name), the new suggestion shows instead.
    const [draft, setDraft] = useState<{ base: string; text: string } | null>(null);

    if (!message) return null;

    const text = draft && draft.base === message.text ? draft.text : message.text;
    const setText = (value: string) => setDraft({ base: message.text, text: value });

    const edited = text !== message.text;

    function copy() {
        navigator.clipboard.writeText(text);
        toast.success(message!.includesLink ? "Message copied — mark the mock as sent once it's out" : "Message copied");
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-violet-400/10 flex items-center justify-center flex-shrink-0">
                        <MessageSquareText className="w-4 h-4 text-violet-400" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">{message.title}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{message.reason}</p>
                    </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                    {edited && (
                        <Button variant="ghost" size="sm" className="h-8 px-2 text-xs" onClick={() => setText(message.text)}>
                            <RotateCcw className="w-3.5 h-3.5" />
                            Reset
                        </Button>
                    )}
                    <Button size="sm" className="h-8" onClick={copy}>
                        <Copy className="w-3.5 h-3.5" />
                        Copy
                    </Button>
                </div>
            </div>
            <Textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                className="min-h-[220px] text-sm leading-relaxed"
                aria-label={message.title}
            />
            <p className="text-[11px] text-muted-foreground">An example to start from — edit it before sending.</p>
        </div>
    );
}
