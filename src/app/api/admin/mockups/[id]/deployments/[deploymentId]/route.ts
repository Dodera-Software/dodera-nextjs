import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { verifyAdminSession } from "@/lib/admin-auth";
import { notifyIntelilangOfDeployment } from "@/lib/intelilang";
import { db } from "@/db";
import { mockupDeployments, mockupProjects } from "@/db/schema";
import { activateDeployment, getProjectDetail, listDeploymentFiles } from "@/lib/mockups";

const unauthorized = () =>
    NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });

type Ctx = { params: Promise<{ id: string; deploymentId: string }> };

async function parseIds(params: Ctx["params"]): Promise<{ projectId: number; deploymentId: number } | null> {
    const p = await params;
    const projectId = Number(p.id);
    const deploymentId = Number(p.deploymentId);
    if (!Number.isInteger(projectId) || projectId <= 0) return null;
    if (!Number.isInteger(deploymentId) || deploymentId <= 0) return null;
    return { projectId, deploymentId };
}

async function deploymentBelongsToProject(projectId: number, deploymentId: number): Promise<boolean> {
    const [row] = await db
        .select({ id: mockupDeployments.id })
        .from(mockupDeployments)
        .where(and(eq(mockupDeployments.id, deploymentId), eq(mockupDeployments.projectId, projectId)))
        .limit(1);
    return !!row;
}

/* ── GET …/deployments/[deploymentId] — file listing of a version ── */
export async function GET(_request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const ids = await parseIds(params);
    if (!ids) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    try {
        if (!(await deploymentBelongsToProject(ids.projectId, ids.deploymentId))) {
            return NextResponse.json({ status: "error", message: "Deployment not found." }, { status: 404 });
        }
        const files = await listDeploymentFiles(ids.deploymentId);
        return NextResponse.json({ status: "success", data: files });
    } catch (err) {
        console.error("Error listing deployment files:", err);
        return NextResponse.json({ status: "error", message: "Failed to list files." }, { status: 500 });
    }
}

/* ── PATCH …/deployments/[deploymentId] { action: "activate" } — roll back / forward ── */
export async function PATCH(request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const ids = await parseIds(params);
    if (!ids) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    let body: { action?: string };
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ status: "error", message: "Invalid JSON body." }, { status: 400 });
    }
    if (body.action !== "activate") {
        return NextResponse.json({ status: "error", message: "Unknown action." }, { status: 400 });
    }

    try {
        const ok = await activateDeployment(ids.projectId, ids.deploymentId);
        if (!ok) {
            return NextResponse.json({ status: "error", message: "Deployment not found." }, { status: 404 });
        }
        // A version that was sent to InteliLang when it was deployed says so again when it goes back live.
        const before = await getProjectDetail(ids.projectId);
        const sentBefore = before?.deployments.find((d) => d.id === ids.deploymentId)?.intelilang_status === "sent";
        const intelilang = sentBefore ? await notifyIntelilangOfDeployment(ids.projectId, ids.deploymentId, "made_live") : null;
        const project = sentBefore ? await getProjectDetail(ids.projectId) : before;
        const message = !intelilang ? "This version is now live." : intelilang.ok ? "This version is now live. InteliLang knows." : `This version is now live. Not sent to InteliLang: ${intelilang.reason}`;
        return NextResponse.json({ status: "success", message, data: project });
    } catch (err) {
        console.error("Error activating deployment:", err);
        return NextResponse.json({ status: "error", message: "Failed to switch versions." }, { status: 500 });
    }
}

/* ── DELETE …/deployments/[deploymentId] — remove an old version (not the live one) ── */
export async function DELETE(_request: NextRequest, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) return unauthorized();

    const ids = await parseIds(params);
    if (!ids) return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });

    try {
        if (!(await deploymentBelongsToProject(ids.projectId, ids.deploymentId))) {
            return NextResponse.json({ status: "error", message: "Deployment not found." }, { status: 404 });
        }
        const [project] = await db
            .select({ activeDeploymentId: mockupProjects.activeDeploymentId })
            .from(mockupProjects)
            .where(eq(mockupProjects.id, ids.projectId))
            .limit(1);
        if (project?.activeDeploymentId === ids.deploymentId) {
            return NextResponse.json(
                { status: "error", message: "This version is live. Make another version live first." },
                { status: 409 },
            );
        }

        await db.delete(mockupDeployments).where(eq(mockupDeployments.id, ids.deploymentId));
        const detail = await getProjectDetail(ids.projectId);
        return NextResponse.json({ status: "success", message: "Version deleted.", data: detail });
    } catch (err) {
        console.error("Error deleting deployment:", err);
        return NextResponse.json({ status: "error", message: "Failed to delete the version." }, { status: 500 });
    }
}
