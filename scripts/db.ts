/**
 * db.ts — shared DB handle for CLI scripts.
 *
 * Deliberately separate from src/db/index.ts: that module imports
 * "server-only", which throws outside the Next.js server bundle.
 * Scripts run under plain tsx, so they build their own pool here.
 *
 * Requires DATABASE_URL in .env (scripts run via `tsx --env-file=.env`).
 */
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "../src/db/schema";

export function getDb() {
    const url = process.env.DATABASE_URL;
    if (!url) {
        console.error("Error: DATABASE_URL must be set in .env");
        process.exit(1);
    }

    const pool = new Pool({ connectionString: url, max: 2 });
    return { db: drizzle(pool, { schema }), pool };
}

export { schema };
