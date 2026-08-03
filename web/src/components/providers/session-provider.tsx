"use client";

import { SessionProvider } from "next-auth/react";

// Lets the public site's nav read session state client-side (useSession())
// instead of the layout calling auth() server-side — the latter forces every
// public page dynamic, even ones with zero DB/session dependency of their own.
export function AppSessionProvider({ children }: { children: React.ReactNode }) {
  return <SessionProvider>{children}</SessionProvider>;
}
