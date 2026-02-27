"use client";

import { useState, useRef, FormEvent } from "react";
import {
    ImageIcon,
    Loader2,
    Download,
    RefreshCw,
    Send,
    AlertTriangle,
} from "lucide-react";

export default function GenerateImagePage() {
    const [prompt, setPrompt] = useState("");
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [usedPrompt, setUsedPrompt] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if (!prompt.trim()) return;

        setLoading(true);
        setError(null);
        setImageUrl(null);
        setUsedPrompt(null);

        try {
            const res = await fetch("/api/admin/generate-image", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ prompt: prompt.trim() }),
            });

            const data = await res.json();

            if (!res.ok || data.status !== "success") {
                setError(data.message || "Image generation failed.");
                return;
            }

            setImageUrl(data.url);
            setUsedPrompt(data.prompt || prompt.trim());
        } catch {
            setError("Request failed. Check the server logs.");
        } finally {
            setLoading(false);
        }
    }

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
            e.preventDefault();
            handleSubmit(e as unknown as FormEvent);
        }
    }

    return (
        <div className="flex flex-col h-full min-h-[calc(100vh-8rem)] space-y-0">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">Generate Image</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Use DALL·E to generate images from a text prompt
                </p>
            </div>

            {/* Image canvas */}
            <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden flex flex-col">
                {/* Result area */}
                <div className="flex-1 flex items-center justify-center p-6 min-h-64">
                    {loading ? (
                        <div className="text-center space-y-3">
                            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                            </div>
                            <p className="text-sm text-muted-foreground">
                                Generating image…
                            </p>
                            <p className="text-xs text-muted-foreground/60">
                                This usually takes 10–20 seconds
                            </p>
                        </div>
                    ) : error ? (
                        <div className="max-w-md w-full rounded-lg bg-destructive/10 border border-destructive/20 px-5 py-4 flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-destructive">
                                    Generation failed
                                </p>
                                <p className="text-xs text-muted-foreground">{error}</p>
                            </div>
                        </div>
                    ) : imageUrl ? (
                        <div className="space-y-3 w-full max-w-3xl">
                            {/* Image */}
                            <div className="rounded-lg overflow-hidden border border-border shadow-lg">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={imageUrl}
                                    alt={usedPrompt || "Generated image"}
                                    className="w-full h-auto object-contain"
                                />
                            </div>
                            {/* Actions */}
                            <div className="flex items-center gap-2 flex-wrap">
                                <a
                                    href={imageUrl}
                                    download="generated-image.png"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors"
                                >
                                    <Download className="w-3.5 h-3.5" />
                                    Download
                                </a>
                                <button
                                    onClick={() => {
                                        setImageUrl(null);
                                        setUsedPrompt(null);
                                        textareaRef.current?.focus();
                                    }}
                                    className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border text-xs font-medium text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" />
                                    New image
                                </button>
                            </div>
                            {usedPrompt && (
                                <p className="text-xs text-muted-foreground/70 italic truncate">
                                    &ldquo;{usedPrompt}&rdquo;
                                </p>
                            )}
                        </div>
                    ) : (
                        <div className="text-center space-y-3 text-muted-foreground">
                            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                                <ImageIcon className="w-8 h-8 opacity-40" />
                            </div>
                            <p className="text-sm">
                                Enter a prompt below to generate an image
                            </p>
                            <p className="text-xs opacity-60">
                                Generated at 1792×1024 via DALL·E 3
                            </p>
                        </div>
                    )}
                </div>

                {/* Input bar */}
                <div className="border-t border-border p-4 bg-card/80">
                    <form onSubmit={handleSubmit} className="flex gap-3 items-end">
                        <div className="flex-1 relative">
                            <textarea
                                ref={textareaRef}
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Describe the image you want to generate…"
                                rows={2}
                                disabled={loading}
                                className="w-full rounded-lg border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent disabled:opacity-50 transition-colors"
                            />
                            <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground/50 pointer-events-none">
                                ⌘↵ to send
                            </span>
                        </div>
                        <button
                            type="submit"
                            disabled={loading || !prompt.trim()}
                            className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            title="Generate (⌘Enter)"
                        >
                            {loading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Send className="w-4 h-4" />
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
