/**
 * Social Post Generation — Prompt Builder
 *
 * ⚠️  Do NOT edit prompts here.
 *    Edit the plain-text prompt files directly:
 *      src/app/api/admin/social-post/linkedin-prompt.txt
 *      src/app/api/admin/social-post/facebook-prompt.txt
 *      src/app/api/admin/social-post/instagram-prompt.txt
 *
 *    To change the company name, edit:
 *      src/config/social-post.ts
 *
 *    Examples are managed dynamically from the admin UI and stored in the DB.
 */

import fs from "fs";
import path from "path";
import { AGENT_IDENTITY } from "@/config/social-post";

const BASE = path.join(process.cwd(), "src/app/api/admin/social-post");

function loadPrompt(filename: string): string {
    return fs.readFileSync(path.join(BASE, filename), "utf-8");
}

/* ── Platform type ───────────────────────────────────────────────────────── */

export type SocialPlatform = "linkedin" | "facebook" | "instagram";

/* ── Public entry point ──────────────────────────────────────────────────── */

/**
 * Build the system prompt for the given platform.
 * @param platform - The social platform
 * @param examples - Reference post strings fetched from the DB (may be empty)
 */
export function buildSystemPrompt(platform: SocialPlatform, examples: string[]): string {
    const raw = loadPrompt(`${platform}-prompt.txt`);
    const withCompany = raw.replaceAll("{{COMPANY}}", AGENT_IDENTITY.company);

    const examplesBlock =
        examples.length > 0
            ? `Study the hook openings, paragraph rhythm, line breaks, and CTA style of these real posts. Mirror the patterns — do NOT copy any content.\n\n${examples.map((e, i) => `### Example ${i + 1}\n${e}`).join("\n\n")}`
            : `No personal examples provided — use proven ${platform} best practices for hooks, paragraph rhythm, and CTAs.`;

    return withCompany.replaceAll("{{EXAMPLES}}", examplesBlock);
}

/* ── User message builder ─────────────────────────────────────────────────── */

export interface BlogContext {
    title: string;
    excerpt: string;
    category: string;
    tags: string[];
    url: string;
    body_plain: string;
}

export function buildUserMessage(platform: SocialPlatform, blog: BlogContext): string {
    const tagsStr = blog.tags.length > 0 ? blog.tags.join(", ") : "none";
    const bodyPreview = blog.body_plain.slice(0, 2500);

    return `Please generate a ${platform.toUpperCase()} post for this blog article.

## Article details

**Title:** ${blog.title}
**URL:** ${blog.url}
**Category:** ${blog.category}
**Tags:** ${tagsStr}
**Excerpt:** ${blog.excerpt}

## Article body (first ~2 500 characters for context)

${bodyPreview}`;
}