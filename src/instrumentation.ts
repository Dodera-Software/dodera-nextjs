/**
 * Runs once when the server starts, before it serves a request (Next.js instrumentation).
 *
 * In production it applies any pending database migrations from `drizzle/` (copied into
 * the image by the Dockerfile) with Drizzle's own migrator, which records each one in
 * `drizzle.__drizzle_migrations` exactly as `npm run db:migrate` does. A failed migration
 * stops the server from starting, so Coolify's health check keeps the previous container
 * serving instead of a new one running against the wrong schema. In development, run
 * `npm run db:migrate` yourself.
 */
export async function register() {
    if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
    if (!process.env.DATABASE_URL) return;

    const path = await import("node:path");
    const { Pool } = await import("pg");
    const { drizzle } = await import("drizzle-orm/node-postgres");
    const { migrate } = await import("drizzle-orm/node-postgres/migrator");

    const pool = new Pool({ connectionString: process.env.DATABASE_URL, max: 1 });
    try {
        await migrate(drizzle(pool), { migrationsFolder: path.join(process.cwd(), "drizzle") });
        console.log("[migrations] database schema is up to date");
    } finally {
        await pool.end();
    }
}
