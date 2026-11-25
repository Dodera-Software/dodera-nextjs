"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AdminQueryKey } from "@/config/admin";
import { BOOLEAN_CONFIG, CONFIG_FIELDS, ConfigFieldKind, DEFAULT_CONFIG_FIELD } from "@/config/admin-settings";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { settingsCopy } from "@/i18n/admin/settings";
import { adminFetch } from "@/lib/admin-api";
import { formatDateShort } from "@/lib/format";
import { cn } from "@/lib/utils";
import type { ConfigRow } from "@/types/admin";

const copy = settingsCopy.config;

const textSchema = z.object({ value: z.string() });
const numberSchema = z.object({ value: z.string().trim().regex(/^\d+$/, copy.wholeNumber) });

type Values = z.infer<typeof textSchema>;

export function ConfigRowForm({ row }: { row: ConfigRow }) {
    const field = CONFIG_FIELDS[row.key] ?? DEFAULT_CONFIG_FIELD;
    const help = copy.help[row.key] ?? row.description;

    const form = useForm<Values>({
        resolver: zodResolver(field.kind === ConfigFieldKind.Number ? numberSchema : textSchema),
        values: { value: row.value },
    });

    const save = useAdminMutation({
        mutationFn: (value: string) => adminFetch("/api/admin/config", { method: "PATCH", json: { key: row.key, value } }),
        invalidates: [AdminQueryKey.Config],
        success: copy.saved(row.key),
    });

    const dirty = form.formState.isDirty;

    return (
        <Form {...form}>
            <form noValidate
                onSubmit={form.handleSubmit((values) => save.mutate(values.value))}
                className="grid gap-3 px-6 py-4 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)_auto] lg:items-start lg:gap-5"
            >
                <div className="min-w-0 space-y-1">
                    <p className="break-all font-mono text-sm font-medium">{row.key}</p>
                    {help && <p className="text-xs leading-relaxed text-muted-foreground">{help}</p>}
                    <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground/70">
                        {copy.updated(formatDateShort(row.updated_at))}
                    </p>
                </div>
                <FormField
                    control={form.control}
                    name="value"
                    render={({ field: input }) => (
                        <FormItem className="min-w-0">
                            {field.kind === ConfigFieldKind.Boolean ? (
                                <div className="flex h-10 items-center gap-3">
                                    <FormControl>
                                        <Switch
                                            checked={input.value === BOOLEAN_CONFIG.on}
                                            onCheckedChange={(checked) => input.onChange(checked ? BOOLEAN_CONFIG.on : BOOLEAN_CONFIG.off)}
                                            aria-label={row.key}
                                        />
                                    </FormControl>
                                    <span className="text-sm text-muted-foreground">
                                        {input.value === BOOLEAN_CONFIG.on ? copy.on : copy.off}
                                    </span>
                                </div>
                            ) : field.kind === ConfigFieldKind.Select ? (
                                <Select value={input.value} onValueChange={input.onChange}>
                                    <FormControl>
                                        <SelectTrigger className="font-mono" aria-label={row.key}>
                                            <SelectValue placeholder={copy.selectModel} />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        {field.options?.map((option) => (
                                            <SelectItem key={option.value} value={option.value} className="font-mono">
                                                {option.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            ) : (
                                <FormControl>
                                    <Input
                                        {...input}
                                        inputMode={field.kind === ConfigFieldKind.Number ? "numeric" : undefined}
                                        placeholder={field.kind === ConfigFieldKind.Text ? copy.emptyDisables : undefined}
                                        className="font-mono"
                                        aria-label={row.key}
                                    />
                                </FormControl>
                            )}
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button
                    type="submit"
                    size="sm"
                    variant={dirty ? "default" : "glass"}
                    className={cn("h-10 rounded-full lg:w-auto", !dirty && "text-muted-foreground")}
                    disabled={!dirty || save.isPending}
                >
                    {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                    {save.isPending ? adminCommon.actions.saving : adminCommon.actions.save}
                </Button>
            </form>
        </Form>
    );
}
