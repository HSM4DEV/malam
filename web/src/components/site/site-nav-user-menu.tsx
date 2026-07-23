"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, LayoutDashboard, LogOut } from "lucide-react";
import type { Session } from "next-auth";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { initialOf } from "@/lib/format";
import { signOutAction } from "@/lib/actions/sign-out";

export function SiteNavUserMenu({ user }: { user: NonNullable<Session["user"]> }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const canAccessDashboard = user.role === "DEVELOPER" || user.role === "BROKER";

  useEffect(() => {
    function onClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-full py-1 pe-1 ps-2.5 transition-colors hover:bg-sand"
        aria-expanded={open}
      >
        <span className="hidden text-[13.5px] font-medium text-foreground sm:inline">
          {user.name ?? user.email}
        </span>
        <Avatar className="size-8">
          <AvatarFallback className="bg-pine text-[13px] text-cream">
            {initialOf(user.name ?? user.email ?? "؟")}
          </AvatarFallback>
        </Avatar>
        <ChevronDown className="size-3.5 text-muted" aria-hidden="true" />
      </button>

      {open ? (
        <div className="absolute end-0 top-[calc(100%+8px)] w-56 overflow-hidden rounded-xl border border-foreground/10 bg-surface py-1.5 shadow-[0_20px_50px_-24px_rgba(23,24,26,.4)]">
          {canAccessDashboard ? (
            <Link
              href="/dashboard/developer"
              className="flex items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-foreground hover:bg-cream"
              onClick={() => setOpen(false)}
            >
              <LayoutDashboard className="size-4 text-muted" aria-hidden="true" />
              لوحة التحكم
            </Link>
          ) : null}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-[13.5px] text-clay hover:bg-cream"
            >
              <LogOut className="size-4" aria-hidden="true" />
              تسجيل الخروج
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
