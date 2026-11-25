"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, Ban, Key, MoreHorizontal, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { DataTable, columnHelper } from "@/components/admin/DataTable";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyButton } from "@/components/ui/copy-button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useConfirm } from "@/hooks/use-confirm";
import { useAdminMutation } from "@/hooks/use-admin";
import { AdminQueryKey } from "@/config/admin";
import { StatusTone } from "@/config/ui";
import { adminCommon } from "@/i18n/admin/common";
import { tokensCopy as copy } from "@/i18n/admin/tokens";
import { adminFetch } from "@/lib/admin-api";
import { tokensQuery } from "@/lib/admin-queries";
import { formatDateTime } from "@/lib/format";
import { isTokenActive } from "@/lib/utils";
import type { ApiToken } from "@/types/admin";

enum TokenStatus {
    Active = "active",
    Revoked = "revoked",
    Expired = "expired",
}

const STATUS_TONE: Record<TokenStatus, StatusTone> = {
    [TokenStatus.Active]: StatusTone.Success,
    [TokenStatus.Revoked]: StatusTone.Danger,
    [TokenStatus.Expired]: StatusTone.Warning,
};

function tokenStatus(token: ApiToken): TokenStatus {
    if (token.revoked_at) return TokenStatus.Revoked;
    return isTokenActive(token) ? TokenStatus.Active : TokenStatus.Expired;
}

const nameSchema = z.string().trim().min(1, copy.form.nameRequired);

const createSchema = z.object({
    name: nameSchema,
    expiresDays: z.string().trim().regex(/^([1-9]\d*)?$/, copy.form.expiryInvalid),
});

const renameSchema = z.object({ name: nameSchema });

type CreateValues = z.infer<typeof createSchema>;
type RenameValues = z.infer<typeof renameSchema>;

const col = columnHelper<ApiToken>();

export default function TokensPage() {
    const confirm = useConfirm();
    const tokens = useQuery(tokensQuery);
    const [creating, setCreating] = useState(false);
    const [renaming, setRenaming] = useState<ApiToken | null>(null);
    const [plainToken, setPlainToken] = useState<string | null>(null);

    const revoke = useAdminMutation({
        mutationFn: (id: number) => adminFetch("/api/admin/tokens", { method: "DELETE", json: { id, action: "revoke" } }),
        invalidates: [AdminQueryKey.Tokens],
        success: copy.revoke.done,
    });

    const remove = useAdminMutation({
        mutationFn: (id: number) => adminFetch("/api/admin/tokens", { method: "DELETE", json: { id } }),
        invalidates: [AdminQueryKey.Tokens],
        success: copy.remove.done,
    });

    async function onRevoke(token: ApiToken) {
        const ok = await confirm({
            title: copy.revoke.title,
            description: copy.revoke.description(token.name),
            confirmLabel: copy.revoke.action,
        });
        if (ok) revoke.mutate(token.id);
    }

    async function onRemove(token: ApiToken) {
        const ok = await confirm({
            title: copy.remove.title,
            description: copy.remove.description(token.name),
            confirmLabel: adminCommon.actions.delete,
        });
        if (ok) remove.mutate(token.id);
    }

    const busy = (id: number) => (revoke.isPending && revoke.variables === id) || (remove.isPending && remove.variables === id);

    const columns = col.columns([
        col.accessor("id", {
            header: copy.columns.id,
            cell: (c) => <span className="font-mono text-xs text-muted-foreground tabular-nums">{c.getValue()}</span>,
            meta: { className: "hidden md:table-cell" },
        }),
        col.accessor("name", { header: copy.columns.name, cell: (c) => <span className="font-medium">{c.getValue()}</span> }),
        col.display({
            id: "status",
            header: copy.columns.status,
            cell: (c) => {
                const status = tokenStatus(c.row.original);
                return (
                    <Badge tone={STATUS_TONE[status]} dot>
                        {copy.status[status]}
                    </Badge>
                );
            },
        }),
        col.accessor("created_at", {
            header: copy.columns.created,
            cell: (c) => <span className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">{formatDateTime(c.getValue())}</span>,
            meta: { className: "hidden md:table-cell" },
        }),
        col.accessor("expires_at", {
            header: copy.columns.expires,
            cell: (c) => <span className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">{formatDateTime(c.getValue())}</span>,
            meta: { className: "hidden lg:table-cell" },
        }),
        col.accessor("last_used_at", {
            header: copy.columns.lastUsed,
            cell: (c) => <span className="whitespace-nowrap text-xs text-muted-foreground tabular-nums">{formatDateTime(c.getValue())}</span>,
            meta: { className: "hidden lg:table-cell" },
        }),
        col.display({
            id: "actions",
            header: () => <span className="sr-only">{adminCommon.table.actions}</span>,
            meta: { align: "right" },
            cell: (c) => {
                const token = c.row.original;
                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="size-8 rounded-full text-muted-foreground"
                                aria-label={adminCommon.actions.more}
                                disabled={busy(token.id)}
                            >
                                <MoreHorizontal />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => setRenaming(token)}>
                                <Pencil />
                                {copy.rename.action}
                            </DropdownMenuItem>
                            {!token.revoked_at && (
                                <DropdownMenuItem onSelect={() => onRevoke(token)}>
                                    <Ban />
                                    {copy.revoke.action}
                                </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem destructive onSelect={() => onRemove(token)}>
                                <Trash2 />
                                {adminCommon.actions.delete}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                );
            },
        }),
    ]);

    const data = tokens.data ?? [];

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={tokens.data ? copy.description(data.length) : undefined}
            actions={
                <>
                    <Button variant="glass" size="sm" className="rounded-full" onClick={() => tokens.refetch()} disabled={tokens.isFetching}>
                        <RefreshCw className={tokens.isFetching ? "animate-spin" : undefined} />
                        {adminCommon.actions.refresh}
                    </Button>
                    <Button size="sm" className="rounded-full" onClick={() => setCreating(true)}>
                        <Plus />
                        {copy.generate}
                    </Button>
                </>
            }
        >
            <DataTable
                columns={columns}
                data={data}
                getRowId={(t) => String(t.id)}
                loading={tokens.isPending}
                error={tokens.error}
                onRetry={() => tokens.refetch()}
                empty={{ icon: Key, ...copy.empty }}
            />
            <CreateTokenDialog
                open={creating}
                onOpenChange={setCreating}
                onCreated={(token) => {
                    setCreating(false);
                    setPlainToken(token);
                }}
            />
            <RenameTokenDialog token={renaming} onClose={() => setRenaming(null)} />
            <NewTokenDialog token={plainToken} onClose={() => setPlainToken(null)} />
        </AdminPage>
    );
}

function CreateTokenDialog({
    open,
    onOpenChange,
    onCreated,
}: {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onCreated: (plainToken: string) => void;
}) {
    const form = useForm<CreateValues>({ resolver: zodResolver(createSchema), defaultValues: { name: "", expiresDays: "" } });

    const create = useAdminMutation({
        mutationFn: (values: CreateValues) =>
            adminFetch<{ plainToken: string }>("/api/admin/tokens", {
                method: "POST",
                json: { name: values.name, expiresDays: values.expiresDays ? Number(values.expiresDays) : null },
            }),
        invalidates: [AdminQueryKey.Tokens],
        success: copy.create.done,
        onSuccess: (data) => {
            form.reset();
            onCreated(data.plainToken);
        },
    });

    return (
        <Dialog
            open={open}
            onOpenChange={(next) => {
                if (!next) form.reset();
                onOpenChange(next);
            }}
        >
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{copy.create.title}</DialogTitle>
                    <DialogDescription>{copy.create.description}</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form noValidate onSubmit={form.handleSubmit((values) => create.mutate(values))} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{copy.form.name}</FormLabel>
                                    <FormControl>
                                        <Input placeholder={copy.form.namePlaceholder} autoFocus {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="expiresDays"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{copy.form.expiry}</FormLabel>
                                    <FormControl>
                                        <Input type="number" inputMode="numeric" min={1} step={1} placeholder={copy.form.expiryPlaceholder} {...field} />
                                    </FormControl>
                                    <FormDescription>{copy.form.expiryHint}</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <DialogFooter className="gap-2">
                            <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={() => onOpenChange(false)}>
                                {adminCommon.actions.cancel}
                            </Button>
                            <Button type="submit" size="sm" className="rounded-full" disabled={create.isPending}>
                                {create.isPending ? copy.create.submitting : copy.create.submit}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function RenameTokenDialog({ token, onClose }: { token: ApiToken | null; onClose: () => void }) {
    return (
        <Dialog open={!!token} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>{copy.rename.title}</DialogTitle>
                </DialogHeader>
                {token && <RenameTokenForm key={token.id} token={token} onDone={onClose} />}
            </DialogContent>
        </Dialog>
    );
}

function RenameTokenForm({ token, onDone }: { token: ApiToken; onDone: () => void }) {
    const form = useForm<RenameValues>({ resolver: zodResolver(renameSchema), defaultValues: { name: token.name } });

    const rename = useAdminMutation({
        mutationFn: (values: RenameValues) => adminFetch("/api/admin/tokens", { method: "PATCH", json: { id: token.id, name: values.name } }),
        invalidates: [AdminQueryKey.Tokens],
        success: copy.rename.done,
        onSuccess: onDone,
    });

    return (
        <Form {...form}>
            <form noValidate onSubmit={form.handleSubmit((values) => rename.mutate(values))} className="space-y-4">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>{copy.form.name}</FormLabel>
                            <FormControl>
                                <Input autoFocus {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <DialogFooter className="gap-2">
                    <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={onDone}>
                        {adminCommon.actions.cancel}
                    </Button>
                    <Button type="submit" size="sm" className="rounded-full" disabled={rename.isPending}>
                        {rename.isPending ? adminCommon.actions.saving : adminCommon.actions.save}
                    </Button>
                </DialogFooter>
            </form>
        </Form>
    );
}

function NewTokenDialog({ token, onClose }: { token: string | null; onClose: () => void }) {
    return (
        <Dialog open={!!token} onOpenChange={(open) => !open && onClose()}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>{copy.created.title}</DialogTitle>
                    <DialogDescription>{copy.created.description}</DialogDescription>
                </DialogHeader>
                <div className="flex items-start gap-2 rounded-2xl border border-foreground/10 bg-foreground/[0.03] p-3">
                    <code className="min-w-0 flex-1 select-all break-all px-1 py-1.5 font-mono text-xs">{token}</code>
                    {token && <CopyButton value={token} iconOnly className="shrink-0" />}
                </div>
                <Alert tone={StatusTone.Warning} icon={AlertTriangle}>
                    {copy.created.warning}
                </Alert>
                <DialogFooter>
                    <Button size="sm" className="w-full rounded-full" onClick={onClose}>
                        {copy.created.done}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
