import * as React from "react";
import { cn } from "@/lib/utils";

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
    value: number;
}

function Progress({ value, className, ...props }: ProgressProps) {
    const clamped = Math.min(100, Math.max(0, value));
    return (
        <div
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={clamped}
            className={cn("h-1.5 w-full overflow-hidden rounded-full bg-foreground/10", className)}
            {...props}
        >
            <div className="h-full rounded-full bg-brand transition-[width] duration-300" style={{ width: `${clamped}%` }} />
        </div>
    );
}

export { Progress };
