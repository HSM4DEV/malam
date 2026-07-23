import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/**
 * Supabase Storage — used only as an object store for project/unit imagery.
 * (Auth stays on NextAuth; the database is accessed via Prisma.)
 *
 * There's no upload UI in the dashboard yet, so image references remain the
 * seeded placeholder seeds. This client is the seam for a future upload flow:
 * once configured, call `getStorageBucket().upload(path, file)` and persist the
 * returned public URL on the Project/Unit record.
 */
let cached: SupabaseClient | null = null;

export function isStorageConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY,
  );
}

function getClient(): SupabaseClient {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and " +
        "SUPABASE_SERVICE_ROLE_KEY in your environment.",
    );
  }

  cached ??= createClient(url, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return cached;
}

export function getStorageBucket() {
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "project-images";
  return getClient().storage.from(bucket);
}
