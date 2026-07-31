import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "الصفحة غير موجودة · مَعلم",
};

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <div className="mb-3 text-sm font-semibold text-pine">٤٠٤</div>
      <h1 className="mb-3 font-serif text-[32px] font-semibold">الصفحة غير موجودة</h1>
      <p className="mx-auto mb-7 max-w-[42ch] text-sm text-muted-strong">
        الرابط الذي فتحته غير موجود أو تم نقله.
      </p>
      <Button asChild>
        <Link href="/">العودة للرئيسية</Link>
      </Button>
    </div>
  );
}
