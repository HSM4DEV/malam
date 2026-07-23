import Link from "next/link";
import Image from "next/image";

import { ArchMark } from "@/components/dashboard/arch-mark";

export function AuthShell({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="grid min-h-screen grid-cols-1 md:grid-cols-2">
      <div className="flex flex-col px-6 py-9 sm:px-10">
        <Link href="/" className="flex items-center gap-[11px] text-pine">
          <ArchMark />
          <span className="font-serif text-2xl font-bold text-foreground">مَعلم</span>
        </Link>

        <div className="mx-auto flex w-full max-w-[440px] flex-1 flex-col justify-center py-10">
          {children}
        </div>

        <div className="text-center text-[12.5px] text-muted">© ٢٠٢٦ مَعلم للاستثمار العقاري</div>
      </div>

      <aside className="relative hidden overflow-hidden md:block">
        <Image
          src="https://picsum.photos/seed/auth-bg/1000/1400.webp"
          alt="مسكنٌ فاخرٌ في الرياض عند الغسق"
          fill
          sizes="50vw"
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-pine-dark/35 to-pine-dark/85" />
        <div className="absolute inset-0 flex flex-col justify-end p-14 text-[#EAF0ED]">
          <blockquote className="max-w-[22ch] font-serif text-[clamp(26px,2.6vw,38px)] leading-[1.45] font-medium">
            «العنوان الموثوق للمعيشة الفاخرة في المملكة.»
          </blockquote>
          <div className="mt-9 flex gap-9">
            <Stat value="+١٤٠٠" label="مسكن منسّق" />
            <Stat value="+٤٠٠" label="وسيطٌ معتمد" />
            <Stat value="٩٨٪" label="رضا العملاء" />
          </div>
        </div>
      </aside>
    </div>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-[34px] font-semibold text-cream">{value}</div>
      <div className="mt-1 text-[13px] text-pine-mist">{label}</div>
    </div>
  );
}
