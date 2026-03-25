/**
 * ╔══════════════════════════════════════════════════════════════════════════�-
 * ║           SOCIAL POST AI - IDENTITY CONFIG                              ║
 * ╠══════════════════════════════════════════════════════════════════════════╣
 * ║  To edit the actual prompt text / writing rules, open the .txt files    ║
 * ║  next to the route:                                                      ║
 * ║    src/app/api/admin/social-post/linkedin-prompt.txt                    ║
 * ║    src/app/api/admin/social-post/facebook-prompt.txt                    ║
 * ║    src/app/api/admin/social-post/instagram-prompt.txt                   ║
 * ╚══════════════════════════════════════════════════════════════════════════╝
 */

/* ═══════════════════════════════════════════════════════════════════════════
   AGENT IDENTITY
   ───────────────────────────────────────────────────────────────────────────
   Used as the {{COMPANY}} placeholder in all three prompt .txt files.
   ═══════════════════════════════════════════════════════════════════════════ */

export const AGENT_IDENTITY = {
    /** One-line description of the company injected into every prompt. */
    company:
        "Dodera, a software development agency that specialises in automation, AI integrations, and custom web/mobile development",
};
