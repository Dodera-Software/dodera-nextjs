"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useDict } from "@/i18n/LocaleProvider";

export interface BreadcrumbItem {
    label: string;
    href?: string;
}

export function Breadcrumb({ items, className }: { items: BreadcrumbItem[]; className?: string }) {
    const t = useDict().breadcrumb;
    return (
        <nav aria-label={t.ariaLabel} className={className}>
            <ol className="flex flex-wrap items-center gap-1.5 font-mono text-xs uppercase tracking-[0.08em] text-muted-foreground">
                {items.map((item, i) => (
                    <li key={`${item.label}-${i}`} className="flex items-center gap-1.5" aria-current={i === items.length - 1 ? "page" : undefined}>
                        {i > 0 && <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />}
                        {item.href ? (
                            <Link href={item.href} className="transition-colors hover:text-foreground">
                                {item.label}
                            </Link>
                        ) : (
                            <span className="text-foreground">{item.label}</span>
                        )}
                    </li>
                ))}
            </ol>
        </nav>
    );
}
