/**
 * Reconcile critical schema drift before any DB-integration file runs. CI runs
 * drizzle push-force, but local/shared DBs may lag (especially on Windows).
 * Lazy-import @workspace/db so pure unit tests can run without DATABASE_URL.
 */
export default async function globalSetup(): Promise<void> {
  if (!process.env.DATABASE_URL) return;
  const { ensureSchemaPatches } = await import("@workspace/db");
  await ensureSchemaPatches();
}
