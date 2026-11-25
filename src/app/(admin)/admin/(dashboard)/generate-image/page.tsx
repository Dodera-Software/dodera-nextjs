"use client";

import { useState } from "react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { AlertTriangle, Download, Loader2, RectangleHorizontal, RectangleVertical, Sparkles, Square, type LucideIcon } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminPage";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { DEFAULT_IMAGE_MODEL, IMAGE_MODEL_CONFIG_KEY, IMAGE_MODELS, ImageModel, isImageModel } from "@/config/ai-models";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { imagesCopy as copy } from "@/i18n/admin/images";
import { configQuery } from "@/lib/admin-queries";
import { adminFetch, errorMessage } from "@/lib/admin-api";
import { DEFAULT_IMAGE_SIZE, IMAGE_SIZES, ImageSize } from "@/lib/image-sizes";
import type { GeneratedImage, ImageRequest } from "@/types/admin";

const SIZE_ICON: Record<ImageSize, LucideIcon> = {
    [ImageSize.Landscape]: RectangleHorizontal,
    [ImageSize.Square]: Square,
    [ImageSize.Portrait]: RectangleVertical,
};

const schema = z.object({
    prompt: z.string().trim().min(1, copy.form.required),
    size: z.enum(ImageSize),
    model: z.enum(ImageModel).optional(),
});

type Values = z.infer<typeof schema>;

interface Outcome {
    image?: GeneratedImage;
    error?: string;
}

function dimensions(size: ImageSize): { width: number; height: number } {
    const [width, height] = size.split("x").map(Number);
    return { width, height };
}

function RequestCard({ request, outcome, pending }: { request: ImageRequest; outcome?: Outcome; pending: boolean }) {
    const SizeIcon = SIZE_ICON[request.size];
    const modelLabel = IMAGE_MODELS.find((m) => m.value === request.model)?.label ?? request.model;
    return (
        <article className="overflow-hidden rounded-3xl border border-foreground/10 bg-card/60">
            <header className="space-y-2 border-b border-foreground/[0.07] px-5 py-4">
                <p className="text-sm leading-relaxed">{request.prompt}</p>
                <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5">
                        <SizeIcon className="size-3" />
                        {copy.sizes[request.size].dimensions}
                    </span>
                    <span>{modelLabel}</span>
                </p>
            </header>
            {pending ? (
                <div className="flex items-center gap-3 px-5 py-6">
                    <Loader2 className="size-4 animate-spin text-brand-bright" />
                    <div>
                        <p className="text-sm font-medium">{copy.history.pending}</p>
                        <p className="text-xs text-muted-foreground">{copy.history.pendingHint}</p>
                    </div>
                </div>
            ) : outcome?.error ? (
                <div className="p-5">
                    <Alert tone={StatusTone.Danger} icon={AlertTriangle}>
                        <p className="font-medium">{copy.history.failed}</p>
                        <p className="text-xs text-muted-foreground">{outcome.error}</p>
                    </Alert>
                </div>
            ) : outcome?.image ? (
                <div className="space-y-4 p-5">
                    <Image
                        src={outcome.image.url}
                        alt={outcome.image.prompt}
                        unoptimized
                        {...dimensions(outcome.image.size)}
                        className="h-auto w-full rounded-2xl border border-foreground/10"
                    />
                    <Button asChild variant="glass" size="sm" className="rounded-full">
                        <a href={outcome.image.url} download={copy.history.downloadName} target="_blank" rel="noopener noreferrer">
                            <Download />
                            {copy.history.download}
                        </a>
                    </Button>
                </div>
            ) : null}
        </article>
    );
}

export default function GenerateImagePage() {
    const [requests, setRequests] = useState<ImageRequest[]>([]);
    const [outcomes, setOutcomes] = useState<Record<number, Outcome>>({});

    const savedModel = useQuery({
        ...configQuery,
        select: (rows) => {
            const value = rows.find((row) => row.key === IMAGE_MODEL_CONFIG_KEY)?.value;
            return isImageModel(value) ? value : DEFAULT_IMAGE_MODEL;
        },
    });

    const form = useForm<Values>({
        resolver: zodResolver(schema),
        defaultValues: { prompt: "", size: DEFAULT_IMAGE_SIZE },
    });

    const generate = useAdminMutation({
        mutationFn: (request: ImageRequest) =>
            adminFetch<GeneratedImage>("/api/admin/generate-image", {
                method: "POST",
                json: { prompt: request.prompt, size: request.size, model: request.model },
            }),
        silentError: true,
    });

    function onSubmit(values: Values) {
        const request: ImageRequest = {
            id: requests.length + 1,
            prompt: values.prompt,
            size: values.size,
            model: values.model ?? savedModel.data ?? DEFAULT_IMAGE_MODEL,
        };
        setRequests((prev) => [request, ...prev]);
        form.reset({ ...values, prompt: "" });
        generate.mutate(request, {
            onSuccess: (image) =>
                setOutcomes((prev) => ({
                    ...prev,
                    [request.id]: {
                        image: { ...image, prompt: image.prompt || request.prompt, size: request.size, model: image.model || request.model },
                    },
                })),
            onError: (error) => setOutcomes((prev) => ({ ...prev, [request.id]: { error: errorMessage(error) } })),
            onSettled: () => form.setFocus("prompt"),
        });
    }

    const submit = form.handleSubmit(onSubmit);

    return (
        <AdminPage eyebrow={copy.eyebrow} title={copy.title} description={copy.description}>
            <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,26rem)_minmax(0,1fr)]">
                <AdminPanel className="lg:sticky lg:top-6">
                    <Form {...form}>
                        <form onSubmit={submit} className="space-y-5">
                            <FormField
                                control={form.control}
                                name="prompt"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{copy.form.prompt}</FormLabel>
                                        <FormControl>
                                            <Textarea
                                                {...field}
                                                rows={5}
                                                placeholder={copy.form.placeholder}
                                                className="resize-y"
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
                                                        e.preventDefault();
                                                        submit();
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="size"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{copy.form.size}</FormLabel>
                                        <Tabs value={field.value} onValueChange={(value) => field.onChange(value as ImageSize)}>
                                            <TabsList className="flex w-full">
                                                {IMAGE_SIZES.map((size) => {
                                                    const Icon = SIZE_ICON[size];
                                                    return (
                                                        <TabsTrigger key={size} value={size} className="flex-1" title={copy.sizes[size].dimensions}>
                                                            <Icon />
                                                            {copy.sizes[size].label}
                                                        </TabsTrigger>
                                                    );
                                                })}
                                            </TabsList>
                                        </Tabs>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="model"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>{copy.form.model}</FormLabel>
                                        <Select
                                            value={field.value ?? savedModel.data ?? DEFAULT_IMAGE_MODEL}
                                            onValueChange={(value) => field.onChange(value as ImageModel)}
                                        >
                                            <FormControl>
                                                <SelectTrigger className="rounded-full">
                                                    <SelectValue />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {IMAGE_MODELS.map((model) => (
                                                    <SelectItem key={model.value} value={model.value}>
                                                        {model.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </FormItem>
                                )}
                            />
                            <div className="flex items-center justify-between gap-3 pt-1">
                                <p className="hidden font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground sm:block">
                                    {copy.form.shortcut}
                                </p>
                                <Button type="submit" size="sm" className="ml-auto rounded-full" disabled={generate.isPending}>
                                    {generate.isPending ? <Loader2 className="animate-spin" /> : <Sparkles />}
                                    {generate.isPending ? copy.form.submitting : copy.form.submit}
                                </Button>
                            </div>
                        </form>
                    </Form>
                </AdminPanel>

                {requests.length === 0 ? (
                    <AdminPanel>
                        <EmptyState
                            icon={Sparkles}
                            title={copy.empty.title}
                            description={copy.empty.description}
                            className="pb-8"
                        />
                        <div className="space-y-3">
                            <p className="font-mono text-[0.68rem] uppercase tracking-[0.08em] text-muted-foreground">{copy.empty.suggestions}</p>
                            <div className="grid gap-2 sm:grid-cols-2">
                                {copy.suggestions.map((suggestion) => (
                                    <button
                                        key={suggestion}
                                        type="button"
                                        onClick={() => {
                                            form.setValue("prompt", suggestion, { shouldValidate: true });
                                            form.setFocus("prompt");
                                        }}
                                        className="rounded-2xl border border-dashed border-foreground/15 px-4 py-3 text-left text-sm leading-relaxed text-muted-foreground transition-colors hover:border-brand/40 hover:bg-foreground/[0.03] hover:text-foreground"
                                    >
                                        {suggestion}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </AdminPanel>
                ) : (
                    <section className="space-y-4" aria-label={copy.history.title}>
                        {requests.map((request) => (
                            <RequestCard
                                key={request.id}
                                request={request}
                                outcome={outcomes[request.id]}
                                pending={generate.isPending && generate.variables?.id === request.id}
                            />
                        ))}
                    </section>
                )}
            </div>
        </AdminPage>
    );
}
