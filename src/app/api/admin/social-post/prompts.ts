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

export function buildSystemPrompt(platform: SocialPlatform): string {
    const raw = loadPrompt(`${platform}-prompt.txt`);
    return raw.replaceAll("{{COMPANY}}", AGENT_IDENTITY.company);
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