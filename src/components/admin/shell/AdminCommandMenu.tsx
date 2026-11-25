"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/components/ui/command";
import { ADMIN_NAV } from "@/config/admin";
import { adminCommon } from "@/i18n/admin/common";

export interface AdminCommandMenuProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSignOut: () => void;
}

export function AdminCommandMenu({ open, onOpenChange, onSignOut }: AdminCommandMenuProps) {
    const router = useRouter();

    useEffect(() => {
        function onKeyDown(event: KeyboardEvent) {
            if (event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey)) {
                event.preventDefault();
                onOpenChange(!open);
            }
        }
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [open, onOpenChange]);

    function run(action: () => void) {
        onOpenChange(false);
        action();
    }

    return (
        <CommandDialog open={open} onOpenChange={onOpenChange} title={adminCommon.shell.search}>
            <CommandInput placeholder={adminCommon.shell.commandPlaceholder} />
            <CommandList>
                <CommandEmpty>{adminCommon.shell.commandEmpty}</CommandEmpty>
                <CommandGroup heading={adminCommon.shell.commandPages}>
                    {ADMIN_NAV.map(({ route, icon: Icon, group }) => (
                        <CommandItem
                            key={route}
                            value={`${adminCommon.nav[route]} ${adminCommon.navGroups[group]}`}
                            onSelect={() => run(() => router.push(route))}
                        >
                            <Icon />
                            {adminCommon.nav[route]}
                            <span className="ml-auto font-mono text-[0.65rem] uppercase tracking-[0.08em] text-muted-foreground">
                                {adminCommon.navGroups[group]}
                            </span>
                        </CommandItem>
                    ))}
                </CommandGroup>
                <CommandGroup heading={adminCommon.shell.commandActions}>
                    <CommandItem onSelect={() => run(() => window.open("/", "_blank", "noopener"))}>
                        <ExternalLink />
                        {adminCommon.shell.viewSite}
                    </CommandItem>
                    <CommandItem onSelect={() => run(onSignOut)}>
                        <LogOut />
                        {adminCommon.shell.signOut}
                    </CommandItem>
                </CommandGroup>
            </CommandList>
        </CommandDialog>
    );
}
