"use server";

import { logError } from "@/lib/log-error";

/**
 * error.tsx / global-error.tsx are Client Components — calling logError()
 * directly from their useEffect would run console.error() in the browser,
 * never reaching Vercel's server-side Runtime Logs. This server action is
 * the bridge: the client boundary calls this, which runs on the server and
 * actually gets captured.
 */
export async function logClientError(
  context: string,
  message: string,
  extra?: { digest?: string; stack?: string },
): Promise<void> {
  const reconstructed = new Error(message);
  if (extra?.stack) reconstructed.stack = extra.stack;
  logError(context, reconstructed, { digest: extra?.digest, origin: "client" });
}
