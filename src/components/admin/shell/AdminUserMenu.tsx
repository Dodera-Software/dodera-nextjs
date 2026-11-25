"use client";

import { ChevronsUpDown, ExternalLink, LogOut } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { adminCommon } from "@/i18n/admin/common";
import type { AdminSession } from "@/types/admin";

export function AdminUserMenu({ session, onSignOut }: { session: AdminSession; onSignOut: () => void }) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex w-full items-center gap-3 rounded-xl px-2 py-2 text-left transition-colors hover:bg-foreground/[0.04] data-[state=open]:bg-foreground/[0.06]">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-bright to-brand-deep font-display text-sm font-semibold text-white">
                    {session.name.charAt(0).toUpperCase()}
                </span>
                <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{session.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{session.email}</span>
                </span>
                <ChevronsUpDown className="size-4 shrink-0 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent side="top" align="start" className="w-[--radix-dropdown-menu-trigger-width]">
                <DropdownMenuLabel>{adminCommon.shell.account}</DropdownMenuLabel>
                <DropdownMenuItem asChild>
                    <a href="/" target="_blank" rel="noopener noreferrer">
                        <ExternalLink />
                        {adminCommon.shell.viewSite}
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem destructive onSelect={onSignOut}>
                    <LogOut />
                    {adminCommon.shell.signOut}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
