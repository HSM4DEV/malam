import Image from "next/image";
import type { Metadata } from "next";
import { Building2, MapPin } from "lucide-react";

import { PublicProjectCardView } from "@/components/site/public-project-card";
import { getPublicCompanyProfile, getPublicCompanySlugs } from "@/lib/data/public-company";
import { toArabicDigits } from "@/lib/format";

// Statically generate every company's profile at build time; any slug not
// yet generated renders on-demand and is then cached — see revalidate below.
// Mutations revalidate this path immediately via revalidatePath in the
// project Server Actions.
export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublicCompanySlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const company = await getPublicCompanyProfile(slug);
  return { title: `${company.name} — مَعلم` };
}

export default async function DeveloperProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const company = await getPublicCompanyProfile(slug);

  return (
    <div dir="rtl">
      <header className="border-b border-foreground/10 bg-sand">
        <div className="mx-auto max-w-[1320px] px-5 py-14 sm:px-10">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
            <div className="relative size-[92px] shrink-0 overflow-hidden rounded-2xl border border-foreground/12 bg-surface">
              <Image
                src={`https://picsum.photos/seed/${company.avatarSeed ?? company.slug}/200/200.webp`}
                alt={`شعار ${company.name}`}
                fill
                sizes="92px"
                className="object-cover"
              />
            </div>
            <div>
              <h1 className="font-serif text-[clamp(28px,4vw,44px)] leading-[1.1] font-semibold">
                {company.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-4 text-[13.5px] text-muted-dark">
                {company.foundedYearsAgo ? (
                  <span className="flex items-center gap-1.5">
                    <Building2 className="size-[15px]" aria-hidden="true" />
                    مطوّرٌ رائد · {toArabicDigits(company.foundedYearsAgo)} سنة خبرة
                  </span>
                ) : null}
                {company.city ? (
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-[15px]" aria-hidden="true" />
                    {company.city}
                  </span>
                ) : null}
              </div>
            </div>
          </div>
          {company.bio ? (
            <p className="mt-7 max-w-[70ch] text-base leading-[1.9] font-light text-muted-strong">
              {company.bio}
            </p>
          ) : null}
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 py-14 sm:px-10">
        <div className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-serif text-[clamp(24px,3.4vw,38px)] font-semibold">
            مشاريع {company.name}
          </h2>
          <span className="text-[15px] text-muted-dark">
            <span className="font-serif text-xl font-semibold text-pine">
              {toArabicDigits(company.projects.length)}
            </span>{" "}
            مشروعاً منشوراً
          </span>
        </div>

        {company.projects.length === 0 ? (
          <p className="py-16 text-center text-muted">لا توجد مشاريع منشورة حالياً لهذا المطوّر.</p>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {company.projects.map((project) => (
              <PublicProjectCardView key={project.slug} project={project} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
