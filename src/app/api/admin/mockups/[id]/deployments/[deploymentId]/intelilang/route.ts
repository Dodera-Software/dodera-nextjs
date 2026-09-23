import { NextResponse } from "next/server";
import { verifyAdminSession } from "@/lib/admin-auth";
import { notifyIntelilangOfDeployment } from "@/lib/intelilang";
import { getProjectDetail } from "@/lib/mockups";

type Ctx = { params: Promise<{ id: string; deploymentId: string }> };

/* ── POST …/deployments/[deploymentId]/intelilang — send (or send again) one version to InteliLang ── */
export async function POST(_request: Request, { params }: Ctx) {
    const session = await verifyAdminSession();
    if (!session) {
        return NextResponse.json({ status: "error", message: "Not authenticated." }, { status: 401 });
    }
    const { id, deploymentId } = await params;
    const projectId = Number(id);
    const deployment = Number(deploymentId);
    if (!Number.isInteger(projectId) || projectId <= 0 || !Number.isInteger(deployment) || deployment <= 0) {
        return NextResponse.json({ status: "error", message: "Invalid id." }, { status: 400 });
    }

    const result = await notifyIntelilangOfDeployment(projectId, deployment, "deployed");
    const project = await getProjectDetail(projectId);
    return NextResponse.json(
        result.ok
            ? { status: "success", message: "Sent to InteliLang.", data: project }
            : { status: "error", message: result.reason, data: project },
        { status: result.ok ? 200 : 502 },
    );
}
