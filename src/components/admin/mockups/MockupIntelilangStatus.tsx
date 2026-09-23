"use client";

import { useState } from "react";
import { BrainCircuit, Loader2 } from "lucide-react";
import { toast } from "sonner";
import type { MockupDeployment, MockupProjectDetail } from "@/types/admin";

interface MockupIntelilangStatusProps {
    projectId: number;
    deployment: MockupDeployment;
    /** InteliLang is set up in Settings; without it nothing can be sent. */
    connected: boolean;
    onChange: (project: MockupProjectDetail) => void;
}

/** Whether one version reached InteliLang, and a way to send it (again). */
export function MockupIntelilangStatus({ projectId, deployment, connected, onChange }: MockupIntelilangStatusProps) {
    const [sending, setSending] = useState(false);
    const status = deployment.intelilang_status;

    async function send() {
        setSending(true);
        try {
            const res = await fetch(`/api/admin/mockups/${projectId}/deployments/${deployment.id}/intelilang`, { method: "POST" });
            const body = await res.json().catch(() => null);
            if (body?.data) onChange(body.data);
            if (body?.status === "success") toast.success(`Version ${deployment.version} sent to InteliLang`);
            else toast.error(body?.message ?? "Not sent to InteliLang");
        } finally {
            setSending(false);
        }
    }

    if (status === "sent") {
        return (
            <span className="inline-flex items-center gap-1 text-[11px] text-primary" title="InteliLang knows about this version">
                <BrainCircuit className="w-3 h-3" />
                In InteliLang
            </span>
        );
    }
    if (!connected) return null;
    return (
        <button
            type="button"
            onClick={send}
            disabled={sending}
            className={`inline-flex items-center gap-1 text-[11px] hover:underline disabled:opacity-60 ${status === "failed" ? "text-destructive" : "text-muted-foreground"}`}
            title={status === "failed" ? "The last attempt failed. Send it again." : "Tell InteliLang about this version"}
        >
            {sending ? <Loader2 className="w-3 h-3 animate-spin" /> : <BrainCircuit className="w-3 h-3" />}
            {status === "failed" ? "InteliLang failed · retry" : "Send to InteliLang"}
        </button>
    );
}
