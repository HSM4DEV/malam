"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ArchMark } from "@/components/dashboard/arch-mark";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import type { DashboardNavItem, DeveloperAccount } from "@/types/dashboard";

interface DeveloperSidebarProps {
  account: DeveloperAccount;
  nav: DashboardNavItem[];
}

export function DeveloperSidebar({ account, nav }: DeveloperSidebarProps) {
  const pathname = usePathname();

  // Active = the nav item whose href is the longest prefix of the current path,
  // so the base Overview route doesn't light up on every sub-page.
  const activeHref = nav
    .filter((item) => pathname === item.href || pathname.startsWith(`${item.href}/`))
    .sort((a, b) => b.href.length - a.href.length)[0]?.href;

  return (
    <aside className="sticky top-0 hidden h-screen flex-col bg-pine-dark px-5 pt-[26px] pb-[26px] text-[#EAF0ED] dash:flex">
      <Link
        href="/"
        className="flex items-center gap-[11px] border-b border-cream/12 px-2 pb-6 text-cream"
      >
        <ArchMark />
        <span className="font-serif text-2xl font-bold">مَعلم</span>
        <span className="rounded-md bg-pine-mist/20 px-2 py-[3px] text-[9px] font-semibold text-pine-mist">
          مطوّر
        </span>
      </Link>

      <nav className="mt-[22px] flex flex-1 flex-col gap-1">
        {nav.map((item) => (
          <SidebarNavItem key={item.key} item={item} isActive={item.href === activeHref} />
        ))}
      </nav>

      <div className="flex items-center gap-3 border-t border-cream/12 pt-4">
        <Avatar className="size-10 border border-cream/20">
          <AvatarImage
            src={`https://picsum.photos/seed/${account.avatarSeed}/160/160.webp`}
            alt={account.avatarAlt}
          />
          <AvatarFallback className="bg-pine-mist/20 text-pine-mist">
            {account.companyName.slice(0, 1)}
          </AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <div className="truncate text-sm font-semibold text-cream">
            {account.companyName}
          </div>
          <div className="text-xs text-pine-mist">{account.roleLabel}</div>
        </div>
        <button
          type="button"
          aria-disabled="true"
          title="تسجيل الخروج (قريبًا)"
          className="text-base text-pine-mist transition-colors hover:text-cream"
        >
          ⏻
        </button>
      </div>
    </aside>
  );
}

function SidebarNavItem({
  item,
  isActive,
}: {
  item: DashboardNavItem;
  isActive: boolean;
}) {
  return (
    <Link
      href={item.href}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "flex items-center gap-[13px] rounded-[11px] px-3.5 py-3 text-[14.5px] transition-colors",
        isActive
          ? "bg-pine-mist/16 font-semibold text-cream"
          : "font-normal text-[#B9CEC7] hover:bg-cream/[0.06]",
      )}
    >
      <span className="w-[22px] text-center text-base">{item.icon}</span>
      <span>{item.label}</span>
      {item.badge ? (
        <span className="ms-auto rounded-full bg-clay px-2 py-0.5 text-[11px] font-bold text-cream">
          {item.badge}
        </span>
      ) : null}
    </Link>
  );
}
