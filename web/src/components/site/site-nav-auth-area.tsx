"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

import { SiteNavUserMenu } from "@/components/site/site-nav-user-menu";

// Session now resolves client-side (see AppSessionProvider) so the public
// layout no longer has to call auth() server-side. While that resolves,
// show a neutral placeholder — never the logged-out links — so a signed-in
// visitor never sees an incorrect "logged out" flash.
export function SiteNavAuthArea() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div className="h-9 w-24 animate-pulse rounded-full bg-sand" aria-hidden="true" />;
  }

  if (session?.user) {
    return <SiteNavUserMenu user={session.user} />;
  }

  return (
    <>
      <Link
        href="/login"
        className="hidden text-[13.5px] font-medium text-muted-strong transition-colors hover:text-pine sm:inline"
      >
        تسجيل الدخول
      </Link>
      <Link
        href="/contact"
        className="rounded-[10px] bg-pine px-5 py-2.5 text-[13.5px] font-semibold text-cream transition-colors hover:bg-pine-dark"
      >
        احجز استشارة
      </Link>
    </>
  );
}
