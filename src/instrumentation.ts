export async function register() {
    if (process.env.NEXT_RUNTIME === "nodejs" && process.env.NODE_ENV === "production" && process.env.DATABASE_URL) {
        const { runMigrations } = await import("./instrumentation-node");
        await runMigrations(process.env.DATABASE_URL);
    }
}
