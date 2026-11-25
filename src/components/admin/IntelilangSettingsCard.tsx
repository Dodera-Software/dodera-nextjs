"use client";

import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { KeyRound, Loader2, Save, Send, ShieldAlert } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminQueryKey } from "@/config/admin";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { settingsCopy } from "@/i18n/admin/settings";
import { adminFetch } from "@/lib/admin-api";
import { intelilangQuery } from "@/lib/mockups-client";
import type { IntelilangSettings } from "@/types/admin";

const copy = settingsCopy.intelilang;

const schema = z.object({
    url: z.string().trim().max(500),
    secret: z.string().trim().max(200),
});

type Values = z.infer<typeof schema>;

export function IntelilangSettingsCard() {
    const settings = useQuery(intelilangQuery);

    return (
        <AdminPanel
            title={copy.title}
            description={copy.description}
            actions={
                settings.data && (
                    <Badge tone={settings.data.configured ? StatusTone.Success : StatusTone.Neutral} dot>
                        {settings.data.configured ? copy.connected : copy.notConnected}
                    </Badge>
                )
            }
        >
            {settings.data ? (
                <IntelilangForm settings={settings.data} />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                    <Skeleton className="h-16 rounded-2xl" />
                    <Skeleton className="h-16 rounded-2xl" />
                </div>
            )}
        </AdminPanel>
    );
}

function IntelilangForm({ settings }: { settings: IntelilangSettings }) {
    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { url: settings.url, secret: "" },
    });

    const save = useAdminMutation({
        mutationFn: (values: Values) =>
            adminFetch<{ message?: string; data: IntelilangSettings }>("/api/admin/intelilang", {
                method: "PUT",
                json: { url: values.url, secret: values.secret || undefined },
            }),
        invalidates: [AdminQueryKey.Intelilang],
        success: (r) => r.message ?? copy.saved,
        onSuccess: (r) => form.reset({ url: r.data.url, secret: "" }),
    });

    const test = useAdminMutation({
        mutationFn: () => adminFetch<{ message?: string }>("/api/admin/intelilang/test", { method: "POST" }),
        success: (r) => r.message ?? copy.tested,
    });

    const dirty = form.formState.isDirty;

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => save.mutate(values))} className="space-y-5">
                {!settings.can_store_secret && (
                    <Alert tone={StatusTone.Warning} icon={ShieldAlert}>
                        {copy.noEncryptionKey}
                    </Alert>
                )}
                <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                        control={form.control}
                        name="url"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.url}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        onChange={(e) => field.onChange(e.target.value.trim())}
                                        placeholder={copy.urlPlaceholder}
                                        className="font-mono text-xs"
                                        autoComplete="off"
                                    />
                                </FormControl>
                                <FormDescription>{copy.urlHint}</FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="secret"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.secret}</FormLabel>
                                <FormControl>
                                    <Input
                                        {...field}
                                        type="password"
                                        placeholder={settings.secret_set ? copy.secretReplace : copy.secretPlaceholder}
                                        className="font-mono text-xs"
                                        autoComplete="new-password"
                                        disabled={!settings.can_store_secret}
                                    />
                                </FormControl>
                                <FormDescription className="flex items-center gap-1.5">
                                    <KeyRound className="size-3 shrink-0" />
                                    {settings.secret_set ? copy.secretStored(settings.secret_tail) : copy.secretMissing}
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <div className="flex flex-wrap items-center gap-2">
                    <Button type="submit" size="sm" className="rounded-full" disabled={!dirty || save.isPending}>
                        {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                        {save.isPending ? adminCommon.actions.saving : adminCommon.actions.save}
                    </Button>
                    <Button
                        type="button"
                        variant="glass"
                        size="sm"
                        className="rounded-full"
                        onClick={() => test.mutate()}
                        disabled={!settings.configured || dirty || test.isPending}
                    >
                        {test.isPending ? <Loader2 className="animate-spin" /> : <Send />}
                        {copy.test}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
