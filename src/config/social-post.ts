/**
 * ╔══════════════════════════════════════════════════════════════════════════╗
 * ║           SOCIAL POST AI — EXAMPLES & IDENTITY CONFIG                   ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  Edit the LinkedIn post examples and company identity here.             ║
 * ║                                                                          ║
 * ║  To edit the actual prompt text / writing rules, open the .txt files    ║
 * ║  next to this file:                                                      ║
 * ║    src/app/api/admin/social-post/linkedin-prompt.txt                    ║
 * ║    src/app/api/admin/social-post/facebook-prompt.txt                    ║
 * ║    src/app/api/admin/social-post/instagram-prompt.txt                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 1 — LINKEDIN REFERENCE EXAMPLES
   ───────────────────────────────────────────────────────────────────────────
   Paste 5–10 real LinkedIn posts that performed well in your feed.
   Each post = one template string (backticks). Keep line breaks as-is.

   The AI uses these to learn hook style, paragraph rhythm, tone, and CTA
   structure. It will never copy content — only absorb the pattern.

   ❌ Remove the placeholder strings and replace with your own posts.
   ✅ Add as many real examples as you like — more is better.
   ═══════════════════════════════════════════════════════════════════════════ */

export const LINKEDIN_EXAMPLES: string[] = [
    // ── Example 1 ──────────────────────────────────────────────────────────
    // Delete this placeholder and paste your first post:
    `PLACEHOLDER — paste a real LinkedIn post here.`,

    // ── Example 2 ──────────────────────────────────────────────────────────
    `PLACEHOLDER — paste a real LinkedIn post here.`,

    // ── Example 3 ──────────────────────────────────────────────────────────
    `PLACEHOLDER — paste a real LinkedIn post here.`,

    // ── Example 4 ──────────────────────────────────────────────────────────
    `PLACEHOLDER — paste a real LinkedIn post here.`,

    // ── Example 5 ──────────────────────────────────────────────────────────
    `PLACEHOLDER — paste a real LinkedIn post here.`,

    // ── Add more below ↓ ───────────────────────────────────────────────────
];

/* ═══════════════════════════════════════════════════════════════════════════
   SECTION 2 — AGENT IDENTITY
   ───────────────────────────────────────────────────────────────────────────
   Used as the {{COMPANY}} placeholder in all three prompt .txt files.
   ═══════════════════════════════════════════════════════════════════════════ */

export const AGENT_IDENTITY = {
    /** One-line description of the company injected into every prompt. */
    company:
        "Dodera, a software development agency that specialises in automation, AI integrations, and custom web/mobile development",
};
