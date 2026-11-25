import type { ReactNode } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";

export interface AdminPageProps {
    title: ReactNode;
    eyebrow?: ReactNode;
    description?: ReactNode;
    actions?: ReactNode;
    back?: { href: string; label: string };
    children: ReactNode;
    className?: string;
}

export function AdminPage({ title, eyebrow, description, actions, back, children, className }: AdminPageProps) {
    return (
        <div className={cn("space-y-10", className)}>
            <header className="flex flex-col gap-6 border-b border-foreground/10 pb-8 lg:flex-row lg:items-end lg:justify-between">
                <div className="min-w-0 space-y-3">
                    {back && (
                        <Link
                            href={back.href}
                            className="inline-flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="size-3.5" />
                            {back.label}
                        </Link>
                    )}
                    {eyebrow && !back && <p className="eyebrow">{eyebrow}</p>}
                    <h1 className="display text-[clamp(2rem,3.4vw,3rem)] leading-[1.02]">{title}</h1>
                    {description && <p className="max-w-2xl text-[0.95rem] leading-relaxed text-muted-foreground">{description}</p>}
                </div>
                {actions && <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>}
            </header>
            {children}
        </div>
    );
}
