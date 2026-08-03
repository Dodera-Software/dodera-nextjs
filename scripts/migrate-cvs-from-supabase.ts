/**
 * migrate-cvs-from-supabase.ts
 * ----------------------------
 * ONE-TIME migration script: copies every CV referenced by
 * job_applications.cv_path from the Supabase Storage bucket "cvs"
 * into the local cv_files table (bytea).
 *
 * Run AFTER the table data has been imported into the new Postgres
 * (job_applications must be populated so the script knows which
 * files to fetch).
 *
 * Required env vars (put them in .env for the run):
 *   DATABASE_URL          — the NEW Postgres 18 connection string
 *   SUPABASE_URL          — the OLD Supabase project URL
 *   SUPABASE_SECRET_KEY   — the OLD Supabase service-role/secret key
 *
 * Usage:
 *   npx tsx --env-file=.env scripts/migrate-cvs-from-supabase.ts
 *
 * Idempotent: files whose path already exists in cv_files are skipped.
 */

import { eq } from "drizzle-orm";
import { getDb, schema } from "./db";

const MIME_BY_EXT: Record<string, string> = {
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".rtf": "application/rtf",
    ".odt": "application/vnd.oasis.opendocument.text",
    ".txt": "text/plain",
};

async function main() {
    const supabaseUrl = process.env.SUPABASE_URL?.replace(/\/$/, "");
    const supabaseKey = process.env.SUPABASE_SECRET_KEY;

    if (!supabaseUrl || !supabaseKey) {
        console.error("Error: SUPABASE_URL and SUPABASE_SECRET_KEY must be set in .env");
        process.exit(1);
    }

    const { db, pool } = getDb();
    const { jobApplications, cvFiles } = schema;

    try {
        const applications = await db
            .select({ id: jobApplications.id, cvPath: jobApplications.cvPath })
            .from(jobApplications);

        const paths = [...new Set(applications.map((a) => a.cvPath))];
        console.log(`Found ${applications.length} application(s), ${paths.length} unique CV path(s).`);

        let migrated = 0;
        let skipped = 0;
        let failed = 0;

        for (const path of paths) {
            const existing = await db
                .select({ id: cvFiles.id })
                .from(cvFiles)
                .where(eq(cvFiles.path, path))
                .limit(1);

            if (existing.length > 0) {
                skipped++;
                continue;
            }

            // Download from the private bucket via the Storage REST API
            const url = `${supabaseUrl}/storage/v1/object/cvs/${path
                .split("/")
                .map(encodeURIComponent)
                .join("/")}`;

            const res = await fetch(url, {
                headers: {
                    apikey: supabaseKey,
                    Authorization: `Bearer ${supabaseKey}`,
                },
            });

            if (!res.ok) {
                console.error(`  ✗ ${path} — download failed (${res.status} ${res.statusText})`);
                failed++;
                continue;
            }

            const data = Buffer.from(await res.arrayBuffer());
            const filename = path.split("/").pop() ?? path;
            const ext = filename.slice(filename.lastIndexOf(".")).toLowerCase();
            const contentType =
                res.headers.get("content-type")?.split(";")[0].trim() ||
                MIME_BY_EXT[ext] ||
                "application/octet-stream";

            await db.insert(cvFiles).values({ path, filename, contentType, data });

            console.log(`  ✓ ${path} (${(data.byteLength / 1024).toFixed(1)} KB)`);
            migrated++;
        }

        console.log("");
        console.log(`Done. Migrated: ${migrated}, skipped (already present): ${skipped}, failed: ${failed}`);
        if (failed > 0) process.exitCode = 1;
    } finally {
        await pool.end();
    }
}

main().catch((err) => {
    console.error("Unexpected error:", err);
    process.exit(1);
});
