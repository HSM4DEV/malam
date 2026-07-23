"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  author: string;
  read: string;
  imageSeed: string;
}

const CATEGORIES = ["الكل", "اتجاهات السوق", "أدلّة المشتري", "العمارة", "حوارات", "أسلوب الحياة"] as const;

export function BlogList({ posts }: { posts: BlogPost[] }) {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("الكل");
  const visible = category === "الكل" ? posts : posts.filter((p) => p.category === category);

  return (
    <div>
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={`rounded-full px-5 py-2.5 text-[13.5px] transition-colors ${
              c === category
                ? "border border-pine bg-pine font-semibold text-cream"
                : "border border-foreground/15 text-muted-strong hover:border-pine hover:text-pine"
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="mt-11 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((post) => (
          <Link
            key={post.slug}
            href="#"
            className="pcard block overflow-hidden rounded-2xl border border-foreground/9 bg-surface"
          >
            <div className="relative aspect-[16/10] overflow-hidden">
              <div className="pthumb absolute inset-0">
                <Image
                  src={`https://picsum.photos/seed/${post.imageSeed}/1000/750.webp`}
                  alt={post.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
              <span className="absolute end-3.5 top-3.5 rounded-full bg-cream/94 px-3 py-1.5 text-[11px] font-bold text-pine backdrop-blur-sm">
                {post.category}
              </span>
            </div>
            <div className="px-6 py-6.5">
              <div className="mb-2.5 text-[12.5px] font-medium text-muted">{post.date}</div>
              <h3 className="mb-2.5 font-serif text-[22px] leading-[1.3] font-semibold">{post.title}</h3>
              <p className="mb-4.5 text-sm leading-[1.8] font-light text-muted-strong">{post.excerpt}</p>
              <div className="flex items-center justify-between border-t border-foreground/9 pt-4">
                <span className="text-[13px] text-muted-dark">{post.author}</span>
                <span className="text-[13px] font-semibold text-pine">{post.read}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {visible.length === 0 ? (
        <p className="py-16 text-center text-muted">لا توجد مقالاتٌ في هذا التصنيف حالياً.</p>
      ) : null}
    </div>
  );
}
