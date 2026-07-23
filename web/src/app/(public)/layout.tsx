import { auth } from "@/auth";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

// Nav reflects live session state — never prerender.
export const dynamic = "force-dynamic";

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <div className="flex min-h-screen flex-col">
      <SiteNav session={session} />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}
