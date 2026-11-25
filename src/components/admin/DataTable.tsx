"use client";

import { Fragment, useState, type ReactNode } from "react";
import {
    createColumnHelper,
    createExpandedRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    rowExpandingFeature,
    rowPaginationFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_basic,
    sortFn_datetime,
    sortFn_text,
    tableFeatures,
    useTable,
    type CellData,
    type ColumnHelper,
    type ExpandedState,
    type PaginationState,
    type RowData,
    type SortingState,
    type TableFeatures,
} from "@tanstack/react-table";
import { AlertTriangle, ArrowDown, ArrowUp, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { EmptyState, type EmptyStateProps } from "@/components/admin/EmptyState";
import { ADMIN_PAGE_SIZE } from "@/config/admin";
import { adminCommon } from "@/i18n/admin/common";
import { errorMessage } from "@/lib/admin-api";
import { cn } from "@/lib/utils";

declare module "@tanstack/table-core" {
    interface ColumnMeta<in out TFeatures extends TableFeatures, in out TData extends RowData, TValue extends CellData = CellData> {
        className?: string;
        align?: "left" | "right";
    }
}

export const dataTableFeatures = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: { alphanumeric: sortFn_alphanumeric, text: sortFn_text, datetime: sortFn_datetime, basic: sortFn_basic },
    rowExpandingFeature,
    expandedRowModel: createExpandedRowModel(),
    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),
});

export type DataTableFeatures = typeof dataTableFeatures;

export type DataTableColumns<TData extends RowData> = ReturnType<ColumnHelper<DataTableFeatures, TData>["columns"]>;

export function columnHelper<TData extends RowData>() {
    return createColumnHelper<DataTableFeatures, TData>();
}

export interface ServerPagination {
    page: number;
    total: number;
    limit: number;
    onPageChange: (page: number) => void;
}

export interface DataTableProps<TData extends RowData> {
    columns: DataTableColumns<TData>;
    data: TData[];
    getRowId: (row: TData) => string;
    loading?: boolean;
    error?: unknown;
    onRetry?: () => void;
    empty: EmptyStateProps;
    server?: ServerPagination;
    pageSize?: number;
    initialSorting?: SortingState;
    renderDetail?: (row: TData) => ReactNode;
    onRowClick?: (row: TData) => void;
    className?: string;
}

export function DataTable<TData extends RowData>({
    columns,
    data,
    getRowId,
    loading,
    error,
    onRetry,
    empty,
    server,
    pageSize = ADMIN_PAGE_SIZE,
    initialSorting = [],
    renderDetail,
    onRowClick,
    className,
}: DataTableProps<TData>) {
    const [sorting, setSorting] = useState<SortingState>(initialSorting);
    const [expanded, setExpanded] = useState<ExpandedState>({});
    const [clientPagination, setClientPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });

    const pagination: PaginationState = server
        ? { pageIndex: server.page - 1, pageSize: server.limit }
        : clientPagination;

    const table = useTable({
        features: dataTableFeatures,
        columns,
        data,
        getRowId: (row) => getRowId(row),
        getRowCanExpand: () => !!renderDetail,
        enableSorting: !server,
        enableSortingRemoval: true,
        manualPagination: !!server,
        rowCount: server?.total,
        autoResetPageIndex: false,
        state: { sorting, expanded, pagination },
        onSortingChange: setSorting,
        onExpandedChange: setExpanded,
        onPaginationChange: (updater) => {
            const next = typeof updater === "function" ? updater(pagination) : updater;
            if (server) server.onPageChange(next.pageIndex + 1);
            else setClientPagination(next);
        },
    });

    const rows = table.getRowModel().rows;
    const visibleColumns = table.getAllLeafColumns().length + (renderDetail ? 1 : 0);
    const total = server ? server.total : data.length;
    const start = total === 0 ? 0 : pagination.pageIndex * pagination.pageSize + 1;
    const end = Math.min((pagination.pageIndex + 1) * pagination.pageSize, total);
    const pageCount = Math.max(1, Math.ceil(total / pagination.pageSize));

    return (
        <div className={cn("overflow-hidden rounded-3xl border border-foreground/10 bg-card/60", className)}>
            <Table>
                <TableHeader>
                    {table.getHeaderGroups().map((group) => (
                        <TableRow key={group.id} className="hover:bg-transparent">
                            {group.headers.map((header) => {
                                const meta = header.column.columnDef.meta;
                                const sorted = header.column.getIsSorted();
                                return (
                                    <TableHead
                                        key={header.id}
                                        className={cn(meta?.align === "right" && "text-right", meta?.className)}
                                        aria-sort={sorted === "asc" ? "ascending" : sorted === "desc" ? "descending" : undefined}
                                    >
                                        {header.isPlaceholder ? null : header.column.getCanSort() ? (
                                            <button
                                                type="button"
                                                onClick={header.column.getToggleSortingHandler()}
                                                className="inline-flex items-center gap-1.5 uppercase hover:text-foreground"
                                            >
                                                <table.FlexRender header={header} />
                                                {sorted === "asc" && <ArrowUp className="size-3" aria-label={adminCommon.table.sortAscending} />}
                                                {sorted === "desc" && <ArrowDown className="size-3" aria-label={adminCommon.table.sortDescending} />}
                                            </button>
                                        ) : (
                                            <table.FlexRender header={header} />
                                        )}
                                    </TableHead>
                                );
                            })}
                            {renderDetail && <TableHead className="w-12" />}
                        </TableRow>
                    ))}
                </TableHeader>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }, (_, i) => (
                            <TableRow key={i} className="hover:bg-transparent">
                                <TableCell colSpan={visibleColumns}>
                                    <Skeleton className="h-5 w-full" />
                                </TableCell>
                            </TableRow>
                        ))
                    ) : error ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={visibleColumns}>
                                <EmptyState
                                    icon={AlertTriangle}
                                    title={adminCommon.errors.loadFailed}
                                    description={errorMessage(error)}
                                    action={
                                        onRetry && (
                                            <Button variant="glass" size="sm" className="rounded-full" onClick={onRetry}>
                                                {adminCommon.actions.retry}
                                            </Button>
                                        )
                                    }
                                />
                            </TableCell>
                        </TableRow>
                    ) : rows.length === 0 ? (
                        <TableRow className="hover:bg-transparent">
                            <TableCell colSpan={visibleColumns}>
                                <EmptyState {...empty} />
                            </TableCell>
                        </TableRow>
                    ) : (
                        rows.map((row) => {
                            const open = row.getIsExpanded();
                            const clickable = !!onRowClick || !!renderDetail;
                            return (
                                <Fragment key={row.id}>
                                    <TableRow
                                        data-state={open ? "open" : undefined}
                                        className={cn(clickable && "cursor-pointer", open && "border-b-0")}
                                        onClick={() => (onRowClick ? onRowClick(row.original) : renderDetail && row.toggleExpanded())}
                                    >
                                        {row.getAllCells().map((cell) => {
                                            const meta = cell.column.columnDef.meta;
                                            return (
                                                <TableCell
                                                    key={cell.id}
                                                    className={cn(meta?.align === "right" && "text-right", meta?.className)}
                                                >
                                                    <table.FlexRender cell={cell} />
                                                </TableCell>
                                            );
                                        })}
                                        {renderDetail && (
                                            <TableCell className="w-12 text-right">
                                                <ChevronDown
                                                    aria-label={open ? adminCommon.actions.collapse : adminCommon.actions.expand}
                                                    className={cn("ml-auto size-4 text-muted-foreground transition-transform", open && "rotate-180")}
                                                />
                                            </TableCell>
                                        )}
                                    </TableRow>
                                    {open && renderDetail && (
                                        <TableRow className="bg-foreground/[0.025] hover:bg-foreground/[0.025]">
                                            <TableCell colSpan={visibleColumns} className="px-6 pb-6 pt-1">
                                                {renderDetail(row.original)}
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </Fragment>
                            );
                        })
                    )}
                </TableBody>
            </Table>
            {total > pagination.pageSize && (
                <div className="flex items-center justify-between gap-4 border-t border-foreground/[0.07] px-4 py-3 text-sm text-muted-foreground">
                    <span className="font-mono text-xs tabular-nums">{adminCommon.table.showing(start, end, total)}</span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            aria-label={adminCommon.table.previous}
                            disabled={pagination.pageIndex === 0}
                            onClick={() => table.previousPage()}
                        >
                            <ChevronLeft />
                        </Button>
                        <span className="min-w-12 text-center font-mono text-xs tabular-nums">
                            {pagination.pageIndex + 1} / {pageCount}
                        </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 rounded-full"
                            aria-label={adminCommon.table.next}
                            disabled={pagination.pageIndex + 1 >= pageCount}
                            onClick={() => table.nextPage()}
                        >
                            <ChevronRight />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

export function stopRowClick(event: { stopPropagation: () => void }) {
    event.stopPropagation();
}
