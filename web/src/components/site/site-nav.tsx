import Link from "next/link";
import type { Session } from "next-auth";

import { ArchMark } from "@/components/dashboard/arch-mark";
import { SiteNavUserMenu } from "@/components/site/site-nav-user-menu";

const LINKS = [
  { key: "projects", label: "المساكن", href: "/projects" },
  { key: "about", label: "عن مَعلم", href: "/about" },
  { key: "contact", label: "تواصل", href: "/contact" },
] as const;

export function SiteNav({ session }: { session: Session | null }) {
  return (
    <nav
      dir="rtl"
      className="sticky top-0 z-50 border-b border-foreground/10 bg-cream/92 backdrop-blur-md"
    >
      <div className="mx-auto flex h-[74px] max-w-[1320px] items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-[11px] text-pine">
          <ArchMark />
          <span className="flex flex-col leading-none">
            <span className="font-serif text-[25px] font-bold text-foreground">مَعلم</span>
            <span className="mt-[3px] text-[8px] font-semibold tracking-[4px] text-pine" dir="ltr">
              MA&apos;LAM
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.key}
              href={link.href}
              className="text-sm font-medium text-muted-strong transition-colors hover:text-pine"
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          {session?.user ? (
            <SiteNavUserMenu user={session.user} />
          ) : (
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
          )}
        </div>
      </div>
    </nav>
  );
}
