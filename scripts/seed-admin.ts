/**
 * seed-admin.ts
 * -------------
 * CLI script to create (or update) the admin user in Postgres.
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/seed-admin.ts
 */

import bcrypt from "bcryptjs";
import { getDb, schema } from "./db";

const ADMIN_EMAIL = "office@doderasoft.com";
const ADMIN_PASSWORD = "...change-me-to-a-secure-password...";
const ADMIN_NAME = "Dodera";

async function main() {
    const { db, pool } = getDb();

    // Hash the password with bcrypt (12 rounds)
    const passwordHash = await bcrypt.hash(ADMIN_PASSWORD, 12);

    try {
        // Upsert admin user
        const [data] = await db
            .insert(schema.adminUsers)
            .values({
                email: ADMIN_EMAIL,
                passwordHash,
                name: ADMIN_NAME,
            })
            .onConflictDoUpdate({
                target: schema.adminUsers.email,
                set: { passwordHash, name: ADMIN_NAME },
            })
            .returning({
                id: schema.adminUsers.id,
                email: schema.adminUsers.email,
                name: schema.adminUsers.name,
            });

        console.log("✓ Admin user seeded successfully:");
        console.log(`  ID:    ${data.id}`);
        console.log(`  Email: ${data.email}`);
        console.log(`  Name:  ${data.name}`);
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
