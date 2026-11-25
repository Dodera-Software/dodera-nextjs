"use client";

import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, RefreshCw, Settings } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { IntelilangSettingsCard } from "@/components/admin/IntelilangSettingsCard";
import { ConfigRowForm } from "@/components/admin/settings/ConfigRowForm";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { HIDDEN_CONFIG_KEYS } from "@/config/admin-settings";
import { adminCommon } from "@/i18n/admin/common";
import { settingsCopy as copy } from "@/i18n/admin/settings";
import { errorMessage } from "@/lib/admin-api";
import { configQuery } from "@/lib/admin-queries";

const SKELETON_ROWS = 4;

export default function SettingsPage() {
    const config = useQuery({
        ...configQuery,
        select: (rows) => rows.filter((row) => !HIDDEN_CONFIG_KEYS.has(row.key)),
    });

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            actions={
                <Button variant="glass" size="sm" className="rounded-full" onClick={() => config.refetch()} disabled={config.isFetching}>
                    <RefreshCw className={config.isFetching ? "animate-spin" : undefined} />
                    {adminCommon.actions.refresh}
                </Button>
            }
        >
            <div className="space-y-6">
                <IntelilangSettingsCard />

                <AdminPanel title={copy.config.title} description={copy.config.description} flush>
                    {config.isPending ? (
                        <div className="space-y-3 p-6">
                            {Array.from({ length: SKELETON_ROWS }, (_, i) => (
                                <Skeleton key={i} className="h-14 rounded-2xl" />
                            ))}
                        </div>
                    ) : config.isError ? (
                        <EmptyState
                            icon={AlertTriangle}
                            title={adminCommon.errors.loadFailed}
                            description={errorMessage(config.error)}
                            action={
                                <Button variant="glass" size="sm" className="rounded-full" onClick={() => config.refetch()}>
                                    {adminCommon.actions.retry}
                                </Button>
                            }
                        />
                    ) : config.data.length === 0 ? (
                        <EmptyState icon={Settings} {...copy.config.empty} />
                    ) : (
                        <div className="divide-y divide-foreground/[0.07]">
                            {config.data.map((row) => (
                                <ConfigRowForm key={row.key} row={row} />
                            ))}
                        </div>
                    )}
                </AdminPanel>
            </div>
        </AdminPage>
    );
}
