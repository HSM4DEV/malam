import { Plus, Sparkle } from "lucide-react";

import { Button } from "@/components/ui/button";

export function NextPhaseCta() {
  return (
    <div className="animate-fade-up rounded-2xl border border-dashed border-foreground/20 bg-surface px-10 py-10 text-center">
      <div className="mx-auto mb-4 flex size-[54px] items-center justify-center rounded-2xl bg-sage text-pine">
        <Sparkle className="size-[22px]" aria-hidden="true" />
      </div>
      <div className="mb-2 font-serif text-[22px] font-semibold">أطلق مرحلتك القادمة</div>
      <p className="mx-auto mb-5 max-w-[40ch] text-sm font-light text-muted-dark">
        لا توجد مشاريع مسوّدة حالياً. ابدأ بإضافة مشروعٍ جديد ليصل إلى آلاف المشترين المؤهّلين.
      </p>
      <Button type="button" aria-disabled="true" title="إضافة مشروع جديد (قريبًا)">
        <Plus className="size-4" aria-hidden="true" />
        إضافة مشروع
      </Button>
    </div>
  );
}
