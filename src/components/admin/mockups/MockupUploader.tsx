"use client";

import { useMemo, useRef, useState, type DragEvent } from "react";
import { AlertTriangle, FileCode2, FileUp, FolderUp, Loader2, Rocket, Trash2, UploadCloud, X } from "lucide-react";
import { toast } from "sonner";
import { AdminPanel } from "@/components/admin/AdminPanel";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { AdminQueryKey } from "@/config/admin";
import { MOCKUP_FIELD_LIMITS } from "@/config/admin-mockups";
import { StatusTone } from "@/config/ui";
import { useAdminMutation } from "@/hooks/use-admin";
import { mockupsCopy } from "@/i18n/admin/mockups";
import { errorMessage } from "@/lib/admin-api";
import {
    detectEntry,
    formatBytes,
    stagedFromDataTransfer,
    stagedFromFileList,
    stripCommonRoot,
    uploadDeployment,
    type StagedFile,
} from "@/lib/mockups-client";
import { cn } from "@/lib/utils";
import type { MockupProjectDetail } from "@/types/admin";

const copy = mockupsCopy.uploader;
const FOLDER_PICKER = { webkitdirectory: "", directory: "" } as Record<string, string>;

interface MockupUploaderProps {
    projectId: number;
    intelilangConnected: boolean;
    onDeployed?: (project: MockupProjectDetail, message: string) => void;
}

export function MockupUploader({ projectId, intelilangConnected, onDeployed }: MockupUploaderProps) {
    const [staged, setStaged] = useState<StagedFile[]>([]);
    const [sendToIntelilang, setSendToIntelilang] = useState(true);
    const [dragging, setDragging] = useState(false);
    const [note, setNote] = useState("");
    const [progress, setProgress] = useState(0);

    const filesInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const displayPaths = useMemo(() => stripCommonRoot(staged.map((s) => s.path)), [staged]);
    const entry = useMemo(() => detectEntry(displayPaths), [displayPaths]);
    const hasZip = useMemo(() => staged.some((s) => /\.zip$/i.test(s.path)), [staged]);
    const totalBytes = useMemo(() => staged.reduce((sum, s) => sum + s.file.size, 0), [staged]);

    const deploy = useAdminMutation({
        mutationFn: () =>
            uploadDeployment({
                projectId,
                staged,
                note,
                sendToIntelilang: intelilangConnected && sendToIntelilang,
                onProgress: setProgress,
            }),
        invalidates: [AdminQueryKey.Mockups, AdminQueryKey.Leads],
        onSuccess: (result) => {
            if (result.message.includes(copy.notSentMarker)) toast.warning(result.message);
            else toast.success(result.message);
            setStaged([]);
            setNote("");
            onDeployed?.(result.data, result.message);
        },
    });

    const uploading = deploy.isPending;
    const canDeploy = staged.length > 0 && (entry !== null || hasZip) && !uploading;

    function addFiles(incoming: StagedFile[]) {
        if (incoming.length === 0) return;
        deploy.reset();
        setStaged((prev) => {
            const byPath = new Map(prev.map((s) => [s.path, s]));
            for (const s of incoming) byPath.set(s.path, s);
            return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
        });
    }

    async function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);
        if (uploading) return;
        try {
            addFiles(await stagedFromDataTransfer(e.dataTransfer));
        } catch {
            toast.error(copy.readFailed);
        }
    }

    function startDeploy() {
        if (!canDeploy) return;
        setProgress(0);
        deploy.mutate();
    }

    function onPicked(list: FileList | null, input: HTMLInputElement) {
        if (list) addFiles(stagedFromFileList(list));
        input.value = "";
    }

    return (
        <AdminPanel title={copy.title} description={copy.description}>
            <div className="space-y-4">
                <div
                    onDragOver={(e) => {
                        e.preventDefault();
                        if (!uploading) setDragging(true);
                    }}
                    onDragLeave={() => setDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                        "rounded-2xl border border-dashed px-4 py-8 text-center transition-colors",
                        dragging ? "border-brand bg-brand/5" : "border-foreground/15 hover:border-foreground/30",
                        uploading && "pointer-events-none opacity-60",
                    )}
                >
                    <UploadCloud className="mx-auto mb-3 size-7 text-muted-foreground" strokeWidth={1.5} />
                    <p className="font-display text-sm font-semibold">{copy.drop}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{copy.dropHint}</p>
                    <div className="mt-4 flex flex-wrap justify-center gap-2">
                        <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={() => filesInputRef.current?.click()}>
                            <FileUp />
                            {copy.chooseFiles}
                        </Button>
                        <Button type="button" variant="glass" size="sm" className="rounded-full" onClick={() => folderInputRef.current?.click()}>
                            <FolderUp />
                            {copy.chooseFolder}
                        </Button>
                    </div>
                    <input ref={filesInputRef} type="file" multiple className="hidden" onChange={(e) => onPicked(e.target.files, e.target)} />
                    <input
                        ref={folderInputRef}
                        type="file"
                        multiple
                        className="hidden"
                        {...FOLDER_PICKER}
                        onChange={(e) => onPicked(e.target.files, e.target)}
                    />
                </div>

                {staged.length > 0 && (
                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span className="min-w-0 truncate tabular-nums">
                                {copy.summary(staged.length, formatBytes(totalBytes))}
                                {entry && (
                                    <>
                                        {" · "}
                                        {copy.entry} <span className="font-mono text-foreground">{entry}</span>
                                    </>
                                )}
                            </span>
                            <button
                                type="button"
                                onClick={() => setStaged([])}
                                disabled={uploading}
                                className="inline-flex shrink-0 items-center gap-1 transition-colors hover:text-red-400"
                            >
                                <Trash2 className="size-3" />
                                {copy.clear}
                            </button>
                        </div>

                        <ul className="max-h-48 divide-y divide-foreground/[0.07] overflow-y-auto rounded-2xl border border-foreground/10 text-xs">
                            {staged.map((s, i) => (
                                <li key={s.path} className="flex items-center gap-2 px-3 py-1.5">
                                    <FileCode2 className="size-3.5 shrink-0 text-muted-foreground" />
                                    <span className="min-w-0 flex-1 truncate font-mono" title={s.path}>
                                        {displayPaths[i]}
                                    </span>
                                    <span className="shrink-0 tabular-nums text-muted-foreground">{formatBytes(s.file.size)}</span>
                                    <button
                                        type="button"
                                        onClick={() => setStaged((prev) => prev.filter((_, idx) => idx !== i))}
                                        disabled={uploading}
                                        className="p-0.5 text-muted-foreground transition-colors hover:text-red-400"
                                        aria-label={copy.remove}
                                        title={copy.remove}
                                    >
                                        <X className="size-3.5" />
                                    </button>
                                </li>
                            ))}
                        </ul>

                        {!entry && !hasZip && (
                            <Alert tone={StatusTone.Warning} icon={AlertTriangle} className="text-xs">
                                {copy.noEntry}
                            </Alert>
                        )}
                    </div>
                )}

                <div className="flex flex-col gap-2 sm:flex-row">
                    <Input
                        type="text"
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        placeholder={copy.notePlaceholder}
                        maxLength={MOCKUP_FIELD_LIMITS.note}
                        disabled={uploading}
                        className="h-9 rounded-full px-4"
                    />
                    <Button type="button" size="sm" onClick={startDeploy} disabled={!canDeploy} className="rounded-full sm:w-44">
                        {uploading ? <Loader2 className="animate-spin" /> : <Rocket />}
                        {uploading ? (progress < 100 ? copy.uploading(progress) : copy.processing) : copy.deploy}
                    </Button>
                </div>

                {intelilangConnected && (
                    <label className="flex cursor-pointer select-none items-start gap-2.5 text-xs text-muted-foreground">
                        <Checkbox
                            checked={sendToIntelilang}
                            onCheckedChange={(checked) => setSendToIntelilang(checked === true)}
                            disabled={uploading}
                            className="mt-0.5"
                        />
                        <span>
                            <span className="font-medium text-foreground">{copy.sendToIntelilang}</span>
                            {" · "}
                            {copy.sendToIntelilangHint}
                        </span>
                    </label>
                )}

                {uploading && <Progress value={progress} />}

                {deploy.isError && (
                    <Alert tone={StatusTone.Danger} icon={AlertTriangle} className="text-xs">
                        {errorMessage(deploy.error)}
                    </Alert>
                )}
            </div>
        </AdminPanel>
    );
}
