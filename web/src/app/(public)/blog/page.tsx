import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

import { BlogList, type BlogPost } from "@/components/site/blog-list";
import { NewsletterForm } from "@/components/site/newsletter-form";

export const metadata: Metadata = { title: "المجلّة — مَعلم" };

const POSTS: BlogPost[] = [
  { slug: "buyer-guide", title: "دليلك لشراء أول عقارٍ فاخرٍ في المملكة", excerpt: "من التمويل إلى المعاينة، خطواتٌ عملية تختصر الطريق.", category: "أدلّة المشتري", date: "١٢ يوليو ٢٠٢٦", author: "سلطان الدوسري", read: "٥ دقائق", imageSeed: "bl-1" },
  { slug: "diriyah-architecture", title: "الدرعية: حين تلتقي العمارة النجدية بالحداثة", excerpt: "كيف يعيد المطوّرون قراءة الطين واللون الترابي في مشاريع اليوم.", category: "العمارة", date: "٤ يوليو ٢٠٢٦", author: "نورة القحطاني", read: "٧ دقائق", imageSeed: "bl-2" },
  { slug: "jeddah-waterfront-interview", title: "حوار: رؤية مطوّرٍ رائدٍ لواجهة جدة البحرية", excerpt: "عن الكورنيش، والخصوصية، وما ينتظر سوق جدة.", category: "حوارات", date: "٢٨ يونيو ٢٠٢٦", author: "فيصل الراشد", read: "٩ دقائق", imageSeed: "bl-3" },
  { slug: "five-value-drivers", title: "خمسة عناصرٍ ترفع قيمة المسكن الفاخر", excerpt: "من الإطلالة إلى جودة التشطيب — ما الذي يصمد أمام الزمن؟", category: "اتجاهات السوق", date: "٢٠ يونيو ٢٠٢٦", author: "ريم العنزي", read: "٤ دقائق", imageSeed: "bl-4" },
  { slug: "penthouse-living", title: "فنّ العيش في بنتهاوس: مساحةٌ وضوءٌ وخصوصية", excerpt: "كيف تعيد المساكن العلوية تعريف الرفاهية اليومية.", category: "أسلوب الحياة", date: "٩ يونيو ٢٠٢٦", author: "نورة القحطاني", read: "٦ دقائق", imageSeed: "bl-5" },
  { slug: "luxury-returns", title: "الاستثمار العقاري الفاخر: قراءةٌ في العوائد", excerpt: "أين تتّجه القيمة في الرياض والمنطقة الشرقية؟", category: "اتجاهات السوق", date: "١ يونيو ٢٠٢٦", author: "سلطان الدوسري", read: "٨ دقائق", imageSeed: "bl-6" },
];

export default function BlogPage() {
  return (
    <div dir="rtl">
      <header className="mx-auto max-w-[1320px] px-5 pt-[76px] pb-10 sm:px-10">
        <div className="flex flex-wrap items-end justify-between gap-7">
          <div>
            <div className="mb-3.5 text-[12.5px] font-bold tracking-wide text-pine">المجلّة</div>
            <h1 className="max-w-[16ch] font-serif text-[clamp(32px,5vw,68px)] leading-[1.08] font-semibold">
              رؤىً في العقار الفاخر والعمارة والعيش الرفيع.
            </h1>
          </div>
          <p className="max-w-[34ch] text-base leading-[1.7] font-light text-muted-strong">
            تحليلاتٌ للسوق، وحواراتٌ مع المطوّرين، وأدلّةٌ للمشتري الفاخر — بقلم فريق مَعلم.
          </p>
        </div>
      </header>

      <section className="mx-auto max-w-[1320px] px-5 pt-6 pb-5 sm:px-10">
        <Link href="#" className="pcard block">
          <div className="grid grid-cols-1 items-center gap-7 md:grid-cols-[1.15fr_.85fr] md:gap-11">
            <div className="relative aspect-[16/10] overflow-hidden rounded-[20px] border border-foreground/10">
              <div className="pthumb absolute inset-0">
                <Image
                  src="https://picsum.photos/seed/bl-feat/1000/750.webp"
                  alt="غلاف المقال المميّز — أفق الرياض من برجٍ سكنيٍّ فاخر"
                  fill
                  sizes="(max-width: 768px) 100vw, 60vw"
                  className="object-cover"
                />
              </div>
              <span className="absolute end-4 top-4 rounded-full bg-cream/94 px-3.5 py-1.5 text-[11.5px] font-bold text-pine backdrop-blur-sm">
                مقالٌ مميّز
              </span>
            </div>
            <div>
              <div className="mb-3 text-[12.5px] font-bold tracking-wide text-pine">
                اتجاهات السوق · ١٨ يوليو ٢٠٢٦
              </div>
              <h2 className="font-serif text-[clamp(24px,3.4vw,44px)] leading-[1.2] font-semibold">
                كيف يعيد جيلٌ جديدٌ من المشترين تعريف الفخامة في الرياض
              </h2>
              <p className="mt-4 max-w-[52ch] text-base leading-[1.85] font-light text-muted-strong">
                من الخصوصية إلى الاستدامة، تتغيّر معايير المسكن الفاخر بسرعة. نستعرض أبرز التحوّلات
                وما تعنيه لمن يشتري اليوم.
              </p>
              <div className="mt-6 flex items-center gap-3">
                <div className="relative size-[38px] overflow-hidden rounded-full border border-foreground/12">
                  <Image
                    src="https://picsum.photos/seed/bl-au0/200/200.webp"
                    alt="صورة الكاتبة نورة القحطاني"
                    fill
                    sizes="38px"
                    className="object-cover"
                  />
                </div>
                <span className="text-sm text-muted-strong">بقلم نورة القحطاني · ٦ دقائق قراءة</span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-14 pb-10 sm:px-10">
        <BlogList posts={POSTS} />
      </section>

      <section className="mx-auto max-w-[1320px] px-5 pt-4 pb-22 sm:px-10">
        <div className="flex flex-wrap items-center justify-between gap-9 rounded-3xl bg-pine-dark px-7 py-14 sm:px-14">
          <div className="max-w-[34ch]">
            <h2 className="font-serif text-[clamp(24px,3.4vw,44px)] leading-[1.14] font-semibold text-cream">
              اشترك في نشرة مَعلم
            </h2>
            <p className="mt-3.5 text-base leading-[1.7] font-light text-[#B9CEC7]">
              رؤىً منتقاةٌ عن السوق والمساكن الجديدة، مرّةً كل أسبوعين. دون إزعاج.
            </p>
          </div>
          <NewsletterForm />
        </div>
      </section>
    </div>
  );
}
