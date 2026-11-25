"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetDescription, SheetTitle } from "@/components/ui/sheet";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { AdminQueryKey } from "@/config/admin";
import { useAdminMutation } from "@/hooks/use-admin";
import { adminCommon } from "@/i18n/admin/common";
import { blogCopy } from "@/i18n/admin/blog";
import { adminFetch } from "@/lib/admin-api";
import type { BlogPostRow } from "@/types/admin";

const copy = blogCopy.form;

const postSchema = z.object({
    title: z.string().trim().min(10, copy.errors.title).max(140, copy.errors.title),
    excerpt: z.string().trim().min(40, copy.errors.excerpt).max(320, copy.errors.excerpt),
    metaTitle: z.string().trim().max(70, copy.errors.metaTitle),
    metaDescription: z.string().trim().max(170, copy.errors.metaDescription),
    body: z.string().trim().min(600, copy.errors.body),
    indexed: z.boolean(),
});

type PostValues = z.infer<typeof postSchema>;

type TextField = Exclude<keyof PostValues, "indexed">;

const FIELDS: { name: TextField; rows?: number; mono?: boolean }[] = [
    { name: "title" },
    { name: "excerpt", rows: 3 },
    { name: "metaTitle" },
    { name: "metaDescription", rows: 2 },
    { name: "body", rows: 22, mono: true },
];

const toValues = (post: BlogPostRow): PostValues => ({
    title: post.title,
    excerpt: post.excerpt,
    metaTitle: post.metaTitle ?? "",
    metaDescription: post.metaDescription ?? "",
    body: post.body,
    indexed: post.indexed,
});

export interface BlogPostSheetProps {
    post: BlogPostRow | null;
    onClose: () => void;
}

export function BlogPostSheet({ post, onClose }: BlogPostSheetProps) {
    return (
        <Sheet open={!!post} onOpenChange={(next) => !next && onClose()}>
            <SheetContent closeLabel={adminCommon.actions.close} className="overflow-y-auto p-6 sm:max-w-3xl">
                {post && (
                    <>
                        <div className="space-y-1.5 pr-8">
                            <SheetTitle>{copy.title(post.locale, post.slug)}</SheetTitle>
                            <SheetDescription>{copy.description}</SheetDescription>
                        </div>
                        <BlogPostForm key={post.id} post={post} onDone={onClose} />
                    </>
                )}
            </SheetContent>
        </Sheet>
    );
}

function BlogPostForm({ post, onDone }: { post: BlogPostRow; onDone: () => void }) {
    const form = useForm<PostValues>({ resolver: zodResolver(postSchema), defaultValues: toValues(post) });

    const save = useAdminMutation({
        mutationFn: (values: PostValues) =>
            adminFetch(`/api/admin/blog/post/${post.id}`, {
                method: "PATCH",
                json: { ...values, metaTitle: values.metaTitle || undefined, metaDescription: values.metaDescription || undefined },
            }),
        invalidates: [AdminQueryKey.Blog],
        success: copy.saved,
        onSuccess: onDone,
    });

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit((values) => save.mutate(values))} className="space-y-5 pt-4">
                {FIELDS.map(({ name, rows, mono }) => (
                    <FormField
                        key={name}
                        control={form.control}
                        name={name}
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>{copy.fields[name]}</FormLabel>
                                <FormControl>{rows ? <Textarea rows={rows} className={mono ? "font-mono text-xs leading-relaxed" : undefined} {...field} /> : <Input {...field} />}</FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                ))}
                <FormField
                    control={form.control}
                    name="indexed"
                    render={({ field }) => (
                        <FormItem className="flex items-center gap-3 space-y-0">
                            <FormControl>
                                <Switch checked={field.value} onCheckedChange={field.onChange} />
                            </FormControl>
                            <FormLabel className="font-normal">{copy.fields.indexed}</FormLabel>
                        </FormItem>
                    )}
                />
                <div className="flex justify-end gap-2 pt-2">
                    <Button type="button" variant="glass" onClick={onDone}>
                        {adminCommon.actions.cancel}
                    </Button>
                    <Button type="submit" disabled={save.isPending}>
                        {save.isPending ? adminCommon.actions.saving : adminCommon.actions.save}
                    </Button>
                </div>
            </form>
        </Form>
    );
}
