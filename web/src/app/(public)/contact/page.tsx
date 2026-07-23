import Image from "next/image";
import type { Metadata } from "next";
import { Phone, Mail, MessageCircle } from "lucide-react";

import { ContactForm } from "@/components/site/contact-form";

export const metadata: Metadata = { title: "تواصل معنا — مَعلم" };

const CHANNELS = [
  { icon: Phone, label: "اتصل بنا", value: "+966 11 000 0000" },
  { icon: Mail, label: "البريد الإلكتروني", value: "concierge@malam.sa" },
  { icon: MessageCircle, label: "واتساب الأعمال", value: "+966 55 000 0000" },
] as const;

const OFFICES = [
  { city: "الرياض", address: "حيّ العليا، طريق الملك فهد، الرياض", slot: "ct-riyadh" },
  { city: "جدة", address: "حيّ الشاطئ، كورنيش جدة", slot: "ct-jeddah" },
  { city: "الخبر", address: "الكورنيش، الخبر، المنطقة الشرقية", slot: "ct-khobar" },
] as const;

export default function ContactPage() {
  return (
    <div dir="rtl">
      <header className="mx-auto max-w-[1320px] px-5 pt-[78px] pb-12 sm:px-10">
        <div className="max-w-[760px]">
          <div className="mb-3.5 text-[12.5px] font-bold tracking-wide text-pine">تواصل معنا</div>
          <h1 className="max-w-[16ch] font-serif text-[clamp(34px,5vw,68px)] leading-[1.1] font-semibold">
            لنبدأ محادثةً واحدة.
          </h1>
          <p className="mt-4.5 max-w-[52ch] text-lg leading-[1.75] font-light text-muted-strong">
            سواءٌ كنت تبحث عن منزل، أو تطوّر مشروعاً، أو تمثّل عملاءك — فريقنا جاهزٌ لمساعدتك
            بخصوصيةٍ وعناية.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 pb-12 sm:px-10">
        <div className="grid grid-cols-1 items-start gap-9 lg:grid-cols-[.85fr_1.15fr] lg:gap-14">
          <div className="flex flex-col gap-3.5">
            {CHANNELS.map((ch) => (
              <div
                key={ch.label}
                className="flex items-center gap-4 rounded-2xl border border-foreground/10 bg-surface px-5.5 py-5"
              >
                <span className="flex size-[46px] shrink-0 items-center justify-center rounded-xl bg-sage text-pine">
                  <ch.icon className="size-[18px]" aria-hidden="true" />
                </span>
                <div>
                  <div className="mb-0.5 text-[13px] text-muted">{ch.label}</div>
                  <div className="font-serif text-[19px] font-semibold" dir="ltr">
                    {ch.value}
                  </div>
                </div>
              </div>
            ))}
            <div className="mt-1.5 rounded-2xl bg-pine-dark px-6 py-6 text-[#EAF0ED]">
              <div className="mb-1.5 font-serif text-[19px] font-semibold text-cream">ساعات العمل</div>
              <div className="text-sm leading-[1.9] font-light text-[#B9CEC7]">
                الأحد – الخميس: ٩ص – ٦م
                <br />
                الجمعة – السبت: بموعدٍ مسبق
              </div>
            </div>
          </div>

          <ContactForm />
        </div>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-4 pb-24 sm:px-10">
        <h2 className="mb-9 font-serif text-[clamp(26px,3.2vw,42px)] leading-[1.1] font-semibold">
          مكاتبنا
        </h2>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {OFFICES.map((office) => (
            <div
              key={office.city}
              className="overflow-hidden rounded-[18px] border border-foreground/10 bg-surface"
            >
              <div className="relative aspect-[16/10]">
                <Image
                  src={`https://picsum.photos/seed/${office.slot}/1000/750.webp`}
                  alt={`مكتب مَعلم في ${office.city}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <div className="px-6 py-6">
                <div className="mb-2 font-serif text-[22px] font-semibold">{office.city}</div>
                <div className="text-sm leading-[1.8] font-light text-muted-strong">
                  {office.address}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
