"use client";

import { useMemo, useState } from "react";
import { Copy, RotateCcw } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { suggestedMessage } from "@/config/outreach-messages";
import { adminCommon } from "@/i18n/admin/common";
import { leadsCopy as copy } from "@/i18n/admin/leads";
import { copyToClipboard, useAdminName } from "@/lib/leads-client";
import type { LeadDetail } from "@/types/admin";

export function LeadMessages({ lead }: { lead: LeadDetail }) {
    const senderName = useAdminName();
    const message = useMemo(() => suggestedMessage(lead, senderName), [lead, senderName]);
    const [draft, setDraft] = useState<{ base: string; text: string } | null>(null);

    if (!message) return null;

    const text = draft && draft.base === message.text ? draft.text : message.text;
    const setText = (value: string) => setDraft({ base: message.text, text: value });
    const edited = text !== message.text;

    return (
        <AdminPanel
            title={message.title}
            description={message.reason}
            actions={
                <>
                    {edited && (
                        <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setText(message.text)}>
                            <RotateCcw />
                            {copy.messages.reset}
                        </Button>
                    )}
                    <Button
                        size="sm"
                        className="rounded-full"
                        onClick={() => copyToClipboard(text, message.includesLink ? copy.messages.copiedWithLink : copy.messages.copied)}
                    >
                        <Copy />
                        {adminCommon.actions.copy}
                    </Button>
                </>
            }
        >
            <div className="space-y-3">
                <Textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="min-h-[220px] rounded-xl border-foreground/10 bg-foreground/[0.03] text-sm leading-relaxed"
                    aria-label={message.title}
                />
                <p className="text-xs text-muted-foreground">{copy.messages.hint}</p>
            </div>
        </AdminPanel>
    );
}
