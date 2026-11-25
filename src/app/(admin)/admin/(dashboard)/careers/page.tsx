"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Download, Inbox, Plus, RefreshCw } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, columnHelper, stopRowClick } from "@/components/admin/DataTable";
import { JobOpeningSheet } from "@/components/admin/JobOpeningSheet";
import { JobOpeningsTable } from "@/components/admin/JobOpeningsTable";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_PAGE_SIZE, AdminQueryKey } from "@/config/admin";
import { JobStatus } from "@/config/careers";
import { useAdminMutation } from "@/hooks/use-admin";
import { useConfirm } from "@/hooks/use-confirm";
import { adminCommon } from "@/i18n/admin/common";
import { careersCopy as copy } from "@/i18n/admin/careers";
import { adminFetch, type Paginated } from "@/lib/admin-api";
import { formatDateShort } from "@/lib/format";
import type { JobApplication, JobOpening } from "@/types/admin";

enum CareersTab {
    Openings = "openings",
    Applications = "applications",
}

const col = columnHelper<JobApplication>();

const applicationColumns = col.columns([
    col.accessor("full_name", { header: copy.applications.columns.name, cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
    col.accessor("email", {
        header: copy.applications.columns.email,
        cell: (c) => (
            <a href={`mailto:${c.getValue()}`} className="break-all text-muted-foreground transition-colors hover:text-foreground">
                {c.getValue()}
            </a>
        ),
    }),
    col.accessor("job_title", {
        header: copy.applications.columns.position,
        cell: (c) => <span className="text-muted-foreground">{c.getValue()}</span>,
        meta: { className: "hidden md:table-cell" },
    }),
    col.accessor("created_at", {
        header: copy.applications.columns.received,
        cell: (c) => <span className="whitespace-nowrap text-muted-foreground tabular-nums">{formatDateShort(c.getValue())}</span>,
        meta: { className: "hidden sm:table-cell" },
    }),
    col.display({
        id: "cv",
        header: () => <span className="sr-only">{copy.applications.cv}</span>,
        meta: { align: "right" },
        cell: (c) => (
            <Button asChild variant="ghost" size="icon" className="size-8 rounded-full text-muted-foreground">
                <a
                    href={`/api/admin/careers/applications/${c.row.original.id}/cv`}
                    download
                    aria-label={copy.applications.cv}
                    title={copy.applications.cv}
                    onClick={stopRowClick}
                >
                    <Download />
                </a>
            </Button>
        ),
    }),
]);

export default function CareersAdminPage() {
    const confirm = useConfirm();
    const [tab, setTab] = useState(CareersTab.Openings);
    const [sheetOpen, setSheetOpen] = useState(false);
    const [editing, setEditing] = useState<JobOpening | null>(null);
    const [page, setPage] = useState(1);

    const openings = useQuery({
        queryKey: [AdminQueryKey.Careers],
        queryFn: () => adminFetch<{ data: JobOpening[] }>("/api/admin/careers").then((r) => r.data),
    });

    const applications = useQuery({
        queryKey: [AdminQueryKey.Applications, page],
        queryFn: () =>
            adminFetch<Paginated<JobApplication>>("/api/admin/careers/applications", {
                query: { page, limit: ADMIN_PAGE_SIZE },
            }),
        placeholderData: keepPreviousData,
    });

    const setStatus = useAdminMutation({
        mutationFn: ({ job, status }: { job: JobOpening; status: JobStatus }) =>
            adminFetch("/api/admin/careers", { method: "PATCH", json: { id: job.id, status } }),
        invalidates: [AdminQueryKey.Careers],
        success: (_, { status }) => copy.statusChanged(copy.status[status]),
    });

    const remove = useAdminMutation({
        mutationFn: (job: JobOpening) => adminFetch("/api/admin/careers", { method: "DELETE", json: { id: job.id } }),
        invalidates: [AdminQueryKey.Careers],
        success: copy.remove.done,
        onSuccess: (_, job) => {
            if (editing?.id === job.id) setSheetOpen(false);
        },
    });

    function openSheet(job: JobOpening | null) {
        setEditing(job);
        setSheetOpen(true);
    }

    async function onDelete(job: JobOpening) {
        const ok = await confirm({
            title: copy.remove.title,
            description: copy.remove.description(job.title),
            confirmLabel: adminCommon.actions.delete,
        });
        if (ok) remove.mutate(job);
    }

    const busyId = setStatus.isPending ? setStatus.variables.job.id : remove.isPending ? remove.variables.id : null;
    const openCount = openings.data?.filter((job) => job.status === JobStatus.Open).length ?? 0;
    const applicationsTotal = applications.data?.pagination.total ?? 0;
    const fetching = openings.isFetching || applications.isFetching;

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={openings.data && applications.data ? copy.description(openCount, applicationsTotal) : undefined}
            actions={
                <>
                    <Button
                        variant="glass"
                        size="sm"
                        className="rounded-full"
                        onClick={() => {
                            openings.refetch();
                            applications.refetch();
                        }}
                        disabled={fetching}
                    >
                        <RefreshCw className={fetching ? "animate-spin" : undefined} />
                        {adminCommon.actions.refresh}
                    </Button>
                    <Button size="sm" className="rounded-full" onClick={() => openSheet(null)}>
                        <Plus />
                        {copy.add}
                    </Button>
                </>
            }
        >
            <Tabs value={tab} onValueChange={(value) => setTab(value === CareersTab.Applications ? CareersTab.Applications : CareersTab.Openings)} className="space-y-4">
                <TabsList>
                    <TabsTrigger value={CareersTab.Openings}>{copy.tabs.openings}</TabsTrigger>
                    <TabsTrigger value={CareersTab.Applications}>{copy.tabs.applications}</TabsTrigger>
                </TabsList>
                <TabsContent value={CareersTab.Openings}>
                    <JobOpeningsTable
                        openings={openings.data ?? []}
                        loading={openings.isPending}
                        error={openings.error}
                        onRetry={() => openings.refetch()}
                        busyId={busyId}
                        onStatusChange={(job, status) => setStatus.mutate({ job, status })}
                        onEdit={openSheet}
                        onDelete={onDelete}
                    />
                </TabsContent>
                <TabsContent value={CareersTab.Applications}>
                    <DataTable
                        columns={applicationColumns}
                        data={applications.data?.data ?? []}
                        getRowId={(a) => String(a.id)}
                        loading={applications.isPending}
                        error={applications.error}
                        onRetry={() => applications.refetch()}
                        server={{ page, total: applicationsTotal, limit: ADMIN_PAGE_SIZE, onPageChange: setPage }}
                        empty={{ icon: Inbox, ...copy.applications.empty }}
                    />
                </TabsContent>
            </Tabs>
            <JobOpeningSheet open={sheetOpen} job={editing} onClose={() => setSheetOpen(false)} />
        </AdminPage>
    );
}
