"use client";

import { Copy, ExternalLink, Globe, Rocket } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { StatusTone } from "@/config/ui";
import { mockupsCopy } from "@/i18n/admin/mockups";
import { cn } from "@/lib/utils";
import type { MockupDeployment } from "@/types/admin";

const copy = mockupsCopy;

export function MockupLiveBadge({ live }: { live: MockupDeployment | null }) {
    if (!live) return <Badge tone={StatusTone.Neutral}>{copy.status.notDeployed}</Badge>;
    return (
        <Badge tone={StatusTone.Success}>
            <Rocket />
            {copy.status.live(live.version)}
        </Badge>
    );
}

export function copyMockupLink(url: string) {
    navigator.clipboard.writeText(url).then(
        () => toast.success(copy.link.copied),
        () => toast.error(copy.link.copyFailed),
    );
}

export interface MockupLinkProps {
    url: string | null;
    fallback: string;
    className?: string;
}

export function MockupLink({ url, fallback, className }: MockupLinkProps) {
    return (
        <div className={cn("flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] py-1 pl-3.5 pr-1", className)}>
            <Globe className="size-3.5 shrink-0 text-muted-foreground" />
            {url ? (
                <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={url}
                    className="min-w-0 flex-1 truncate font-mono text-xs transition-colors hover:text-brand-bright"
                >
                    {url.replace(/^https?:\/\//, "")}
                </a>
            ) : (
                <span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">{fallback}</span>
            )}
            <Button
                variant="ghost"
                size="icon"
                className="size-7 shrink-0 rounded-full text-muted-foreground"
                aria-label={copy.link.copy}
                title={copy.link.copy}
                disabled={!url}
                onClick={() => url && copyMockupLink(url)}
            >
                <Copy className="!size-3.5" />
            </Button>
            {url && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-7 shrink-0 rounded-full text-muted-foreground"
                    aria-label={copy.link.open}
                    title={copy.link.open}
                    asChild
                >
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="!size-3.5" />
                    </a>
                </Button>
            )}
        </div>
    );
}
