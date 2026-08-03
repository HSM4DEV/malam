import { AppSessionProvider } from "@/components/providers/session-provider";
import { SiteNav } from "@/components/site/site-nav";
import { SiteFooter } from "@/components/site/site-footer";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppSessionProvider>
      <div className="flex min-h-screen flex-col">
        <SiteNav />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </div>
    </AppSessionProvider>
  );
}
