import Link from "next/link";

import { ArchMark } from "@/components/dashboard/arch-mark";

const COLUMNS = [
  {
    head: "استكشف",
    links: [{ t: "كل المساكن", href: "/projects" }],
  },
  {
    head: "الشركة",
    links: [
      { t: "عن مَعلم", href: "/about" },
      { t: "تواصل معنا", href: "/contact" },
    ],
  },
  {
    head: "الحساب",
    links: [
      { t: "تسجيل الدخول", href: "/login" },
      { t: "إنشاء حساب", href: "/register" },
      { t: "سوّق مشروعك", href: "/register/apply" },
    ],
  },
] as const;

export function SiteFooter() {
  return (
    <footer dir="rtl" className="border-t border-foreground/10 bg-background text-foreground">
      <div className="mx-auto max-w-[1320px] px-5 pt-16 pb-9 md:px-10">
        <div className="grid grid-cols-2 gap-8 border-b border-foreground/10 pb-12 md:grid-cols-[2fr_1fr_1fr_1fr] md:gap-11">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-[11px] text-pine">
              <ArchMark />
              <span className="font-serif text-[28px] font-bold text-foreground">مَعلم</span>
            </div>
            <p className="mt-[18px] max-w-[34ch] text-sm leading-[1.8] font-light text-muted-dark">
              العنوان الموثوق للمعيشة الفاخرة في المملكة. نصل بين المساكن الاستثنائية ومقتنيها
              بعنايةٍ وخصوصية.
            </p>
          </div>

          {COLUMNS.map((col) => (
            <div key={col.head}>
              <div className="mb-4 text-xs font-bold tracking-wide text-pine">{col.head}</div>
              {col.links.map((link) => (
                <div key={link.href} className="mb-[11px]">
                  <Link
                    href={link.href}
                    className="text-sm font-light text-muted-strong transition-colors hover:text-foreground"
                  >
                    {link.t}
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="flex flex-col items-start gap-3.5 pt-7 text-[12.5px] text-muted sm:flex-row sm:items-center sm:justify-between sm:gap-0">
          <span>© ٢٠٢٦ مَعلم للاستثمار العقاري. جميع الحقوق محفوظة.</span>
          <span dir="ltr" className="tracking-wide">
            RIYADH · JEDDAH · DAMMAM
          </span>
        </div>
      </div>
    </footer>
  );
}
