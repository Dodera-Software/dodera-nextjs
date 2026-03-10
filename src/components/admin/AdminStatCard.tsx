import type { ElementType } from "react";
import { cn } from "@/lib/utils";

export interface AdminStatCardProps {
    label: string;
    value: number | string;
    icon: ElementType;
    iconColor: string;
    iconBg: string;
    isLoading?: boolean;
    className?: string;
}

/**
 * Metric card shown on the admin dashboard overview.
 */
export function AdminStatCard({
    label,
    value,
    icon: Icon,
    iconColor,
    iconBg,
    isLoading,
    className,
}: AdminStatCardProps) {
    return (
        <div
            className={cn(
                "space-y-3 rounded-xl border border-border bg-card p-5",
                className,
            )}
        >
            <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <div
                    className={cn(
                        "flex size-9 items-center justify-center rounded-lg",
                        iconBg,
                    )}
                >
                    <Icon className={cn("size-4", iconColor)} />
                </div>
            </div>
            <p className="text-3xl font-bold">
                {isLoading ? (
                    <span className="inline-block h-8 w-12 animate-pulse rounded bg-muted" />
                ) : (
                    value
                )}
            </p>
        </div>
    );
}
