import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface AdminPanelProps {
    title?: ReactNode;
    eyebrow?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    footer?: ReactNode;
    flush?: boolean;
    children?: ReactNode;
    className?: string;
    id?: string;
}

export function AdminPanel({ title, eyebrow, description, actions, footer, flush, children, className, id }: AdminPanelProps) {
    const hasHeader = title || eyebrow || description || actions;
    return (
        <section id={id} className={cn("overflow-hidden rounded-3xl border border-foreground/10 bg-card/60", className)}>
            {hasHeader && (
                <header className="flex flex-col gap-4 border-b border-foreground/[0.07] px-6 py-5 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0 space-y-1.5">
                        {eyebrow && <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{eyebrow}</p>}
                        {title && <h2 className="font-display text-lg font-semibold tracking-tight">{title}</h2>}
                        {description && <p className="text-sm leading-relaxed text-muted-foreground">{description}</p>}
                    </div>
                    {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
                </header>
            )}
            {children && <div className={cn(!flush && "p-6")}>{children}</div>}
            {footer && <footer className="border-t border-foreground/[0.07] px-6 py-4">{footer}</footer>}
        </section>
    );
}
