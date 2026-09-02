"use client";

import { useCallback, useMemo, useRef, useState, type DragEvent } from "react";
import { UploadCloud, FolderUp, FileUp, Rocket, Loader2, X, AlertTriangle, FileCode2, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import type { MockupProjectDetail } from "@/types/admin";
import {
    detectEntry,
    formatBytes,
    stagedFromDataTransfer,
    stagedFromFileList,
    stripCommonRoot,
    uploadDeployment,
    type StagedFile,
} from "@/lib/mockups-client";

interface MockupUploaderProps {
    projectId: number;
    /** Called with the refreshed project after a successful deploy. */
    onDeployed: (project: MockupProjectDetail, message: string) => void;
}

/**
 * Drop zone + staging list + "Deploy" button. Accepts loose files, a whole
 * folder (drag-and-drop or the folder picker) or a .zip; the server unpacks
 * zips and strips a wrapper folder, so the staging list mirrors that here.
 */
export function MockupUploader({ projectId, onDeployed }: MockupUploaderProps) {
    const [staged, setStaged] = useState<StagedFile[]>([]);
    const [dragging, setDragging] = useState(false);
    const [note, setNote] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);

    const filesInputRef = useRef<HTMLInputElement>(null);
    const folderInputRef = useRef<HTMLInputElement>(null);

    const displayPaths = useMemo(() => stripCommonRoot(staged.map((s) => s.path)), [staged]);
    const entry = useMemo(() => detectEntry(displayPaths), [displayPaths]);
    const hasZip = useMemo(() => staged.some((s) => /\.zip$/i.test(s.path)), [staged]);
    const totalBytes = useMemo(() => staged.reduce((sum, s) => sum + s.file.size, 0), [staged]);
    const canDeploy = staged.length > 0 && (entry !== null || hasZip) && !uploading;

    const addFiles = useCallback((incoming: StagedFile[]) => {
        if (incoming.length === 0) return;
        setError(null);
        setStaged((prev) => {
            const byPath = new Map(prev.map((s) => [s.path, s]));
            for (const s of incoming) byPath.set(s.path, s); // same path → replace
            return [...byPath.values()].sort((a, b) => a.path.localeCompare(b.path));
        });
    }, []);

    const removeAt = (index: number) => setStaged((prev) => prev.filter((_, i) => i !== index));

    async function handleDrop(e: DragEvent<HTMLDivElement>) {
        e.preventDefault();
        setDragging(false);
        if (uploading) return;
        try {
            addFiles(await stagedFromDataTransfer(e.dataTransfer));
        } catch {
            toast.error("Could not read the dropped files.");
        }
    }

    async function handleDeploy() {
        if (!canDeploy) return;
        setUploading(true);
        setProgress(0);
        setError(null);
        try {
            const result = await uploadDeployment(projectId, staged, note, setProgress);
            if (result.ok && result.data) {
                toast.success(result.message);
                onDeployed(result.data, result.message);
                setStaged([]);
                setNote("");
            } else {
                setError(result.message);
                toast.error(result.message);
            }
        } finally {
            setUploading(false);
        }
    }

    return (
        <div className="rounded-xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Rocket className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <p className="font-medium text-sm">Deploy a new version</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Upload the mockup files — it goes live on the project link right away.
                    </p>
                </div>
            </div>

            {/* Drop zone */}
            <div
                onDragOver={(e) => {
                    e.preventDefault();
                    if (!uploading) setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={handleDrop}
                className={`rounded-lg border-2 border-dashed px-4 py-8 text-center transition-colors ${dragging
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-muted-foreground/40"
                    } ${uploading ? "opacity-60 pointer-events-none" : ""}`}
            >
                <UploadCloud className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm font-medium">Drag &amp; drop your mockup here</p>
                <p className="text-xs text-muted-foreground mt-1">
                    A folder, loose HTML / CSS / JS / images, or a .zip
                </p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                    <Button type="button" variant="outline" size="sm" onClick={() => filesInputRef.current?.click()}>
                        <FileUp className="w-4 h-4" />
                        Choose files
                    </Button>
                    <Button type="button" variant="outline" size="sm" onClick={() => folderInputRef.current?.click()}>
                        <FolderUp className="w-4 h-4" />
                        Choose folder
                    </Button>
                </div>
                <input
                    ref={filesInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                        if (e.target.files) addFiles(stagedFromFileList(e.target.files));
                        e.target.value = "";
                    }}
                />
                <input
                    ref={folderInputRef}
                    type="file"
                    multiple
                    className="hidden"
                    // Non-standard attributes React doesn't type; every desktop browser honours them.
                    {...({ webkitdirectory: "", directory: "" } as Record<string, string>)}
                    onChange={(e) => {
                        if (e.target.files) addFiles(stagedFromFileList(e.target.files));
                        e.target.value = "";
                    }}
                />
            </div>

            {/* Staged files */}
            {staged.length > 0 && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>
                            {staged.length} file{staged.length === 1 ? "" : "s"} · {formatBytes(totalBytes)}
                            {entry && (
                                <>
                                    {" "}· entry <span className="font-mono text-foreground">{entry}</span>
                                </>
                            )}
                        </span>
                        <button
                            type="button"
                            onClick={() => setStaged([])}
                            disabled={uploading}
                            className="inline-flex items-center gap-1 hover:text-destructive transition-colors"
                        >
                            <Trash2 className="w-3 h-3" />
                            Clear
                        </button>
                    </div>

                    <ul className="max-h-48 overflow-y-auto rounded-lg border border-border divide-y divide-border text-xs">
                        {staged.map((s, i) => (
                            <li key={s.path} className="flex items-center gap-2 px-3 py-1.5">
                                <FileCode2 className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                                <span className="font-mono truncate flex-1" title={s.path}>
                                    {displayPaths[i]}
                                </span>
                                <span className="text-muted-foreground flex-shrink-0">{formatBytes(s.file.size)}</span>
                                <button
                                    type="button"
                                    onClick={() => removeAt(i)}
                                    disabled={uploading}
                                    className="text-muted-foreground hover:text-destructive transition-colors p-0.5"
                                    title="Remove"
                                >
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </li>
                        ))}
                    </ul>

                    {!entry && !hasZip && (
                        <p className="flex items-start gap-2 rounded-lg bg-amber-500/10 border border-amber-500/20 px-3 py-2 text-xs text-amber-500">
                            <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            No HTML file at the top level. Add an <span className="font-mono">index.html</span> (or the
                            folder that contains it) so there is something to show at &ldquo;/&rdquo;.
                        </p>
                    )}
                </div>
            )}

            {/* Note + deploy */}
            <div className="flex flex-col sm:flex-row gap-2">
                <Input
                    type="text"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="What changed? (optional)"
                    maxLength={200}
                    disabled={uploading}
                    className="h-9 text-sm"
                />
                <Button type="button" size="sm" onClick={handleDeploy} disabled={!canDeploy} className="h-9 sm:w-40">
                    {uploading ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            {progress < 100 ? `Uploading ${progress}%` : "Processing…"}
                        </>
                    ) : (
                        <>
                            <Rocket className="w-4 h-4" />
                            Deploy
                        </>
                    )}
                </Button>
            </div>

            {uploading && (
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-primary transition-all" style={{ width: `${progress}%` }} />
                </div>
            )}

            {error && (
                <p className="flex items-start gap-2 rounded-lg bg-destructive/10 border border-destructive/20 px-3 py-2 text-xs text-destructive">
                    <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                    {error}
                </p>
            )}
        </div>
    );
}
