import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { ArchMark } from "@/components/dashboard/arch-mark";
import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { HeroSearch } from "@/components/site/hero-search";
import { FeaturedProjects } from "@/components/site/featured-projects";
import { getFeaturedProjects, getPlatformStats, getSpotlightProject } from "@/lib/data/public-projects";

export const metadata: Metadata = {
  title: "مَعلم — اعثر على العنوان الذي يليق بك",
  description: "منصّة العقار الفاخر في المملكة العربية السعودية.",
};

// Reads live Postgres data (featured projects, platform stats) — never prerender.
export const dynamic = "force-dynamic";

const TRUSTED_DEVELOPERS = ["فيجن العقارية", "دار الأركان", "روشن", "الدرعية", "البحر الأحمر"];

const AUDIENCES = [
  {
    tag: "للمشترين",
    title: "اعثر على منزلك القادم",
    body: "تصفّح محفظةً موثّقةً من المساكن، واحجز معايناتٍ خاصّة، بمرافقة مستشارٍ واحدٍ يفهم ما تبحث عنه.",
    link: "تصفّح المساكن ←",
    href: "/projects",
  },
  {
    tag: "للمطوّرين",
    title: "سوّق مشروعك بثقة",
    body: "اعرض مشروعك أمام مشترين مؤهّلين، بعرضٍ تحريريٍّ راقٍ وأدوات تحليلٍ واضحةٍ للأداء.",
    link: "أدرج مشروعاً ←",
    href: "/register/apply",
  },
  {
    tag: "للوسطاء",
    title: "انضمّ إلى شبكتنا",
    body: "الوصول إلى قوائم حصرية وعملاء من النخبة، ضمن شبكةٍ تُقدّر المهنية والخصوصية.",
    link: "كن شريكاً ←",
    href: "/register/apply",
  },
] as const;

const WHY = [
  { title: "استشارةٌ خاصّة", body: "مستشارٌ واحدٌ مخصّص من أول معاينةٍ حتى التسليم — يتقن السوق ولغتك وطموحاتك." },
  { title: "عروضٌ موثّقة", body: "كل مسكنٍ موثّق الملكية ومُدقّقٌ من المطوّر ومُصوّرٌ وفق معيارٍ واحد. لا مفاجآت." },
  { title: "وصولٌ حصري", body: "فرصٌ خارج السوق وتخصيصات ما قبل الإطلاق، قبل أن تصل إلى العامّة." },
] as const;

export default async function HomePage() {
  const [featured, stats, spotlight] = await Promise.all([
    getFeaturedProjects(6),
    getPlatformStats(),
    getSpotlightProject(),
  ]);

  return (
    <div dir="rtl">
      {/* HERO */}
      <header className="mx-auto max-w-[1320px] px-5 pt-14 pb-16 sm:px-10 md:pt-[72px] md:pb-[88px]">
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.05fr_.95fr] md:gap-16">
          <div>
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-pine/18 bg-sage px-3.5 py-1.5">
              <span className="size-1.5 rounded-full bg-pine" />
              <span className="text-[12.5px] font-semibold text-pine">منصّة العقار الفاخر في المملكة</span>
            </div>
            <h1 className="max-w-[15ch] font-serif text-[clamp(38px,5.4vw,74px)] leading-[1.12] font-semibold">
              اعثر على العنوان الذي يليق بك.
            </h1>
            <p className="mt-[22px] max-w-[44ch] text-lg leading-[1.7] font-light text-muted-strong">
              محفظةٌ منسّقةٌ من أرقى المساكن — موثّقة، وبمستشارٍ خاصٍّ واحدٍ من أول معاينةٍ حتى
              التسليم.
            </p>

            <HeroSearch />

            <div className="mt-7 flex gap-7">
              <Stat value={stats.projectsLabel} label="مشروع منشور" />
              <Stat value={stats.unitsLabel} label="وحدة سكنية" />
              <Stat value={stats.citiesLabel} label="مدن" />
            </div>
          </div>

          <div className="relative">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[20px] border border-foreground/10">
              <Image
                src="https://picsum.photos/seed/sig-hero/1000/1250.webp"
                alt="مسكن فاخر — ضوء طبيعي، هادئ"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
            {spotlight ? (
              <div className="absolute inset-x-5 bottom-5 flex items-center justify-between rounded-2xl border border-foreground/8 bg-surface/94 p-5 shadow-[0_20px_40px_-24px_rgba(23,24,26,.5)] backdrop-blur-md">
                <div>
                  <div className="mb-1 text-[11.5px] font-semibold tracking-wide text-muted">
                    مسكنٌ مميّز · {spotlight.city}
                  </div>
                  <div className="font-serif text-[22px] font-semibold">{spotlight.name}</div>
                </div>
                <div className="text-left">
                  <div className="mb-0.5 text-[11.5px] text-muted">يبدأ من</div>
                  <div className="font-serif text-[22px] font-semibold text-pine">
                    {spotlight.priceLabel}
                    <SaudiRiyal />
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </header>

      {/* TRUST BAR */}
      <section className="border-y border-foreground/10 bg-background">
        <div className="mx-auto flex max-w-[1320px] flex-wrap items-center justify-between gap-8 px-5 py-6 sm:px-10">
          <span className="text-[13px] font-medium text-muted-dark">موثوقٌ من نخبة المطوّرين في المملكة</span>
          <div className="flex flex-wrap gap-8 opacity-70">
            {TRUSTED_DEVELOPERS.map((name) => (
              <span key={name} className="font-serif text-[19px] font-semibold text-muted-strong">
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* COLLECTIONS */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10 md:py-24">
        <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="mb-3 text-[12.5px] font-bold tracking-wide text-pine">مساكن مختارة</div>
            <h2 className="font-serif text-[clamp(28px,3.8vw,52px)] leading-[1.05] font-semibold">
              أحدث ما أضفناه إلى المحفظة
            </h2>
          </div>
          <Link href="/projects" className="border-b border-pine/40 pb-1 text-sm font-semibold text-pine">
            عرض كل المساكن ←
          </Link>
        </div>

        <FeaturedProjects projects={featured} />
      </section>

      {/* AUDIENCES */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10 md:py-24">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <div className="mb-3 text-[12.5px] font-bold tracking-wide text-pine">مصمَّمٌ لكل طرف</div>
          <h2 className="font-serif text-[clamp(28px,3.8vw,52px)] leading-[1.1] font-semibold">
            تجربةٌ واحدة تخدم الجميع
          </h2>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {AUDIENCES.map((a) => (
            <div
              key={a.tag}
              className="flex flex-col rounded-2xl border border-foreground/9 bg-surface p-8"
            >
              <div className="mb-5 flex size-[46px] items-center justify-center rounded-xl bg-sage text-pine">
                <ArchMark />
              </div>
              <div className="mb-2.5 text-[12.5px] font-bold tracking-wide text-pine">{a.tag}</div>
              <h3 className="mb-3 font-serif text-[26px] font-semibold">{a.title}</h3>
              <p className="flex-1 text-[15px] leading-[1.8] font-light text-muted-strong">{a.body}</p>
              <Link
                href={a.href}
                className="mt-6 w-fit border-b border-pine/40 pb-1 text-sm font-semibold text-pine"
              >
                {a.link}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* SPOTLIGHT */}
      {spotlight ? (
        <section className="bg-pine-dark text-[#EAF0ED]">
          <div className="mx-auto grid max-w-[1320px] grid-cols-1 items-stretch md:grid-cols-2">
            <div className="flex flex-col justify-center px-6 py-16 sm:px-10 md:px-16 md:py-24">
              <div className="mb-4.5 text-[12.5px] font-bold tracking-wide text-pine-mist">
                مشروع الغلاف
              </div>
              <h2 className="font-serif text-[clamp(32px,4.4vw,60px)] leading-[1.08] font-semibold text-cream">
                {spotlight.name}
              </h2>
              {spotlight.blurb ? (
                <p className="mt-[22px] max-w-[44ch] text-[17px] leading-[1.85] font-light text-[#B9CEC7]">
                  {spotlight.blurb}
                </p>
              ) : null}
              <div className="mt-9 flex gap-11">
                <Stat value={spotlight.district} label="الحي" dark />
                <Stat value={String(spotlight.totalUnits)} label="وحدة" dark />
                <Stat value={spotlight.priceLabel} label="السعر يبدأ من" dark />
              </div>
              <div className="mt-10 flex flex-wrap gap-3.5">
                <Link
                  href={`/projects/${spotlight.slug}`}
                  className="rounded-[11px] bg-cream px-[30px] py-[15px] text-sm font-semibold text-pine-dark transition-colors hover:bg-white"
                >
                  استكشف المشروع
                </Link>
                <Link
                  href="/contact"
                  className="rounded-[11px] border border-cream/35 px-[30px] py-[15px] text-sm font-semibold text-cream transition-colors hover:border-cream"
                >
                  احجز معاينة
                </Link>
              </div>
            </div>
            <div className="relative min-h-[360px] md:min-h-[560px]">
              <Image
                src={`https://picsum.photos/seed/${spotlight.imageSeed}/1000/1200.webp`}
                alt={spotlight.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </section>
      ) : null}

      {/* WHY */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10 md:py-24">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-12">
          {WHY.map((w) => (
            <div key={w.title} className="border-t-2 border-pine pt-6">
              <h3 className="mb-3 font-serif text-[26px] font-semibold">{w.title}</h3>
              <p className="text-[15px] leading-[1.85] font-light text-muted-strong">{w.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="border-t border-foreground/10 bg-sand">
        <div className="mx-auto max-w-[960px] px-5 py-16 text-center sm:px-10 md:py-24">
          <blockquote className="font-serif text-[clamp(24px,3.4vw,44px)] leading-[1.5] font-medium">
            «أنجزوا كل شيءٍ بهدوءٍ وخصوصية. مستشارٌ واحدٌ فهم ما أبحث عنه من أول لقاء.»
          </blockquote>
          <div className="mt-7 text-sm text-muted-dark">— مالكٌ في حيّ العليا، الرياض</div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10 md:py-24">
        <div className="flex flex-wrap items-center justify-between gap-10 rounded-3xl bg-pine px-7 py-14 sm:px-14">
          <div className="max-w-[30ch]">
            <h2 className="font-serif text-[clamp(28px,3.8vw,50px)] leading-[1.12] font-semibold text-cream">
              ابدأ رحلتك مع مستشارٍ خاص.
            </h2>
            <p className="mt-[18px] text-[16.5px] leading-[1.75] font-light text-[#B9CEC7]">
              سواءٌ كنت تبحث عن منزل، أو تطوّر مشروعاً، أو تمثّل عملاءك — نبدأ بمحادثةٍ واحدة.
            </p>
          </div>
          <div className="flex min-w-[260px] flex-col gap-3">
            <Link
              href="/contact"
              className="rounded-xl bg-cream px-[30px] py-4 text-center text-[15px] font-semibold text-pine-dark transition-colors hover:bg-white"
            >
              احجز استشارة خاصّة
            </Link>
            <Link
              href="/register/apply"
              className="rounded-xl border border-cream/40 px-[30px] py-4 text-center text-[15px] font-semibold text-cream transition-colors hover:border-cream"
            >
              أدرج مشروعك
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label, dark }: { value: string; label: string; dark?: boolean }) {
  return (
    <div>
      <div className={`font-serif text-2xl font-semibold ${dark ? "text-cream" : "text-pine"}`}>
        {value}
      </div>
      <div className={`mt-0.5 text-[12.5px] ${dark ? "text-pine-mist" : "text-muted-dark"}`}>{label}</div>
    </div>
  );
}
