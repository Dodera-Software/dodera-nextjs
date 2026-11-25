"use client";

import { useState } from "react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ArrowRight, MonitorSmartphone, Plus, RefreshCw } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { MockupLink, MockupLiveBadge } from "@/components/admin/mockups/MockupLink";
import { MockupProjectDialog } from "@/components/admin/mockups/MockupProjectDialog";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminRoute } from "@/config/admin";
import { StatusTone } from "@/config/ui";
import { adminCommon } from "@/i18n/admin/common";
import { mockupsCopy as copy } from "@/i18n/admin/mockups";
import { errorMessage } from "@/lib/admin-api";
import { formatTimeAgo } from "@/lib/format";
import { mockupsQuery } from "@/lib/mockups-client";
import type { MockupProject } from "@/types/admin";

const SKELETON_CARDS = 3;

function MockupCard({ project }: { project: MockupProject }) {
    const live = project.active_deployment;
    const href = `${AdminRoute.Mockups}/${project.id}`;
    return (
        <AdminPanel
            className="flex flex-col transition-colors hover:border-foreground/20 [&>div]:flex-1"
            title={
                <Link href={href} className="block truncate transition-colors hover:text-brand-bright">
                    {project.name}
                </Link>
            }
            description={<span className="block truncate">{project.client_name || copy.card.noClient}</span>}
            actions={<MockupLiveBadge live={live} />}
            footer={
                <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                    <span className="min-w-0 truncate">
                        {live ? copy.card.deployedAgo(formatTimeAgo(live.created_at)) : copy.card.createdAgo(formatTimeAgo(project.created_at))}
                        {project.deployments_count > 0 && ` · ${copy.card.versions(project.deployments_count)}`}
                    </span>
                    <Link href={href} className="inline-flex shrink-0 items-center gap-1 font-semibold text-foreground hover:text-brand-bright">
                        {copy.card.open}
                        <ArrowRight className="size-3.5" />
                    </Link>
                </div>
            }
        >
            <MockupLink url={project.url} fallback={copy.card.domainNotSet(project.slug)} />
        </AdminPanel>
    );
}

export default function MockupsPage() {
    const [creating, setCreating] = useState(false);
    const mockups = useQuery(mockupsQuery);
    const projects = mockups.data?.data ?? [];
    const domain = mockups.data?.domain ?? null;

    const newButton = (
        <Button size="sm" className="rounded-full" onClick={() => setCreating(true)}>
            <Plus />
            {copy.newProject}
        </Button>
    );

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={mockups.data ? copy.description(projects.length) : undefined}
            actions={
                <>
                    <Button variant="glass" size="sm" className="rounded-full" onClick={() => mockups.refetch()} disabled={mockups.isFetching}>
                        <RefreshCw className={mockups.isFetching ? "animate-spin" : undefined} />
                        {adminCommon.actions.refresh}
                    </Button>
                    {newButton}
                </>
            }
        >
            <div className="space-y-6">
                {mockups.data && !domain && (
                    <Alert tone={StatusTone.Warning} icon={AlertTriangle}>
                        <span className="font-medium">{copy.domainMissing.title}</span> {copy.domainMissing.body}
                    </Alert>
                )}

                {mockups.isPending ? (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {Array.from({ length: SKELETON_CARDS }, (_, i) => (
                            <Skeleton key={i} className="h-52 rounded-3xl" />
                        ))}
                    </div>
                ) : mockups.isError ? (
                    <AdminPanel>
                        <EmptyState
                            icon={AlertTriangle}
                            title={adminCommon.errors.loadFailed}
                            description={errorMessage(mockups.error)}
                            action={
                                <Button variant="glass" size="sm" className="rounded-full" onClick={() => mockups.refetch()}>
                                    {adminCommon.actions.retry}
                                </Button>
                            }
                        />
                    </AdminPanel>
                ) : projects.length === 0 ? (
                    <AdminPanel className="border-dashed">
                        <EmptyState
                            icon={MonitorSmartphone}
                            title={copy.empty.title}
                            description={copy.empty.description(domain)}
                            action={newButton}
                        />
                    </AdminPanel>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                        {projects.map((p) => (
                            <MockupCard key={p.id} project={p} />
                        ))}
                    </div>
                )}
            </div>

            <MockupProjectDialog open={creating} onOpenChange={setCreating} domain={domain} />
        </AdminPage>
    );
}
