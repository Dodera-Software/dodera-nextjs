import { adminCommon } from "@/i18n/admin/common";
import type { Pagination } from "@/types/admin";

export class AdminApiError extends Error {
    constructor(message: string, readonly status: number) {
        super(message);
    }
}

export interface AdminRequest extends Omit<RequestInit, "body"> {
    json?: unknown;
    body?: BodyInit;
    query?: Record<string, string | number | boolean | null | undefined>;
}

export interface Paginated<T> {
    data: T[];
    pagination: Pagination;
}

function withQuery(path: string, query: AdminRequest["query"]): string {
    if (!query) return path;
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(query)) {
        if (value !== null && value !== undefined && value !== "") params.set(key, String(value));
    }
    const qs = params.toString();
    return qs ? `${path}?${qs}` : path;
}

export async function adminFetch<T>(path: string, { json, body, query, headers, ...init }: AdminRequest = {}): Promise<T> {
    let res: Response;
    try {
        res = await fetch(withQuery(path, query), {
            ...init,
            headers: json === undefined ? headers : { "Content-Type": "application/json", ...headers },
            body: json === undefined ? body : JSON.stringify(json),
        });
    } catch {
        throw new AdminApiError(adminCommon.errors.network, 0);
    }

    const payload = await res.json().catch(() => null);
    if (!res.ok || payload?.status === "error") {
        throw new AdminApiError(payload?.message ?? payload?.error ?? adminCommon.errors.generic, res.status);
    }
    return payload as T;
}

export function errorMessage(error: unknown): string {
    return error instanceof Error && error.message ? error.message : adminCommon.errors.generic;
}

export function downloadCsv(filename: string, header: string[], rows: (string | number | null | undefined)[][]): void {
    const cell = (v: string | number | null | undefined) => `"${String(v ?? "").replace(/"/g, '""')}"`;
    const csv = [header.map(cell), ...rows.map((r) => r.map(cell))].map((r) => r.join(",")).join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}
