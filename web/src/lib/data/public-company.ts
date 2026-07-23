import "server-only";
import { cache } from "react";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { toPublicProjectCard } from "@/lib/data/public-projects";
import type { DeveloperProfile } from "@/types/public";

export const getPublicCompanyProfile = cache(
  async (slug: string): Promise<DeveloperProfile> => {
    const company = await prisma.company.findUnique({
      where: { slug },
      include: {
        projects: {
          where: { status: "PUBLISHED" },
          include: { units: true },
        },
      },
    });

    if (!company) {
      notFound();
    }

    return {
      slug: company.slug,
      name: company.name,
      logoUrl: company.logoUrl,
      avatarSeed: company.avatarSeed,
      bio: company.bio,
      city: company.city,
      foundedYearsAgo: company.foundedYear
        ? new Date().getFullYear() - company.foundedYear
        : null,
      projects: company.projects.map(toPublicProjectCard),
    };
  },
);
