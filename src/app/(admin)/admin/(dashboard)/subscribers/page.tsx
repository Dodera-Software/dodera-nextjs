"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { RefreshCw, Trash2, Users } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, columnHelper, stopRowClick } from "@/components/admin/DataTable";
import { SearchInput, Toolbar } from "@/components/admin/SearchInput";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useAdminMutation, useDebouncedValue } from "@/hooks/use-admin";
import { ADMIN_PAGE_SIZE, AdminQueryKey } from "@/config/admin";
import { adminCommon } from "@/i18n/admin/common";
import { subscribersCopy as copy } from "@/i18n/admin/subscribers";
import { adminFetch, type Paginated } from "@/lib/admin-api";
import { formatDateShort } from "@/lib/format";
import type { Subscriber } from "@/types/admin";

const col = columnHelper<Subscriber>();

export default function SubscribersPage() {
    const confirm = useConfirm();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const query = useDebouncedValue(search.trim());

    const subscribers = useQuery({
        queryKey: [AdminQueryKey.Subscribers, page, query],
        queryFn: () =>
            adminFetch<Paginated<Subscriber>>("/api/admin/subscribers", {
                query: { page, limit: ADMIN_PAGE_SIZE, search: query },
            }),
        placeholderData: keepPreviousData,
    });

    const remove = useAdminMutation({
        mutationFn: (id: number) => adminFetch("/api/admin/subscribers", { method: "DELETE", json: { id } }),
        invalidates: [AdminQueryKey.Subscribers],
        success: copy.remove.done,
    });

    async function onRemove(subscriber: Subscriber) {
        const ok = await confirm({
            title: copy.remove.title,
            description: copy.remove.description(subscriber.email),
            confirmLabel: adminCommon.actions.delete,
        });
        if (ok) remove.mutate(subscriber.id);
    }

    const columns = col.columns([
        col.accessor("email", { header: copy.columns.email, cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
        col.accessor("created_at", {
            header: copy.columns.subscribed,
            cell: (c) => <span className="text-muted-foreground">{formatDateShort(c.getValue())}</span>,
            meta: { className: "hidden sm:table-cell" },
        }),
        col.display({
            id: "actions",
            header: () => <span className="sr-only">{adminCommon.table.actions}</span>,
            meta: { align: "right" },
            cell: (c) => (
                <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 rounded-full text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
                    aria-label={adminCommon.actions.delete}
                    disabled={remove.isPending && remove.variables === c.row.original.id}
                    onClick={(e) => {
                        stopRowClick(e);
                        onRemove(c.row.original);
                    }}
                >
                    <Trash2 />
                </Button>
            ),
        }),
    ]);

    const total = subscribers.data?.pagination.total ?? 0;

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={subscribers.data ? copy.description(total) : undefined}
            actions={
                <Button variant="glass" size="sm" className="rounded-full" onClick={() => subscribers.refetch()} disabled={subscribers.isFetching}>
                    <RefreshCw className={subscribers.isFetching ? "animate-spin" : undefined} />
                    {adminCommon.actions.refresh}
                </Button>
            }
        >
            <div className="space-y-4">
                <Toolbar>
                    <SearchInput
                        value={search}
                        onChange={(value) => {
                            setSearch(value);
                            setPage(1);
                        }}
                        placeholder={copy.search}
                    />
                </Toolbar>
                <DataTable
                    columns={columns}
                    data={subscribers.data?.data ?? []}
                    getRowId={(s) => String(s.id)}
                    loading={subscribers.isPending}
                    error={subscribers.error}
                    onRetry={() => subscribers.refetch()}
                    server={{ page, total, limit: ADMIN_PAGE_SIZE, onPageChange: setPage }}
                    empty={query ? { icon: Users, title: adminCommon.table.noMatches } : { icon: Users, ...copy.empty }}
                />
            </div>
        </AdminPage>
    );
}
