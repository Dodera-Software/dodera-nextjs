import "server-only";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import * as schema from "./schema";

/**
 * Server-only Postgres client (Drizzle over node-postgres).
 *
 * This module is guarded by the `server-only` package — importing it
 * from a Client Component will throw a build-time error, ensuring
 * credentials never leak to the browser.
 *
 * The pool is cached on `globalThis` so hot reloads in dev don't
 * exhaust Postgres connections.
 */
const globalForDb = globalThis as unknown as { pgPool?: Pool };

const pool =
    globalForDb.pgPool ??
    new Pool({
        connectionString: process.env.DATABASE_URL,
        max: 10,
    });

if (process.env.NODE_ENV !== "production") {
    globalForDb.pgPool = pool;
}

export const db = drizzle(pool, { schema });
export { schema };
