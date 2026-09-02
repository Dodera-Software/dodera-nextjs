"use client";

import { useState } from "react";
import { Monitor, Tablet, Smartphone, RefreshCw, ExternalLink, MonitorSmartphone } from "lucide-react";
import { Button } from "@/components/ui/button";

type Device = "desktop" | "tablet" | "mobile";

const DEVICES: { key: Device; label: string; width: string; icon: typeof Monitor }[] = [
    { key: "desktop", label: "Desktop", width: "100%", icon: Monitor },
    { key: "tablet", label: "Tablet", width: "820px", icon: Tablet },
    { key: "mobile", label: "Mobile", width: "390px", icon: Smartphone },
];

interface MockupPreviewProps {
    /** Live URL of the project, or null when nothing can be shown. */
    url: string | null;
    /** Changes whenever the live version changes → the iframe reloads. */
    versionKey: string | number;
    /** Why there is nothing to show (used for the empty state). */
    emptyReason?: string;
}

/**
 * Embeds the live mockup in an iframe with desktop / tablet / mobile widths.
 * The mockup host allows framing from the admin origin via CSP frame-ancestors.
 */
export function MockupPreview({ url, versionKey, emptyReason }: MockupPreviewProps) {
    const [device, setDevice] = useState<Device>("desktop");
    const [nonce, setNonce] = useState(0);

    const active = DEVICES.find((d) => d.key === device)!;

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-sky-400/10 flex items-center justify-center flex-shrink-0">
                        <MonitorSmartphone className="w-4 h-4 text-sky-400" />
                    </div>
                    <div>
                        <p className="font-medium text-sm">Preview</p>
                        <p className="text-xs text-muted-foreground mt-0.5">What the client sees at the link</p>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    <div className="flex items-center rounded-lg border border-border p-0.5 mr-1">
                        {DEVICES.map((d) => (
                            <button
                                key={d.key}
                                type="button"
                                onClick={() => setDevice(d.key)}
                                title={d.label}
                                className={`h-7 w-8 inline-flex items-center justify-center rounded-md transition-colors ${device === d.key
                                    ? "bg-primary/10 text-primary"
                                    : "text-muted-foreground hover:text-foreground"
                                    }`}
                            >
                                <d.icon className="w-3.5 h-3.5" />
                            </button>
                        ))}
                    </div>
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        title="Reload preview"
                        disabled={!url}
                        onClick={() => setNonce((n) => n + 1)}
                    >
                        <RefreshCw className="w-4 h-4" />
                    </Button>
                    <Button type="button" variant="ghost" size="icon" className="h-8 w-8" title="Open in new tab" disabled={!url} asChild={!!url}>
                        {url ? (
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                            </a>
                        ) : (
                            <ExternalLink className="w-4 h-4" />
                        )}
                    </Button>
                </div>
            </div>

            <div className="rounded-lg border border-border bg-muted/30 p-3 overflow-x-auto">
                {url ? (
                    <div className="mx-auto transition-[width] duration-200" style={{ width: active.width, maxWidth: "100%" }}>
                        <iframe
                            key={`${versionKey}-${nonce}`}
                            src={url}
                            title="Mockup preview"
                            referrerPolicy="no-referrer"
                            className="block w-full h-[640px] rounded-md border border-border bg-white shadow-sm"
                        />
                    </div>
                ) : (
                    <div className="h-[320px] flex flex-col items-center justify-center text-center text-muted-foreground">
                        <MonitorSmartphone className="w-8 h-8 mb-2 opacity-50" />
                        <p className="text-sm">{emptyReason ?? "Nothing to preview yet."}</p>
                    </div>
                )}
            </div>
        </div>
    );
}
