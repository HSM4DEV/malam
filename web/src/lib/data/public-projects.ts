import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { formatMillions, toArabicDigits } from "@/lib/format";
import type { Project, Unit } from "@/generated/prisma/client";
import type {
  PlatformStats,
  PublicProjectCard,
  PublicProjectDetails,
  PublicProjectFilters,
  PublicProjectListItem,
  PublicUnitType,
} from "@/types/public";

function rangeLabel(min: number, max: number, suffix: string): string {
  if (min === max) return `${toArabicDigits(min)} ${suffix}`;
  return `${toArabicDigits(min)}–${toArabicDigits(max)} ${suffix}`;
}

export function toPublicProjectCard(project: Project & { units: Unit[] }): PublicProjectCard {
  const beds = project.units.map((u) => u.beds);
  const baths = project.units.map((u) => u.baths);
  const areas = project.units.map((u) => u.areaSqm);

  return {
    slug: project.slug,
    name: project.name,
    city: project.city,
    cityLabel: `${project.city} · ${project.district}`,
    tag: project.tag,
    imageSeed: project.imageSeed,
    imageAlt: project.imageAlt,
    bedsRangeLabel: beds.length
      ? rangeLabel(Math.min(...beds), Math.max(...beds), "غرف")
      : "—",
    bathsLabel: baths.length ? `${toArabicDigits(Math.max(...baths))} حمّامات` : "—",
    areaRangeLabel: areas.length ? rangeLabel(Math.min(...areas), Math.max(...areas), "م²") : "—",
    priceLabel: formatMillions(project.priceFromMillions),
  };
}

export const getFeaturedProjects = cache(
  async (limit = 6): Promise<PublicProjectCard[]> => {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { viewCount: "desc" },
      take: limit,
      include: { units: true },
    });
    return projects.map(toPublicProjectCard);
  },
);

export const getPlatformStats = cache(async (): Promise<PlatformStats> => {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { totalUnits: true, city: true },
  });

  const totalUnits = projects.reduce((sum, p) => sum + p.totalUnits, 0);
  const cityCount = new Set(projects.map((p) => p.city)).size;

  return {
    projectsLabel: toArabicDigits(projects.length),
    unitsLabel: `+${toArabicDigits(totalUnits)}`,
    citiesLabel: toArabicDigits(cityCount),
  };
});

export interface AboutStats {
  unitsLabel: string;
  citiesLabel: string;
  portfolioValueLabel: string;
}

export const getAboutStats = cache(async (): Promise<AboutStats> => {
  const projects = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { totalUnits: true, city: true, priceFromMillions: true },
  });

  const totalUnits = projects.reduce((sum, p) => sum + p.totalUnits, 0);
  const cityCount = new Set(projects.map((p) => p.city)).size;
  // Rough portfolio value: starting price × total units, summed across published projects.
  const portfolioMillions = projects.reduce((sum, p) => sum + p.priceFromMillions * p.totalUnits, 0);

  return {
    unitsLabel: `+${toArabicDigits(totalUnits)}`,
    citiesLabel: toArabicDigits(cityCount),
    portfolioValueLabel: formatMillions(portfolioMillions),
  };
});

export const getPublicCities = cache(async (): Promise<string[]> => {
  const rows = await prisma.project.findMany({
    where: { status: "PUBLISHED" },
    select: { city: true },
    distinct: ["city"],
  });
  return rows.map((r) => r.city);
});

export const getPublicProjects = cache(
  async (filters: PublicProjectFilters): Promise<PublicProjectListItem[]> => {
    const projects = await prisma.project.findMany({
      where: {
        status: "PUBLISHED",
        ...(filters.city ? { city: filters.city } : {}),
        ...(filters.type ? { type: filters.type } : {}),
        ...(filters.maxPrice ? { priceFromMillions: { lte: filters.maxPrice } } : {}),
        ...(filters.q
          ? {
              OR: [
                { name: { contains: filters.q, mode: "insensitive" } },
                { district: { contains: filters.q, mode: "insensitive" } },
              ],
            }
          : {}),
        ...(filters.minBeds
          ? { units: { some: { beds: { gte: filters.minBeds } } } }
          : {}),
      },
      include: { units: true },
      orderBy:
        filters.sort === "price-asc"
          ? { priceFromMillions: "asc" }
          : filters.sort === "price-desc"
            ? { priceFromMillions: "desc" }
            : { createdAt: "desc" },
    });

    return projects.map((project) => {
      const beds = project.units.map((u) => u.beds);
      return {
        ...toPublicProjectCard(project),
        city: project.city,
        district: project.district,
        type: project.type,
        priceFromMillions: project.priceFromMillions,
        minBeds: beds.length ? Math.min(...beds) : 0,
        blurb: project.blurb,
      };
    });
  },
);

export const getPublicProjectBySlug = cache(
  async (slug: string): Promise<PublicProjectDetails> => {
    const project = await prisma.project.findUnique({
      where: { slug },
      include: {
        units: true,
        company: { include: { members: { orderBy: { createdAt: "asc" }, take: 1 } } },
      },
    });

    if (!project || project.status !== "PUBLISHED") {
      notFound();
    }

    const publishedProjectsCount = await prisma.project.count({
      where: { companyId: project.company.id, status: "PUBLISHED" },
    });

    const unitTypeMap = new Map<string, Unit[]>();
    for (const unit of project.units) {
      const list = unitTypeMap.get(unit.typeName) ?? [];
      list.push(unit);
      unitTypeMap.set(unit.typeName, list);
    }

    const unitTypes: PublicUnitType[] = Array.from(unitTypeMap.entries()).map(
      ([typeName, units]) => {
        // Representative unit: cheapest available (or cheapest overall if none available).
        const available = units.filter((u) => u.status === "AVAILABLE");
        const rep = [...(available.length ? available : units)].sort(
          (a, b) => a.priceMillions - b.priceMillions,
        )[0];
        return {
          typeName,
          areaSqm: rep.areaSqm,
          beds: rep.beds,
          baths: rep.baths,
          floorLabel: rep.floorLabel,
          priceMillions: rep.priceMillions,
          status:
            rep.status === "AVAILABLE" ? "available" : rep.status === "RESERVED" ? "reserved" : "sold",
          count: units.length,
        };
      },
    );

    return {
      id: project.id,
      slug: project.slug,
      name: project.name,
      city: project.city,
      district: project.district,
      type: project.type,
      tag: project.tag,
      blurb: project.blurb,
      amenities: project.amenities,
      imageSeed: project.imageSeed,
      imageAlt: project.imageAlt,
      priceFromMillions: project.priceFromMillions,
      priceLabel: formatMillions(project.priceFromMillions),
      totalUnits: project.totalUnits,
      unitTypes,
      company: {
        slug: project.company.slug,
        name: project.company.name,
        logoUrl: project.company.logoUrl,
        avatarSeed: project.company.avatarSeed,
        bio: project.company.bio,
        city: project.company.city,
        foundedYearsAgo: project.company.foundedYear
          ? new Date().getFullYear() - project.company.foundedYear
          : null,
        publishedProjectsCount,
        contactName: project.company.members[0]?.name ?? null,
        contactTitle: project.company.members[0]?.jobTitle ?? null,
      },
    };
  },
);

export interface SpotlightProject {
  slug: string;
  name: string;
  district: string;
  city: string;
  blurb: string | null;
  totalUnits: number;
  priceLabel: string;
  imageSeed: string;
  imageAlt: string;
}

export const getSpotlightProject = cache(async (): Promise<SpotlightProject | null> => {
  const project = await prisma.project.findFirst({
    where: { status: "PUBLISHED" },
    orderBy: { viewCount: "desc" },
  });
  if (!project) return null;

  return {
    slug: project.slug,
    name: project.name,
    district: project.district,
    city: project.city,
    blurb: project.blurb,
    totalUnits: project.totalUnits,
    priceLabel: formatMillions(project.priceFromMillions),
    imageSeed: project.imageSeed,
    imageAlt: project.imageAlt,
  };
});

export const getRelatedProjects = cache(
  async (city: string, excludeId: string, limit = 3): Promise<PublicProjectCard[]> => {
    const projects = await prisma.project.findMany({
      where: { status: "PUBLISHED", city, id: { not: excludeId } },
      take: limit,
      include: { units: true },
    });
    return projects.map(toPublicProjectCard);
  },
);
