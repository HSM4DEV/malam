import Link from "next/link";
import Image from "next/image";

import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { FavoriteButton } from "@/components/site/favorite-button";
import type { PublicProjectListItem } from "@/types/public";

export function ProjectCardList({
  project,
  favorite,
  onToggleFavorite,
}: {
  project: PublicProjectListItem;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="pcard grid grid-cols-1 items-stretch overflow-hidden rounded-2xl border border-foreground/9 bg-surface sm:grid-cols-[260px_1fr_auto]"
    >
      <div className="relative min-h-[180px] overflow-hidden">
        <div className="pthumb absolute inset-0">
          <Image
            src={`https://picsum.photos/seed/pll-${project.slug}/1000/750.webp`}
            alt={project.imageAlt}
            fill
            sizes="260px"
            className="object-cover"
          />
        </div>
        <span className="absolute end-3.5 top-3.5 rounded-full bg-cream/95 px-3 py-1.5 text-[11px] font-bold text-pine backdrop-blur-sm">
          {project.tag}
        </span>
      </div>

      <div className="flex flex-col justify-center px-5 py-5">
        <div className="mb-2 text-xs font-semibold text-muted">{project.cityLabel}</div>
        <h3 className="mb-3 font-serif text-[27px] leading-[1.1] font-semibold">{project.name}</h3>
        {project.blurb ? (
          <p className="mb-3.5 max-w-[52ch] text-sm leading-[1.7] font-light text-muted-strong">
            {project.blurb}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-4 text-[13.5px] text-muted-strong">
          <span>{project.bedsRangeLabel}</span>
          <span className="text-sand">·</span>
          <span>{project.bathsLabel}</span>
          <span className="text-sand">·</span>
          <span>{project.areaRangeLabel}</span>
          <span className="text-sand">·</span>
          <span>{project.type}</span>
        </div>
      </div>

      <div className="flex min-w-[220px] flex-col items-start justify-center gap-3.5 border-t border-foreground/8 px-6 py-5 sm:border-t-0 sm:border-s">
        <div>
          <div className="mb-1 text-[11.5px] text-muted">يبدأ من</div>
          <div className="font-serif text-[28px] font-semibold text-pine">
            {project.priceLabel}
            <SaudiRiyal />
          </div>
        </div>
        <span className="rounded-xl bg-pine px-6 py-2.5 text-[13.5px] font-semibold text-cream">
          عرض التفاصيل
        </span>
        <FavoriteButton variant="list" active={favorite} onToggle={onToggleFavorite} />
      </div>
    </Link>
  );
}
