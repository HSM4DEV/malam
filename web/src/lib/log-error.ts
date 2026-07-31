/**
 * No external observability tool is wired up — Vercel already captures every
 * console.error from Server Components/Actions/Route Handlers into its
 * Runtime Logs, so a structured line here is what "error tracking" means in
 * this app today. `error.digest` (present on errors caught by error.tsx /
 * global-error.tsx) is how a user-reported digest can be matched back to the
 * corresponding log entry.
 */
export function logError(context: string, error: unknown, extra?: Record<string, unknown>): void {
  const digest = typeof error === "object" && error && "digest" in error ? error.digest : undefined;

  console.error(
    JSON.stringify({
      context,
      message: error instanceof Error ? error.message : String(error),
      digest,
      stack: error instanceof Error ? error.stack : undefined,
      ...extra,
    }),
  );
}
