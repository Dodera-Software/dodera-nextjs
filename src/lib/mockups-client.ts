/**
 * Browser-side helpers for the Mockups admin pages (no server imports).
 */
import { useEffect, useState } from "react";
import type { MockupProjectDetail } from "@/types/admin";

export interface StagedFile {
    /** Relative path inside the mockup, forward slashes ("css/style.css"). */
    path: string;
    file: File;
}

export function formatBytes(bytes: number): string {
    const mb = 1024 * 1024;
    if (bytes >= mb) return `${(bytes / mb).toFixed(bytes >= 10 * mb ? 0 : 1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
}

const JUNK = new Set(["__MACOSX", "node_modules", "Thumbs.db", "desktop.ini"]);

function cleanPath(raw: string): string | null {
    const segments = raw.replace(/\\/g, "/").split("/").filter((s) => s !== "" && s !== ".");
    if (segments.length === 0) return null;
    if (segments.some((s) => s === ".." || s.startsWith(".") || JUNK.has(s))) return null;
    return segments.join("/");
}

/** Files from an <input type="file"> — folder pickers provide webkitRelativePath. */
export function stagedFromFileList(list: FileList | File[]): StagedFile[] {
    const out: StagedFile[] = [];
    for (const file of Array.from(list)) {
        const rel = (file as File & { webkitRelativePath?: string }).webkitRelativePath;
        const path = cleanPath(rel || file.name);
        if (path) out.push({ path, file });
    }
    return out;
}

async function walkEntry(entry: FileSystemEntry, prefix: string, out: StagedFile[]): Promise<void> {
    if (entry.isFile) {
        const file = await new Promise<File>((resolve, reject) =>
            (entry as FileSystemFileEntry).file(resolve, reject),
        );
        const path = cleanPath(prefix + entry.name);
        if (path) out.push({ path, file });
        return;
    }
    if (entry.isDirectory) {
        if (cleanPath(entry.name) === null) return; // skip .git, __MACOSX, …
        const reader = (entry as FileSystemDirectoryEntry).createReader();
        const children: FileSystemEntry[] = [];
        // readEntries returns results in batches; keep going until an empty batch.
        for (;;) {
            const batch = await new Promise<FileSystemEntry[]>((resolve, reject) =>
                reader.readEntries(resolve, reject),
            );
            if (batch.length === 0) break;
            children.push(...batch);
        }
        for (const child of children) {
            await walkEntry(child, `${prefix}${entry.name}/`, out);
        }
    }
}

/** Files from a drag-and-drop, descending into dropped folders. */
export async function stagedFromDataTransfer(dt: DataTransfer): Promise<StagedFile[]> {
    const items = Array.from(dt.items ?? []);
    const entries = items
        .filter((i) => i.kind === "file")
        .map((i) => (typeof i.webkitGetAsEntry === "function" ? i.webkitGetAsEntry() : null));

    if (entries.length === 0 || entries.every((e) => e === null)) {
        return stagedFromFileList(dt.files);
    }

    const out: StagedFile[] = [];
    for (const entry of entries) {
        if (entry) await walkEntry(entry, "", out);
    }
    return out;
}

/** Mirror of the server's wrapper-folder stripping, so the staging list matches what gets deployed. */
export function stripCommonRoot(paths: string[]): string[] {
    let current = paths;
    while (current.length > 0) {
        const first = current[0].split("/")[0];
        const allShare = current.every((p) => {
            const segs = p.split("/");
            return segs.length >= 2 && segs[0] === first;
        });
        if (!allShare) break;
        current = current.map((p) => p.slice(first.length + 1));
    }
    return current;
}

/** Which file will be served at "/" — index.html, or the first top-level .html. */
export function detectEntry(paths: string[]): string | null {
    if (paths.includes("index.html")) return "index.html";
    if (paths.includes("index.htm")) return "index.htm";
    const rootHtml = paths.filter((p) => !p.includes("/") && /\.html?$/i.test(p)).sort();
    return rootHtml[0] ?? null;
}

export interface UploadResult {
    ok: boolean;
    status: number;
    message: string;
    data?: MockupProjectDetail;
}

/** Upload staged files as a new deployment, reporting upload progress (0–100). */
export function uploadDeployment(
    projectId: number,
    staged: StagedFile[],
    note: string,
    onProgress: (percent: number) => void,
    sendToIntelilang = false,
): Promise<UploadResult> {
    const form = new FormData();
    for (const s of staged) form.append("files", s.file, s.file.name);
    form.append("paths", JSON.stringify(staged.map((s) => s.path)));
    if (note.trim()) form.append("note", note.trim());
    if (sendToIntelilang) form.append("intelilang", "true");

    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", `/api/admin/mockups/${projectId}/deployments`);
        xhr.upload.onprogress = (e) => {
            if (e.lengthComputable) onProgress(Math.round((e.loaded / e.total) * 100));
        };
        xhr.onload = () => {
            let body: { status?: string; message?: string; data?: MockupProjectDetail } = {};
            try {
                body = JSON.parse(xhr.responseText);
            } catch {
                /* non-JSON error page */
            }
            const ok = xhr.status >= 200 && xhr.status < 300 && body.status === "success";
            resolve({
                ok,
                status: xhr.status,
                message: body.message ?? (ok ? "Deployed." : `Upload failed (HTTP ${xhr.status}).`),
                data: body.data,
            });
        };
        xhr.onerror = () => resolve({ ok: false, status: 0, message: "Network error — the upload did not complete." });
        xhr.send(form);
    });
}

/** Whether InteliLang is set up in Settings, so deployments can be sent to it. False until known. */
export function useIntelilangConnected(): boolean {
    const [connected, setConnected] = useState(false);
    useEffect(() => {
        let cancelled = false;
        fetch("/api/admin/intelilang")
            .then((res) => res.json())
            .then((body) => {
                if (!cancelled) setConnected(body?.status === "success" && Boolean(body.data?.configured));
            })
            .catch(() => {});
        return () => { cancelled = true; };
    }, []);
    return connected;
}
