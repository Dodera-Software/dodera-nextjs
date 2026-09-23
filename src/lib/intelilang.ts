import "server-only";
import { randomUUID } from "node:crypto";
import { and, asc, eq } from "drizzle-orm";
import { Webhook } from "standardwebhooks";
import { db } from "@/db";
import { mockupDeployments, mockupProjects } from "@/db/schema";
import { getConfig, setConfig } from "@/lib/app-config";
import { getProjectUrl } from "@/lib/mockups";
import { canSealSecrets, openSecret, sealSecret } from "@/lib/secret-box";

/*
 * InteliLang (intelilang.com) keeps a project's memory: what was decided, who does
 * what, and what went live where. A webhook made in InteliLang (Sources → Add a
 * source → "Another app") gives an address and a signing secret; deployments sent
 * there become notes the InteliLang chat can answer from ("what's the staging URL?").
 *
 * The address is stored as is. The secret is sealed (secret-box.ts) and never sent
 * back to the browser: the admin only ever sees its last four characters.
 */

export const INTELILANG_URL_KEY = "intelilang_webhook_url";
export const INTELILANG_SECRET_KEY = "intelilang_webhook_secret";
/** Config keys only this module reads and writes; the generic settings list neither shows nor saves them. */
export const INTELILANG_CONFIG_KEYS = new Set([INTELILANG_URL_KEY, INTELILANG_SECRET_KEY]);

const SEND_TIMEOUT_MS = 8000;
const SECRET_PATTERN = /^whsec_[A-Za-z0-9+/=]{20,}$/;
/** HTTPS, or plain HTTP to this machine for trying it against a local InteliLang. */
const ADDRESS_PATTERN = /^(https:\/\/[^\s/]+|http:\/\/(localhost|127\.0\.0\.1)(:\d+)?)\/api\/webhooks\/incoming\/[A-Za-z0-9_-]+$/;

export interface IntelilangSettings {
    url: string;
    /** Whether a secret is stored; the secret itself never leaves the server. */
    secret_set: boolean;
    /** Last four characters, so an admin can tell which secret is in use. */
    secret_tail: string | null;
    configured: boolean;
    /** False when APP_ENCRYPTION_KEY is missing, so no secret can be saved. */
    can_store_secret: boolean;
}

export class IntelilangError extends Error {
    constructor(message: string, readonly status = 400) {
        super(message);
    }
}

async function readSecret(): Promise<string | null> {
    const sealed = await getConfig(INTELILANG_SECRET_KEY, "");
    if (!sealed) return null;
    try {
        return await openSecret(sealed);
    } catch (err) {
        console.error("[intelilang] the stored secret can't be opened (was APP_ENCRYPTION_KEY changed?)", err);
        return null;
    }
}

export async function getIntelilangSettings(): Promise<IntelilangSettings> {
    const url = await getConfig(INTELILANG_URL_KEY, "");
    const secret = await readSecret();
    return {
        url,
        secret_set: secret !== null,
        secret_tail: secret ? secret.slice(-4) : null,
        configured: Boolean(url && secret),
        can_store_secret: canSealSecrets(),
    };
}

/** Saves the address and, when given, a new secret. An empty address turns sending off. */
export async function saveIntelilangSettings(input: { url: string; secret?: string }) {
    const url = input.url.trim();
    if (url && !ADDRESS_PATTERN.test(url)) {
        throw new IntelilangError("Paste the address InteliLang shows for the webhook (https://…/api/webhooks/incoming/…).");
    }
    const secret = input.secret?.trim();
    if (secret) {
        if (!SECRET_PATTERN.test(secret)) {
            throw new IntelilangError("Paste the signing secret InteliLang shows (it starts with whsec_).");
        }
        if (!canSealSecrets()) {
            throw new IntelilangError("APP_ENCRYPTION_KEY is not set on the server, so the secret can't be stored safely.", 503);
        }
        await setConfig(INTELILANG_SECRET_KEY, await sealSecret(secret));
    }
    await setConfig(INTELILANG_URL_KEY, url);
    return getIntelilangSettings();
}

export interface IntelilangMessage {
    /** Our own id for what this is about: sending it again updates that entry in InteliLang. */
    id: string;
    title: string;
    body: string;
    url?: string;
    author?: string;
    occurredAt?: string;
}

/** Signs and sends one message the Standard Webhooks way; throws with a readable reason. */
export async function sendToIntelilang(message: IntelilangMessage): Promise<void> {
    const url = await getConfig(INTELILANG_URL_KEY, "");
    const secret = await readSecret();
    if (!url || !secret) {
        throw new IntelilangError("InteliLang isn't set up. Add the webhook address and secret in Settings.", 409);
    }
    const body = JSON.stringify(message);
    const deliveryId = `msg_${randomUUID()}`;
    const now = new Date();
    let response: Response;
    try {
        response = await fetch(url, {
            method: "POST",
            headers: {
                "content-type": "application/json",
                "webhook-id": deliveryId,
                "webhook-timestamp": String(Math.floor(now.getTime() / 1000)),
                "webhook-signature": new Webhook(secret).sign(deliveryId, now, body),
            },
            body,
            signal: AbortSignal.timeout(SEND_TIMEOUT_MS),
        });
    } catch {
        throw new IntelilangError("InteliLang couldn't be reached.", 502);
    }
    if (!response.ok) {
        const reason = await response.json().then((data: { statusMessage?: string }) => data.statusMessage).catch(() => null);
        throw new IntelilangError(`InteliLang answered ${response.status}${reason ? `: ${reason}` : ""}.`, 502);
    }
}

type DeploymentEvent = "deployed" | "made_live";

async function deploymentMessage(projectId: number, deploymentId: number, event: DeploymentEvent): Promise<IntelilangMessage | null> {
    const [row] = await db
        .select({ project: mockupProjects, deployment: mockupDeployments })
        .from(mockupDeployments)
        .innerJoin(mockupProjects, eq(mockupProjects.id, mockupDeployments.projectId))
        .where(and(eq(mockupDeployments.id, deploymentId), eq(mockupDeployments.projectId, projectId)))
        .limit(1);
    if (!row) return null;

    const { project, deployment } = row;
    const url = getProjectUrl(project.slug) ?? undefined;
    const client = project.clientName ? ` for ${project.clientName}` : "";
    const where = url ? ` at ${url}` : "";
    const lines = event === "deployed"
        ? [`Version ${deployment.version} of the ${project.name} mockup${client} is live${where}.`]
        : [`Version ${deployment.version} of the ${project.name} mockup${client} is live again${where}: it was made the live version from the admin panel.`];
    if (deployment.note) lines.push(`What changed: ${deployment.note}`);
    lines.push(`Deployed by ${deployment.createdBy ?? "an admin"} from the Dodera admin panel, ${deployment.fileCount} file${deployment.fileCount === 1 ? "" : "s"}.`);

    const now = new Date().toISOString();
    return {
        id: event === "deployed"
            ? `mockup-${project.id}-v${deployment.version}`
            : `mockup-${project.id}-v${deployment.version}-live-${Date.now()}`,
        title: event === "deployed"
            ? `Deployed ${project.name} v${deployment.version}${client}`
            : `${project.name} v${deployment.version} is live again${client}`,
        body: lines.join("\n"),
        url,
        author: deployment.createdBy ?? undefined,
        occurredAt: event === "deployed" ? deployment.createdAt.toISOString() : now,
    };
}

/**
 * Tells InteliLang about a deployment and records whether it got there. Never throws:
 * a deploy has already happened and must not fail because InteliLang is unreachable.
 */
export async function notifyIntelilangOfDeployment(projectId: number, deploymentId: number, event: DeploymentEvent) {
    try {
        const message = await deploymentMessage(projectId, deploymentId, event);
        if (!message) return { ok: false, reason: "Deployment not found." };
        await sendToIntelilang(message);
        await db.update(mockupDeployments).set({ intelilangStatus: "sent" }).where(eq(mockupDeployments.id, deploymentId));
        return { ok: true, reason: null };
    } catch (err) {
        const reason = err instanceof IntelilangError ? err.message : "Sending to InteliLang failed.";
        if (!(err instanceof IntelilangError)) console.error("[intelilang] send failed", err);
        await db.update(mockupDeployments).set({ intelilangStatus: "failed" }).where(eq(mockupDeployments.id, deploymentId));
        return { ok: false, reason };
    }
}

/** What InteliLang was told about a mockup, read before the mockup or one of its versions is deleted. */
export interface MockupSentToIntelilang {
    project: typeof mockupProjects.$inferSelect;
    /** Versions whose deployment reached InteliLang. */
    sentVersions: number[];
    liveVersion: number | null;
}

export async function readMockupSentToIntelilang(projectId: number): Promise<MockupSentToIntelilang | null> {
    const [project] = await db.select().from(mockupProjects).where(eq(mockupProjects.id, projectId)).limit(1);
    if (!project) return null;
    const deployments = await db
        .select({ id: mockupDeployments.id, version: mockupDeployments.version, status: mockupDeployments.intelilangStatus })
        .from(mockupDeployments)
        .where(eq(mockupDeployments.projectId, projectId))
        .orderBy(asc(mockupDeployments.version));
    return {
        project,
        sentVersions: deployments.filter((d) => d.status === "sent").map((d) => d.version),
        liveVersion: deployments.find((d) => d.id === project.activeDeploymentId)?.version ?? null,
    };
}

function deletionMessage(before: MockupSentToIntelilang, deletedBy: string, version: number | null): IntelilangMessage {
    const { project } = before;
    const url = getProjectUrl(project.slug) ?? undefined;
    const client = project.clientName ? ` for ${project.clientName}` : "";
    const now = new Date().toISOString();
    if (version !== null) {
        const live = before.liveVersion !== null
            ? ` Version ${before.liveVersion} is still the live one${url ? ` at ${url}` : ""}.`
            : "";
        return {
            // The same id as the deploy message, so InteliLang replaces "is live" with this.
            id: `mockup-${project.id}-v${version}`,
            title: `Deleted ${project.name} v${version}${client}`,
            body: `Version ${version} of the ${project.name} mockup${client} was deleted by ${deletedBy} from the Dodera admin panel. It no longer exists and can't be made live again.${live}`,
            author: deletedBy,
            occurredAt: now,
        };
    }
    return {
        id: `mockup-${project.id}-deleted`,
        title: `Deleted the ${project.name} mockup${client}`,
        body: [
            `The ${project.name} mockup${client} was deleted by ${deletedBy} from the Dodera admin panel, together with all its versions.`,
            url ? `${url} no longer shows it.` : "Its preview link no longer works.",
        ].join("\n"),
        author: deletedBy,
        occurredAt: now,
    };
}

/**
 * Tells InteliLang that a mockup, or one version of it, was deleted: only when it is
 * connected and knew about what was deleted, so a mockup kept out of it stays out.
 * Returns null when there was nothing to tell. Never throws, like the deploy notice.
 */
export async function notifyIntelilangOfDeletion(before: MockupSentToIntelilang, deletedBy: string, version: number | null = null) {
    const told = version === null ? before.sentVersions.length > 0 : before.sentVersions.includes(version);
    if (!told || !(await getIntelilangSettings()).configured) return null;
    try {
        await sendToIntelilang(deletionMessage(before, deletedBy, version));
        return { ok: true, reason: null };
    } catch (err) {
        if (!(err instanceof IntelilangError)) console.error("[intelilang] send failed", err);
        return { ok: false, reason: err instanceof IntelilangError ? err.message : "Sending to InteliLang failed." };
    }
}

/** The toast after a delete, saying whether InteliLang heard about it. */
export function deletionNotice(done: string, intelilang: { ok: boolean; reason: string | null } | null) {
    if (!intelilang) return done;
    return intelilang.ok ? `${done} InteliLang knows.` : `${done} Not sent to InteliLang: ${intelilang.reason}`;
}
