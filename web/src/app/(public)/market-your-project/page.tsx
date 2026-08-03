import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { MarketProjectForm } from "@/components/site/market-project-form";

export const metadata: Metadata = {
  title: "سوّق مشروعك — مَعلم",
  description: "اعرض مشروعك أمام المشتري الصحيح. أرسل تفاصيل مشروعك وسيتواصل معك مستشار الشراكات خلال ٢٤ ساعة.",
};

const PROMISES = [
  { title: "ردٌّ خلال ٢٤ ساعة", body: "مستشارٌ مخصّص يتواصل معك بعرضٍ تقديميٍّ لمشروعك." },
  { title: "عرضٌ دون التزام", body: "استكشف الفكرة والتكلفة قبل أي اتفاق." },
  { title: "جمهورٌ مؤهّل", body: "وصولٌ إلى مشترين ووسطاء مُتحقَّقين فقط." },
  { title: "خصوصيةٌ تامّة", body: "تُعامَل بياناتك ومشروعك بسريّةٍ كاملة." },
] as const;

const PROCESS = [
  { no: "٠١", title: "مكالمة تعارف", body: "نفهم المشروع وأهدافك التسويقية ونتّفق على النطاق." },
  { no: "٠٢", title: "إعداد العرض", body: "ننتج الصفحة التحريرية والتصوير ونطلقها بعد موافقتك." },
  { no: "٠٣", title: "الإطلاق والمتابعة", body: "ننشر المشروع ونشاركك تقارير الأداء والصفقات أولاً بأول." },
] as const;

const FAQS = [
  { q: "كم تستغرق عملية الإدراج؟", a: "من تأكيد التفاصيل حتى الإطلاق عادةً ما بين ٧ و١٤ يوم عمل، حسب جاهزية المواد." },
  { q: "هل أحتاج إلى تصويرٍ جاهز؟", a: "لا. نوفّر تصويراً معمارياً احترافياً ضمن الباقتين الاحترافية والحصرية." },
  { q: "كيف تُحتسب التكلفة؟", a: "نعمل بنموذج نسبةٍ من المبيعات أو اتفاقيةٍ مخصّصة للمشاريع الكبرى — دون رسومٍ مقدّمة خفيّة." },
  { q: "من يرى مشروعي؟", a: "قاعدةٌ من المشترين المؤهّلين والوسطاء المعتمدين فقط، مع خيار الإطلاق الخاص." },
] as const;

export default function MarketYourProjectPage() {
  return (
    <div dir="rtl">
      {/* HERO + FORM */}
      <header className="mx-auto max-w-[1320px] px-5 pt-16 pb-20 sm:px-10">
        <div className="grid grid-cols-1 items-start gap-9 md:grid-cols-[1fr_1.05fr] md:gap-14">
          {/* value side */}
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-pine/18 bg-sage px-3.5 py-1.5">
              <span className="size-1.5 rounded-full bg-pine" />
              <span className="text-[12.5px] font-semibold text-pine">سوّق مشروعك</span>
            </div>
            <h1 className="max-w-[15ch] font-serif text-[clamp(38px,4.6vw,62px)] leading-[1.14] font-semibold">
              اعرض مشروعك أمام المشتري الصحيح.
            </h1>
            <p className="mt-5 max-w-[44ch] text-[17.5px] leading-[1.75] font-light text-muted-strong">
              أرسل تفاصيل مشروعك، وسيتواصل معك مستشار الشراكات خلال ٢٤ ساعة بعرضٍ تقديميٍّ مخصّص — دون
              التزام.
            </p>

            <div className="mt-9 flex flex-col">
              {PROMISES.map((p) => (
                <div key={p.title} className="flex items-start gap-3.5 border-b border-foreground/10 py-4">
                  <span className="mt-0.5 flex size-[26px] shrink-0 items-center justify-center rounded-[8px] bg-sage text-[13px] text-pine">
                    ✓
                  </span>
                  <div>
                    <div className="font-serif text-[19px] font-semibold">{p.title}</div>
                    <div className="mt-0.5 text-sm font-light text-muted-strong">{p.body}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-7 flex items-center gap-4 rounded-[14px] bg-cream px-[22px] py-[18px]">
              <div className="relative size-12 shrink-0 overflow-hidden rounded-full border border-foreground/12">
                <Image
                  src="https://picsum.photos/seed/myp-advisor/1000/750.webp"
                  alt="صورة مستشار الشراكات"
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <div className="text-[14.5px] font-semibold">سارة العتيبي — مستشارة الشراكات</div>
                <div className="text-[13px] text-muted">عادةً ما ترد خلال ساعات العمل</div>
              </div>
            </div>
          </div>

          {/* form card */}
          <MarketProjectForm />
        </div>
      </header>

      {/* PROCESS */}
      <section className="bg-pine-dark text-cream">
        <div className="mx-auto max-w-[1320px] px-5 py-[82px] sm:px-10">
          <div className="mb-12 max-w-[620px]">
            <div className="mb-3 text-[12.5px] font-bold tracking-wide text-pine-mist">ماذا بعد الإرسال</div>
            <h2 className="font-serif text-[clamp(28px,3.4vw,46px)] leading-[1.12] font-semibold text-cream">
              رحلةٌ واضحةٌ من أول تواصلٍ حتى الإطلاق
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
            {PROCESS.map((s) => (
              <div key={s.no} className="border-t border-cream/20 pt-5.5">
                <div className="mb-3 font-serif text-[32px] font-semibold text-pine-mist">{s.no}</div>
                <h3 className="mb-2.5 font-serif text-[21px] font-semibold text-cream">{s.title}</h3>
                <p className="text-[14.5px] leading-[1.8] font-light text-pine-mist">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MINI FAQ */}
      <section className="mx-auto max-w-[820px] px-5 pt-[82px] pb-[90px] sm:px-10">
        <h2 className="mb-10 text-center font-serif text-[clamp(28px,3.2vw,42px)] leading-[1.1] font-semibold">
          أسئلةٌ يطرحها المطوّرون
        </h2>
        <div className="flex flex-col gap-3">
          {FAQS.map((f) => (
            <div key={f.q} className="rounded-[14px] border border-foreground/10 bg-surface px-[26px] py-6">
              <div className="mb-2 font-serif text-[19px] font-semibold">{f.q}</div>
              <div className="text-[14.5px] leading-[1.8] font-light text-muted-strong">{f.a}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 text-center">
          <Link href="/faq" className="border-b border-pine/40 pb-1 text-sm font-semibold text-pine">
            كل الأسئلة الشائعة ←
          </Link>
        </div>
      </section>
    </div>
  );
}
