/**
 * Writes src/config/lastmod.json: for every page in the route map
 * (src/i18n/routes.ts), the date of the latest git commit that changed the
 * content of any of its source files. The sitemap reads this file for
 * <lastmod>.
 *
 * Run it before committing content changes:  npm run seo:lastmod
 *
 * It is a committed file rather than a build step because the Docker build
 * context has no .git directory.
 *
 * - Pure renames (moving a file without editing it) are not content changes.
 * - Files with uncommitted edits count as modified today.
 */

import { execFileSync } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { ROUTES } from "../src/i18n/routes";

const root = join(__dirname, "..");
const today = new Date().toISOString().slice(0, 10);

function git(args: string[]): string {
    try {
        return execFileSync("git", args, { cwd: root, encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] }).trim();
    } catch {
        return "";
    }
}

/* Working-tree status, keyed by current path: "M", "A", "??", or "R" with the old path. */
const status = new Map<string, { code: string; from?: string }>();
for (const line of git(["status", "--porcelain=v1", "--untracked-files=all"]).split("\n").filter(Boolean)) {
    const code = line.slice(0, 2).trim();
    const rest = line.slice(3);
    if (code.startsWith("R")) {
        const [from, to] = rest.split(" -> ");
        status.set(to, { code: "R", from });
    } else {
        status.set(rest, { code });
    }
}

/** Date of the newest commit that changed `path`'s content (follows renames, skips R100). */
function historyDate(path: string): string | null {
    const out = git(["log", "--follow", "-M", "--format=@%cI", "--name-status", "--", path]);
    let date: string | null = null;
    for (const line of out.split("\n")) {
        if (line.startsWith("@")) {
            date = line.slice(1, 11);
        } else if (line && date && !line.startsWith("R100")) {
            return date;
        }
    }
    return null;
}

function fileDate(path: string): string | null {
    if (!existsSync(join(root, path))) return null;

    const s = status.get(path);
    if (!s) return historyDate(path);

    // A staged rename with unchanged content keeps the old file's date.
    if (s.code === "R" && s.from && git(["hash-object", path]) === git(["rev-parse", `HEAD:${s.from}`])) {
        return historyDate(s.from);
    }
    return today;
}

const out: Record<string, string> = {};
for (const [id, route] of Object.entries(ROUTES)) {
    const dates = route.sources.map(fileDate).filter((d): d is string => !!d);
    if (dates.length) out[id] = dates.sort().at(-1)!;
}

const sorted = Object.fromEntries(Object.entries(out).sort(([a], [b]) => a.localeCompare(b)));
writeFileSync(join(root, "src/config/lastmod.json"), JSON.stringify(sorted, null, 4) + "\n");
console.log(`lastmod.json: ${Object.keys(sorted).length} pages`);
