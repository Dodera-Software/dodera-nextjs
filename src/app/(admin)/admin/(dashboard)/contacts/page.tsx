"use client";

import { useState } from "react";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Download, MessageSquare, RefreshCw, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, columnHelper, stopRowClick } from "@/components/admin/DataTable";
import { SearchInput, Toolbar } from "@/components/admin/SearchInput";
import { Button } from "@/components/ui/button";
import { useConfirm } from "@/hooks/use-confirm";
import { useAdminMutation, useDebouncedValue } from "@/hooks/use-admin";
import { ADMIN_PAGE_SIZE, AdminQueryKey } from "@/config/admin";
import { adminCommon } from "@/i18n/admin/common";
import { contactsCopy as copy } from "@/i18n/admin/contacts";
import { adminFetch, downloadCsv, type Paginated } from "@/lib/admin-api";
import { formatDateISO, formatDateShort } from "@/lib/format";
import type { Contact } from "@/types/admin";

const col = columnHelper<Contact>();

const EXPORT_PAGE_SIZE = 200;

async function fetchAllContacts(search: string): Promise<Contact[]> {
    const all: Contact[] = [];
    for (let page = 1; ; page++) {
        const res = await adminFetch<Paginated<Contact>>("/api/admin/contacts", {
            query: { page, limit: EXPORT_PAGE_SIZE, search },
        });
        all.push(...res.data);
        if (page >= res.pagination.totalPages) return all;
    }
}

function Muted({ value }: { value: string | null }) {
    return <span className="text-muted-foreground">{value || adminCommon.empty}</span>;
}

export default function ContactsPage() {
    const confirm = useConfirm();
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");
    const query = useDebouncedValue(search.trim());

    const contacts = useQuery({
        queryKey: [AdminQueryKey.Contacts, page, query],
        queryFn: () =>
            adminFetch<Paginated<Contact>>("/api/admin/contacts", {
                query: { page, limit: ADMIN_PAGE_SIZE, search: query },
            }),
        placeholderData: keepPreviousData,
    });

    const rows = contacts.data?.data ?? [];
    const total = contacts.data?.pagination.total ?? 0;

    const remove = useAdminMutation({
        mutationFn: (id: number) => adminFetch("/api/admin/contacts", { method: "DELETE", json: { id } }),
        invalidates: [AdminQueryKey.Contacts],
        success: copy.remove.done,
        onSuccess: () => {
            if (rows.length === 1 && page > 1) setPage(page - 1);
        },
    });

    const exportCsv = useAdminMutation({
        mutationFn: () => fetchAllContacts(query),
        success: (data) => copy.exportCsv.done(data.length),
        onSuccess: (data) =>
            downloadCsv(
                copy.exportCsv.filename(new Date().toISOString().slice(0, 10)),
                [...copy.exportCsv.header],
                data.map((c) => [c.id, c.name, c.email, c.company, c.phone, c.message, formatDateISO(c.created_at)]),
            ),
    });

    async function onRemove(contact: Contact) {
        const ok = await confirm({
            title: copy.remove.title,
            description: copy.remove.description(contact.name),
            confirmLabel: adminCommon.actions.delete,
        });
        if (ok) remove.mutate(contact.id);
    }

    const columns = col.columns([
        col.accessor("name", { header: copy.columns.name, cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
        col.accessor("email", {
            header: copy.columns.email,
            cell: (c) => (
                <a
                    href={`mailto:${c.getValue()}`}
                    onClick={stopRowClick}
                    className="break-all text-muted-foreground transition-colors hover:text-foreground"
                >
                    {c.getValue()}
                </a>
            ),
        }),
        col.accessor("company", {
            header: copy.columns.company,
            cell: (c) => <Muted value={c.getValue()} />,
            meta: { className: "hidden md:table-cell" },
        }),
        col.accessor("phone", {
            header: copy.columns.phone,
            cell: (c) => <Muted value={c.getValue()} />,
            meta: { className: "hidden lg:table-cell" },
        }),
        col.accessor("created_at", {
            header: copy.columns.date,
            cell: (c) => <span className="whitespace-nowrap text-muted-foreground tabular-nums">{formatDateShort(c.getValue())}</span>,
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

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={contacts.data ? copy.description(total) : undefined}
            actions={
                <>
                    <Button
                        variant="glass"
                        size="sm"
                        className="rounded-full"
                        onClick={() => exportCsv.mutate()}
                        disabled={exportCsv.isPending || total === 0}
                    >
                        <Download className={exportCsv.isPending ? "animate-pulse" : undefined} />
                        {adminCommon.actions.export}
                    </Button>
                    <Button variant="glass" size="sm" className="rounded-full" onClick={() => contacts.refetch()} disabled={contacts.isFetching}>
                        <RefreshCw className={contacts.isFetching ? "animate-spin" : undefined} />
                        {adminCommon.actions.refresh}
                    </Button>
                </>
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
                    data={rows}
                    getRowId={(c) => String(c.id)}
                    loading={contacts.isPending}
                    error={contacts.error}
                    onRetry={() => contacts.refetch()}
                    server={{ page, total, limit: ADMIN_PAGE_SIZE, onPageChange: setPage }}
                    empty={query ? { icon: MessageSquare, title: adminCommon.table.noMatches } : { icon: MessageSquare, ...copy.empty }}
                    renderDetail={(contact) => (
                        <div className="space-y-4">
                            <dl className="grid gap-4 sm:grid-cols-2 lg:hidden">
                                <div className="space-y-1 md:hidden">
                                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{copy.detail.company}</dt>
                                    <dd className="text-sm">{contact.company || adminCommon.empty}</dd>
                                </div>
                                <div className="space-y-1">
                                    <dt className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{copy.detail.phone}</dt>
                                    <dd className="text-sm">{contact.phone || adminCommon.empty}</dd>
                                </div>
                            </dl>
                            <div className="space-y-1.5">
                                <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{copy.detail.message}</p>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">{contact.message}</p>
                            </div>
                        </div>
                    )}
                />
            </div>
        </AdminPage>
    );
}
