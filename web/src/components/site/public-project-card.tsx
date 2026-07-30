import Link from "next/link";
import Image from "next/image";

import { SaudiRiyal } from "@/components/ui/saudi-riyal";
import { projectImageSrc } from "@/lib/image";
import type { PublicProjectCard } from "@/types/public";

export function PublicProjectCardView({
  project,
  overlay,
}: {
  project: PublicProjectCard;
  overlay?: React.ReactNode;
}) {
  return (
    <Link
      href={`/projects/${project.slug}`}
      className="pcard block overflow-hidden rounded-2xl border border-foreground/9 bg-surface"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        <div className="pthumb absolute inset-0">
          <Image
            src={projectImageSrc(project)}
            alt={project.imageAlt}
            fill
            sizes="(max-width: 960px) 100vw, 400px"
            className="object-cover"
          />
        </div>
        <span className="absolute end-3.5 top-3.5 rounded-full bg-cream/95 px-3 py-1.5 text-[11px] font-bold text-pine backdrop-blur-sm">
          {project.tag}
        </span>
        {overlay}
      </div>

      <div className="p-[22px]">
        <div className="mb-1.5 text-xs font-semibold tracking-wide text-muted">
          {project.cityLabel}
        </div>
        <h3 className="mb-3.5 font-serif text-2xl leading-[1.1] font-semibold">{project.name}</h3>

        <div className="mb-4 flex gap-3.5 border-b border-foreground/9 pb-4 text-[13px] text-muted-strong">
          <span>{project.bedsRangeLabel}</span>
          <span className="text-sand">·</span>
          <span>{project.bathsLabel}</span>
          <span className="text-sand">·</span>
          <span>{project.areaRangeLabel}</span>
        </div>

        <div className="flex items-baseline justify-between">
          <div>
            <div className="mb-0.5 text-[11.5px] text-muted">يبدأ من</div>
            <div className="font-serif text-[23px] font-semibold text-pine">
              {project.priceLabel}
              <SaudiRiyal />
            </div>
          </div>
          <span className="text-[13.5px] font-medium text-foreground">عرض ←</span>
        </div>
      </div>
    </Link>
  );
}
