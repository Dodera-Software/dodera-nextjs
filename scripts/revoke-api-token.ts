/**
 * revoke-api-token.ts
 * --------------------
 * CLI script to revoke an existing API token by its name or ID.
 *
 * Usage:
 *   npx tsx scripts/revoke-api-token.ts --name "CI pipeline"
 *   npx tsx scripts/revoke-api-token.ts --id 3
 */

import { and, eq, isNull } from "drizzle-orm";
import { getDb, schema } from "./db";

/* ── Parse CLI args ─────────────────────────────────────────── */
function parseArgs(): { name: string | null; id: number | null } {
    const args = process.argv.slice(2);
    let name: string | null = null;
    let id: number | null = null;

    for (let i = 0; i < args.length; i++) {
        if (args[i] === "--name" && args[i + 1]) {
            name = args[++i];
        } else if (args[i] === "--id" && args[i + 1]) {
            id = parseInt(args[++i], 10);
            if (isNaN(id)) {
                console.error("Error: --id must be a number.");
                process.exit(1);
            }
        }
    }

    if (!name && !id) {
        console.error("Error: --name or --id is required.");
        console.error(
            'Usage: npx tsx scripts/revoke-api-token.ts --name "My token"',
        );
        process.exit(1);
    }

    return { name, id };
}

/* ── Main ───────────────────────────────────────────────────── */
async function main() {
    const { name, id } = parseArgs();
    const { db, pool } = getDb();
    const { apiTokens } = schema;

    const matcher = id ? eq(apiTokens.id, id) : eq(apiTokens.name, name!);

    let data;
    try {
        data = await db
            .update(apiTokens)
            .set({ revokedAt: new Date() })
            .where(and(matcher, isNull(apiTokens.revokedAt))) // only revoke active tokens
            .returning({ id: apiTokens.id, name: apiTokens.name });
    } catch (err) {
        console.error("Update error:", err instanceof Error ? err.message : err);
        process.exit(1);
    } finally {
        await pool.end();
    }

    if (data.length === 0) {
        console.log("No active token found matching that criteria.");
        process.exit(0);
    }

    for (const token of data) {
        console.log(`✓ Revoked token #${token.id} "${token.name}"`);
    }
}

main();
