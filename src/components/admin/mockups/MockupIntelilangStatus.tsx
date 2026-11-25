"use client";

import { useQueryClient } from "@tanstack/react-query";
import { BrainCircuit, Loader2 } from "lucide-react";
import { AdminQueryKey } from "@/config/admin";
import { useAdminMutation } from "@/hooks/use-admin";
import { mockupsCopy } from "@/i18n/admin/mockups";
import { adminFetch } from "@/lib/admin-api";
import { cn } from "@/lib/utils";
import type { MockupDeployment } from "@/types/admin";

const copy = mockupsCopy.intelilang;

interface MockupIntelilangStatusProps {
    projectId: number;
    deployment: MockupDeployment;
    connected: boolean;
}

export function MockupIntelilangStatus({ projectId, deployment, connected }: MockupIntelilangStatusProps) {
    const queryClient = useQueryClient();
    const status = deployment.intelilang_status;
    const failed = status === "failed";

    const send = useAdminMutation({
        mutationFn: () => adminFetch(`/api/admin/mockups/${projectId}/deployments/${deployment.id}/intelilang`, { method: "POST" }),
        invalidates: [AdminQueryKey.Mockups],
        success: copy.done(deployment.version),
    });

    if (status === "sent") {
        return (
            <span className="inline-flex items-center gap-1 text-[0.7rem] text-brand-bright" title={copy.sentHint}>
                <BrainCircuit className="size-3" />
                {copy.sent}
            </span>
        );
    }
    if (!connected) return null;
    return (
        <button
            type="button"
            onClick={() => send.mutate(undefined, { onError: () => queryClient.invalidateQueries({ queryKey: [AdminQueryKey.Mockups, projectId] }) })}
            disabled={send.isPending}
            title={failed ? copy.retryHint : copy.sendHint}
            className={cn(
                "inline-flex items-center gap-1 text-[0.7rem] transition-colors hover:text-foreground disabled:opacity-60",
                failed ? "text-red-400" : "text-muted-foreground",
            )}
        >
            {send.isPending ? <Loader2 className="size-3 animate-spin" /> : <BrainCircuit className="size-3" />}
            {failed ? copy.retry : copy.send}
        </button>
    );
}
