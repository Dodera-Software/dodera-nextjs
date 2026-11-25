"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import type { Editor, EditorRef } from "react-email-editor";
import { Info, Loader2, RotateCcw, Save } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminQueryKey } from "@/config/admin";
import { WELCOME_EDITOR } from "@/config/admin-email";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { emailCopy } from "@/i18n/admin/email";
import { adminFetch } from "@/lib/admin-api";

const copy = emailCopy.welcome;

const EmailEditor = dynamic(() => import("react-email-editor"), {
    ssr: false,
    loading: () => <Skeleton className="w-full rounded-none" style={{ height: WELCOME_EDITOR.minHeight }} />,
});

type UnlayerDesign = Parameters<Editor["loadDesign"]>[0];

interface WelcomeTemplate {
    subject: string;
    html: string;
    design: string | UnlayerDesign | null;
}

const schema = z.object({ subject: z.string().trim().min(1, copy.subject.required) });

type Values = z.infer<typeof schema>;

function parseDesign(design: WelcomeTemplate["design"]): UnlayerDesign | null {
    if (!design) return null;
    if (typeof design !== "string") return design;
    try {
        return JSON.parse(design) as UnlayerDesign;
    } catch {
        return null;
    }
}

export default function WelcomeEmailPage() {
    const queryClient = useQueryClient();
    const editorRef = useRef<EditorRef>(null);
    const [ready, setReady] = useState(false);

    const template = useQuery({
        queryKey: [AdminQueryKey.WelcomeEmailTemplate],
        queryFn: () => adminFetch<WelcomeTemplate>("/api/admin/welcome-email-template"),
    });

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { subject: "" },
        values: template.data ? { subject: template.data.subject } : undefined,
    });

    const design = useMemo(() => parseDesign(template.data?.design ?? null), [template.data]);

    useEffect(() => {
        if (ready && design) editorRef.current?.editor?.loadDesign(design);
    }, [ready, design]);

    const save = useAdminMutation({
        mutationFn: async ({ subject }: Values) => {
            const editor = editorRef.current?.editor;
            if (!editor) throw new Error(copy.notReady);
            const exported = await new Promise<{ design: UnlayerDesign; html: string }>((resolve) =>
                editor.exportHtml((data: { design: UnlayerDesign; html: string }) => resolve(data)),
            );
            return adminFetch("/api/admin/welcome-email-template", {
                method: "PUT",
                json: { subject: subject.trim(), html: exported.html, design: JSON.stringify(exported.design) },
            });
        },
        success: copy.saved,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: [AdminQueryKey.WelcomeEmailTemplate], refetchType: "none" }),
    });

    async function reset() {
        const { data } = await template.refetch();
        if (!data) return;
        form.reset({ subject: data.subject });
        const fresh = parseDesign(data.design);
        if (fresh) editorRef.current?.editor?.loadDesign(fresh);
        toast.info(copy.reloaded);
    }

    return (
        <AdminPage
            eyebrow={copy.eyebrow}
            title={copy.title}
            description={copy.description}
            actions={
                <>
                    <Button variant="glass" size="sm" className="rounded-full" onClick={reset} disabled={save.isPending || template.isFetching}>
                        <RotateCcw className={template.isFetching ? "animate-spin" : undefined} />
                        {copy.reset}
                    </Button>
                    <Button size="sm" className="rounded-full" onClick={form.handleSubmit((values) => save.mutate(values))} disabled={save.isPending || !ready}>
                        {save.isPending ? <Loader2 className="animate-spin" /> : <Save />}
                        {copy.save}
                    </Button>
                </>
            }
        >
            <Alert tone={StatusTone.Neutral} icon={Info}>
                {copy.notice}
            </Alert>

            <AdminPanel>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit((values) => save.mutate(values))} className="max-w-xl">
                        <FormField
                            control={form.control}
                            name="subject"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>{copy.subject.label}</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder={copy.subject.placeholder} disabled={template.isPending} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </form>
                </Form>
            </AdminPanel>

            <AdminPanel title={copy.body.title} description={copy.body.hint} flush>
                {template.isError && <p className="border-b border-foreground/[0.07] px-6 py-4 text-sm text-red-400">{template.error.message}</p>}
                <EmailEditor
                    ref={editorRef}
                    onReady={() => setReady(true)}
                    minHeight={WELCOME_EDITOR.minHeight}
                    options={{ features: { devTab: false }, appearance: { theme: WELCOME_EDITOR.theme } }}
                />
            </AdminPanel>
        </AdminPage>
    );
}
