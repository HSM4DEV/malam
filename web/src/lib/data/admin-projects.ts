import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { Project, ProjectStatus } from "@/generated/prisma/client";

export type AdminProjectRow = Project & {
  company: { name: string; slug: string; type: "DEVELOPER" | "BROKER" };
};

/**
 * Every project across every company, for the admin moderation page — the
 * one place in this app that intentionally sees across company boundaries
 * (everywhere else scopes to the logged-in company or to PUBLISHED-only).
 */
export const getAllProjectsForModeration = cache(
  async (status?: ProjectStatus): Promise<AdminProjectRow[]> => {
    return prisma.project.findMany({
      where: status ? { status } : undefined,
      include: { company: { select: { name: true, slug: true, type: true } } },
      orderBy: { createdAt: "desc" },
    });
  },
);
