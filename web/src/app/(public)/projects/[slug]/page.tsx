import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { Landmark, Plane, TreePine, HeartPulse, GraduationCap, Phone, Mail, MessageCircle } from "lucide-react";

import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { ShareButton } from "@/components/site/share-button";
import { SaveProjectButton } from "@/components/site/save-project-button";
import { UnitTypeSelector } from "@/components/site/unit-type-selector";
import { FinancingCalculator } from "@/components/site/financing-calculator";
import { BookingForm } from "@/components/site/booking-form";
import { WhatsAppFloat } from "@/components/site/whatsapp-float";
import { PublicProjectCardView } from "@/components/site/public-project-card";
import { amenityIcon } from "@/lib/data/amenity-icons";
import { getNearbyLandmarks, type NearbyLandmark } from "@/lib/data/nearby-landmarks";
import { formatArea, toArabicDigits } from "@/lib/format";
import {
  getPublicProjectBySlug,
  getRelatedProjects,
} from "@/lib/data/public-projects";

// Reads live Postgres data per-slug — never prerender.
export const dynamic = "force-dynamic";

const LANDMARK_ICON: Record<NearbyLandmark["icon"], typeof Landmark> = {
  finance: Landmark,
  airport: Plane,
  boulevard: TreePine,
  hospital: HeartPulse,
  school: GraduationCap,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  return { title: `${project.name} — مَعلم` };
}

export default async function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getPublicProjectBySlug(slug);
  const related = await getRelatedProjects(project.city, project.id);
  const landmarks = getNearbyLandmarks(project.city);

  const beds = project.unitTypes.map((u) => u.beds);
  const baths = project.unitTypes.map((u) => u.baths);
  const areas = project.unitTypes.map((u) => u.areaSqm);
  const specs = [
    {
      k: "غرف النوم",
      v: beds.length ? rangeStr(Math.min(...beds), Math.max(...beds)) : "—",
    },
    {
      k: "الحمّامات",
      v: baths.length ? rangeStr(Math.min(...baths), Math.max(...baths)) : "—",
    },
    {
      k: "المساحة",
      v: areas.length
        ? `${toArabicDigits(Math.min(...areas))}–${formatArea(Math.max(...areas))}`
        : "—",
    },
    { k: "النوع", v: project.type },
  ];

  const devStats = [
    { v: `+${toArabicDigits(project.company.publishedProjectsCount)}`, l: "مشروعاً منشوراً" },
    ...(project.company.foundedYearsAgo
      ? [{ v: toArabicDigits(project.company.foundedYearsAgo), l: "سنة خبرة" }]
      : []),
  ];

  return (
    <div dir="rtl">
      {/* BREADCRUMB */}
      <div className="mx-auto max-w-[1320px] px-5 pt-6 text-[12.5px] text-muted sm:px-10">
        <Link href="/" className="text-muted">
          الرئيسية
        </Link>{" "}
        /{" "}
        <Link href="/projects" className="text-muted">
          المساكن
        </Link>{" "}
        / <span className="text-muted-strong">{project.name}</span>
      </div>

      {/* GALLERY */}
      <section className="mx-auto max-w-[1320px] px-5 pt-5 sm:px-10">
        <div className="grid h-auto grid-cols-2 gap-3 sm:grid-cols-4 sm:[grid-template-rows:1fr_1fr] sm:h-[540px]">
          <div className="relative col-span-2 row-span-2 h-[240px] overflow-hidden rounded-2xl border border-foreground/10 sm:h-auto">
            <Image
              src={`https://picsum.photos/seed/${project.imageSeed}-g1/1000/750.webp`}
              alt={project.imageAlt}
              fill
              sizes="(max-width: 640px) 100vw, 660px"
              className="object-cover"
              priority
            />
          </div>
          {[2, 3, 4].map((i) => (
            <div key={i} className="relative hidden h-[130px] overflow-hidden rounded-2xl sm:block sm:h-auto">
              <Image
                src={`https://picsum.photos/seed/${project.imageSeed}-g${i}/1000/750.webp`}
                alt={project.imageAlt}
                fill
                sizes="330px"
                className="object-cover"
              />
            </div>
          ))}
          <div className="relative col-span-2 h-[130px] overflow-hidden rounded-2xl sm:col-span-1 sm:h-auto">
            <Image
              src={`https://picsum.photos/seed/${project.imageSeed}-g5/1000/750.webp`}
              alt={project.imageAlt}
              fill
              sizes="330px"
              className="object-cover"
            />
            <div className="absolute inset-0 flex items-center justify-center bg-pine-dark/62">
              <Link
                href="#book"
                className="rounded-[10px] border border-cream/70 px-5 py-2.5 text-[13px] font-semibold text-cream backdrop-blur-sm"
              >
                تواصل لمعاينة الصور
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* TITLE BAR */}
      <section className="mx-auto max-w-[1320px] px-5 pt-8 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span className="rounded-full bg-pine px-3 py-1.5 text-[11px] font-bold text-cream">
                {project.tag}
              </span>
              <span className="text-[13px] text-muted">
                ◈ {project.city} · حيّ {project.district}
              </span>
            </div>
            <h1 className="font-serif text-[clamp(32px,4.6vw,64px)] leading-[1.05] font-semibold">
              {project.name}
            </h1>
            <div className="mt-2.5 text-[15px] text-muted-dark">
              بتطوير{" "}
              <Link href={`/developers/${project.company.slug}`} className="font-semibold text-pine">
                {project.company.name}
              </Link>
            </div>
          </div>
          <div className="flex gap-2.5">
            <SaveProjectButton slug={project.slug} />
            <ShareButton />
          </div>
        </div>
      </section>

      {/* SPECS */}
      <section className="mx-auto max-w-[1320px] px-5 pt-7 sm:px-10">
        <div className="grid grid-cols-2 overflow-hidden rounded-2xl border border-foreground/10 bg-surface sm:grid-cols-4">
          {specs.map((s) => (
            <div key={s.k} className="border-e border-foreground/9 px-6 py-5.5 last:border-e-0">
              <div className="mb-2 text-xs text-muted">{s.k}</div>
              <div className="font-serif text-2xl leading-none font-semibold">{s.v}</div>
            </div>
          ))}
        </div>
      </section>

      {/* BODY */}
      <section className="mx-auto max-w-[1320px] px-5 pt-12 pb-20 sm:px-10">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[1fr_380px]">
          {/* MAIN */}
          <div className="flex flex-col gap-14">
            {project.blurb ? (
              <div>
                <div className="mb-4 text-[12.5px] font-bold tracking-wide text-pine">عن المسكن</div>
                <p className="text-base leading-[1.95] font-light text-muted-strong">{project.blurb}</p>
              </div>
            ) : null}

            {project.amenities.length ? (
              <div>
                <div className="mb-5 text-[12.5px] font-bold tracking-wide text-pine">وسائل الراحة</div>
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-4">
                  {project.amenities.map((label) => {
                    const Icon = amenityIcon(label);
                    return (
                      <div
                        key={label}
                        className="rounded-[14px] border border-foreground/9 bg-surface px-4.5 py-5"
                      >
                        <div className="mb-3.5 flex size-[38px] items-center justify-center rounded-[10px] bg-sage text-pine">
                          <Icon className="size-4" aria-hidden="true" />
                        </div>
                        <div className="text-sm leading-[1.4] font-medium">{label}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {project.unitTypes.length ? (
              <div>
                <div className="mb-5 text-[12.5px] font-bold tracking-wide text-pine">أنواع الوحدات</div>
                <UnitTypeSelector unitTypes={project.unitTypes} imageSeed={project.imageSeed} />
              </div>
            ) : null}

            <div>
              <div className="mb-5 text-[12.5px] font-bold tracking-wide text-pine">المعالم القريبة</div>
              <div className="grid grid-cols-1 items-stretch gap-5 md:grid-cols-[1.3fr_1fr]">
                <div className="flex flex-col">
                  {landmarks.map((n) => {
                    const Icon = LANDMARK_ICON[n.icon];
                    return (
                      <div
                        key={n.name}
                        className="flex items-center gap-3.5 border-b border-foreground/9 py-3.5"
                      >
                        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-[10px] bg-sage text-pine">
                          <Icon className="size-4" aria-hidden="true" />
                        </span>
                        <span className="flex-1 text-[14.5px] font-medium">{n.name}</span>
                        <span className="text-[13.5px] text-muted-dark">{n.dist}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="relative min-h-[220px] overflow-hidden rounded-2xl border border-foreground/10">
                  <Image
                    src={`https://picsum.photos/seed/${project.imageSeed}-map/1000/750.webp`}
                    alt={`خريطة موقع ${project.name}`}
                    fill
                    sizes="400px"
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

            <FinancingCalculator startPriceRiyals={Math.round(project.priceFromMillions * 1_000_000)} />

            {/* DEVELOPER */}
            <div id="developer" className="rounded-[20px] border border-foreground/10 bg-surface px-9 py-8">
              <div className="mb-5 text-[12.5px] font-bold tracking-wide text-pine">عن المطوّر</div>
              <div className="mb-5 flex items-center gap-4.5">
                <div className="relative size-[66px] shrink-0 overflow-hidden rounded-2xl border border-foreground/12">
                  <Image
                    src={`https://picsum.photos/seed/${project.company.avatarSeed ?? project.company.slug}/200/200.webp`}
                    alt={`شعار ${project.company.name}`}
                    fill
                    sizes="66px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <h3 className="font-serif text-2xl font-semibold">{project.company.name}</h3>
                  <div className="mt-0.5 text-[13.5px] text-muted-dark">
                    {[
                      project.company.foundedYearsAgo ? "مطوّرٌ رائد" : null,
                      project.company.city,
                    ]
                      .filter(Boolean)
                      .join(" · ")}
                  </div>
                </div>
              </div>
              {project.company.bio ? (
                <p className="mb-6 text-[15px] leading-[1.9] font-light text-muted-strong">
                  {project.company.bio}
                </p>
              ) : null}
              {devStats.length ? (
                <div className="grid grid-cols-2 gap-3.5 sm:grid-cols-3">
                  {devStats.map((d) => (
                    <div key={d.l} className="rounded-xl bg-background px-4.5 py-4.5 text-center">
                      <div className="font-serif text-2xl font-semibold text-pine">{d.v}</div>
                      <div className="mt-1 text-xs text-muted-dark">{d.l}</div>
                    </div>
                  ))}
                </div>
              ) : null}
              <Link
                href={`/developers/${project.company.slug}`}
                className="mt-5.5 inline-flex border-b border-pine/40 pb-1 text-sm font-semibold text-pine"
              >
                عرض كل مشاريع المطوّر ←
              </Link>
            </div>

            <div id="book" className="scroll-mt-28">
              <div className="mb-4 text-[12.5px] font-bold tracking-wide text-pine">احجز معاينة</div>
              <BookingForm projectId={project.id} projectName={project.name} />
            </div>
          </div>

          {/* STICKY RAIL */}
          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-[20px] border border-foreground/10 bg-surface shadow-[0_30px_60px_-40px_rgba(23,24,26,.4)]">
              <div className="border-b border-foreground/9 px-7 py-6">
                <div className="mb-1 text-xs text-muted">يبدأ من</div>
                <div className="font-serif text-[38px] leading-none font-semibold text-pine">
                  {project.priceLabel}
                  <SaudiRiyal />
                </div>
              </div>
              <div className="px-7 py-6">
                {project.company.contactName ? (
                  <div className="mb-5 flex items-center gap-3">
                    <div className="relative size-[50px] shrink-0 overflow-hidden rounded-full border border-foreground/12">
                      <Image
                        src={`https://picsum.photos/seed/${project.company.slug}-contact/160/160.webp`}
                        alt={project.company.contactName}
                        fill
                        sizes="50px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <div className="text-[14.5px] font-semibold">{project.company.contactName}</div>
                      <div className="text-[12.5px] text-muted">
                        {project.company.contactTitle ?? "مستشارٌ خاص"}
                      </div>
                    </div>
                  </div>
                ) : null}
                <a
                  href="#book"
                  className="mb-2.5 block rounded-xl bg-pine py-3.5 text-center text-[14.5px] font-semibold text-cream transition-colors hover:bg-pine-dark"
                >
                  احجز معاينة خاصّة
                </a>
                <a
                  href="#book"
                  className="mb-2.5 flex items-center justify-center gap-2 rounded-xl bg-[#25443C] py-3.5 text-center text-[14.5px] font-semibold text-cream transition-colors hover:bg-[#1c3730]"
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  تواصل عبر واتساب
                </a>
                <div className="flex gap-2.5">
                  <Link
                    href="/contact"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-foreground/12 py-2.5 text-[12.5px] text-muted-strong transition-colors hover:border-pine"
                  >
                    <Phone className="size-3.5" aria-hidden="true" />
                    اتصال
                  </Link>
                  <Link
                    href="/contact"
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[10px] border border-foreground/12 py-2.5 text-[12.5px] text-muted-strong transition-colors hover:border-pine"
                  >
                    <Mail className="size-3.5" aria-hidden="true" />
                    بريد
                  </Link>
                </div>
              </div>
            </div>
            <div className="mt-3.5 text-center text-xs text-muted">مرجع: {project.slug}</div>
          </aside>
        </div>
      </section>

      {/* RELATED */}
      {related.length ? (
        <section className="border-t border-foreground/10 bg-sand">
          <div className="mx-auto max-w-[1320px] px-5 py-16 sm:px-10">
            <div className="mb-8 flex items-end justify-between">
              <h2 className="font-serif text-[clamp(24px,3.4vw,44px)] font-semibold">مساكن مشابهة</h2>
              <Link href="/projects" className="border-b border-pine/40 pb-1 text-sm font-semibold text-pine">
                عرض الكل ←
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <PublicProjectCardView key={p.slug} project={p} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <WhatsAppFloat />
    </div>
  );
}

function rangeStr(min: number, max: number): string {
  return min === max ? toArabicDigits(min) : `${toArabicDigits(min)}–${toArabicDigits(max)}`;
}
