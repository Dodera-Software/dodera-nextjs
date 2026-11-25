"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Menu, Search } from "lucide-react";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { AdminNav } from "@/components/admin/shell/AdminNav";
import { AdminCommandMenu } from "@/components/admin/shell/AdminCommandMenu";
import { AdminUserMenu } from "@/components/admin/shell/AdminUserMenu";
import { AdminRoute } from "@/config/admin";
import { adminCommon } from "@/i18n/admin/common";
import { sessionQuery } from "@/lib/admin-queries";

function SearchButton({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center gap-2.5 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3.5 py-2 text-sm text-muted-foreground transition-colors hover:border-foreground/20 hover:text-foreground"
        >
            <Search className="size-4" />
            {adminCommon.shell.search}
            <kbd className="ml-auto font-mono text-[0.7rem] tracking-wider">{adminCommon.shell.searchShortcut}</kbd>
        </button>
    );
}

export function AdminShell({ children }: { children: ReactNode }) {
    const router = useRouter();
    const queryClient = useQueryClient();
    const [menuOpen, setMenuOpen] = useState(false);
    const [commandOpen, setCommandOpen] = useState(false);

    const session = useQuery(sessionQuery);

    useEffect(() => {
        if (session.isError) router.replace(AdminRoute.Login);
    }, [session.isError, router]);

    const signOut = useCallback(async () => {
        await fetch("/api/admin/logout", { method: "POST" });
        queryClient.clear();
        router.replace(AdminRoute.Login);
    }, [queryClient, router]);

    if (!session.data) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="size-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    const sidebar = (
        <div className="flex h-full flex-col">
            <div className="flex h-20 items-center px-6">
                <Logo href={AdminRoute.Dashboard} label={adminCommon.nav[AdminRoute.Dashboard]} />
            </div>
            <div className="px-4 pb-4">
                <SearchButton onClick={() => setCommandOpen(true)} />
            </div>
            <div className="flex-1 overflow-y-auto px-6 pb-6">
                <AdminNav onNavigate={() => setMenuOpen(false)} />
            </div>
            <div className="border-t border-foreground/10 p-3">
                <AdminUserMenu session={session.data} onSignOut={signOut} />
            </div>
        </div>
    );

    return (
        <div className="relative min-h-screen">
            <div
                aria-hidden
                className="pointer-events-none fixed inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_100%_at_70%_0%,hsl(var(--brand)/0.14),transparent_70%)]"
            />
            <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-foreground/10 bg-background/80 lg:block">
                {sidebar}
            </aside>

            <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-foreground/10 bg-background/80 px-[var(--gutter)] backdrop-blur-md lg:hidden">
                <Logo href={AdminRoute.Dashboard} label={adminCommon.nav[AdminRoute.Dashboard]} className="[&_img]:h-7" />
                <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label={adminCommon.shell.search} onClick={() => setCommandOpen(true)}>
                        <Search />
                    </Button>
                    <Button variant="ghost" size="icon" className="rounded-full" aria-label={adminCommon.shell.openMenu} onClick={() => setMenuOpen(true)}>
                        <Menu />
                    </Button>
                </div>
            </header>

            <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
                <SheetContent side="left" closeLabel={adminCommon.shell.closeMenu} className="p-0">
                    <SheetTitle className="sr-only">{adminCommon.brand}</SheetTitle>
                    {sidebar}
                </SheetContent>
            </Sheet>

            <AdminCommandMenu open={commandOpen} onOpenChange={setCommandOpen} onSignOut={signOut} />

            <main className="relative lg:pl-64">
                <div className="mx-auto w-full max-w-[1320px] px-[var(--gutter)] pb-24 pt-10 lg:pt-14">{children}</div>
            </main>
        </div>
    );
}
