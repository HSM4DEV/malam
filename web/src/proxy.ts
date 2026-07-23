import { NextResponse } from "next/server";

import { auth } from "@/auth";

const DASHBOARD_ROLES = new Set(["DEVELOPER", "BROKER"]);

export default auth((req) => {
  const session = req.auth;
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin");

  if (!session?.user) {
    const loginUrl = new URL("/login", req.url);
    loginUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAdminRoute) {
    if (session.user.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
    return NextResponse.next();
  }

  // Only developer/broker accounts with a company attached have a dashboard
  // to see — buyers, admins, and not-yet-provisioned pro accounts don't.
  if (!DASHBOARD_ROLES.has(session.user.role) || !session.user.companyId) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
