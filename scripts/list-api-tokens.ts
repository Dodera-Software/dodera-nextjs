/**
 * list-api-tokens.ts
 * -------------------
 * CLI script to list all API tokens (without revealing the hash).
 *
 * Usage:
 *   npx tsx scripts/list-api-tokens.ts
 *   npx tsx scripts/list-api-tokens.ts --all    (include revoked)
 */

import { desc, isNull } from "drizzle-orm";
import { getDb, schema } from "./db";

async function main() {
    const showAll = process.argv.includes("--all");
    const { db, pool } = getDb();
    const { apiTokens } = schema;

    let data;
    try {
        data = await db
            .select({
                id: apiTokens.id,
                name: apiTokens.name,
                created_at: apiTokens.createdAt,
                expires_at: apiTokens.expiresAt,
                revoked_at: apiTokens.revokedAt,
                last_used_at: apiTokens.lastUsedAt,
            })
            .from(apiTokens)
            .where(showAll ? undefined : isNull(apiTokens.revokedAt))
            .orderBy(desc(apiTokens.createdAt));
    } catch (err) {
        console.error("Query error:", err instanceof Error ? err.message : err);
        process.exit(1);
    } finally {
        await pool.end();
    }

    if (data.length === 0) {
        console.log("No tokens found.");
        return;
    }

    console.log("");
    console.log(
        "ID".padEnd(6) +
        "Name".padEnd(25) +
        "Created".padEnd(14) +
        "Expires".padEnd(14) +
        "Revoked".padEnd(14) +
        "Last Used",
    );
    console.log("─".repeat(90));

    for (const t of data) {
        const created = t.created_at ? t.created_at.toLocaleDateString() : "–";
        const expires = t.expires_at ? t.expires_at.toLocaleDateString() : "never";
        const revoked = t.revoked_at ? t.revoked_at.toLocaleDateString() : "–";
        const lastUsed = t.last_used_at ? t.last_used_at.toLocaleDateString() : "never";

        const isExpired = t.expires_at && t.expires_at < new Date();
        const status = t.revoked_at
            ? " [REVOKED]"
            : isExpired
                ? " [EXPIRED]"
                : "";

        console.log(
            String(t.id).padEnd(6) +
            (t.name + status).padEnd(25) +
            created.padEnd(14) +
            expires.padEnd(14) +
            revoked.padEnd(14) +
            lastUsed,
        );
    }

    console.log("");
}

main();
