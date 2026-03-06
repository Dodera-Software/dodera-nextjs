import type { ReactNode } from "react";

export interface AdminPageHeaderProps {
    title: string;
    subtitle?: string;
    /** Buttons / actions rendered in the top-right corner. */
    actions?: ReactNode;
}

/**
 * Standard page header used across admin dashboard pages.
 * Renders the h1 + optional subtitle + optional action tray.
 */
export function AdminPageHeader({ title, subtitle, actions }: AdminPageHeaderProps) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
                {subtitle && (
                    <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
                )}
            </div>
            {actions && <div className="flex gap-2">{actions}</div>}
        </div>
    );
}
