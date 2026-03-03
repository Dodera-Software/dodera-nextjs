import fs from "fs";
import path from "path";

/* ── Output shape ───────────────────────────────────────────── */

export interface GeneratedPost {
    uid: string;
    title: string;
    excerpt: string;
    body: string;
    tags: string[];
    category: string;
    read_time: string;
    meta_title: string;
    meta_description: string;
}

/* ── System prompt ──────────────────────────────────────────── */
// Loaded from system-prompt.txt so non-technical editors can update the prompt
// without touching TypeScript. Use {{YEAR}} in the txt file as a placeholder.

const CURRENT_YEAR = new Date().getFullYear();

export const SYSTEM_PROMPT: string = fs
    .readFileSync(path.join(process.cwd(), "src/app/api/auto-post/system-prompt.txt"), "utf-8")
    .replaceAll("{{YEAR}}", String(CURRENT_YEAR));

/* ── Topic diversity helper ─────────────────────────────────── */

const TOPIC_DOMAINS = [
    "Workflow & Business Automation",
    "Web Development & Frontend",
    "Mobile & Cross-Platform",
    "SaaS & Product Strategy",
    "Startup & MVP Development",
    "Enterprise Software",
    "Tech Leadership & Culture",
];

/**
 * Returns a randomised topic-domain hint injected into the user message so the
 * model doesn't gravitate toward the same subject area on successive calls.
 */
export function getRandomTopicHint(): string {
    const shuffled = [...TOPIC_DOMAINS].sort(() => Math.random() - 0.5);
    const picked = shuffled.slice(0, 3);
    return `Consider these domains first (but pick whichever is genuinely trending the most): ${picked.join(", ")}. Do NOT always default to AI — variety is critical.`;
}

/* ── Response parser ────────────────────────────────────────── */

export function parseGeneratedPost(raw: string): GeneratedPost {
    // With Structured Outputs (json_schema + strict:true) the model is
    // guaranteed to return a valid object matching the schema — no fencing,
    // no missing fields.  We still parse defensively and coerce tags just in
    // case the caller ever switches back to a non-strict model.
    const parsed = JSON.parse(raw) as Record<string, unknown>;

    if (!Array.isArray(parsed.tags)) {
        parsed.tags = [];
    }

    return parsed as unknown as GeneratedPost;
}
