import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { ArchMark } from "@/components/dashboard/arch-mark";

export const metadata: Metadata = { title: "للوسطاء — مَعلم" };

const BENEFITS = [
  { title: "قوائمُ حصرية", body: "وصولٌ مبكرٌ إلى مساكن خارج السوق وتخصيصات ما قبل الإطلاق." },
  { title: "عملاءُ من النخبة", body: "طلباتُ شراءٍ مُتحقَّقة من مشترين جادّين وذوي قدرةٍ عالية." },
  { title: "عمولاتٌ تنافسية", body: "هيكل عمولاتٍ شفّاف ومجزٍ، مع دفعاتٍ منتظمة وواضحة." },
  { title: "أدواتٌ رقمية", body: "لوحةٌ لإدارة القوائم والعملاء والصفقات في مكانٍ واحد." },
  { title: "تسويقٌ جاهز", body: "موادُّ عرضٍ وتصويرٌ احترافي لكل قائمةٍ تمثّلها." },
  { title: "تدريبٌ ودعم", body: "ورشٌ دورية ومستشارٌ لدعمك في الصفقات الكبرى." },
] as const;

const STEPS = [
  { no: "٠١", title: "قدّم طلبك", body: "أنشئ حساباً وأرفق رخصتك ومحفظة أعمالك." },
  { no: "٠٢", title: "تحقّقٌ سريع", body: "يراجع فريقنا طلبك ويتحقّق من اعتمادك خلال أيام." },
  { no: "٠٣", title: "ابدأ العمل", body: "ادخل لوحتك، واستعرض القوائم الحصرية، وابدأ الإغلاق." },
] as const;

const METRICS = [
  { v: "+٤٠٠", l: "وسيطٌ معتمد" },
  { v: "٣٥٪", l: "عمولةٌ أعلى" },
  { v: "٢٤س", l: "زمن ردٍّ للطلبات" },
  { v: "٩٦٪", l: "رضا الوسطاء" },
] as const;

export default function BrokersPage() {
  return (
    <div dir="rtl">
      <header className="mx-auto max-w-[1320px] px-5 pt-16 pb-16 sm:px-10 md:pt-[72px] md:pb-20">
        <div className="grid grid-cols-1 items-center gap-9 md:grid-cols-[1.05fr_.95fr] md:gap-14">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-pine/18 bg-sage px-3.5 py-1.5">
              <span className="size-1.5 rounded-full bg-pine" />
              <span className="text-[12.5px] font-semibold text-pine">لِلوسطاء</span>
            </div>
            <h1 className="max-w-[16ch] font-serif text-[clamp(32px,5vw,68px)] leading-[1.14] font-semibold">
              انضمّ إلى أرقى شبكة وساطةٍ في المملكة.
            </h1>
            <p className="mt-5 max-w-[46ch] text-lg leading-[1.7] font-light text-muted-strong">
              قوائم حصرية، عملاءُ من النخبة، وأدواتٌ تُنجز صفقاتك أسرع — ضمن شبكةٍ تُقدّر المهنية
              والخصوصية.
            </p>
            <div className="mt-8 flex flex-wrap gap-3.5">
              <Link
                href="/register/apply"
                className="rounded-xl bg-pine px-[30px] py-[15px] text-[14.5px] font-semibold text-cream transition-colors hover:bg-pine-dark"
              >
                قدّم طلب انضمام
              </Link>
              <Link
                href="#how"
                className="rounded-xl border border-foreground/20 px-[30px] py-[15px] text-[14.5px] font-semibold text-foreground transition-colors hover:border-pine"
              >
                كيف تنضم
              </Link>
            </div>
          </div>
          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-foreground/10">
              <Image
                src="https://picsum.photos/seed/brk-hero/1000/1250.webp"
                alt="وسيطٌ عقاريٌّ أنيق في مكتبٍ راقٍ / لقاء عميل"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
            <div className="absolute end-5.5 bottom-5.5 rounded-2xl border border-foreground/8 bg-surface/95 px-5.5 py-4.5 shadow-[0_20px_40px_-24px_rgba(23,24,26,.5)] backdrop-blur-md">
              <div className="mb-1 text-xs text-muted">متوسّط العمولة السنوية</div>
              <div className="font-serif text-2xl font-semibold text-pine">أعلى بـ ٣٥٪</div>
            </div>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 pt-5 pb-10 sm:px-10">
        <div className="mb-11 max-w-[620px]">
          <div className="mb-3 text-[12.5px] font-bold tracking-wide text-pine">لماذا مَعلم</div>
          <h2 className="font-serif text-[clamp(28px,3.6vw,48px)] leading-[1.1] font-semibold">
            أدواتٌ ومزايا تُنجز صفقاتك
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-2xl border border-foreground/9 bg-surface p-8">
              <div className="mb-5 flex size-[44px] items-center justify-center rounded-xl bg-sage text-pine">
                <ArchMark />
              </div>
              <h3 className="mb-2.5 font-serif text-[22px] font-semibold">{b.title}</h3>
              <p className="text-[14.5px] leading-[1.8] font-light text-muted-strong">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how" className="mt-14 border-t border-foreground/10 bg-sand">
        <div className="mx-auto max-w-[1320px] px-5 py-22 sm:px-10">
          <div className="mb-11 max-w-[620px]">
            <div className="mb-3 text-[12.5px] font-bold tracking-wide text-pine">الانضمام</div>
            <h2 className="font-serif text-[clamp(28px,3.6vw,48px)] leading-[1.1] font-semibold">
              ثلاث خطواتٍ لتصبح شريكاً
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-9 md:grid-cols-3">
            {STEPS.map((s) => (
              <div key={s.no} className="border-t-2 border-pine pt-5.5">
                <div className="mb-3 font-serif text-[34px] font-semibold text-pine">{s.no}</div>
                <h3 className="mb-2.5 font-serif text-[22px] font-semibold">{s.title}</h3>
                <p className="text-[14.5px] leading-[1.8] font-light text-muted-strong">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-pine-dark text-[#EAF0ED]">
        <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10">
          <div className="grid grid-cols-2 gap-9 md:grid-cols-4">
            {METRICS.map((m) => (
              <div key={m.l} className="text-center">
                <div className="font-serif text-[clamp(34px,4.4vw,60px)] leading-none font-semibold text-cream">
                  {m.v}
                </div>
                <div className="mt-3 text-[13px] text-pine-mist">{m.l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[920px] px-5 py-22 text-center sm:px-10">
        <blockquote className="font-serif text-[clamp(22px,3.2vw,40px)] leading-[1.5] font-medium">
          «القوائم الحصرية وحدها غيّرت أعمالي. أُغلق صفقاتٍ أكبر وبثقةٍ أكثر.»
        </blockquote>
        <div className="mt-6.5 text-sm text-muted-dark">— وسيطٌ معتمد، الرياض</div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pb-22 sm:px-10">
        <div className="rounded-3xl bg-pine px-7 py-16 text-center sm:px-14">
          <h2 className="mx-auto max-w-[24ch] font-serif text-[clamp(28px,3.8vw,50px)] leading-[1.14] font-semibold text-cream">
            ابدأ رحلتك في شبكة مَعلم للوسطاء.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/register/apply"
              className="rounded-xl bg-cream px-8 py-[15px] text-[15px] font-semibold text-pine-dark transition-colors hover:bg-white"
            >
              قدّم طلب انضمام
            </Link>
            <Link
              href="/contact"
              className="rounded-xl border border-cream/40 px-8 py-[15px] text-[15px] font-semibold text-cream transition-colors hover:border-cream"
            >
              تحدّث إلى فريقنا
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
