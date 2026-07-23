import type { Metadata } from "next";

import { DeveloperApplyForm } from "@/components/site/developer-apply-form";

export const metadata: Metadata = { title: "سوّق مشروعك — مَعلم" };

export default function RegisterApplyPage() {
  return (
    <div dir="rtl" className="mx-auto max-w-[720px] px-5 py-16 sm:px-10 md:py-24">
      <div className="mb-9 text-center">
        <div className="mb-3.5 text-[12.5px] font-bold tracking-wide text-pine">للمطوّرين والوسطاء</div>
        <h1 className="mb-4 font-serif text-[clamp(30px,4.6vw,50px)] leading-[1.14] font-semibold">
          اعرض مشروعك أمام المشتري الصحيح.
        </h1>
        <p className="mx-auto max-w-[52ch] text-[17px] leading-[1.75] font-light text-muted-strong">
          حساب المطوّر والوسيط يُنشأ بعد مراجعة قصيرة من فريقنا — أخبرنا عن مشروعك وسنعاود التواصل
          معك لتفعيل لوحة التحكم الخاصة بشركتك.
        </p>
      </div>
      <DeveloperApplyForm />
    </div>
  );
}
