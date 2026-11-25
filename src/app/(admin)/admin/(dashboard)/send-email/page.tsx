"use client";

import { useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { EditorContent, useEditor } from "@tiptap/react";
import { NodeSelection } from "@tiptap/pm/state";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Placeholder from "@tiptap/extension-placeholder";
import { AlertCircle, BookOpen, ChevronDown, Loader2, Paperclip, Send, UserCheck, Users, Wifi, X } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { BlogPostCommand } from "@/components/admin/BlogPostCommand";
import { EmailImage } from "@/components/admin/email-image-extension";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AdminQueryKey } from "@/config/admin";
import { RecipientMode, SEND_TO_ALL, SMTP_VERIFY_ACTION } from "@/config/admin-email";
import { ConfirmVariant, StatusTone } from "@/config/ui";
import { useConfirm } from "@/hooks/use-confirm";
import { useAdminMutation } from "@/hooks/use-admin";
import { emailCopy } from "@/i18n/admin/email";
import { blogPostsQuery } from "@/lib/admin-queries";
import { adminFetch } from "@/lib/admin-api";
import type { AdminBlogPost, AttachedFile, BulkSendResult, SmtpCheck } from "@/types/admin";
import { EditorToolbar } from "./EditorToolbar";

const copy = emailCopy.send;

const MODE_ICON = { [RecipientMode.All]: Users, [RecipientMode.Custom]: UserCheck };

function splitEmails(value: string): string[] {
    return value.split(",").map((email) => email.trim()).filter(Boolean);
}

const schema = z
    .object({
        mode: z.enum(RecipientMode),
        emails: z.string(),
        subject: z.string().trim().min(1, copy.subject.required),
        html: z.string().min(1, copy.body.required),
        attachments: z.array(z.custom<AttachedFile>()),
    })
    .superRefine((values, ctx) => {
        if (values.mode !== RecipientMode.Custom) return;
        const emails = splitEmails(values.emails);
        if (emails.length === 0) {
            ctx.addIssue({ code: "custom", path: ["emails"], message: copy.recipients.required });
            return;
        }
        const invalid = emails.find((email) => !z.email().safeParse(email).success);
        if (invalid) ctx.addIssue({ code: "custom", path: ["emails"], message: copy.recipients.invalid(invalid) });
    });

type Values = z.infer<typeof schema>;

const DEFAULTS: Values = { mode: RecipientMode.All, emails: "", subject: "", html: "", attachments: [] };

function formatSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function verifySmtp(): Promise<SmtpCheck> {
    return adminFetch<SmtpCheck>("/api/admin/send-email", { query: { action: SMTP_VERIFY_ACTION } });
}

function SmtpStatus() {
    const smtp = useQuery({ queryKey: [AdminQueryKey.Smtp], queryFn: verifySmtp, retry: false });
    if (smtp.isFetching) {
        return (
            <Badge tone={StatusTone.Neutral}>
                <Loader2 className="animate-spin" />
                {copy.smtp.checking}
            </Badge>
        );
    }
    if (smtp.data?.ok) {
        return (
            <Badge tone={StatusTone.Success} dot>
                <Wifi />
                {copy.smtp.ok}
            </Badge>
        );
    }
    return (
        <button type="button" onClick={() => smtp.refetch()} title={smtp.error?.message}>
            <Badge tone={StatusTone.Danger}>
                <AlertCircle />
                {copy.smtp.failed}
            </Badge>
        </button>
    );
}

export default function SendEmailPage() {
    const confirm = useConfirm();
    const fileInput = useRef<HTMLInputElement>(null);
    const [pickerOpen, setPickerOpen] = useState(false);
    const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: DEFAULTS });

    const posts = useQuery({ ...blogPostsQuery, enabled: pickerOpen });

    const editor = useEditor({
        immediatelyRender: false,
        extensions: [
            StarterKit,
            Underline,
            Link.configure({ openOnClick: false }),
            TextAlign.configure({ types: ["heading", "paragraph"] }),
            Placeholder.configure({ placeholder: copy.body.placeholder }),
            EmailImage,
        ],
        content: "",
        editorProps: {
            attributes: { class: "tiptap-editor prose prose-sm max-w-none min-h-[320px] p-5 focus:outline-none sm:p-6" },
            handleClickOn(view, _pos, node, nodePos) {
                if (node.type.name !== "image") return false;
                view.dispatch(view.state.tr.setSelection(NodeSelection.create(view.state.doc, nodePos)));
                return true;
            },
        },
        onUpdate: ({ editor: e }) => syncHtml(e.isEmpty ? "" : e.getHTML()),
    });

    function syncHtml(html: string) {
        form.setValue("html", html, { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
    }

    const send = useAdminMutation({
        mutationFn: (values: Values) => {
            const body = new FormData();
            body.append("to", values.mode === RecipientMode.All ? SEND_TO_ALL : splitEmails(values.emails).join(", "));
            body.append("subject", values.subject.trim());
            body.append("html", values.html);
            values.attachments.forEach((a) => body.append("files[]", a.file));
            return adminFetch<{ data: BulkSendResult }>("/api/admin/send-email", { method: "POST", body }).then((r) => r.data);
        },
        onSuccess: (result, values) => {
            if (result.accepted === 0) {
                toast.error(copy.result.failed, { description: result.errors[0] ?? copy.result.allRejected });
                return;
            }
            toast.success(copy.result.sent, {
                description: copy.result.summary(result.accepted, result.totalRecipients, result.rejected),
            });
            form.reset({ ...DEFAULTS, mode: values.mode });
            editor?.commands.clearContent();
        },
    });

    async function onSubmit(values: Values) {
        const ok = await confirm({
            title: copy.confirm.title,
            description:
                values.mode === RecipientMode.All
                    ? copy.confirm.toAll(values.subject)
                    : copy.confirm.toCustom(values.subject, splitEmails(values.emails).join(", ")),
            confirmLabel: copy.confirm.action,
            variant: ConfirmVariant.Default,
        });
        if (ok) send.mutate(values);
    }

    function applyBlogPost(post: AdminBlogPost) {
        setPickerOpen(false);
        if (!editor) return;
        form.setValue("subject", copy.blog.subject(post.title), { shouldDirty: true, shouldValidate: form.formState.isSubmitted });
        editor.commands.setContent(copy.blog.html(post));
        syncHtml(editor.getHTML());
    }

    function addFiles(event: React.ChangeEvent<HTMLInputElement>) {
        const files = Array.from(event.target.files ?? []);
        event.target.value = "";
        form.setValue("attachments", [
            ...form.getValues("attachments"),
            ...files.map((file) => ({ file, id: `${file.name}-${file.lastModified}-${crypto.randomUUID()}` })),
        ]);
    }

    const mode = useWatch({ control: form.control, name: "mode" });
    const attachments = useWatch({ control: form.control, name: "attachments" });

    return (
        <AdminPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description} actions={<SmtpStatus />}>
            <Form {...form}>
                <form noValidate onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <AdminPanel>
                        <div className="space-y-6">
                            <FormField
                                control={form.control}
                                name="mode"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{copy.recipients.label}</FormLabel>
                                        <Tabs value={field.value} onValueChange={(value) => field.onChange(value as RecipientMode)}>
                                            <TabsList className="flex w-full sm:inline-flex sm:w-auto">
                                                {Object.values(RecipientMode).map((value) => {
                                                    const Icon = MODE_ICON[value];
                                                    return (
                                                        <TabsTrigger key={value} value={value} className="flex-1 sm:flex-none">
                                                            <Icon />
                                                            {copy.recipients.modes[value]}
                                                        </TabsTrigger>
                                                    );
                                                })}
                                            </TabsList>
                                        </Tabs>
                                    </FormItem>
                                )}
                            />
                            {mode === RecipientMode.Custom && (
                                <FormField
                                    control={form.control}
                                    name="emails"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input {...field} placeholder={copy.recipients.placeholder} className="font-mono text-sm" />
                                            </FormControl>
                                            <FormDescription>{copy.recipients.hint}</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            )}
                            <FormField
                                control={form.control}
                                name="subject"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{copy.subject.label}</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder={copy.subject.placeholder} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                    </AdminPanel>

                    <FormField
                        control={form.control}
                        name="html"
                        render={() => (
                            <FormItem className="space-y-0">
                                <AdminPanel
                                    title={copy.body.label}
                                    flush
                                    actions={
                                        <Popover open={pickerOpen} onOpenChange={setPickerOpen}>
                                            <PopoverTrigger asChild>
                                                <Button type="button" variant="glass" size="sm" className="rounded-full">
                                                    <BookOpen />
                                                    {copy.blog.trigger}
                                                    <ChevronDown />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent align="end" className="w-[min(26rem,calc(100vw-2rem))] p-0">
                                                <BlogPostCommand
                                                    posts={posts.data}
                                                    loading={posts.isPending}
                                                    error={posts.error}
                                                    onSelect={applyBlogPost}
                                                    placeholder={copy.blog.search}
                                                    empty={copy.blog.empty}
                                                    listClassName="max-h-80"
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    }
                                >
                                    <EditorToolbar editor={editor} />
                                    <FormControl>
                                        <EditorContent editor={editor} className="bg-white" />
                                    </FormControl>
                                </AdminPanel>
                                <div className="px-2 pt-2">
                                    <FormMessage />
                                </div>
                            </FormItem>
                        )}
                    />

                    <AdminPanel
                        title={copy.attachments.label}
                        actions={
                            <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={() => fileInput.current?.click()}>
                                <Paperclip />
                                {copy.attachments.add}
                            </Button>
                        }
                        flush={attachments.length === 0}
                    >
                        <input ref={fileInput} type="file" multiple className="hidden" onChange={addFiles} />
                        {attachments.length > 0 && (
                            <ul className="space-y-2">
                                {attachments.map((a) => (
                                    <li
                                        key={a.id}
                                        className="flex items-center justify-between gap-3 rounded-2xl border border-foreground/[0.07] bg-foreground/[0.02] px-4 py-2.5 text-sm"
                                    >
                                        <span className="flex min-w-0 items-center gap-2">
                                            <Paperclip className="size-3.5 shrink-0 text-muted-foreground" />
                                            <span className="truncate">{a.file.name}</span>
                                            <span className="shrink-0 tabular-nums text-muted-foreground">{formatSize(a.file.size)}</span>
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="size-8 shrink-0 rounded-full text-muted-foreground hover:bg-red-400/10 hover:text-red-400"
                                            aria-label={copy.attachments.remove(a.file.name)}
                                            onClick={() =>
                                                form.setValue(
                                                    "attachments",
                                                    attachments.filter((item) => item.id !== a.id),
                                                )
                                            }
                                        >
                                            <X />
                                        </Button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </AdminPanel>

                    <div className="flex flex-col-reverse gap-4 border-t border-foreground/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
                        <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{copy.sender}</p>
                        <Button type="submit" size="sm" className="rounded-full" disabled={send.isPending || !editor}>
                            {send.isPending ? <Loader2 className="animate-spin" /> : <Send />}
                            {send.isPending ? copy.submitting : copy.submit}
                        </Button>
                    </div>
                </form>
            </Form>
        </AdminPage>
    );
}
