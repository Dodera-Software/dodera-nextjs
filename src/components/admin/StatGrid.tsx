import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface StatTileProps {
    label: ReactNode;
    value: ReactNode;
    hint?: ReactNode;
    href?: string;
    loading?: boolean;
}

export function StatGrid({ children, className }: { children: ReactNode; className?: string }) {
    return (
        <div
            className={cn(
                "grid grid-cols-2 gap-px overflow-hidden rounded-3xl border border-foreground/10 bg-foreground/10 xl:grid-cols-4",
                className,
            )}
        >
            {children}
        </div>
    );
}

export function StatTile({ label, value, hint, href, loading }: StatTileProps) {
    const body = (
        <>
            <div className="flex items-center justify-between gap-3">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{label}</p>
                {href && (
                    <ArrowUpRight className="size-4 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-bright" />
                )}
            </div>
            <div className="space-y-1">
                {loading ? (
                    <Skeleton className="h-12 w-20" />
                ) : (
                    <p className="display text-gradient-metal pb-1 text-[clamp(1.6rem,7vw,2.25rem)] tabular-nums sm:text-5xl">{value}</p>
                )}
                <p className="min-h-5 text-sm text-muted-foreground">{hint}</p>
            </div>
        </>
    );
    const className = "group flex min-h-[9rem] flex-col justify-between gap-4 bg-card p-5 transition-colors sm:min-h-[11rem] sm:p-6";
    if (href) {
        return (
            <Link href={href} className={cn(className, "hover:bg-foreground/[0.03]")}>
                {body}
            </Link>
        );
    }
    return <div className={className}>{body}</div>;
}
