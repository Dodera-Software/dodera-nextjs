import "server-only";
import { unzipSync } from "fflate";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { db } from "@/db";
import { mockupDeployments, mockupFiles, mockupProjects } from "@/db/schema";
import { MOCKUP_LIMITS, mockupUrl } from "@/config/mockups";
import type { MockupDeployment, MockupProject, MockupProjectDetail } from "@/types/admin";

/* ══════════════════════════════════════════════════════════════
 * Mockup previews — server-side service.
 *
 * Files live in Postgres (`mockup_files.data` bytea) exactly like CVs, so a
 * DB backup covers everything and no volume/S3 is needed. Each upload
 * becomes a new versioned deployment; the project points at the one that
 * is live, which makes rollback a single UPDATE.
 * ══════════════════════════════════════════════════════════════ */

/* ── Domain / URLs ─────────────────────────────────────────── */

/** `MOCKUPS_DOMAIN` (e.g. "demo.doderasoft.com"), or null when not configured. */
export function getMockupsDomain(): string | null {
    const raw = process.env.MOCKUPS_DOMAIN?.trim().toLowerCase() ?? "";
    const cleaned = raw.replace(/^https?:\/\//, "").replace(/\/+$/, "");
    return cleaned || null;
}

export function getProjectUrl(slug: string): string | null {
    const domain = getMockupsDomain();
    return domain ? mockupUrl(domain, slug) : null;
}

/* ── Upload processing ─────────────────────────────────────── */

export interface IncomingFile {
    /** Relative path as sent by the browser (folder uploads keep their sub-paths). */
    path: string;
    data: Buffer;
}

export interface PreparedUpload {
    files: IncomingFile[];
    entryPath: string;
    totalBytes: number;
}

/** Validation failure that should surface to the user as-is. */
export class MockupUploadError extends Error {
    status: number;
    constructor(message: string, status = 422) {
        super(message);
        this.name = "MockupUploadError";
        this.status = status;
    }
}

const CONTENT_TYPES: Record<string, string> = {
    html: "text/html; charset=utf-8",
    htm: "text/html; charset=utf-8",
    css: "text/css; charset=utf-8",
    js: "text/javascript; charset=utf-8",
    mjs: "text/javascript; charset=utf-8",
    json: "application/json; charset=utf-8",
    map: "application/json; charset=utf-8",
    webmanifest: "application/manifest+json",
    txt: "text/plain; charset=utf-8",
    md: "text/markdown; charset=utf-8",
    csv: "text/csv; charset=utf-8",
    xml: "application/xml; charset=utf-8",
    svg: "image/svg+xml",
    png: "image/png",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    webp: "image/webp",
    avif: "image/avif",
    ico: "image/x-icon",
    bmp: "image/bmp",
    woff: "font/woff",
    woff2: "font/woff2",
    ttf: "font/ttf",
    otf: "font/otf",
    eot: "application/vnd.ms-fontobject",
    mp4: "video/mp4",
    webm: "video/webm",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    ogg: "audio/ogg",
    pdf: "application/pdf",
    wasm: "application/wasm",
};

export function contentTypeFor(path: string): string {
    const dot = path.lastIndexOf(".");
    const ext = dot === -1 ? "" : path.slice(dot + 1).toLowerCase();
    return CONTENT_TYPES[ext] ?? "application/octet-stream";
}

const JUNK_SEGMENTS = new Set(["__MACOSX", "node_modules", "Thumbs.db", "desktop.ini"]);
const CONTROL_CHARS_RE = /[\u0000-\u001f\u007f]/;

function isJunkSegment(segment: string): boolean {
    return segment.startsWith(".") || JUNK_SEGMENTS.has(segment);
}

/**
 * Normalize a client-supplied relative path ("./site\\css/a.css" → "site/css/a.css").
 * Returns null for unsafe paths (traversal, control chars) and OS junk
 * (dotfiles, __MACOSX, node_modules…), which are silently skipped.
 */
export function normalizeUploadPath(raw: string): string | null {
    const segments = raw
        .replace(/\\/g, "/")
        .split("/")
        .filter((s) => s !== "" && s !== ".");
    if (segments.length === 0) return null;
    for (const seg of segments) {
        if (seg === ".." || seg.length > 255 || CONTROL_CHARS_RE.test(seg)) return null;
        if (isJunkSegment(seg)) return null;
    }
    const joined = segments.join("/");
    return joined.length > 1024 ? null : joined;
}

function formatBytes(bytes: number): string {
    const mb = 1024 * 1024;
    if (bytes >= mb) return `${(bytes / mb).toFixed(bytes % mb === 0 ? 0 : 1)} MB`;
    if (bytes >= 1024) return `${Math.round(bytes / 1024)} KB`;
    return `${bytes} B`;
}

/** Expand a .zip upload into files (directories and junk entries skipped). Size limits are enforced before inflating. */
export function expandZip(buf: Buffer): IncomingFile[] {
    let total = 0;
    let entries: Record<string, Uint8Array>;
    try {
        entries = unzipSync(new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength), {
            filter: (file) => {
                if (file.name.endsWith("/")) return false;
                if (normalizeUploadPath(file.name) === null) return false;
                if (file.originalSize > MOCKUP_LIMITS.maxFileBytes) {
                    throw new MockupUploadError(
                        `"${file.name}" is ${formatBytes(file.originalSize)} — the limit per file is ${formatBytes(MOCKUP_LIMITS.maxFileBytes)}.`,
                    );
                }
                total += file.originalSize;
                if (total > MOCKUP_LIMITS.maxTotalBytes) {
                    throw new MockupUploadError(
                        `The zip unpacks to more than ${formatBytes(MOCKUP_LIMITS.maxTotalBytes)}.`,
                    );
                }
                return true;
            },
        });
    } catch (err) {
        if (err instanceof MockupUploadError) throw err;
        throw new MockupUploadError("The zip file could not be read. Make sure it is a valid .zip archive.");
    }
    return Object.entries(entries).map(([name, data]) => ({
        path: normalizeUploadPath(name)!,
        data: Buffer.from(data.buffer, data.byteOffset, data.byteLength),
    }));
}

/**
 * Drop a wrapper folder shared by every file ("my-site/index.html" → "index.html").
 * Repeats for nested wrappers. Stops as soon as any file sits at the root.
 */
function stripCommonRoot(files: IncomingFile[]): IncomingFile[] {
    let current = files;
    while (current.length > 0) {
        const first = current[0].path.split("/")[0];
        const allShare = current.every((f) => {
            const segs = f.path.split("/");
            return segs.length >= 2 && segs[0] === first;
        });
        if (!allShare) break;
        current = current.map((f) => ({ path: f.path.slice(first.length + 1), data: f.data }));
    }
    return current;
}

/** index.html wins; otherwise the (alphabetically first) top-level .html file. */
function pickEntry(files: IncomingFile[]): string | null {
    const paths = new Set(files.map((f) => f.path));
    if (paths.has("index.html")) return "index.html";
    if (paths.has("index.htm")) return "index.htm";
    const rootHtml = [...paths].filter((p) => !p.includes("/") && /\.html?$/i.test(p)).sort();
    return rootHtml[0] ?? null;
}

/**
 * Validate an upload, expand zips, strip wrapper folders and pick the entry
 * file. Throws MockupUploadError with a user-facing message on failure.
 */
export function prepareUpload(raw: IncomingFile[]): PreparedUpload {
    const collected: IncomingFile[] = [];
    for (const f of raw) {
        const path = normalizeUploadPath(f.path);
        if (path === null) continue;
        if (/\.zip$/i.test(path)) {
            collected.push(...expandZip(f.data));
        } else {
            collected.push({ path, data: f.data });
        }
    }

    if (collected.length === 0) {
        throw new MockupUploadError("No usable files were uploaded.");
    }
    if (collected.length > MOCKUP_LIMITS.maxFiles) {
        throw new MockupUploadError(
            `Too many files (${collected.length}). The limit is ${MOCKUP_LIMITS.maxFiles} per deployment.`,
        );
    }

    let totalBytes = 0;
    for (const f of collected) {
        if (f.data.byteLength > MOCKUP_LIMITS.maxFileBytes) {
            throw new MockupUploadError(
                `"${f.path}" is ${formatBytes(f.data.byteLength)} — the limit per file is ${formatBytes(MOCKUP_LIMITS.maxFileBytes)}.`,
            );
        }
        totalBytes += f.data.byteLength;
    }
    if (totalBytes > MOCKUP_LIMITS.maxTotalBytes) {
        throw new MockupUploadError(
            `The upload is ${formatBytes(totalBytes)} — the limit per deployment is ${formatBytes(MOCKUP_LIMITS.maxTotalBytes)}.`,
        );
    }

    // Last occurrence of a duplicate path wins (e.g. a zip overriding a loose file).
    const byPath = new Map<string, IncomingFile>();
    for (const f of stripCommonRoot(collected)) byPath.set(f.path, f);
    const files = [...byPath.values()];

    const entryPath = pickEntry(files);
    if (!entryPath) {
        throw new MockupUploadError(
            "No HTML file found at the top level. Add an index.html, or upload the folder / zip that contains it.",
        );
    }

    return { files, entryPath, totalBytes };
}

/* ── Serialization ─────────────────────────────────────────── */

type ProjectRow = typeof mockupProjects.$inferSelect;
type DeploymentRow = typeof mockupDeployments.$inferSelect;

export function serializeDeployment(row: DeploymentRow, activeDeploymentId: number | null): MockupDeployment {
    return {
        id: row.id,
        version: row.version,
        entry_path: row.entryPath,
        file_count: row.fileCount,
        total_bytes: row.totalBytes,
        note: row.note,
        created_by: row.createdBy,
        created_at: row.createdAt.toISOString(),
        is_active: row.id === activeDeploymentId,
        intelilang_status: row.intelilangStatus === "sent" || row.intelilangStatus === "failed" ? row.intelilangStatus : null,
    };
}

export function serializeProject(
    row: ProjectRow,
    active: DeploymentRow | null,
    deploymentsCount: number,
): MockupProject {
    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        client_name: row.clientName,
        notes: row.notes,
        url: getProjectUrl(row.slug),
        active_deployment: active ? serializeDeployment(active, row.activeDeploymentId) : null,
        deployments_count: deploymentsCount,
        created_by: row.createdBy,
        created_at: row.createdAt.toISOString(),
        updated_at: row.updatedAt.toISOString(),
    };
}

/* ── Queries ───────────────────────────────────────────────── */

const deploymentsCountSql = sql<number>`(
    select count(*)::int from ${mockupDeployments}
    where ${mockupDeployments.projectId} = ${mockupProjects.id}
)`;

export async function listProjects(): Promise<MockupProject[]> {
    const rows = await db
        .select({
            project: mockupProjects,
            active: mockupDeployments,
            deploymentsCount: deploymentsCountSql,
        })
        .from(mockupProjects)
        .leftJoin(mockupDeployments, eq(mockupDeployments.id, mockupProjects.activeDeploymentId))
        .orderBy(desc(mockupProjects.updatedAt));

    return rows.map((r) => serializeProject(r.project, r.active, r.deploymentsCount));
}

export async function getProject(id: number): Promise<MockupProject | null> {
    const [row] = await db
        .select({
            project: mockupProjects,
            active: mockupDeployments,
            deploymentsCount: deploymentsCountSql,
        })
        .from(mockupProjects)
        .leftJoin(mockupDeployments, eq(mockupDeployments.id, mockupProjects.activeDeploymentId))
        .where(eq(mockupProjects.id, id))
        .limit(1);

    return row ? serializeProject(row.project, row.active, row.deploymentsCount) : null;
}

export async function getProjectDetail(id: number): Promise<MockupProjectDetail | null> {
    const project = await getProject(id);
    if (!project) return null;

    const deployments = await db
        .select()
        .from(mockupDeployments)
        .where(eq(mockupDeployments.projectId, id))
        .orderBy(desc(mockupDeployments.version));

    const activeId = project.active_deployment?.id ?? null;
    return { ...project, deployments: deployments.map((d) => serializeDeployment(d, activeId)) };
}

export async function listDeploymentFiles(deploymentId: number) {
    return db
        .select({ path: mockupFiles.path, content_type: mockupFiles.contentType, size: mockupFiles.size })
        .from(mockupFiles)
        .where(eq(mockupFiles.deploymentId, deploymentId))
        .orderBy(mockupFiles.path);
}

const INSERT_CHUNK = 25;

/**
 * Store an upload as the next deployment version and make it live.
 * The project row is locked for the duration so concurrent deploys
 * get sequential version numbers.
 */
export async function createDeployment(
    projectId: number,
    upload: PreparedUpload,
    opts: { note?: string | null; createdBy?: string | null } = {},
): Promise<DeploymentRow> {
    const deployment = await db.transaction(async (tx) => {
        const [project] = await tx
            .select({ id: mockupProjects.id })
            .from(mockupProjects)
            .where(eq(mockupProjects.id, projectId))
            .for("update");
        if (!project) throw new MockupUploadError("Project not found.", 404);

        const [{ nextVersion }] = await tx
            .select({ nextVersion: sql<number>`coalesce(max(${mockupDeployments.version}), 0)::int + 1` })
            .from(mockupDeployments)
            .where(eq(mockupDeployments.projectId, projectId));

        const [row] = await tx
            .insert(mockupDeployments)
            .values({
                projectId,
                version: nextVersion,
                entryPath: upload.entryPath,
                fileCount: upload.files.length,
                totalBytes: upload.totalBytes,
                note: opts.note?.trim() || null,
                createdBy: opts.createdBy ?? null,
            })
            .returning();

        for (let i = 0; i < upload.files.length; i += INSERT_CHUNK) {
            const chunk = upload.files.slice(i, i + INSERT_CHUNK);
            await tx.insert(mockupFiles).values(
                chunk.map((f) => ({
                    deploymentId: row.id,
                    path: f.path,
                    contentType: contentTypeFor(f.path),
                    size: f.data.byteLength,
                    data: f.data,
                })),
            );
        }

        await tx
            .update(mockupProjects)
            .set({ activeDeploymentId: row.id, updatedAt: new Date() })
            .where(eq(mockupProjects.id, projectId));

        return row;
    });

    await pruneDeployments(projectId).catch((err) => console.error("[mockups] prune failed:", err));
    return deployment;
}

/** Delete old non-live deployments beyond MOCKUP_LIMITS.keepDeployments. */
export async function pruneDeployments(projectId: number): Promise<number> {
    const [project] = await db
        .select({ activeDeploymentId: mockupProjects.activeDeploymentId })
        .from(mockupProjects)
        .where(eq(mockupProjects.id, projectId))
        .limit(1);
    if (!project) return 0;

    const rows = await db
        .select({ id: mockupDeployments.id })
        .from(mockupDeployments)
        .where(eq(mockupDeployments.projectId, projectId))
        .orderBy(desc(mockupDeployments.version));

    const stale = rows
        .filter((r) => r.id !== project.activeDeploymentId)
        .slice(MOCKUP_LIMITS.keepDeployments)
        .map((r) => r.id);
    if (stale.length === 0) return 0;

    await db.delete(mockupDeployments).where(inArray(mockupDeployments.id, stale));
    return stale.length;
}

/** Point the project at an older deployment (rollback). Returns false if it doesn't belong to the project. */
export async function activateDeployment(projectId: number, deploymentId: number): Promise<boolean> {
    const [dep] = await db
        .select({ id: mockupDeployments.id })
        .from(mockupDeployments)
        .where(and(eq(mockupDeployments.id, deploymentId), eq(mockupDeployments.projectId, projectId)))
        .limit(1);
    if (!dep) return false;

    await db
        .update(mockupProjects)
        .set({ activeDeploymentId: deploymentId, updatedAt: new Date() })
        .where(eq(mockupProjects.id, projectId));
    return true;
}

/* ── Serving ───────────────────────────────────────────────── */

export type ResolvedMockup =
    | { kind: "not-found" }
    | { kind: "empty"; projectName: string }
    | { kind: "redirect"; location: string }
    | { kind: "file"; id: number; path: string; contentType: string; size: number };

function normalizeRequestPath(rawPathname: string): { path: string; isDir: boolean } | null {
    let decoded: string;
    try {
        decoded = decodeURIComponent(rawPathname);
    } catch {
        return null;
    }
    const segments = decoded.split("/").filter((s) => s !== "" && s !== ".");
    if (segments.some((s) => s === "..")) return null;
    return { path: segments.join("/"), isDir: decoded.endsWith("/") };
}

/**
 * Map a request on `<slug>.<domain>/<pathname>` to a stored file, following
 * static-host conventions: "/" → entry file, "/about" → about | about.html |
 * about/index.html (the latter redirects to "/about/" so relative links work).
 */
export async function resolveMockupFile(slug: string, rawPathname: string): Promise<ResolvedMockup> {
    const [project] = await db
        .select({
            name: mockupProjects.name,
            deploymentId: mockupDeployments.id,
            entryPath: mockupDeployments.entryPath,
        })
        .from(mockupProjects)
        .leftJoin(mockupDeployments, eq(mockupDeployments.id, mockupProjects.activeDeploymentId))
        .where(eq(mockupProjects.slug, slug))
        .limit(1);

    if (!project) return { kind: "not-found" };
    if (project.deploymentId === null || project.entryPath === null) {
        return { kind: "empty", projectName: project.name };
    }

    const req = normalizeRequestPath(rawPathname);
    if (!req) return { kind: "not-found" };

    let candidates: string[];
    let dirIndexCandidate: string | null = null;
    if (req.path === "") {
        candidates = [project.entryPath];
    } else if (req.isDir) {
        candidates = [`${req.path}/index.html`, `${req.path}/index.htm`];
    } else {
        dirIndexCandidate = `${req.path}/index.html`;
        candidates = [req.path, `${req.path}.html`, dirIndexCandidate];
    }

    const matches = await db
        .select({
            id: mockupFiles.id,
            path: mockupFiles.path,
            contentType: mockupFiles.contentType,
            size: mockupFiles.size,
        })
        .from(mockupFiles)
        .where(and(eq(mockupFiles.deploymentId, project.deploymentId), inArray(mockupFiles.path, candidates)));

    for (const candidate of candidates) {
        const hit = matches.find((m) => m.path === candidate);
        if (!hit) continue;
        if (candidate === dirIndexCandidate) {
            const encoded = req.path.split("/").map(encodeURIComponent).join("/");
            return { kind: "redirect", location: `/${encoded}/` };
        }
        return { kind: "file", id: hit.id, path: hit.path, contentType: hit.contentType, size: hit.size };
    }

    return { kind: "not-found" };
}

export async function readMockupFile(id: number): Promise<Buffer | null> {
    const [row] = await db
        .select({ data: mockupFiles.data })
        .from(mockupFiles)
        .where(eq(mockupFiles.id, id))
        .limit(1);
    return row?.data ?? null;
}
