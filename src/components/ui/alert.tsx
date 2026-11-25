import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import type { LucideIcon } from "lucide-react";
import { StatusTone } from "@/config/ui";
import { cn } from "@/lib/utils";

const alertVariants = cva("flex items-start gap-2.5 rounded-2xl border px-4 py-3 text-sm leading-relaxed", {
    variants: {
        tone: {
            [StatusTone.Neutral]: "border-foreground/10 bg-foreground/[0.03] text-muted-foreground",
            [StatusTone.Brand]: "border-brand/30 bg-brand/10 text-brand-bright",
            [StatusTone.Success]: "border-emerald-400/25 bg-emerald-400/10 text-emerald-400",
            [StatusTone.Warning]: "border-amber-400/25 bg-amber-400/10 text-amber-400",
            [StatusTone.Danger]: "border-red-400/25 bg-red-400/10 text-red-400",
            [StatusTone.Info]: "border-sky-400/25 bg-sky-400/10 text-sky-400",
        },
    },
    defaultVariants: { tone: StatusTone.Neutral },
});

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof alertVariants> {
    icon?: LucideIcon;
}

function Alert({ className, tone, icon: Icon, children, ...props }: AlertProps) {
    return (
        <div className={cn(alertVariants({ tone }), className)} {...props}>
            {Icon && <Icon className="mt-0.5 size-4 shrink-0" />}
            <div className="min-w-0 flex-1">{children}</div>
        </div>
    );
}

export { Alert, alertVariants };
