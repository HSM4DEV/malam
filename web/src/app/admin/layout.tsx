import Link from "next/link";

import { ArchMark } from "@/components/dashboard/arch-mark";
import { signOutAction } from "@/lib/actions/sign-out";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-background">
      <header className="border-b border-foreground/10 bg-surface">
        <div className="mx-auto flex h-[68px] max-w-[1100px] items-center justify-between px-6">
          <Link href="/admin/applications" className="flex items-center gap-2.5 text-pine">
            <ArchMark />
            <span className="font-serif text-xl font-bold text-foreground">مَعلم</span>
            <span className="rounded-md bg-sage px-2 py-[3px] text-[10px] font-semibold text-pine">
              لوحة الإدارة
            </span>
          </Link>
          <form action={signOutAction}>
            <button type="submit" className="text-[13.5px] font-medium text-muted-strong hover:text-pine">
              تسجيل الخروج
            </button>
          </form>
        </div>
      </header>
      <main className="mx-auto max-w-[1100px] px-6 py-10">{children}</main>
    </div>
  );
}
