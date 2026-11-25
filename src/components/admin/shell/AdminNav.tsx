"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ADMIN_NAV, ADMIN_NAV_GROUPS, activeAdminRoute } from "@/config/admin";
import { adminCommon } from "@/i18n/admin/common";
import { cn } from "@/lib/utils";

export function AdminNav({ onNavigate }: { onNavigate?: () => void }) {
    const active = activeAdminRoute(usePathname());
    return (
        <nav className="space-y-6">
            {ADMIN_NAV_GROUPS.map((group) => (
                <div key={group} className="space-y-1">
                    <p className="px-3 pb-1 font-mono text-[0.65rem] uppercase tracking-[0.1em] text-muted-foreground/70">
                        {adminCommon.navGroups[group]}
                    </p>
                    {ADMIN_NAV.filter((entry) => entry.group === group).map(({ route, icon: Icon }) => {
                        const isActive = route === active;
                        return (
                            <Link
                                key={route}
                                href={route}
                                onClick={onNavigate}
                                aria-current={isActive ? "page" : undefined}
                                className={cn(
                                    "group relative flex items-center gap-3 rounded-xl px-3 py-2 text-sm transition-colors",
                                    isActive
                                        ? "bg-foreground/[0.07] text-foreground"
                                        : "text-muted-foreground hover:bg-foreground/[0.04] hover:text-foreground",
                                )}
                            >
                                <Icon className={cn("size-4 shrink-0", isActive && "text-brand-bright")} strokeWidth={1.75} />
                                {adminCommon.nav[route]}
                                {isActive && <span className="absolute -left-3 top-1/2 h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand" />}
                            </Link>
                        );
                    })}
                </div>
            ))}
        </nav>
    );
}
