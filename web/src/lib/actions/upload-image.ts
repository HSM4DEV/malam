"use server";

import { randomUUID } from "node:crypto";

import { getStorageBucket, isStorageConfigured } from "@/lib/storage";

/**
 * Uploads an image to Supabase Storage and returns its public URL — ready to
 * persist on a Project/Unit record. There's no upload UI wired yet, so this is
 * the prepared server action a future "change cover image" control will call.
 *
 * Requires NEXT_PUBLIC_SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY to be set;
 * throws a clear error otherwise (never runs with invented credentials).
 */
export async function uploadProjectImage(formData: FormData): Promise<{ url: string }> {
  if (!isStorageConfigured()) {
    throw new Error(
      "Supabase Storage is not configured. Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.",
    );
  }

  const file = formData.get("file");
  if (!(file instanceof File)) {
    throw new Error("No file provided under the `file` field.");
  }

  const extension = file.name.includes(".") ? file.name.split(".").pop() : "jpg";
  const path = `projects/${randomUUID()}.${extension}`;

  const bucket = getStorageBucket();
  const { error } = await bucket.upload(path, file, {
    contentType: file.type || "application/octet-stream",
    upsert: false,
  });
  if (error) {
    throw new Error(`Upload failed: ${error.message}`);
  }

  return { url: bucket.getPublicUrl(path).data.publicUrl };
}
