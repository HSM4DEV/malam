import "server-only";
import { cache } from "react";

import { prisma } from "@/lib/prisma";
import type { NewsletterSubscriber } from "@/generated/prisma/client";

export const getNewsletterSubscribers = cache(async (): Promise<NewsletterSubscriber[]> => {
  return prisma.newsletterSubscriber.findMany({
    orderBy: { createdAt: "desc" },
  });
});
