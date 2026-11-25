import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { StatusTone } from "@/config/ui";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-2.5 py-0.5 text-xs font-medium [&_svg]:size-3",
    {
        variants: {
            variant: {
                default: "border-transparent bg-primary text-primary-foreground",
                secondary: "border-transparent bg-secondary text-secondary-foreground",
                destructive: "border-transparent bg-destructive text-destructive-foreground",
                outline: "border-foreground/15 text-foreground",
            },
            tone: {
                [StatusTone.Neutral]: "border-foreground/10 bg-foreground/[0.04] text-muted-foreground",
                [StatusTone.Brand]: "border-brand/30 bg-brand/10 text-brand-bright",
                [StatusTone.Success]: "border-emerald-400/25 bg-emerald-400/10 text-emerald-400",
                [StatusTone.Warning]: "border-amber-400/25 bg-amber-400/10 text-amber-400",
                [StatusTone.Danger]: "border-red-400/25 bg-red-400/10 text-red-400",
                [StatusTone.Info]: "border-sky-400/25 bg-sky-400/10 text-sky-400",
            },
        },
    },
);

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {
    dot?: boolean;
}

function Badge({ className, variant, tone, dot, children, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant: tone ? null : (variant ?? "default"), tone }), className)} {...props}>
            {dot && <span className="size-1.5 rounded-full bg-current" />}
            {children}
        </span>
    );
}

export { Badge, badgeVariants };
