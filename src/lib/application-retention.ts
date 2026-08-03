import "server-only";
import { inArray, lt, notInArray, and } from "drizzle-orm";
import { db } from "@/db";
import { cvFiles, jobApplications } from "@/db/schema";
import { getConfig } from "@/lib/app-config";

/**
 * GDPR retention cleanup for job applications and their CV files.
 *
 * The privacy policy promises deletion at most 12 months after
 * submission. There is no cron infrastructure — this runs
 * opportunistically (fire-and-forget) when an application is submitted
 * and when an admin lists applications, which is more than frequent
 * enough at this volume.
 *
 * Config key (app_config): `application_retention_days` — default 365.
 * Set to 0 to disable automatic cleanup.
 */
export async function cleanupExpiredApplications(): Promise<void> {
    try {
        const raw = await getConfig("application_retention_days", "365");
        const days = parseInt(raw, 10);
        if (!Number.isFinite(days) || days <= 0) return; // 0 = disabled

        const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

        await db.transaction(async (tx) => {
            const expired = await tx
                .select({ id: jobApplications.id })
                .from(jobApplications)
                .where(lt(jobApplications.createdAt, cutoff));

            if (expired.length > 0) {
                await tx.delete(jobApplications).where(
                    inArray(jobApplications.id, expired.map((e) => e.id)),
                );
            }

            // Remove CV files past retention that no remaining application
            // references (also sweeps up any orphaned files).
            const deletedFiles = await tx
                .delete(cvFiles)
                .where(
                    and(
                        lt(cvFiles.createdAt, cutoff),
                        notInArray(
                            cvFiles.path,
                            tx.select({ path: jobApplications.cvPath }).from(jobApplications),
                        ),
                    ),
                )
                .returning({ id: cvFiles.id });

            if (expired.length > 0 || deletedFiles.length > 0) {
                console.log(
                    `[application-retention] Deleted ${expired.length} application(s) and ${deletedFiles.length} CV file(s) older than ${days} days.`,
                );
            }
        });
    } catch (err) {
        // Never let cleanup break the calling request
        console.warn("[application-retention] Cleanup failed:", err);
    }
}
