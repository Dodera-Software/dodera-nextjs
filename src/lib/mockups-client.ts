import { queryOptions, useQuery } from "@tanstack/react-query";
import { AdminQueryKey } from "@/config/admin";
import { mockupsCopy } from "@/i18n/admin/mockups";
import { AdminApiError, adminFetch } from "@/lib/admin-api";
import type { IntelilangSettings, MockupProject, MockupProjectDetail } from "@/types/admin";

export interface StagedFile {
    path: string;
    file: File;
}

export interface MockupList {
    data: MockupProject[];
    domain: string | null;
}

export interface MockupResponse {
    message?: string;
    data: MockupProjectDetail;
}

export const mockupsQuery = queryOptions({
    queryKey: [AdminQueryKey.Mockups],
    queryFn: () => adminFetch<MockupList>("/api/admin/mockups"),
});

export function mockupQuery(id: number) {
    return queryOptions({
        queryKey: [AdminQueryKey.Mockups, id],
        queryFn: () => adminFetch<MockupResponse>(`/api/admin/mockups/${id}`).then((r) => r.data),
    });
}

export const intelilangQuery = queryOptions({
    queryKey: [AdminQueryKey.Intelilang],
    queryFn: () => adminFetch<{ data: IntelilangSettings }>("/api/admin/intelilang").then((r) => r.data),
});

export function useIntelilangConnected(): boolean {
    const { data } = useQuery({ ...intelilangQuery, select: (settings) => settings.configured });
    return data ?? false;
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
        const file = await new Promise<File>((resolve, reject) => (entry as FileSystemFileEntry).file(resolve, reject));
        const path = cleanPath(prefix + entry.name);
        if (path) out.push({ path, file });
        return;
    }
    if (entry.isDirectory) {
        if (cleanPath(entry.name) === null) return;
        const reader = (entry as FileSystemDirectoryEntry).createReader();
        const children: FileSystemEntry[] = [];
        for (;;) {
            const batch = await new Promise<FileSystemEntry[]>((resolve, reject) => reader.readEntries(resolve, reject));
            if (batch.length === 0) break;
            children.push(...batch);
        }
        for (const child of children) {
            await walkEntry(child, `${prefix}${entry.name}/`, out);
        }
    }
}

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

export function detectEntry(paths: string[]): string | null {
    if (paths.includes("index.html")) return "index.html";
    if (paths.includes("index.htm")) return "index.htm";
    const rootHtml = paths.filter((p) => !p.includes("/") && /\.html?$/i.test(p)).sort();
    return rootHtml[0] ?? null;
}

export interface DeploymentUpload {
    projectId: number;
    staged: StagedFile[];
    note: string;
    sendToIntelilang: boolean;
    onProgress: (percent: number) => void;
}

export function uploadDeployment({ projectId, staged, note, sendToIntelilang, onProgress }: DeploymentUpload): Promise<Required<MockupResponse>> {
    const copy = mockupsCopy.uploader;
    const form = new FormData();
    for (const s of staged) form.append("files", s.file, s.file.name);
    form.append("paths", JSON.stringify(staged.map((s) => s.path)));
    if (note.trim()) form.append("note", note.trim());
    if (sendToIntelilang) form.append("intelilang", "true");

    return new Promise((resolve, reject) => {
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
                body = {};
            }
            const ok = xhr.status >= 200 && xhr.status < 300 && body.status === "success" && body.data;
            if (ok && body.data) resolve({ message: body.message ?? copy.deployed, data: body.data });
            else reject(new AdminApiError(body.message ?? copy.failed(xhr.status), xhr.status));
        };
        xhr.onerror = () => reject(new AdminApiError(copy.network, 0));
        xhr.send(form);
    });
}
