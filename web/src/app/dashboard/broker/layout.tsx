import { DeveloperSidebar } from "@/components/dashboard/developer-sidebar";
import { getBrokerShell } from "@/lib/data/company";

// Dashboard reads live, per-request data from Postgres — never prerender it.
export const dynamic = "force-dynamic";

export default async function BrokerDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { account, nav } = await getBrokerShell();

  return (
    <div className="grid min-h-screen grid-cols-1 dash:grid-cols-[264px_1fr]">
      <DeveloperSidebar account={account} nav={nav} roleBadge="وسيط" />
      <main className="flex min-w-0 flex-col">{children}</main>
    </div>
  );
}
