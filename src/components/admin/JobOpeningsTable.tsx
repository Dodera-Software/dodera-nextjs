"use client";

import { Briefcase, ChevronDown, Pencil, Trash2 } from "lucide-react";
import { DataTable, columnHelper, stopRowClick } from "@/components/admin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { JOB_STATUSES, JobStatus } from "@/config/careers";
import { StatusTone } from "@/config/ui";
import { adminCommon } from "@/i18n/admin/common";
import { careersCopy as copy } from "@/i18n/admin/careers";
import { formatDateShort } from "@/lib/format";
import type { JobOpening } from "@/types/admin";

const JOB_STATUS_TONE: Record<JobStatus, StatusTone> = {
    [JobStatus.Open]: StatusTone.Success,
    [JobStatus.Closed]: StatusTone.Danger,
    [JobStatus.Draft]: StatusTone.Warning,
};

const col = columnHelper<JobOpening>();

export interface JobOpeningsTableProps {
    openings: JobOpening[];
    loading: boolean;
    error: unknown;
    onRetry: () => void;
    busyId: number | null;
    onStatusChange: (job: JobOpening, status: JobStatus) => void;
    onEdit: (job: JobOpening) => void;
    onDelete: (job: JobOpening) => void;
}

export function JobOpeningsTable({ openings, loading, error, onRetry, busyId, onStatusChange, onEdit, onDelete }: JobOpeningsTableProps) {
    const columns = col.columns([
        col.accessor("title", {
            header: copy.columns.title,
            cell: (c) => (
                <div className="min-w-0">
                    <p className="font-medium">{c.getValue()}</p>
                    {c.row.original.department && <p className="text-xs text-muted-foreground">{c.row.original.department}</p>}
                </div>
            ),
        }),
        col.accessor("type", {
            header: copy.columns.type,
            cell: (c) => <span className="text-muted-foreground">{c.getValue()}</span>,
            meta: { className: "hidden md:table-cell" },
        }),
        col.accessor("location", {
            header: copy.columns.location,
            cell: (c) => <span className="text-muted-foreground">{c.getValue()}</span>,
            meta: { className: "hidden sm:table-cell" },
        }),
        col.accessor("status", {
            header: copy.columns.status,
            cell: (c) => {
                const job = c.row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild disabled={busyId === job.id}>
                            <button type="button" aria-label={copy.changeStatus} className="rounded-full disabled:opacity-50">
                                <Badge tone={JOB_STATUS_TONE[job.status]} dot>
                                    {copy.status[job.status]}
                                    <ChevronDown />
                                </Badge>
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>{copy.changeStatus}</DropdownMenuLabel>
                            <DropdownMenuRadioGroup
                                value={job.status}
                                onValueChange={(value) => {
                                    const next = JOB_STATUSES.find((status) => status === value);
                                    if (next && next !== job.status) onStatusChange(job, next);
                                }}
                            >
                                {JOB_STATUSES.map((status) => (
                                    <DropdownMenuRadioItem key={status} value={status}>
                                        {copy.status[status]}
                                    </DropdownMenuRadioItem>
                                ))}
                            </DropdownMenuRadioGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
        col.accessor("created_at", {
            header: copy.columns.created,
            cell: (c) => <span className="whitespace-nowrap text-muted-foreground tabular-nums">{formatDateShort(c.getValue())}</span>,
            meta: { className: "hidden lg:table-cell" },
        }),
        col.display({
            id: "actions",
            header: () => <span className="sr-only">{adminCommon.table.actions}</span>,
            meta: { align: "right" },
            cell: (c) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full text-muted-foreground"
                        aria-label={adminCommon.actions.edit}
                        onClick={(e) => {
                            stopRowClick(e);
                            onEdit(c.row.original);
                        }}
                    >
                        <Pencil />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
                        aria-label={adminCommon.actions.delete}
                        disabled={busyId === c.row.original.id}
                        onClick={(e) => {
                            stopRowClick(e);
                            onDelete(c.row.original);
                        }}
                    >
                        <Trash2 />
                    </Button>
                </div>
            ),
        }),
    ]);

    return (
        <DataTable
            columns={columns}
            data={openings}
            getRowId={(job) => String(job.id)}
            loading={loading}
            error={error}
            onRetry={onRetry}
            empty={{ icon: Briefcase, ...copy.empty }}
        />
    );
}
