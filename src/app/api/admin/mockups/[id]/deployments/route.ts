import { NextRequest, NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import {
    createDeployment,
    getProjectDetail,
    MockupUploadError,
    prepareUpload,
    type IncomingFile,
} from "@/lib/mockups";
import { notifyIntelilangOfDeployment } from "@/lib/intelilang";

/* ── POST /api/admin/mockups/[id]/deployments ─────────────────
 * multipart/form-data:
 *   files   — one or more files (a .zip is expanded server-side)
 *   paths   — optional JSON array of relative paths, same order as `files`
 *             (browsers drop folder info from File.name, so the UI sends it)
 *   note    — optional label for this version
 *   intelilang — "true" to tell InteliLang this version went live
 *
 * Creates the next version and makes it live immediately.
 */
export async function POST(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> },
) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }

    const id = Number((await params).id);
    if (!Number.isInteger(id) || id <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    let formData: FormData;
    try {
        formData = await request.formData();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid form data." }, { status: 400 });
    }

    const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
    if (files.length === 0) {
        return NextResponse.json({ status: "error", message: "No files were uploaded." }, { status: 422 });
    }

    let paths: string[] | null = null;
    const rawPaths = formData.get("paths");
    if (typeof rawPaths === "string") {
        try {
            const parsed: unknown = JSON.parse(rawPaths);
            if (Array.isArray(parsed) && parsed.every((p) => typeof p === "string")) paths = parsed;
        } catch {
            /* fall back to File.name */
        }
    }

    const noteRaw = formData.get("note");
    const note = typeof noteRaw === "string" ? noteRaw.trim().slice(0, 200) : null;

    try {
        const incoming: IncomingFile[] = await Promise.all(
            files.map(async (file, i) => ({
                path: paths?.[i] || file.name,
                data: Buffer.from(await file.arrayBuffer()),
            })),
        );

        const prepared = prepareUpload(incoming);
        const deployment = await createDeployment(id, prepared, { note, createdBy: session.email });
        // The version is live either way; InteliLang being unreachable only changes the message.
        const intelilang = formData.get("intelilang") === "true"
            ? await notifyIntelilangOfDeployment(id, deployment.id, "deployed")
            : null;
        const project = await getProjectDetail(id);
        const live = `Version ${deployment.version} is live (${prepared.files.length} file${prepared.files.length === 1 ? "" : "s"}).`;

        return NextResponse.json(
            {
                status: "success",
                message: !intelilang ? live : intelilang.ok ? `${live} Sent to InteliLang.` : `${live} Not sent to InteliLang: ${intelilang.reason}`,
                data: project,
            },
            { status: 201 },
        );
    } catch (err) {
        if (err instanceof MockupUploadError) {
            return NextResponse.json({ status: "error", message: err.message }, { status: err.status });
        }
        console.error("Error creating mockup deployment:", err);
        return NextResponse.json(
            { status: "error", message: "Deployment failed. Check the server logs." },
            { status: 500 },
        );
    }
}
