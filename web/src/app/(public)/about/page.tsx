import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { ArchMark } from "@/components/dashboard/arch-mark";
import { getAboutStats } from "@/lib/data/public-projects";

export const metadata: Metadata = { title: "عن مَعلم" };

// Stats read live Postgres counts — never prerender.
export const dynamic = "force-dynamic";

const VALUES = [
  { title: "الثقة أولاً", body: "كل مسكنٍ موثّق الملكية ومُدقّق. نقول الحقيقة كاملةً، حتى حين لا تكون في مصلحة الصفقة." },
  { title: "العناية بالتفصيل", body: "من التصوير إلى الكلمة، نلتزم بمعيارٍ تحريريٍّ واحدٍ يليق بمكانة كل عنوان." },
  { title: "الخصوصية", body: "نحمي بيانات عملائنا وصفقاتهم بسريّةٍ تامّة، ونعمل بهدوءٍ بعيداً عن الضجيج." },
] as const;

const TEAM = [
  { name: "فيصل الراشد", role: "الشريك المؤسّس والرئيس التنفيذي", slot: "ab-t1" },
  { name: "نورة القحطاني", role: "رئيسة التصميم والتجربة", slot: "ab-t2" },
  { name: "سلطان الدوسري", role: "رئيس الشراكات", slot: "ab-t3" },
  { name: "ريم العنزي", role: "رئيسة العمليات", slot: "ab-t4" },
] as const;

export default async function AboutPage() {
  const stats = await getAboutStats();
  const statCards = [
    { v: "٢٠٢٦", l: "سنة التأسيس" },
    { v: stats.unitsLabel, l: "وحدة سكنية مدرجة" },
    { v: stats.portfolioValueLabel, l: "قيمة المحفظة" },
    { v: stats.citiesLabel, l: "مدنٌ مخدومة" },
  ];

  return (
    <div dir="rtl">
      <header className="mx-auto max-w-[1320px] px-5 pt-20 pb-16 sm:px-10">
        <div className="max-w-[900px]">
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-pine/18 bg-sage px-3.5 py-1.5">
            <span className="size-1.5 rounded-full bg-pine" />
            <span className="text-[12.5px] font-semibold text-pine">عن مَعلم</span>
          </div>
          <h1 className="max-w-[18ch] font-serif text-[clamp(32px,5.4vw,76px)] leading-[1.1] font-semibold">
            نصنع العناوين التي تُعرّف حياةً بأكملها.
          </h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-[1.75] font-light text-muted-strong">
            «مَعلم» منصّةٌ سعوديةٌ للعقار الفاخر، تصل بين المساكن الاستثنائية ومقتنيها بعنايةٍ
            تحريريةٍ وخصوصيةٍ تامّة — ونؤمن أن المسكن الرفيع يستحق أن يُقدَّم كما تُقدَّم القطعة
            النادرة.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 pb-5 sm:px-10">
        <div className="grid h-[280px] grid-cols-2 gap-3.5 sm:h-[380px] md:h-[520px] md:grid-cols-[1.4fr_1fr] md:[grid-template-rows:1fr_1fr]">
          <div className="relative row-span-2 overflow-hidden rounded-2xl border border-foreground/10">
            <Image
              src="https://picsum.photos/seed/ab-1/1000/1300.webp"
              alt="واجهة برجٍ سكنيٍّ فاخر في العليا بالرياض عند الغسق"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10">
            <Image
              src="https://picsum.photos/seed/ab-2/1000/750.webp"
              alt="صالة معيشةٍ راقية بإضاءةٍ طبيعية"
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
          <div className="relative overflow-hidden rounded-2xl border border-foreground/10">
            <Image
              src="https://picsum.photos/seed/ab-3/1000/750.webp"
              alt="تفصيلة عمارةٍ نجديةٍ من الدرعية"
              fill
              sizes="400px"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-16 pb-5 sm:px-10">
        <div className="grid grid-cols-2 border-y border-foreground/12 md:grid-cols-4">
          {statCards.map((s) => (
            <div key={s.l} className="border-e border-foreground/12 px-5 py-11 text-center last:border-e-0">
              <div className="font-serif text-[clamp(30px,4.2vw,56px)] leading-none font-semibold text-pine">
                {s.v}
              </div>
              <div className="mt-3 text-[13px] text-muted-dark">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-20 pb-10 sm:px-10">
        <div className="grid grid-cols-1 items-center gap-9 md:grid-cols-[1.05fr_.95fr] md:gap-16">
          <div>
            <div className="mb-3.5 text-[12.5px] font-bold tracking-wide text-pine">قصّتنا</div>
            <h2 className="max-w-[16ch] font-serif text-[clamp(28px,3.6vw,48px)] leading-[1.12] font-semibold">
              وُلدنا من قناعةٍ بأن الفخامة تبدأ بالثقة.
            </h2>
          </div>
          <div className="flex flex-col gap-4.5">
            <p className="text-base leading-[1.95] font-light text-muted-strong">
              في سوقٍ يزخر بالخيارات، لاحظنا أن المشتري الفاخر يبحث عن شيءٍ نادر: عرضٌ صادق،
              ومسارٌ واضح، ومستشارٌ يُصغي. أطلقنا «مَعلم» لنملأ هذه الفجوة — بمعيارٍ تحريريٍّ واحدٍ
              لا يقبل المساومة.
            </p>
            <p className="text-base leading-[1.95] font-light text-muted-strong">
              اليوم نصل بين نخبة المطوّرين وأكثر المشترين تطلّباً في الرياض وجدة والمنطقة الشرقية،
              عبر محفظةٍ موثّقةٍ بالكامل، وشبكةٍ من الوسطاء المعتمدين، وتجربةٍ رقميةٍ صُمّمت لتكون
              هادئةً وواضحةً وجديرةً بالثقة.
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 border-t border-foreground/10 bg-sand">
        <div className="mx-auto max-w-[1320px] px-5 py-22 sm:px-10">
          <div className="mb-12 max-w-[620px]">
            <div className="mb-3.5 text-[12.5px] font-bold tracking-wide text-pine">قيمنا</div>
            <h2 className="font-serif text-[clamp(28px,3.6vw,48px)] leading-[1.1] font-semibold">
              مبادئُ نبني عليها كل قرار
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.title} className="rounded-2xl border border-foreground/9 bg-surface p-8">
                <div className="mb-5.5 flex size-[46px] items-center justify-center rounded-xl bg-sage text-pine">
                  <ArchMark />
                </div>
                <h3 className="mb-2.5 font-serif text-2xl font-semibold">{v.title}</h3>
                <p className="text-[14.5px] leading-[1.85] font-light text-muted-strong">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-22 pb-10 sm:px-10">
        <div className="mb-12 max-w-[620px]">
          <div className="mb-3.5 text-[12.5px] font-bold tracking-wide text-pine">القيادة</div>
          <h2 className="font-serif text-[clamp(28px,3.6vw,48px)] leading-[1.1] font-semibold">
            فريقٌ يجمع العقار والتصميم والتقنية
          </h2>
        </div>
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {TEAM.map((t) => (
            <div key={t.name}>
              <div className="relative mb-4 aspect-[4/5] overflow-hidden rounded-2xl border border-foreground/10">
                <Image
                  src={`https://picsum.photos/seed/${t.slot}/1000/750.webp`}
                  alt={`صورة بورتريه لـ${t.name}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 300px"
                  className="object-cover"
                />
              </div>
              <div className="font-serif text-xl font-semibold">{t.name}</div>
              <div className="mt-0.5 text-[13.5px] text-muted-dark">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-16 pb-22 sm:px-10">
        <div className="rounded-3xl bg-pine px-7 py-16 text-center sm:px-14">
          <h2 className="mx-auto max-w-[22ch] font-serif text-[clamp(28px,3.8vw,50px)] leading-[1.14] font-semibold text-cream">
            لنبنِ عنوانك القادم معاً.
          </h2>
          <div className="mt-8 flex flex-wrap justify-center gap-3.5">
            <Link
              href="/contact"
              className="rounded-xl bg-cream px-8 py-[15px] text-[15px] font-semibold text-pine-dark transition-colors hover:bg-white"
            >
              تواصل معنا
            </Link>
            <Link
              href="/projects"
              className="rounded-xl border border-cream/40 px-8 py-[15px] text-[15px] font-semibold text-cream transition-colors hover:border-cream"
            >
              تصفّح المساكن
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
