"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, Copy, ExternalLink, Loader2, MonitorSmartphone, Pencil, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { copyMockupLink, MockupLink, MockupLiveBadge } from "@/components/admin/mockups/MockupLink";
import { MockupPreview } from "@/components/admin/mockups/MockupPreview";
import { MockupProjectDialog } from "@/components/admin/mockups/MockupProjectDialog";
import { MockupUploader } from "@/components/admin/mockups/MockupUploader";
import { MockupVersions } from "@/components/admin/mockups/MockupVersions";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminQueryKey, AdminRoute } from "@/config/admin";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { useConfirm } from "@/hooks/use-confirm";
import { adminCommon } from "@/i18n/admin/common";
import { mockupsCopy as copy } from "@/i18n/admin/mockups";
import { AdminApiError, adminFetch, errorMessage } from "@/lib/admin-api";
import { mockupQuery, useIntelilangConnected } from "@/lib/mockups-client";

const NOT_FOUND = 404;

export default function MockupProjectPage() {
    const params = useParams<{ id: string }>();
    const router = useRouter();
    const confirm = useConfirm();
    const queryClient = useQueryClient();
    const intelilangConnected = useIntelilangConnected();
    const projectId = Number(params.id);
    const validId = Number.isInteger(projectId) && projectId > 0;
    const [editing, setEditing] = useState(false);

    const query = useQuery({
        ...mockupQuery(projectId),
        enabled: validId,
        retry: (count, error) => !(error instanceof AdminApiError && error.status === NOT_FOUND) && count < 1,
    });
    const project = query.data;

    const remove = useAdminMutation({
        mutationFn: () => adminFetch<{ message?: string }>(`/api/admin/mockups/${projectId}`, { method: "DELETE" }),
        success: (r) => r.message ?? copy.detail.deleted,
        onSuccess: () => {
            router.replace(AdminRoute.Mockups);
            queryClient.invalidateQueries({ queryKey: [AdminQueryKey.Mockups], exact: true });
            queryClient.invalidateQueries({ queryKey: [AdminQueryKey.Leads] });
        },
    });

    const back = { href: AdminRoute.Mockups, label: copy.detail.back };
    const notFound = !validId || (query.error instanceof AdminApiError && query.error.status === NOT_FOUND);

    if (notFound || query.isError) {
        return (
            <AdminPage back={back} title={notFound ? copy.detail.notFound : adminCommon.errors.loadFailed}>
                <AdminPanel>
                    <EmptyState
                        icon={notFound ? MonitorSmartphone : AlertTriangle}
                        title={notFound ? copy.detail.notFound : errorMessage(query.error)}
                        action={
                            !notFound && (
                                <Button variant="glass" size="sm" className="rounded-full" onClick={() => query.refetch()}>
                                    {adminCommon.actions.retry}
                                </Button>
                            )
                        }
                    />
                </AdminPanel>
            </AdminPage>
        );
    }

    if (!project) {
        return (
            <AdminPage back={back} title={<Skeleton className="h-10 w-64" />}>
                <div className="grid gap-6 xl:grid-cols-5">
                    <Skeleton className="h-80 rounded-3xl xl:col-span-2" />
                    <Skeleton className="h-80 rounded-3xl xl:col-span-3" />
                </div>
            </AdminPage>
        );
    }

    async function onDelete() {
        if (!project) return;
        const ok = await confirm({
            title: copy.detail.deleteTitle(project.name),
            description: copy.detail.deleteDescription(project.url),
            confirmLabel: copy.detail.deleteProject,
        });
        if (ok) remove.mutate();
    }

    const live = project.active_deployment;
    const deleting = remove.isPending || remove.isSuccess;

    return (
        <AdminPage
            back={back}
            title={project.name}
            description={project.client_name ? copy.detail.forClient(project.client_name) : copy.detail.noClient}
            actions={
                <>
                    <Button variant="glass" size="sm" className="rounded-full" onClick={() => setEditing(true)}>
                        <Pencil />
                        {adminCommon.actions.edit}
                    </Button>
                    <Button
                        variant="glass"
                        size="sm"
                        className="rounded-full text-red-400 hover:text-red-400"
                        onClick={onDelete}
                        disabled={deleting}
                    >
                        {deleting ? <Loader2 className="animate-spin" /> : <Trash2 />}
                        {adminCommon.actions.delete}
                    </Button>
                </>
            }
        >
            <div className="space-y-6">
                <AdminPanel>
                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                        {project.url ? (
                            <MockupLink url={project.url} fallback={project.slug} className="min-w-0 flex-1" />
                        ) : (
                            <Alert tone={StatusTone.Warning} icon={AlertTriangle} className="flex-1">
                                {copy.link.domainMissing}
                            </Alert>
                        )}
                        <div className="flex flex-wrap items-center gap-2">
                            <MockupLiveBadge live={live} />
                            <Button
                                variant="glass"
                                size="sm"
                                className="rounded-full"
                                disabled={!project.url}
                                onClick={() => project.url && copyMockupLink(project.url)}
                            >
                                <Copy />
                                {copy.link.copy}
                            </Button>
                            {project.url && (
                                <Button size="sm" className="rounded-full" asChild>
                                    <a href={project.url} target="_blank" rel="noopener noreferrer">
                                        <ExternalLink />
                                        {adminCommon.actions.open}
                                    </a>
                                </Button>
                            )}
                        </div>
                    </div>
                </AdminPanel>

                <div className="grid gap-6 xl:grid-cols-5">
                    <div className="min-w-0 space-y-6 xl:col-span-2">
                        <MockupUploader projectId={project.id} intelilangConnected={intelilangConnected} />
                        <MockupVersions project={project} intelilangConnected={intelilangConnected} />
                        {project.notes && (
                            <AdminPanel title={copy.detail.notes}>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{project.notes}</p>
                            </AdminPanel>
                        )}
                    </div>
                    <div className="min-w-0 xl:col-span-3">
                        <MockupPreview
                            url={project.url && live ? project.url : null}
                            versionKey={live?.id ?? "none"}
                            emptyReason={!project.url ? copy.preview.noDomain : copy.preview.notDeployed}
                        />
                    </div>
                </div>
            </div>

            <MockupProjectDialog open={editing} onOpenChange={setEditing} project={project} />
        </AdminPage>
    );
}
