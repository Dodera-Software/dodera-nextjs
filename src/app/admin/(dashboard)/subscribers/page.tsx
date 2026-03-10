"use client";

import { useEffect, useState, useCallback } from "react";
import {
    Search,
    Trash2,
    Loader2,
    Users,
    RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { toast } from "sonner";
import type { Subscriber, Pagination } from "@/types/admin";
import { AdminPageHeader } from "@/components/admin/AdminPageHeader";
import { AdminPagination } from "@/components/admin/AdminPagination";
import { formatDateShort } from "@/lib/format";

export default function SubscribersPage() {
    const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
    const [pagination, setPagination] = useState<Pagination>({
        page: 1,
        limit: 25,
        total: 0,
        totalPages: 0,
    });
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const confirm = useConfirm();
    const [deleting, setDeleting] = useState<number | null>(null);

    const fetchSubscribers = useCallback(
        async (page = 1, searchQuery = search) => {
            setLoading(true);
            try {
                const params = new URLSearchParams({
                    page: String(page),
                    limit: String(pagination.limit),
                });
                if (searchQuery) params.set("search", searchQuery);

                const res = await fetch(`/api/admin/subscribers?${params}`);
                const data = await res.json();

                if (data.status === "success") {
                    setSubscribers(data.data);
                    setPagination(data.pagination);
                }
            } catch {
                console.error("Failed to fetch subscribers");
            } finally {
                setLoading(false);
            }
        },
        [search, pagination.limit],
    );

    useEffect(() => {
        fetchSubscribers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function handleDelete(id: number, email: string) {
        const ok = await confirm({
            title: "Delete subscriber",
            description: `Remove "${email}" from your newsletter list? This cannot be undone.`,
            confirmLabel: "Delete",
        });
        if (ok) doDelete(id);
    }

    async function doDelete(id: number) {
        setDeleting(id);
        try {
            const res = await fetch("/api/admin/subscribers", {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id }),
            });

            if (res.ok) {
                setSubscribers((prev) => prev.filter((s) => s.id !== id));
                setPagination((prev) => ({ ...prev, total: prev.total - 1 }));
                toast.success("Subscriber deleted");
            } else {
                toast.error("Failed to delete subscriber");
            }
        } catch {
            toast.error("Failed to delete subscriber");
        } finally {
            setDeleting(null);
        }
    }

    function handleSearch(e: React.FormEvent) {
        e.preventDefault();
        fetchSubscribers(1, search);
    }

    return (
        <div className="space-y-6">
            <AdminPageHeader
                title="Subscribers"
                subtitle={`${pagination.total} total newsletter subscriber${pagination.total !== 1 ? "s" : ""}`}
                actions={
                    <Button variant="outline" size="sm" onClick={() => fetchSubscribers(pagination.page)}>
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                    </Button>
                }
            />

            {/* Search */}
            <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search by email..."
                        className="pl-9"
                    />
                </div>
                <Button type="submit">Search</Button>
            </form>

            {/* Table */}
            <div className="rounded-xl border border-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-border bg-card">
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                                    ID
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                                    Email
                                </th>
                                <th className="text-left px-4 py-3 font-medium text-muted-foreground">
                                    Subscribed
                                </th>
                                <th className="text-right px-4 py-3 font-medium text-muted-foreground">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} className="px-4 py-12 text-center">
                                        <Loader2 className="w-6 h-6 animate-spin mx-auto text-muted-foreground" />
                                    </td>
                                </tr>
                            ) : subscribers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan={4}
                                        className="px-4 py-12 text-center text-muted-foreground"
                                    >
                                        <Users className="w-8 h-8 mx-auto mb-2 opacity-50" />
                                        No subscribers found.
                                    </td>
                                </tr>
                            ) : (
                                subscribers.map((sub) => (
                                    <tr
                                        key={sub.id}
                                        className="border-b border-border last:border-0 hover:bg-accent/50 transition-colors"
                                    >
                                        <td className="px-4 py-3 text-muted-foreground font-mono text-xs">
                                            {sub.id}
                                        </td>
                                        <td className="px-4 py-3 font-medium">
                                            {sub.email}
                                        </td>
                                        <td className="px-4 py-3 text-muted-foreground">
                                            {formatDateShort(sub.created_at)}
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleDelete(sub.id, sub.email)}
                                                disabled={deleting === sub.id}
                                                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                                            >
                                                {deleting === sub.id ? (
                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                ) : (
                                                    <Trash2 className="w-3 h-3" />
                                                )}
                                                Delete
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <AdminPagination
                pagination={pagination}
                onPageChange={(page) => fetchSubscribers(page)}
            />

        </div>
    );
}
