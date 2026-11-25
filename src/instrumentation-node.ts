import path from "path";
import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { migrate } from "drizzle-orm/node-postgres/migrator";

export async function runMigrations(connectionString: string) {
    const pool = new Pool({ connectionString, max: 1 });
    try {
        await migrate(drizzle(pool), { migrationsFolder: path.join(process.cwd(), "drizzle") });
        console.log("[migrations] database schema is up to date");
    } finally {
        await pool.end();
    }
}
