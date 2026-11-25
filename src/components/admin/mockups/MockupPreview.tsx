"use client";

import { useState } from "react";
import { ExternalLink, Monitor, MonitorSmartphone, RefreshCw, Smartphone, Tablet, type LucideIcon } from "lucide-react";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { EmptyState } from "@/components/admin/EmptyState";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PREVIEW_DEVICE_WIDTHS, PreviewDevice } from "@/config/admin-mockups";
import { mockupsCopy } from "@/i18n/admin/mockups";

const copy = mockupsCopy.preview;

const DEVICE_ICONS: Record<PreviewDevice, LucideIcon> = {
    [PreviewDevice.Desktop]: Monitor,
    [PreviewDevice.Tablet]: Tablet,
    [PreviewDevice.Mobile]: Smartphone,
};

interface MockupPreviewProps {
    url: string | null;
    versionKey: string | number;
    emptyReason?: string;
}

export function MockupPreview({ url, versionKey, emptyReason }: MockupPreviewProps) {
    const [device, setDevice] = useState(PreviewDevice.Desktop);
    const [nonce, setNonce] = useState(0);

    return (
        <AdminPanel
            title={copy.title}
            description={copy.description}
            flush
            actions={
                <>
                    <Tabs value={device} onValueChange={(value) => setDevice(value as PreviewDevice)}>
                        <TabsList className="h-9">
                            {Object.values(PreviewDevice).map((d) => {
                                const Icon = DEVICE_ICONS[d];
                                return (
                                    <TabsTrigger key={d} value={d} className="h-7 px-2.5" aria-label={copy.devices[d]} title={copy.devices[d]}>
                                        <Icon className="!size-3.5" />
                                    </TabsTrigger>
                                );
                            })}
                        </TabsList>
                    </Tabs>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-8 rounded-full"
                        aria-label={copy.reload}
                        title={copy.reload}
                        disabled={!url}
                        onClick={() => setNonce((n) => n + 1)}
                    >
                        <RefreshCw />
                    </Button>
                    {url && (
                        <Button variant="ghost" size="icon" className="size-8 rounded-full" aria-label={copy.open} title={copy.open} asChild>
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink />
                            </a>
                        </Button>
                    )}
                </>
            }
        >
            <div className="overflow-x-auto bg-foreground/[0.02] p-3 sm:p-4">
                {url ? (
                    <div className="mx-auto max-w-full transition-[width] duration-200" style={{ width: PREVIEW_DEVICE_WIDTHS[device] }}>
                        <iframe
                            key={`${versionKey}-${nonce}`}
                            src={url}
                            title={copy.frameTitle}
                            referrerPolicy="no-referrer"
                            className="block h-[min(640px,75vh)] w-full rounded-2xl border border-foreground/10 bg-white"
                        />
                    </div>
                ) : (
                    <EmptyState icon={MonitorSmartphone} title={emptyReason ?? copy.empty} className="min-h-[320px]" />
                )}
            </div>
        </AdminPanel>
    );
}
