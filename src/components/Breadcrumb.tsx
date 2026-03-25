"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface BreadcrumbItem {
    label: string;
    /** Omit for the current (last) page - renders as plain text. */
    href?: string;
}

interface BreadcrumbProps {
    /**
     * Explicit items. When omitted the component auto-derives them from the
     * current URL pathname: each path segment becomes a crumb whose label is
     * title-cased and hyphen-to-space converted.
     *
     * @example auto  /services/web-development → Home › Services › Web Development
     * @example manual pass `items` when you need custom labels (e.g. `heroLabel`
     *          from CMS data) or non-standard hrefs.
     */
    items?: BreadcrumbItem[];
    className?: string;
}

function segmentToLabel(segment: string): string {
    return segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
}

function useAutoItems(): BreadcrumbItem[] {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const crumbs: BreadcrumbItem[] = [{ label: "Home", href: "/" }];
    segments.forEach((seg, i) => {
        const isLast = i === segments.length - 1;
        crumbs.push({
            label: segmentToLabel(seg),
            href: isLast ? undefined : "/" + segments.slice(0, i + 1).join("/"),
        });
    });
    return crumbs;
}

export function Breadcrumb({ items, className }: BreadcrumbProps) {
    const autoItems = useAutoItems();
    const crumbs = items ?? autoItems;

    return (
        <nav
            aria-label="Breadcrumb"
            className={cn(
                "sticky top-16 z-40 border-b border-border/50 bg-background/80 backdrop-blur-xl",
                className,
            )}
        >
            <div className="mx-auto max-w-7xl px-6 py-4">
                <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
                    {crumbs.map((item, i) => (
                        <li
                            key={i}
                            className="flex items-center gap-1.5"
                            aria-current={i === crumbs.length - 1 ? "page" : undefined}
                        >
                            {i > 0 && (
                                <ChevronRight className="size-3.5 shrink-0" aria-hidden="true" />
                            )}
                            {item.href ? (
                                <Link
                                    href={item.href}
                                    className="transition-colors hover:text-foreground"
                                >
                                    {item.label}
                                </Link>
                            ) : (
                                <span className="font-medium text-foreground">
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </div>
        </nav>
    );
}
