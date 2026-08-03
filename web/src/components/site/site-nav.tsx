import Link from "next/link";

import { ArchMark } from "@/components/dashboard/arch-mark";
import { SiteNavAuthArea } from "@/components/site/site-nav-auth-area";

const LINKS = [
  { key: "projects", label: "المساكن", href: "/projects" },
  { key: "brokers", label: "الوسطاء", href: "/brokers" },
  { key: "market-your-project", label: "سوّق مشروعك", href: "/market-your-project" },
  { key: "about", label: "عن مَعلم", href: "/about" },
  { key: "blog", label: "المدوّنة", href: "/blog" },
  { key: "faq", label: "الأسئلة", href: "/faq" },
  { key: "contact", label: "تواصل", href: "/contact" },
] as const;

export function SiteNav() {
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
          <SiteNavAuthArea />
        </div>
      </div>
    </nav>
  );
}
