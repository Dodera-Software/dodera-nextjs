"use client";

import { useState, useRef, useEffect, FormEvent } from "react";
import {
    ImageIcon,
    Loader2,
    Download,
    Send,
    AlertTriangle,
} from "lucide-react";
import { IMAGE_SIZES, type ImageSize } from "@/lib/image-sizes";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface HistoryItem {
    id: number;
    prompt: string;
    size: string;
    url?: string;
    error?: string;
    loading: boolean;
}

let nextId = 1;

export default function GenerateImagePage() {
    const [prompt, setPrompt] = useState("");
    const [size, setSize] = useState<ImageSize>("1792x1024");
    const [history, setHistory] = useState<HistoryItem[]>([]);
    const [submitting, setSubmitting] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const bottomRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom whenever history changes
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [history]);

    async function handleSubmit(e?: FormEvent) {
        e?.preventDefault();
        if (!prompt.trim() || submitting) return;

        const id = nextId++;
        const userPrompt = prompt.trim();
        const userSize = size;

        // Add loading entry
        setHistory((prev) => [
            ...prev,
            { id, prompt: userPrompt, size: userSize, loading: true },
        ]);
        setPrompt("");
        setSubmitting(true);

        try {
            const res = await fetch("/api/admin/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: userPrompt, size: userSize }),
            });

            const data = await res.json();

            if (!res.ok || data.status !== "success") {
                setHistory((prev) =>
                    prev.map((item) =>
                        item.id === id
                            ? { ...item, loading: false, error: data.message || "Generation failed." }
                            : item,
                    ),
                );
                return;
            }

            setHistory((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, loading: false, url: data.url, prompt: data.prompt || userPrompt, size: data.size || userSize }
                        : item,
                ),
            );
        } catch {
            setHistory((prev) =>
                prev.map((item) =>
                    item.id === id
                        ? { ...item, loading: false, error: "Request failed. Check the server logs." }
                        : item,
                ),
            );
        } finally {
            setSubmitting(false);
            textareaRef.current?.focus();
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit();
        }
    }

    const selectedSizeLabel = IMAGE_SIZES.find((s) => s.value === size);

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-8rem)]">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Generate Image</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Use DALL·E to generate images from a text prompt
                </p>
            </div>

            {/* Main card */}
            <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden flex flex-col min-h-0">
                {/* Scrollable history */}
                <div className="flex-1 overflow-y-auto p-4 space-y-6 min-h-0">
                    {history.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full min-h-48 text-center text-muted-foreground space-y-3">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
                                <ImageIcon className="w-8 h-8 opacity-40" />
                            </div>
                            <p className="text-sm">Enter a prompt below to generate an image</p>
                            <p className="text-xs opacity-60">
                                {selectedSizeLabel?.label} — {selectedSizeLabel?.note} · DALL·E 3
                            </p>
                        </div>
                    ) : (
                        history.map((item) => (
                            <div key={item.id} className="space-y-2 max-w-3xl mx-auto w-full">
                                {/* Prompt bubble */}
                                <div className="flex justify-end">
                                    <div className="max-w-xl rounded-2xl rounded-tr-sm bg-primary/10 px-4 py-2.5 text-sm text-foreground">
                                        <p>{item.prompt}</p>
                                        <p className="text-[10px] text-muted-foreground mt-1 font-mono">{item.size}</p>
                                    </div>
                                </div>

                                {/* Response */}
                                <div className="flex justify-start">
                                    {item.loading ? (
                                        <div className="rounded-2xl rounded-tl-sm border border-border bg-muted/40 px-5 py-4 flex items-center gap-3">
                                            <Loader2 className="w-5 h-5 animate-spin text-primary flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Generating…</p>
                                                <p className="text-xs text-muted-foreground/60">Usually 10–20 seconds</p>
                                            </div>
                                        </div>
                                    ) : item.error ? (
                                        <div className="rounded-2xl rounded-tl-sm bg-destructive/10 border border-destructive/20 px-4 py-3 flex items-start gap-2.5 max-w-md">
                                            <AlertTriangle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
                                            <div>
                                                <p className="text-sm font-medium text-destructive">Generation failed</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{item.error}</p>
                                            </div>
                                        </div>
                                    ) : item.url ? (
                                        <div className="space-y-2 w-full max-w-xl">
                                            <div className="rounded-2xl rounded-tl-sm overflow-hidden border border-border shadow-md">
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img
                                                    src={item.url}
                                                    alt={item.prompt}
                                                    className="w-full h-auto object-contain"
                                                />
                                            </div>
                                            <Button asChild size="sm" variant="outline">
                                                <a
                                                    href={item.url}
                                                    download="generated-image.png"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                >
                                                    <Download className="w-3.5 h-3.5" />
                                                    Download
                                                </a>
                                            </Button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>

                {/* Input bar — single inline row */}
                <div className="border-t border-border p-4 bg-muted/30">
                    <form onSubmit={handleSubmit} className="flex items-start gap-2">
                        <Textarea
                            ref={textareaRef}
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Describe the image you want to generate… (⌘↵ to send)"
                            rows={2}
                            disabled={submitting}
                            className="flex-1 resize-none min-h-0"
                        />
                        <Select
                            value={size}
                            onValueChange={(v) => setSize(v as ImageSize)}
                            disabled={submitting}
                        >
                            <SelectTrigger className="w-44 flex-shrink-0">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {IMAGE_SIZES.map((s) => (
                                    <SelectItem key={s.value} value={s.value}>
                                        {s.label} — {s.note}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Button
                            type="submit"
                            size="icon"
                            className="flex-shrink-0 w-10 h-10"
                            disabled={submitting || !prompt.trim()}
                            title="Generate (⌘↵)"
                        >
                            {submitting ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
